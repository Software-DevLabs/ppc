# GSAP + 3D Animation Guide — Software Dev Labs

> Built from the GSAP crash course + Three.js course notes, adapted to **this** project
> (React + Vite + Tailwind, `gsap@3.15`, `three`, no R3F — plain Three.js + canvas).
> Stack in use: `src/pages/Ver7.jsx` (timelines, ScrollTrigger), `src/components/layout/Layout.jsx`
> (ScrollSmoother), `src/components/VoxelSphere.jsx` (Three.js), `src/components/PixelField.jsx` (canvas).

## Contents

1. [Part 1 — GSAP core](#part-1--gsap-core-tofromfromtotimelinestaggereases)
2. [Part 2 — ScrollTrigger + GSAP in React](#part-2--scrolltrigger--gsap-in-react)
3. [Part 3 — Three.js fundamentals (+ R3F/Drei notes)](#part-3--threejs-fundamentals--r3fdrei-notes)
4. [Part 4 — How this project uses it + mistakes checklist](#part-4--how-this-project-uses-it--mistakes-checklist)

---

## Part 1 — GSAP core (to / from / fromTo / timeline / stagger / eases)

### The three base methods

| Method | Meaning | Use when |
|---|---|---|
| `gsap.to(target, vars)` | Animate **from current state → new state** | Most cases (move/rotate/fade something somewhere) |
| `gsap.from(target, vars)` | Animate **from given state → current state** | Entrances (element starts hidden/offset, lands natural) |
| `gsap.fromTo(target, fromVars, toVars)` | Explicit start **and** end | Full control, scroll reveals, hovers |

```js
gsap.to('.box', { x: 250, rotation: 360, duration: 1, ease: 'elastic' });
gsap.from('.hero-title', { yPercent: 110, duration: 1, ease: 'expo.out' });
gsap.fromTo('.card', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });
```

Looping: `repeat: -1` repeats forever; `yoyo: true` reverses every other cycle.

```js
gsap.to('.box', { x: 250, rotation: 360, duration: 2, ease: 'back.inOut', repeat: -1, yoyo: true });
```

### Timelines — sequencing + full control

A timeline is a container for animations: chain them, overlap them, pause/reverse/restart the whole thing.

```js
const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true });
tl.to('.box', { x: 250, rotation: 360, borderRadius: '100%', duration: 2, ease: 'back.inOut' })
  .to('.box', { x: 500, scale: 1, duration: 2, ease: 'back.inOut' })
  .to('.box', { y: 250, scale: 2, duration: 2, ease: 'back.inOut' });

// Control: tl.play() / tl.pause() / tl.reverse() / tl.restart()
// Check state: tl.paused()
if (tl.paused()) tl.play(); else tl.pause();
```

Position parameter overlaps tweens: `.to(target, vars, '-=0.5')` starts 0.5s before the previous ends.

### Stagger — animate groups with rhythm

```js
// Simple: each target starts 0.5s after the previous
gsap.to('.stagger-box', { y: 250, rotation: 360, borderRadius: '100%', repeat: -1, yoyo: true, stagger: 0.5 });

// Advanced object: grid + axis + ease + origin
gsap.to('.grid-item', {
  y: 100, duration: 1,
  stagger: { amount: 1.5, grid: [2, 1], axis: 'y', ease: 'circ.inOut', from: 'center' },
});
```

`from: 'center' | 'edges' | 'random' | index` chooses where the stagger wave starts.

### Eases that matter most

- Everyday: `power1.inOut`, `power2.inOut`, `power3.out`, `expo.out`
- Playful/UI: `back.inOut`, `back.out(2)`, `elastic`, `bounce.out`
- Scroll-linked: `none` (linear — required for scrubbed/container animations)

## Part 2 — ScrollTrigger + GSAP in React

### Setup (once)

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger); // plugins are NOT active until registered
```

### The mental model

`trigger` = **which element**, `start`/`end` = **when** (element position + viewport position).

- `"top 80%"` → when the **top** of the trigger hits **80% down** the viewport.
- `"bottom bottom"` → bottom of trigger hits bottom of viewport.
- `"top top"` / `"bottom top"` for pin-style ranges.

```js
gsap.to('.box', {
  x: 150, rotation: 360, scale: 1.5, ease: 'power1.inOut',
  scrollTrigger: {
    trigger: '.box',   // animate this box when IT enters view
    start: 'top 80%',  // top of box hits 80% viewport height
    end: 'top 20%',
    scrub: true,       // tie progress to scroll (smooth when a number, e.g. scrub: 1)
  },
});
```

Per-target variation with an index (from the course):

```js
boxes.forEach((box, i) => {
  gsap.to(box, {
    x: 150 * i + 5, // second box travels further
    scrollTrigger: { trigger: box, start: 'top 80%', end: 'top 20%', scrub: true },
  });
});
```

### Pin + scrub (Apple-style storytelling)

```js
gsap.timeline({
  scrollTrigger: {
    trigger: '#pinned-section',
    start: 'top top',
    end: 'bottom top', // == one viewport of scroll distance per section height
    scrub: 1.5,        // 1.5s catch-up = buttery
    pin: true,         // lock section while scrubbing through it
  },
});
```

### Batch reveals (lists, grids)

```js
ScrollTrigger.batch('.card', {
  start: 'top 88%',
  onEnter: (els) => gsap.fromTo(
    els,
    { y: 50, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out', overwrite: true },
  ),
});
```

### Keep triggers honest

```js
ScrollTrigger.refresh(); // recalc after images/fonts load or layout shifts
window.addEventListener('load', () => ScrollTrigger.refresh());
```

Responsive / reduced motion via matchMedia:

```js
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: reduce)', () => {
  // return a no-op setup (or simplified tweens) for this case
});
```

### React pattern (the only safe one)

Refs for targets, `useLayoutEffect` + `gsap.context` scoped to the component,
`ctx.revert()` cleanup. Never skip cleanup (StrictMode double-mount + leaks).

```jsx
import { useLayoutEffect, useRef } from 'react';

function Section() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.title', { yPercent: 110, duration: 1, ease: 'expo.out' });
      gsap.to('.parallax-img', {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, root); // ← scope: selectors only match inside this component
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => { window.removeEventListener('load', onLoad); ctx.revert(); };
  }, []);
  return <section ref={root}>…</section>;
}
```

Rules: register plugins once (module scope), scope animations with context + ref,
never animate the pinned element itself, `overwrite: true` (or `'auto'`) on
re-triggerable tweens, `toggleActions: 'play none none none'` for one-shots.

### Keyframes (multi-step tweens)

Keyframes live **only inside `to()` tweens**. Three flavors: object arrays,
percentage maps, simple value arrays.

```js
// Object keyframes: per-step duration/ease/delay/gap control
gsap.to('.elem', {
  keyframes: [
    { x: 100, duration: 1, ease: 'sine.out' },
    { y: 200, duration: 1, delay: 0.5 },          // 0.5s gap
    { rotation: 360, duration: 2, delay: -0.25 },  // overlap 0.25s
  ],
  ease: 'expo.inOut', // ease applied across the whole block
});

