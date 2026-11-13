import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Pause, Play } from 'lucide-react';

// Voxel sphere: ~900 instanced cubes on a fibonacci sphere, cobalt + white.
// Spins by default (with a play/pause toggle so the visitor always has
// control, including when the OS prefers reduced motion), drag-to-rotate,
// pointer parallax. Flat basic materials keep it cheap and brutally crisp.
export default function VoxelSphere({ className = '', shape = 'sphere', speed = 0.0075, tilt = 0.35, label = 'كرة بكسل ثلاثية الأبعاد — اسحب لتدويرها' }) {
  const ref = useRef(null);
  const spinRef = useRef(true);
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const host = ref.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 7.2;

    const COUNT = shape === 'torus' ? 72 * 12 : 900;
    const RADIUS = 2.25;
    const geo = new THREE.BoxGeometry(0.105, 0.105, 0.105);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const place = (i) => {
      if (shape === 'torus') {
        // Parametric donut: 72 around × 12 tube.
        const NU = 72;
        const iu = Math.floor(i / 12);
        const iv = i % 12;
        const u = (iu / NU) * Math.PI * 2;
        const v = (iv / 12) * Math.PI * 2;
        const R = 2.0;
        const r = 0.72;
        dummy.position.set(
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v)
        );
      } else {
        const golden = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - (i / (COUNT - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        // Slight radial jitter so it feels hand-placed, not perfect.
        const jitter = 1 + ((Math.sin(i * 12.9898) * 43758.5453 % 1) * 0.05);
        dummy.position.set(
          Math.cos(theta) * r * RADIUS * jitter,
          y * RADIUS * jitter,
          Math.sin(theta) * r * RADIUS * jitter
        );
      }
    };
    for (let i = 0; i < COUNT; i++) {
      place(i);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (i % 5 === 0) color.set('#F0F0F0');
      else color.set('#2E5BFF').offsetHSL(0, 0, (((i * 7) % 10) / 10) * 0.12 - 0.05);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    const group = new THREE.Group();
    group.add(mesh);
    group.rotation.x = tilt;
    scene.add(group);

    const resize = () => {
      const s = Math.max(1, host.clientWidth || 300);
      renderer.setSize(s, s, false);
    };
    resize();

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    // Drag-to-rotate: grab the sphere and turn it yourself.
    let dragging = false;
    let px = 0;
    let py = 0;
    const onDown = (e) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      host.style.cursor = 'grabbing';
    };
    const onDrag = (e) => {
      if (!dragging) return;
      group.rotation.y += (e.clientX - px) * 0.008;
      group.rotation.x += (e.clientY - py) * 0.008;
      renderer.render(scene, camera);
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = () => {
      dragging = false;
      host.style.cursor = 'grab';
    };
    host.style.cursor = 'grab';
    host.style.touchAction = 'pan-y';

    let raf = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(host);

    const tick = () => {
      if (visible && spinRef.current && !dragging) {
        group.rotation.y += speed;
        group.rotation.x += ((tilt + pointer.y * 0.25) - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    };
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    host.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onDrag, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('mousemove', onMove);
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const toggle = () => {
    spinRef.current = !spinRef.current;
    setSpinning(spinRef.current);
  };

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      <div ref={ref} aria-label={label} role="img" className="h-full w-full" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={spinning}
        aria-label={spinning ? 'إيقاف الدوران' : 'تشغيل الدوران'}
        className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-[#3F3F3F] bg-black/60 px-4 py-2 font-body text-xs text-white backdrop-blur transition-colors hover:border-cobalt hover:text-white"
      >
        {spinning ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
        {spinning ? 'إيقاف' : 'تدوير'}
      </button>
    </div>
  );
}
