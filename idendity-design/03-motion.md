# 03 — MOTION: framer-motion vs GSAP (deep handbook + real bugs)

## THE DIVISION OF LABOR

| Concern | Owner | Why |
|---|---|---|
| scroll reveals, sheet parallax, marquee velocity, `AnimatePresence` mount/unmount | **framer-motion** | declarative, layout-props (style={{y}}) don't fight React re-renders |
| pinned scroll scenes, entry timelines, cursor magnet, multi-prop `.to` sequences on non-React markup | **GSAP 3.15** | timeline authority, `quickTo`, ScrollTrigger maturation |
| hover micro-interactions | **CSS transitions only** | zero JS, can't de-sync from render cycles |

Both are installed together framer-motion@11.18.2 + gsap@3.15.0 and they
do NOT touch the same elements. That's a hard rule born from a real
jitter bug (see P-MIX below).

## GSAP IN THIS REPO — WHERE AND HOW (actual usage)

### 1) `src/pages/Ver7.jsx` — the GSAP showcase page

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

Pattern A — **everything inside one `gsap.context`, returned as cleanup**:

```js
const ctx = gsap.context(() => {
  gsap.to('.v7-dock', { y: -6, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
  gsap.set(...);                       // initial paint before triggers
  const strip = ...;
  gsap.to(strip, { xPercent: ..., scrollTrigger: {...} }); // horizontal drive
  gsap.utils.toArray('.v7-orb-spin').forEach((g, i) =>
    gsap.to(g, { rotation: 360, duration: 16 + i * 3, repeat: -1, ease: 'none' })
  );
  ScrollTrigger.batch('.v7-service', {          // batch = masked rows reveal
    interval: 0.15, batchMax: 4,
    onEnter: (els) => gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, ... })
  });
}, rootRef);                                   // scope selectors to THIS page
return () => ctx.revert();                     // <- the whole trick
```

Why `gsap.context(...)` + `ctx.revert()` is non-negotiable:
React 18 StrictMode double-mounts effects in dev. Without revert you get
TWO sets of tweens/ScrollTriggers writing to the same elements -> doubled
animations, leaked listeners, later "why is my marquee 2x speed".
`ctx.revert()` also restores inline styles GSAP touched (it snapshots).

Pattern B — **`scrollTrigger` timeline drive for horizontal movement**:

```js
const tl = gsap.timeline({
  scrollTrigger: { trigger: section, start: 'top top', end: '+=120%', scrub: 1, pin: true }
});
```
`scrub: 1` (seconds of catch-up) is the difference between butter and
nausea; scrub with `0` makes scroll directly weld the transform and
feels mechanical on wheel devices.

Pattern C — **pointer magnet / tilt with `quickTo`** (V7 globe + TiltCard):

```js
const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
// inside pointermove: xTo(e.clientX); yTo(e.clientY);
```
`quickTo` reuses ONE tween per property and re-targets it -> O(1) per
frame, no tween garbage, no overwrite collisions. Creating a `gsap.to`
inside `pointermove` (the naive approach) spawns hundreds of tweens and
stutters under load.

Pattern D — **conflict-proof tweens**: any tween that may be re-triggered
while running carries `overwrite: 'auto'` (TiltCard enter/leave does);
anything scheduled for "on the way out" uses `gsap.killTweensOf(el)`
plus `gsap.set(el, { clearProps: 'all' })` so unhover returns the EXACT
pre-GSAP styling (TiltCard.jsx:62-63).

### 2) `src/components/TiltCard.jsx`
3D tilt: `gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' })`
once on mount, quickTo for rotationX/rotationY, `z` pop on enter,
kill+clearProps on leave. Its rules to copy:
- set perspective ONCE, never per frame;
- enter and leave must be separate tween objects not fight -> overwrite auto;
- clearProps so CSS hover styles and GSAP never disagree about state.

### 3) `src/components/ver10/LiquidButton.jsx`
Paused timeline built once in a ref (`tl.current = gsap.timeline({ paused: true })`),
play/reverse on hover. Paused timelines are the right hover pattern: no
new tween per enter/leave, reversible, and the ramp shapes stay authored
(eases are part of the brand feel).

### 4) `src/components/layout/Layout.jsx` — ScrollSmoother
`gsap.registerPlugin(ScrollTrigger, ScrollSmoother)` with wrapper/content
smoothing on the PLATFORM layout. NOT used on macterm product pages,
deliberately:

**Why forbidden on the product identity pages** (real incidents, not
vibes):
- Smooth-scroll hijacks transform on `wrapper/content` divs around the
  whole app. Our sheet-stacking is powerless under it: `sticky top-0`
  computes against the HIDDEN overflow context -> pinned hero dies.
