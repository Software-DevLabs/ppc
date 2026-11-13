# 02 — LAYOUT ARCHITECTURE (the sheet-stacking system)

Origin: studied `resources/ochi-website-clone-master/` (premium template)
and rebuilt its scroll grammar natively for this repo inside
`src/pages/MacTermV2.jsx`. What follows is the system as implemented,
including every parameter that made it survive real use.

## THE SHEET PRIMITIVE

```jsx
const Sheet = ({ z, tone, className = '', children }) => (
  <div
    className={`relative w-full rounded-t-[24px] -mt-[24px] ${className}`}
    style={{ zIndex: z, backgroundColor: tone }}
  >
    {children}
  </div>
);
```

- `rounded-t-[24px]` — the sheet opens upward like a card lifted from the
  page; borders-top only (radius), body flat.
- `-mt-[24px]` — EXACTLY the radius, so the sheet tucks over the previous
  sheet with no gap and the top corners actually show a curve. If the
  negative margin is smaller than the radius, you see hairline gaps of
  the previous tone at the corners; larger, you crop the curve. 24 = 24.
- `zIndex: z` — the LADDER below. Each sheet must strictly exceed the
  previous. Sheets are siblings in a normal flow — they scroll AND cover.
  It's the stacking that creates the depth, not shadows.
- `backgroundColor: tone` from the ladder in 01. Must sit slightly over
  the previous tone (+/- 2-3 lightness steps).

## THE CURRENT LADDER (MacTermV2)

```
hero            sticky top-0 z-0    min-h-[92svh], page base (pinned, root)
sheet 1   z=10  #0d0d0d  hero media, claim, feature rows   (covers hero)
sheet 2   z=20  #141414  giant velocity marquee
sheet 3   z=30  #0c0c0c  highlights accordion + shortcut ledger + chords
sheet 4   z=35  #101010  overview (video) + drift cross
sheet 5   z=40  #0d0d0d  api surface + hard limits (runtime flow removed)
sheet 6   z=45  #131313  runs real + stats + security + get started
sheet 7   z=50  #161616  terminal-fluency band (panel)
ready     z=55  #1a1a1a  money shot: outline wordmark drifts 0 -> -700
footer    z=70  #0a0807  halftone wordmark footer (rounded-t)
PageLoader      z-[100]       fixed above everything until reveal
BrandBar        z-[90]        absolute top, transparent
```

Gaps in z (10 apart) leave room to insert sheets without renumbering.
Never renumber blindly — sections were added/removed by request five
times; the ladder absorbs it (fresh slot = previous z + 5).

## THE STICKY HERO

```jsx
<div className="sticky top-0 z-0 min-h-[92svh] ...">...</div>
```

- `sticky top-0 z-0`: the hero pins at the top and every sheet slides
  OVER it. Hero must have z LOWER than all sheets (z-0 with siblings
  stacking naturally), and it must be in flow (not fixed) so the page
  still scrolls naturally.
- `min-h-[92svh]` not `h-screen`: 100vh lies on mobile Safari (URL bar).
  `svh` = small viewport height and does not jump when bars hide.
- Inside the hero, the scroll-down indicator (`SCROLL DOWN` + ticker)
  and an inline `main.png` that is plain `w-full h-auto` — we removed
  scale/drift/side-crop on the hero image per user request: the source
  artifact is 7216x2892 and must show uncut.

## DRIFT (parallax cross-sheet)

```jsx
const Drift = ({ children, from = 120, to = -120 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};
```

- Target-based (`start end` -> `end start`, element enters from the
  bottom until fully past the top) — NOT viewport-based; section-local
  progress stays stable when content above/below changes height.
- Used with `from/to` asymmetries: Ready sheet's 24vw wordmark goes
  `140 -> -700` (a cinematic exit), stats tiles get gentle `60 -> -60`.

## VELOCITY MARQUEE (sheet 2)

Framer-motion `useVelocity` on scrollY drives `x` base velocity: scroll
faster and the strip speeds up; it never reverses reads illegibly because
we clamp speed and keep one direction. Wrapped in `overflow-hidden` with
two copies of the content (A B) translating `0 -> -50%` for a seamless
loop. Text `text-[14vw] leading-none`, alternating solid `#F2F2F0` /
transparent with `WebkitTextStroke: '1.5px rgba(242,242,240,0.12)'`.

## REVEALS

- `SlideIn from="left|right"`: `opacity/x` springs; one-sided per
  grid column so the composition slides apart rather than popping.
  Names were chosen to never collide with `motion` props — they are
  wrappers, not duplicated systems.
- `Roll` (text hover on accordion titles): two stacked spans, top
  translates out as bottom comes in (the ochi TextHover idea) — pure
  CSS transition inside a `group`, no JS, so it can't de-sync.
- `MaskText`: overflow-hidden line masks with per-line y-tween (ver10
  component). Keep `title` prop NOT children (see ver10 notes).

## WHERE THINGS WENT WRONG (and stay fixed)

1. Sheet negative margin < radius (early -12px) -> hairline light gap at
   corners on 1x screens; fixed at exactly 24px / 24px.
2. Renumbering z-ladder after section removal is a bug factory — always
   leave spaced slots (see above).
3. `sticky` inside any ancestor with `overflow-x-hidden` still works, but
   an ancestor with `overflow:hidden` on Y would silently UNSTICK it.
   The page root uses `overflow-x-hidden` only (MacTerm uses that).
4. Footer as the FINAL sheet with `-mt` over the ready sheet: it is also
   `rounded-t` so the pages end with the same opening curve they began.
5. The 57/43 band panel grid: divider is an ABSolutely positioned dashed
   line at `left-[57%] top-6 bottom-6` with `+` marks at its ends, NOT a
   border — a line element can be inset from the panel border (10px day
   look) without touching it and it never resizes with content.
