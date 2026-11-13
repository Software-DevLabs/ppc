# 06 — DEPLOY: VERCEL WAR STORY (macterm-001m.vercel.app)

## CURRENT STATE (what works, do not disturb)

```
project:    prox8lfs-projects/macterm-001m
domain:     https://macterm-001m.vercel.app  (auto, from project name)
CLI login:  vercel  -> user prox8lf (checked via: vercel whoami)
deploy dir: D:\workstation\project\dist-macterm   (STATIC, prebuilt)
ritual:     deploy-macterm.ps1  (see bottom)
```

## THE STACK THAT SHIPS

1. **Dedicated build** — the page deploys ALONE, not the platform app:
   - `macterm.html` — own entry HTML (LTR English, macterm title/meta,
     `#0a0807` inline bg so first paint is never white).
   - `src/macterm-main.jsx` — mounts ONLY MacTermV2 at `/` with the FULL
     provider stack cloned from App.jsx (ThemeProvider + AuthProvider +
     QueryClientProvider + Router + Toaster). Missing providers =
     black page (incident documented in 07).
   - `vite.macterm.config.js` — same react plugin + `@` alias, build
     `outDir: dist-macterm`, `rollupOptions.input: macterm.html`.
     `npm run build:macterm`.

2. **Static-only Vercel deploy** — `dist-macterm/vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "installCommand": "exit 0",
  "buildCommand": "exit 0",
  "outputDirectory": ".",
  "rewrites": [{ "source": "/((?!assets/).*)", "destination": "/macterm.html" }]
}
```
   - no install, no build, cloud serves uploaded files verbatim.
   - the rewrite: anything that is NOT `/assets/*` (hashed bundle) is
     served the SPA html; `/macterm/*` media and `/logo.png`
     pass as plain files (they don't match the assets/ block, they DO
     exist on the FS, and filesystem wins over rewrites on Vercel).

3. **Per-project settings note**: `dist-macterm/vercel.json` is
   deployment-local (CLI reads it from the cwd you deploy). The repo
   ROOT also has a `vercel.json` (from the first cloud-build attempt:
   framework vite, buildCommand `vite build --config
   vite.macterm.config.js`, outputDirectory dist-macterm). If someday
   the FULL platform app must deploy to Vercel from this root, that
   root file must be removed/forked FIRST — it currently speaks
   macterm-only.

## WHY CLOUD BUILD IS BYPASSED (the sordid history)

Attempt 1 — root vercel.json cloud build (`vite build` in the Vercel
build container, 2 cores/8GB): process printed
`transforming...` + the postcss CJS warning, then died WITHOUT any JS
stack error (`Command "vite build ..." exited with 1`). Reproduced
locally with `vercel pull` + `vercel build --prod`: SUCCEEDS in 7s, same
files, same CLI. Conclusion: environment-specific native kill (suspect:
worker/memory/OOM or bun-installed toolchain difference — cloud runs
bun from `bun.lock`) that leaves no stderr to fix. Two retries = two
identical deaths => deterministic => stop fighting, ship prebuilt
locally. `vercel build --prod` locally produces the exact
`.vercel/output` the runtime would serve; we simply deploy `dist-`
macterm/ as files.

## THE PER-FILE 100 MB LIMIT (and how we kept hitting it)

- Vercel rejects ANY single file >= 100 MB (`DeploymentError: File size
  limit exceeded (100 MB)`), the CLI uploads EVERYTHING first, THEN
  tells you. The 147.5 MB capture burned a full 1 GB project upload
  twice before the rule was internalized:
  1. full-source upload included `public/` wholesale (1 GB!);
  2. after re-encode (74.5 MB) the RESIDUAL copy of the ORIGINAL
     `Recording_*.mp4` still sat in dist (Vite copies ALL public/* into
     every build) -> 147.5 MB -> error AGAIN.
- Fixes, all structural now:
  - `.vercelignore` prunes the SOURCE upload for the (dead) cloud flow;
  - `deploy-macterm.ps1` prunes DIST after each build (Vite will keep
    re-copying public anyway): Recording/before-footer-with-space/
    design.png/products_ogi/root card pngs + keeps ONLY
    macterm.html + vercel.json + logo.png + favicon.png + favicon.ico +
    assets/ + macterm/.
  - upload size today: ~148 MB total (74.5 mp4 + ~57 png + bundle) in
    under a minute.

## STATIC-DEPLOY RITUAL (deploy-macterm.ps1 — the whole law)

```powershell
# 1. build (WIPES dist-macterm outright - emptyOutDir kills .vercel too)
npm run build:macterm 2>&1 | Select-Object -Last 2
# 2. restore the static deploy config that the build just erased
Copy-Item vercel.static.json dist-macterm\vercel.json -Force
# 3. strip heavy/unreferenced media  (list in the script)
#    KEEP logo.png / favicon.*  <- the Great Icon Disappearance fix
# 4. re-link (link file died with the wipe) + deploy
Push-Location dist-macterm
vercel link --yes --project macterm-001m
vercel --prod --yes
Pop-Location
```
- `vercel link --yes --project macterm-001m` inside dist-macterm ALSO
  writes `.env.local` + `.gitignore` there — the deploy would have
  uploaded them (the .env.local link-token file is junk but
  LEAKY-LOOKING) — the script deletes both before deploy (done after a
  found incident; been burned once, never again).
- first `vercel deploy` from a NON-linked cwd with a NEW directory name
  CREATES a new project named after that directory ("dist-macterm")
  and from then on quietly deploys THERE (wrong project, wrong domain).
  That stray project was `vercel remove dist-macterm --yes`-ed and the
  ritual now re-links each cycle: link-after-build is mandatory, not
  optional.

## VERIFICATION (before declaring victory, in order)

1. `Invoke-WebRequest -Head /logo.png` -> 200 (the icon MUST be back);
2. `/assets/macterm-*.js` -> 200; `/macterm/overview.mp4` -> 200 +
   `Accept-Ranges: bytes`;
3. `node check-live.mjs https://macterm-001m.vercel.app` (puppeteer-core
   + system Chrome, headless) -> `ERRORS []` (acceptable: `ERR_ABORTED`
   noise on the video prefetch) + body text starts with the BrandBar
   content + the video `currentSrc` is the .env URL.
- Chrome headless quirks recorded: profile dir MUST live on D: (C: had
  ~0.25 GB free, ENOSPC mid-screenshot); a stale chrome headless process
  held the profile -> kill chrome between runs; `--headless=new` works
  (old headless removed in Chrome 132).

## REDEPLOY QUICK PATH

```
powershell (from D:\workstation\project):
  powershell -ExecutionPolicy Bypass -File deploy-macterm.ps1
```
Do NOT run the ps1 via a nested `powershell -File` from an already-PS
session: npm's stderr notices turn into NativeCommandError records
under `$ErrorActionPreference='Stop'` and murder the script at step 1.
Run the four steps directly (or `powershell -Command "& {...}"` with
errors not escalated). Root cause + fix history in 07.
