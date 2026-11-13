# 07 — PROBLEMS AND FIXES (the incident catalog)

Chronological, everything that ACTUALLY broke in this project, what it
cost, the root cause, and the structural cure. This is the most valuable
file here — the same bugs return dressed differently.

---

## E-01. PowerShell UTF-8 mojibake (text corruption)
RANK: catastrophic, project-wide, repeatable.

- What: text on the macterm band (dashes, arrows, middle dots, (c))
  rendered as `â€“`, `â€”`, `Â·`, `â†`, `Â©` garbage in the browser and
  in files. PowerShell `Get-Content -Raw` read a UTF-8 file as Windows-
  1252/ANSI (PS 5.1 default), and `Set-Content` re-encoded THAT — every
  non-ASCII pair of bytes became 2 mojibake chars.
- Fix used under fire: Node script replacing corrupted byte sequences
  byte-exact
  (e2 80 93 -> –, e2 80 94 -> —, c2 b7 -> ·, e2 86 90 -> ←, c2 a9 -> ©).
- Structural cure: NEVER read/write project files with PS cmdlets or
  `echo >`. Our write tool (UTF-8) or Node `fs` ONLY. Any PS necessity
  (temp stdin) goes through HERE-STRINGS with `\uXXXX` escapes.
- Side effect of the same disease: a `Set-Content` on a JSON config
  (vercel.json) silently injected PowerShell quote-backtick garbage
  (\`$schema) — JSON survived only because we caught it by reading the
  file back. Rule: after ANY tool-touch on a file we must not own,
  verify with a read first.

## E-02. Black page on the deployed site ("No QueryClient set")
RANK: total outage of the product page.

- What: macterm-001m.vercel.app loaded a blank dark screen.
- Diagnose: headless Chrome console via puppeteer-core printed
  `Error: No QueryClient set, use QueryClientProvider to set one` + the
  component stack. (The FIRST debugging attempt used raw Chrome
  headless flags + `--dump-dom`, which printed NOTHING: chrome on this
  machine swallows stdout in PS; puppeteer-core using the system chrome
  executable (`C:\Program Files\Google\Chrome\Application\chrome.exe`)
  worked instantly. Lesson: use an API, not CLI screen tricks.)
- Root cause: `macterm-main.jsx` mounted the page with ThemeProvider +
  Router ONLY. Some component in the graph (header/arrow-link chrome)
  calls `useQuery` -> react-query throws -> React unmounts the tree ->
  the dark `#0a0807` body = "black page". SSR probes could not catch it:
  our probe wrapped pages in QueryClientProvider and SSR skips the
  client-only path where the crash happens.
- Fix: standalone entry clones the FULL App.jsx stack (ThemeProvider,
  AuthProvider, QueryClientProvider, Toaster). AuthProvider's
  checkAuth() fetch 404s safely on this static host (catch -> null).
- Structural cure: EVERY standalone page entry includes every provider
  App.jsx has. Acceptance test = check-live.mjs, not "it runs in dev".

## E-03. Vercel per-file 100 MB limit
(see 06 for the full walk; short version)
- `-DeploymentError: File size limit exceeded (100 MB)` after burning
  1 GB and 148 MB uploads — TWICE (whole public dir; then the
  still-present original Recording copy inside dist).
- Cures: .vercelignore for source uploads; bitrate-budgeted re-encode
  (147.5 -> 74.5 MB); dist-stripping in the deploy script that removes
  heavy copies after each build (Vite re-copies ALL public/\* every
  time). Also: the remux/re-encode recipe in 05 (faststart math, VBV,
  yuv420p, temp dir must exist).

## E-04. Wrong Vercel project created by accident ("dist-macterm")
- Deploying from a cwd whose `.vercel` link was WIPED by the
  rebuild (emptyOutDir deletes everything in dist — including the
  link!) made the CLI create a NEW project named after the directory.
  Deploys then went to a dead project.
- Cures: deploy script re-links (`vercel link --yes --project
  macterm-001m`) AFTER each build; stray project deleted with
  `vercel remove dist-macterm --yes`. Where do rebuilds collide with
  metadata? EVERYWHERE — rebuilds wipe .vercel links, deploy json and
  any config inside dist. Rebuild = rehydrate everything post-build.

## E-05. .env.local uploaded to the deployment bundle
- `vercel link` wrote `.env.local` + `.gitignore` inside dist-macterm;
  static deploy would have shipped them.
- Cure: strip list extended (both files). Rule: after ANY link
  command, run the strip before deploy.

## E-06. The missing icon (logo 404 on prod)
- The wholesale dist-strip filtered `*- not macterm.html/vercel.json`,
  swallowing `logo.png` + `favicon.*` -> the brand bar showed a hole;
  TEXT check (innerText) didn't reveal it since img alt doesn't render.
- Cure: whitelist those files; verify each deploy with
  `HEAD /logo.png -> 200`. Lesson: a TEXT-based live check CANNOT see
  missing images; asset-level HTTP checks are mandatory.

## E-07. Cloud build dies with no error (exit 1, zero output)
- Full forensic in 06. Local `vercel build --prod` = success, cloud =
  deterministic silent kill (suspected bun/OOM/env difference).
- Cure: prebuilt static deploys; ALSO surfaced that cloud ran CLI 65.x
  vs local 60.x and bun from bun.lock("412 packages") vs local npm
  ("459 packages") — differences matter, pin expectations accordingly.

## E-08. ENOSPC — C: drive at 0 GB
- Headless Chrome screenshots + temp dying writes failed randomly
  (`ENOSPC: no space left on device`); the first-ever ffmpeg output to
  `$env:TEMP\opencode` ALSO failed (dir absent) — separate incident but
  same class: platform I/O assumptions.
- Cures: ffmpeg `New-Item -Force` before every temp write; puppeteer
  profiles + cache pinned to D:\tempwork (126 GB free); kill chrome
  processes after each run (headless leaks). Report C: < 1 GB as a
  standing risk.

## E-09. Video: moov at end / play delay
- Original recording streamed nowhere: no faststart -> browser could
  not start play before full download (our hover-play looked broken).
- Cure: `-c copy -movflags +faststart` remux (lossless, seconds), then
  bitrate-budget re-encode. Verify by first 8 bytes (`ftyp` at 4-7).

## E-10. The band inset war (concentric corners + equal gaps)
- Round 1: panel + INNER image frame (double boxes) — user: "no inner
  frame, full component".
- Round 2: `p-2 md:p-3` inset but `h-auto` image centered in a flex ->
  top/bottom gaps unequal ("corners and distances must be harmonious;
  right side hosts text/divider").
- Cure: single frame, image `h-full object-cover`, uniform inset,
  radius chain 16(outer)/12(inner)/12px(gap). The full analysis in 04.

## E-11. Runtime-flow section removal churn
- Removed `FLOW`, `FlowTerm`, `RuntimeFlow` + their Shell usage and
  renumbered the z-ladder comment; nothing else referenced them
  (checked via grep before/after). SSR probe confirmed absence in both
  pages. Cure pattern: grep FIRST for symbol usage, delete data+comp,
  update the ladder comment, build, probe.

## E-12. PS 5.1 $ErrorActionPreference='Stop' + native stderr
- `powershell -File deploy-macterm.ps1` died at step 1 because npm's
  benign "npm notice" stderr lines became NativeCommandError records
  under the Stop preference inside a nested powershell launch.
- Cure: run the steps directly (no nested -File), or avoid
  `$ErrorActionPreference='Stop'` around native pipelines. (Reported
  as foolproof script wrapper in 06: never nest a -File call from an
  existing PS session for this repo.)

## E-13. React 18 fetchpriority casing
- `fetchPriority="high"` warns "unknown prop" on React 18 (React 19
  supports camelCase); the working spelling on this React version is
  lowercase `fetchpriority="high"` (passes through as a raw attribute).
- Cure: documented in the LCP <img> recipe (05). Upgrade note: on a
  React 19 move, switch back to camelCase.

## E-14. Tailwind ambiguous ease-[...] warnings
- `ease-[cubic-bezier(.4,0,.2,1)]` matches multiple utilities ->
  warnings from both Tailwind scans. Harmless today (first wins), but
  it's a smell — classNames hold these bracket eases in several
  sheets; migrate them to named eases when touched (tasks list).

## E-15. useLayoutEffect SSR warning (known, ignorable)
- framer-motion components warn during SSR probes. CSR-only pages: not
  a bug. Probe noise; do not "fix" by removing animations.

## E-16. HoverPlayCard mute-state restore lost after real click
- Early version restored `prevMuted` on unhover even after the user
  had clicked sound-on -> sound died the moment cursor left the card.
- Cure: `userStarted` flag: only auto-restore when the user NEVER
  clicked (component owns the state once the user owns it).

## E-17. `bun.lock` vs npm package drift (412 vs 459)
- Fresh cloud bun install resolves 412 packages; local node_modules
  carries 459 (historical strays). Consequence strategy: never rely on
  packages not in package.json; if the cloud build flow returns, run
  locally with `bun install --frozen-lockfile` first to reproduce.

---

## THE META-RULES (what the pattern book says)

1. Corrupting incidents came from TOOLS that rewrite files wholesale
   (PS read/write chains) and from PIPELINES with eager-copy steps
   (Vite public copy strip omissions). Build in verify steps.
2. Every outage had a WORKING local dev parity check that could have
   caught it: SSR probe + headless live check = the two instruments,
   both cheap. Run them before every deploy, not after.
3. Infra-flavored mysteries (cloud OOM, ENOSPC, ENOENT) cost the most
   because they fail silently. Always reproduce locally, and if local
   CANNOT reproduce — change the strategy (prebuilt deploy), don't
   burn cycles on the unfixable layer.
4. User taste laws (no warm tones, no hover-zoom, minimal header, exact
   artifacts) — stopped guessing, asked once, applied everywhere, and
   recorded them in 01. Re-asking = distrust lost forever.