// Simple arrays: values spread evenly over duration
gsap.to('.box', {
  keyframes: { x: [0, 100, 100, 0, 0], y: [0, 0, 100, 100, 0], ease: 'power1.inOut' },
  duration: 2,
});
```

Note: SplitText (chars/words/lines splitting for text reveals) ships free with
modern GSAP (`import { SplitText } from 'gsap/SplitText'`) — not currently used
in this project; mask-reveal via `overflow-hidden` + `yPercent` covers our needs.

## Part 3 — Three.js fundamentals (+ R3F/Drei notes)

### The 7-step scene recipe (vanilla Three.js)

Every scene is: **scene → camera → object(s) → lights → renderer → animate → resize**.

```js
import * as THREE from 'three';

// 1. Scene (+ background)
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0');

// 2. Camera: FOV, aspect, near, far — then position it
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Object = geometry + material → mesh
const geometry = new THREE.BoxGeometry(2, 2, 2);          // try: Sphere, Cylinder, Torus, Dodecahedron…
const material = new THREE.MeshStandardMaterial({ color: 0x468585, roughness: 0.6 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 4. Lights (no lights + standard material = black object!)
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0x9cdba6, 2.5);
sun.position.set(5, 5, 5);
scene.add(sun);
// More flavors: SpotLight (cone, angle/decay/penumbra), PointLight (bulb),
// HemisphereLight (sky/ground), RectAreaLight (softbox via primitive).

// 5. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // perf!
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 6. Animate loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// 7. Resize (else the scene stretches/breaks)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### Materials cheat sheet

| Material | Look | Needs lights? | Notes |
|---|---|---|---|
| MeshBasicMaterial | Flat color | No | Cheap UI/overlay looks |
| MeshLambertMaterial | Matte + `emissive` | Yes | Simple, fast |
| MeshStandardMaterial | Realistic PBR | Yes | `roughness`/`metalness`; the default serious choice |
| MeshPhysicalMaterial | Standard + clearcoat/sheen | Yes | Cars, fabric, glass |
| MeshToonMaterial | Flat cartoon bands | Yes | Stylized |
| MeshNormalMaterial | Rainbow normals | No | Debugging shapes |

Textures: any image as `map` (diffuse), plus normal/bump/roughness maps.
Color tip: set `texture.colorSpace = THREE.SRGBColorSpace` or colors wash out.

### Cameras & controls

- **PerspectiveCamera** (human-eye, `fov`≈45–75) for everything cinematic.
- **OrthographicCamera** for blueprints/UI-like flat views.
- **OrbitControls** (from `three/addons/controls/OrbitControls.js`): rotate/zoom/pan
  with damping — `enableZoom`, `min/maxDistance`, `min/maxPolarAngle`,
  `enablePan: false` on touch pages so scrolling still works.

### React Three Fiber (declarative Three.js) + Drei (toolbox)

Same scene, React-style. Lowercase JSX tags map 1:1 to Three.js classes:

```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Sparkles, useGLTF } from '@react-three/drei';

function SpinningBox() {
  const ref = useRef();
  useFrame((_, delta) => { ref.current.rotation.y += delta * 0.5; });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#468585" roughness={0.6} />
    </mesh>
  );
}

<Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} intensity={2.5} />
  <Float speed={5} rotationIntensity={0.5} floatIntensity={0.9}>
    <SpinningBox />
  </Float>
  <Sparkles count={100} scale={4} size={6} speed={0.2} color="orange" />
  <OrbitControls enableZoom={false} enablePan={false} />
</Canvas>
```

Drei greatest hits: `Float` (hover bobbing), `Sparkles` (one-line particles),
`Environment preset="city"` (studio reflections), `useGLTF` + `useTexture`,
`Html` (DOM inside canvas, e.g. loaders), `ContactShadows`, `PresentationControls`
(snap-back orbit). GLTF workflow: `npx gltfjsx model.glb` → JSX component;
optimize with `-t` (draco/prune/resize) — a 1MB room became ~40KB in the course.

Status in THIS project: plain `three` only (`VoxelSphere.jsx` uses instanced
meshes + manual rAF loop — no R3F/Drei installed). Install if a page ever needs
orbitable models:
`bun add three @react-three/fiber @react-three/drei`.

## Part 4 — How this project uses it + mistakes checklist

### Animation inventory (where things live)

| Where | What | Technique |
|---|---|---|
| `src/components/layout/Layout.jsx` | Buttery page scroll | ScrollSmoother (`smooth: 1.3`, effects on) |
| `src/pages/Ver7.jsx` hero | Masked title reveal, card entrances, dock pop | Intro timeline + keyframe settle (`expo` → `sine` → `back.out`) |
| `src/pages/Ver7.jsx` on scroll | Title drift, image parallax, progress hairline, section rises, card batches | Scrub-linked tweens + `ScrollTrigger.batch` + `refresh()` on load |
| `src/components/VoxelSphere.jsx` | Spinning voxel ball (900 instanced cubes) | Three.js `InstancedMesh` + rAF loop, drag-to-rotate, play/pause toggle |
| `src/components/PixelField.jsx`, `CodeRain.jsx`, `SnowFall.jsx`, `ActivityHeatmap.jsx` | Pixel terrain, code rain, snow, activity grid | Plain 2D canvas, DPR-capped, static draw or single rAF |
| `src/pages/Ver2.jsx` | Staggered entrances, hover fills, marquee, count-ups | framer-motion + CSS keyframes |

### Adding a new animation here (checklist)

1. Prefer CSS keyframes for one-shot entrances; GSAP timeline for sequences; ScrollTrigger scrub for scroll-linked motion.
2. Scope with `gsap.context(..., ref)` + `ctx.revert()` cleanup (see Part 2 pattern).
3. Gate everything behind the reduced-motion guard (`useState` + `matchMedia`, skip effects when true).
4. After layout-affecting content loads: `ScrollTrigger.refresh()`.
5. Canvas work: cap DPR at 2, `willReadFrequently` only when reading pixels, pause loops off-screen (`IntersectionObserver`), full dispose on unmount (geometries, materials, renderer, listeners, rAF).
6. Never hide content with JS-set initial states unless the revealing tween is guaranteed (prefer `.from()` / CSS `both` fills over `set()` + `.to()`).

### Common mistakes (course lessons → our rules)

- **Animating the pinned element itself** → breaks ScrollTrigger measurements; animate children inside it instead.
- **Missing `overwrite` on re-triggerable tweens** → overlapping tweens fight; use `overwrite: true` (batch callbacks) or timelines.
- **No `ScrollTrigger.refresh()` after images load** → triggers computed on wrong positions; we refresh on window `load`.
- **Forgetting `ctx.revert()`** → leaked triggers/tweens across route changes; every effect with GSAP returns cleanup.
- **ScrollTrigger + transformed ancestors** → `position: fixed` children break; our fixed header lives outside the smoothed wrapper for this reason.
- **Scrub without `ease: 'none'`** → laggy fighting; scrubbed tweens always use `ease: 'none'`.
- **Giant unoptimized assets in 3D** → prefer instancing (`InstancedMesh`) over hundreds of meshes; compress textures; cap pixel ratio.
- **Forgetting mobile** → `enablePan: false` / disable zoom on touch so pages stay scrollable; `matchMedia` for simplified mobile timelines.

---

*End of guide. When in doubt: prototype the motion in isolation, then wire it into a page following the Part 2 React pattern and the Part 4 checklist.*
