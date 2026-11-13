# 01 — DESIGN TOKEN SYSTEM (the identity, precisely)

This is not a Tailwind theme file; it is the vocabulary we actually use
inside the page files. Consistency beats abstraction here — the tokens
appear literally in classNames, because the pages are bespoke art, not
components-library work.

## SURFACE LADDER (pure neutral dark — WARM CASTS ARE BANNED)

The user explicitly rejected any dark-red-brown cast. All sheet tones are
neutral grays on a hue-free scale around black:

```
page base      #0a0807   (the html/body bg, also every page root div)
sheet 1        #0d0d0d   main content after the pinned hero
sheet 2        #141414   giant marquee band
sheet 3        #0c0c0c   documentation-density sheet (highlights, shortcuts)
sheet 4        #101010   overview media sheet
sheet 5        #0d0d0d   under-the-hood (api surface, limits)
sheet 6        #131313   proof sheet (runs real, stats, security, get started)
sheet 7        #161616   terminal-fluency band
ready sheet    #1a1a1a   final CTA
footer         #0a0807   sheets under the footer use the base again
panel          #1c1c1c   contained panels (the band card) with border #3f3f3f  (card border)
tiles          #141414 / #171717 / #151515 for stats / accordion rows
```

Rules of the ladder: each successive sheet gets _slightly_ different
than its neighbor so the eye reads stacking even without shadows;
differences are 2-3 steps of lightness max. Use borders not shadows:
shadows lie on near-black surfaces.

## INK GRADATION (text)

```
primary    #F2F2F0   headings, product nouns, band titles
body       #A8A8A4   paragraphs
muted      #8A8A86   section eyebrows ("THE LOOP — 127.0.0.1 ONLY")
faint      #5f5f5b   loader whisper text, breathing meta
accent     #2E5BFF   cobalt — scarce: one glow, one link, one mark per view
```

Blue is the product's live-surface color (terminal backdrops are cobalt
images) — in UI chrome it stays scarce so the media carries it.

## TYPE

- UI/sans: **IBM Plex Sans Arabic, sans-serif** (`font-body`) — chosen
  because pages are bilingual-latin with Arabic platform chrome; weight
  range 400-555; headings are `font-medium` (`500`), NOT 700, with
  `tracking-tight` (-0.02em) for latin display sizes.
- Mono: **JetBrains Mono, monospace** (`font-mono`) for: eyebrow labels,
  counters (loader `000`, stat numbers), chord keys (`kbd` chips),
  tickers, % badges. Mono text is always UPPERCASE + `tracking-[0.2em]`/`
  [0.3em]` + 10-12px — it is a texture, not information.
- Display scale (clamp() everywhere, no media-query jumps):
  hero h1        `clamp(2.6rem, 5vw, 4.6rem)` with `leading-[0.98]... 1.1`
  section h3     `clamp(2rem, 2.9vw, 3.1rem)`  `leading-[1.12]`
  giant marquee  `14vw` outline + solid alternating (see 03 VelocityMarquee)
  counters       `text-6xl md:text-7xl tabular-nums` (loader, stats)
- `tabular-nums` on every mutable number — the loader counter and
  stats must not wiggle as digits change.

## RADIUS PHILOSOPHY — CONCENTRIC CORNERS (this bit us twice)

One rule: **the inner element's radius + its inset = the panel's radius**,
visually. We use:

```
outer panel    rounded-2xl (16px)
inner media    rounded-xl (12px)  with a p-3 (12px) inset from the panel
row/tile       rounded-t-[24px] only sheets (they open upward)
pills/badges   rounded-full
```

Failure mode documented: when the inner image had `rounded-lg` (8px)
inside a `rounded-2xl` panel with unequal insets, corners fought each
other and gaps looked "broken" — fixed by: uniform `p-2 md:p-3` inset +
`h-full object-cover` media + single `rounded-xl`. See `07-problems`
entry "the band inset war".

## ICONOGRAPHY

lucide-react only, stroke style consistent:
```
decorative     strokeWidth={1.5}
functional     strokeWidth={1.75} (github chip)
CTA arrows     strokeWidth={2}   (Grid2x2 in pill, ArrowUpLeft on pill edge)
```
Sizes: 1.75-2 (decorative), 4 (button icons), 6-8 (hero/CTA). Arrows that
point OUTSIDE the canvas (ArrowUpLeft on the Github pill) are part of the
identity — small arrows leaving from a label = "this leaves the box".

## MOTION LANGUAGE (summary; full detail in 03)

- Rise-in: `opacity 0 -> 1`, `y: 26 -> 0`, `0.7-0.9s`, expo-ish ease,
  staggered by section, triggered once on-enter.
- One-sided slides: left/right sheets' columns (SlideIn), not both at
  once, so the grid feels composed, not bouncy.
- Ambient loops: infinite yoyo / marquee only — NEVER sine "breathing"
  on text blocks (reads drunk).
- All scroll-driven transforms are straight-line (x/y/rotate OR scale)
  and never more than one axis per element per driver.

## WHAT IS BANNED (user taste law — violations got reverted)

- warm / dark-red-brown casts on any surface
- hover-zoom (scale) on media cards, frames, images
- busy headers: the standalone site has a bare BrandBar (logo + wordmark
  + one circle icon) — no menu, no dropdowns
- redundant insets or double frames (panel bg + inner card bg = no)
- mojibake glyphs anywhere (write with the write tool only)
