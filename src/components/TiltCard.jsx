import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Pointer-driven 3D tilt card (Apple product-card feel).
 * Rotates on X/Y toward the cursor, lifts in Z, with a glare sheen that follows it.
 * Disabled for coarse pointers and reduced-motion users.
 */
export default function TiltCard({
  children,
  className = '',
  max = 10,
  scale = 1.02,
  glare = true,
  lift = 26,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && !new URLSearchParams(window.location.search).get('motion');
    if (!fine || calm) return undefined;

    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    // CSS custom properties can't be quickTo'd (yields NaN) - write them directly.
    const setGlare = (x, y) => {
      el.style.setProperty('--gx', x);
      el.style.setProperty('--gy', y);
    };
    setGlare('50%', '50%');

    const enter = gsap.to(el, { scale, z: lift, duration: 0.5, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * max * 2);
      rx((0.5 - py) * max * 2);
      setGlare(`${px * 100}%`, `${py * 100}%`);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      setGlare('50%', '50%');
      gsap.to(el, { scale: 1, z: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'all' });
    };
  }, [max, scale, lift]);

  return (
    <div ref={ref} className={`relative ${className}`} style={glare ? { '--gx': '50%', '--gy': '50%' } : undefined}>
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{
            background:
              'radial-gradient(420px circle at var(--gx) var(--gy), rgba(255,255,255,0.45), transparent 62%)',
          }}
        />
      )}
    </div>
  );
}