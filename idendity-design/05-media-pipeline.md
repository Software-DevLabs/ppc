# 05 — MEDIA PIPELINE (video + images, mathematics included)

## THE VIDEO CHAIN (overview: from recording to deploy)

Original capture: `public/macterm/Recording_10_28_2026_8_35_08_AM.mp4`
(147.5 MB, H.264 1920x1080, ~101.5s, 12.19 Mbps, moov atom at EOF =
streams fine locally Vite, cannot START in a browser until the whole
file downloads — and rejects Vercel's 100 MB per-file limit outright).

ffmpeg lives at (winget-installed, Gyan full build):
```
C:\Users\PC\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe
...\ffprobe.exe  (same dir)
```

### step 1 — repair streaming readiness (faststart remux, lossless)

```
ffmpeg -i Recording.mp4 -c copy -movflags +faststart overview.mp4
```
`-c copy` = no re-encode (seconds, quality byte-identical), merely moves
the moov atom (index) to the start -> browser can start playback after
a few KB. Verify: read first 8 bytes of the file — you want `ftyp` at
offset 4-7 (means moov is ahead; files with trailing moov show garbage
there, they start with zeroed bytes/stco later).

### step 2 — beat the 100 MB wall (bitrate-budgeted re-encode)

Math used, reproducible:

```
budget_MB <= 95 (safety margin under 100)
total_kbits = budget_MB * 8192        (1 MB = 8192 kbit)
video_kbps  = total_kbits / duration_s - audio_kbps(128) - ~2% mux overhead
```
For 101.48s and 90MB: ~6800k video + 128k audio -> landed at 74.5 MB
(actual CRF-less two-pass-free result from `-b:v 6800k -maxrate 8160k
-bufsize 13600k`, VBV windows constrain peaks for streaming).

```
ffmpeg -y -i overview.mp4 -c:v libx264 -b:v 6800k -maxrate 8160k \
  -bufsize 13600k -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k \
  -movflags +faststart overview_70.mp4
```
- `-preset medium` under ffmpeg 9 on a tired machine took ~1 min for
  101s of 1080p; `slow` buys ~10% bitrate efficiency, costs 3-4x time.
- `yuv420p` — REQUIRED for wide browser/decoder compat (h264 4:2:0);
  a yuv444 source plays as black in some Players.
- REAL incident: output path `C:\Users\...\Temp\opencode\...` with the
  dir NOT EXISTING — ffmpeg aborts instantly with "No such file or
  directory". Always `New-Item -ItemType Directory -Force` the temp dir
  first (this shell's opencode temp dir).
- Verify before swapping: ffprobe duration/codec == source, moov-first
  byte check, size; THEN Copy-Item over `public/macterm/overview.mp4`.

### step 3 — the remote-host era (user's decision, Nov 2026)

The user hosts the video at
`https://frame-and-file-harbor.lovable.app/f/1793187801553-Recording_10_28_2026_8_35_08_AM.mp4`
and wants the URL OUT of code, IN an env file. Done as:

```
.env:  VITE_MACTERM_VIDEO_URL=https://frame-and-file-harbor....
```
`VITE_` prefixed vars are inlined into the client bundle at build time
by Vite — this is "config from env, value baked in" and it CANNOT be
secret (it's a public URL anyway; document this clearly — do not
promising "hidden" env vars in SPA bundles, they are all visible).

Both pages read it as:
```jsx
const VIDEO_URL = import.meta.env.VITE_MACTERM_VIDEO_URL || '/macterm/overview.mp4';
```
- fallback is the local re-encoded file: dev never breaks if .env is
  missing; the file ALSO still ships (74.5 MB) as a second chance if
  the remote host dies.
- `<video src>` cross-origin playback needs NO CORS (media elements
  fetch like images); ranges supported by most hosts — if a host lacks
  `Accept-Ranges`, seeking = full download. Lovable host returns
  ranges (verified live: `accept-ranges: bytes`).
- `PageLoader` counts `loadeddata` of the REMOTE — capMs 3500 protects
  against a slow cold host; the page reveals regardless.
- Keep `-movflags +faststart` dogma: even the REMOTE file is the
  ORIGINAL slow-start capture — if that host ever becomes the primary
  path for real users, re-upload the faststart+bitrate version there.

## IMAGE BUDGETS (current state + future work)

Current inventory in public/macterm (as shipped):
```
main.png        17.9 MB  7216x2892  hero/og artifact (UNCUT by user law)
featur1.png      8.8 MB  feature row 1
featur2/Featur2  4.7 MB
bluetex.png      4.3 MB  cobalt backdrop crop (nice accident, see below)
beforefooter.png 7.2 MB  band panel image
```
- `bluetex.png` was CROPPED out of main.png's right edge
  (6130,0,1086,2892) purely to have a light-weight backdrop for the
  Overview card.
- `design.png` (1080x2700 mock) was pruned from every page; do not
  re-import.
- Total shipped media ~120 MB. Eventual improvement (NOT done, rank by
  value): convert band/LTS pngs to webp q80 (5-10x smaller), then
  picture/data-srcset with png fallback. main.png stays png per
  user's exact-artifact rule; if a 3 MB webp conversion is ever
  approved, do it ONLY as an additional `<source>`, never a replacement.

## LAZY/EAGER DISCIPLINE IN MARKUP

- `loading="eager" fetchpriority="high" decoding="async"` on ABOVE-fold
  imagery (hero artifact, feature rows) — LCP discipline.
- everything else `loading="lazy"` — the PageLoader prewarm handles the
  scroll-down pop-in problem (cache hit before you arrive).
- NEVER `loading="lazy"` on the LCP hero picture (worse: browser FCP
  wait + lazy fetch double delay).