- `scrollYProgress` (framer) and ScrollTrigger both derive from native
  scroll; with smoothing mid-lag between the two systems, sheets visibly
  desync from the marquee.
- The template's fixed elements (BrandBar) double-flicker with GSAP's
  forced re-decoder of transforms.
So: the product site scrolls NATIVE + framer; the platform layout may
keep ScrollSmoother.

## GSAP PROBLEMS ACTUALLY HIT IN THIS REPO & THE FIXES

P-1 **StrictMode double-mount** — every tween ran twice, repeated tweens
stacked, page got heavier every HMR. Fix: single `gsap.context()` per
component scoped to the root ref + `return () => ctx.revert()`. Never
register a tween naked inside `useEffect` without cleanup.

P-2 **ScrollTriggers computed before fonts/images arrived** — section
positions were stale; triggers fired 200px early/late. Fix: images in
triggers got explicit `width`/`aspect-ratio` (no layout shift) and loaders
`onLoad={ () => ScrollTrigger.refresh() }`; new triggers created in
`gsap.context` with `invalidateOnRefresh: true` on pinned scenes.

P-3 **gsap.from() flicker (FOUC)** — React paints before the tween
starts: elements flash at end-state then jump to start. Fix: `gsap.set()`
initial states inside the context BEFORE first paint (runs in
`useLayoutEffect`), or `fromTo` with `immediateRender: true`.

P-4 **useEffect vs useLayoutEffect** — ScrollTrigger created in
`useEffect` produced a visible one-frame layout jump; moved to
`useLayoutEffect` for triggers that SET positions. On the server this
warns "useLayoutEffect does nothing" — harmless here (pages are CSR),
but our SSR probes print it; ignore that specific warning.

P-5 **Marquee speed death spiral** — an interval feeding `gsap.to` while
the tab was backgrounded caused RAF queuing and a mega-jump on focus.
Fix: RAF-driven marquees only (framer useVelocity copy), or
`ScrollTrigger` with `scrub` — nothing time-cumulative.

P-6 **Two transform owners on one element (P-MIX)** — a Drift-wrapped
section ALSO had a GSAP `y`-tween; framer wrote `style.transform` inline,
GSAP wrote inline `transform` too — last writer wins per frame, element
jumped depending on interleaving. Fix: separation of ownership per
element (rule above); if coercion is ever needed, animate the INNER
element with framer and leave the OUTER element to GSAP (never both on
the same node).

P-7 **pinning under a fixed brand bar** — pinned sections scrolled UNDER
the fixed header text. Fix: brand bar became absolute (not fixed) on
product pages (`BrandBar`, z-[90]) — pages scroll it away; nothing fixed
stays on screen except the loader overlay.

P-8 **Conditionally-unmounted sheets** — removing the Runtime-flow
section by request left its ScrollTrigger for a filter that never had
`ctx.revert()` -> ScrollTrigger error spam in console. Fix: the
component-owned trigger ALWAYS reverts with the component
(context), never global; sheets that unmount take their triggers with
them.

P-9 **quickTo to a rotating element with layout thrash** — reading
`getBoundingClientRect` inside `pointermove` each move forced layout AND
dispatch. Fix: measure once on mount + on resize (in a ResizeObserver at
the context start), store in ref, pointermove only WRITES.

## FRAMER-MOTION NOTES THAT PAID

- `useScroll({ target, offset: ['start end', 'end start'] })` —
  element-local; stable to content edits above.
- `useTransform` ALWAYS chained to `style={{ y }}` — not `animate=`;
  avoids re-render churn; `will-change` auto-managed by framer.
- `AnimatePresence` needs a stable `key` on BOTH the parent and the
  exiting child and the child CANNOT be a bare conditional of a
  component with its own fade — otherwise no exit anim.
- Enter animations use `initial/animate` (mount-truth) — not
  `whileInView` for page-structure elements, because the sheets stand
  on each other and inView triggers double-fire at sheet boundaries.
- Never animate `layout` prop on elements inside sticky parents —
  layout animations remeasure and sticky positions melt.

## VIDEO MOTION (HoverPlayCard)

- `preload="auto"` + `muted` + `playsInline` (autoplay policies: muted
  is the only autoplay-safe state; browsers demand `playsInline` to not
  fullscreen-jack iOS).
- Hover play WITHOUT user gesture must be muted; click-to-play with
  sound restores/forgets previous muted state through `prevMuted`
  (restore only if the user never clicked).
- `addEventListener('play'/'pause'/'ended')` in one effect, listeners
  always returned — ended resets `isPlaying` to keep the CTA circular.
