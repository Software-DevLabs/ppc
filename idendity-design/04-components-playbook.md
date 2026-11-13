# 04 — COMPONENTS PLAYBOOK (the identity's moving parts)

Every component below exists in the repo with a real incident attached.
Path of truth: `src/components/warmup/PageLoader.jsx`,
`src/components/macterm/HoverPlayCard.jsx`, and the page-level
components in `MacTermV2.jsx` / `MacTerm.jsx`.

## PageLoader + prewarm (first-load, anti-drop system)

Purpose: the user must never SEE an image pop in or a video start
buffering after they arrived. Two jobs:
(1) hold the page behind a dark counter until the critical set is ready;
(2) warm cache/idle-prefetch everything below the fold afterwards.

### design decisions that make it safe
- The loader DOESN'T fetch the critical images — the page under it
  already renders and the browser starts those fetches; the loader runs
  parallel `new Image()` "tickets" for the SAME URLs, so percentages
  track real browser cache fill (requests coalesce on URL).
- `video` criticalness = ONE thing only: `loadeddata` (first frame).
  Counting the whole 74 MB would be absurd; `preload="auto"` on the
  player continues buffering in the background after reveal.
- State machine: percent -> ready (loaded>=total AND elapsed>=minMs,
  hardcoded 700ms floor so the flash of 000->100->gone never strobes)
  -> gone (260ms later, after percent hits 100, then AnimatePresence
  exits with y-up fade). HARD CAP `capMs=3500`: any stalled file (or a
  failing remote host like the Lovable video host) still reveals —
  NEVER hang the page on a lazy server.
- Reveal comes with EXIT first (percent 100 -> 260ms -> exit anim), not
  instant unmount, so the counter never flickers 100 -> gone in one
  frame.
- `prewarm(urls)` runs INSIDE the reveal timeout (idle time, only
  browser truly idle): below-fold images as plain `new Image().src`,
  distant video as `<link rel="prefetch" as="video" href>`. `as="video"`
  IS the correct `as` token for media prefetch. `requestIdleCallback`
  with `{timeout: 2500}` fallback `setTimeout(1400)`.
- Effect deps: `[criticalKey, video, minMs, capMs]` where
  `criticalKey = critical.join('|')` — passing the raw ARRAY would
  rerun the whole loader every parent render (array identity!). This
  single line has bitten every team that skips it.

### wiring per page
```jsx
<PageLoader
  label="macterm"
  critical={[M('main.png'), M('featur1.png'), M('Featur2.png')]}
  video={VIDEO_URL}                                   // .env or local
  warm={[M('beforefooter.png'), M('bluetex.png')]}
/>
```
And hero images carry `loading="eager" fetchpriority="high"` — the
React 18-safe lowercase prop (`fetchpriority`), because camelCase
`fetchPriority` warns "unknown prop" in React 18.3.

## HoverPlayCard (the video window)

- `preload="auto"` so the video begins buffering right after load,
  `muted` true initially (autoplay law), `playsInline` always.
- Hover -> play muted; leave -> pause and restore `prevMuted` ONLY if
  the user never clicked (after real click, user owns the state).
- Icon overlay: Play/Pause with `AnimatePresence` fade; the button
  `stopPropagation` so card-level handlers don't double-fire.
- Rendering invariant: `isPlaying` is driven BY the video's own events
  (`play/pause/ended` listeners), not by local setState races — ended
  resets to "Paused" and unlocks hover-play again.
- Poster: none (first frame comes from `loadeddata` fast on H.264 fast-
  start files — see 05 for the moov rule).

## BrandBar (the ONLY header on product pages)

```jsx
<header className="absolute inset-x-0 top-0 z-[90]"> ... </header>
```
- absolute, NOT fixed: scrolls away; nothing fixed stays except the
  loader overlay — this killed a real "pinned sections hide under the
  header text" family of bugs and matches the ochi premium look.
- left: `/logo.png` (the blue S mark, h-7 w-7 md:h-8) + wordmark.
- right: ONE circular Github icon button (border hairline, hover fill).
- z-[90] > all sheets (70) < loader (100).
- LESSON RECORDED: deploy-stripping wiped `/logo.png` from the bundle
  -> the icon silently 404'd and the brand bar showed an alt-less img
  hole. The deploy script now whitelists logo + favicons (see 06).

## FluencyBand (57 / 43 panel — the "Image 1" incident)

```jsx
<div className="relative rounded-2xl border border-[#3f3f3f] bg-[#1c1c1c]
                overflow-hidden grid grid-cols-1 md:grid-cols-[57%_43%]">
  <div className="p-2 md:p-3 h-full">
    <div className="h-full rounded-xl overflow-hidden">
      <img className="block w-full h-full object-cover" />
```
- image FILLS the column height (`h-full object-cover`), so the three
  open sides read EQUAL insets (12px), corners concentric
  (panel radius 16 vs inner 12 with 12px inset = the concentric lock),
  right side open toward the dashed divider (which hosts the copy) —
  exactly the user's "Image 1" artifact.
- the earlier failure: `h-auto` img centered by flex -> top/bottom gaps
  unequal vs left gap; double-rounded frames fighting. object-cover on
  the same source is imperceptibly cropped (native 1920x1080 media).
- copy column: `p-8 md:p-10 lg:p-12`; pills centered at bottom via
  `mt-auto`; pill = outer hairline ring p-[5px] + inner white real
  link, `hover:-translate-y-1`, and the small ArrowUpLeft icon in a
  dark orthogonal circle jumping OUT of the pill on hover (the single
  sanctioned scale animation in the whole product).

## HalftoneWordmarkFooter (src/components/halftone/)

- giant wordmark (`text-[24vw]`-class) with `WebkitTextStroke` outline
  that fills solid on hover per-letter; halftone dot texture layer via
  background-image gradients; it is the FINAL sheet (z-70) so it closes
  the stack with the same rounded-t curve the stack opened with.
- prop discipline: it takes `wordmark` + column data; keep
  FOOTER_COLUMNS data co-located in the page files, NOT shared state.

## PageLoader anti-pattern table

| Anti-pattern | Real consequence | Our cure |
|---|---|---|
| `useEffect([images])` with array param | loader restarts every render | `images.join('|')` as dep |
| await fetch per image | double downloads, CORS on prod | parallel `new Image()` only |
| reveal on `load` event | one 404 image freezes the page | per-item onload+onerror BOTH bump |
| no capMs | a dead video host = eternal loader | 3.5s cap ALWAYS |
| unmount overlay instantly | 100->gone flicker | percent 100 -> 260ms -> exit anim |
| preload whole video before reveal | first visit takes 30s+ | only `loadeddata` (first frame) |
