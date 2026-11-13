# IDENTITY DESIGN — MASTER OVERVIEW

> Permanent engineering + design memory for this repo (Software DevLabs —
> `D:\workstation\project`). Written by the agent, for the agent. Read this
> folder BEFORE touching any page in `src/pages/`.

Location: `D:\workstation\project\idendity-design/`
Last updated: 2026-10-30

---

## WHAT LIVES HERE (read order)

| File | What it covers |
|---|---|
| `00-OVERVIEW.md` | this file — the map |
| `01-design-token-system.md` | colors, type, radius, iconography, motion language, taste bans |
| `02-layout-architecture.md` | sheet-stacking system, z-ladder, sticky hero, parallax, marquees |
| `03-motion.md` | framer-motion vs GSAP: who does what, full GSAP handbook, its real bugs |
| `04-components-playbook.md` | PageLoader/prewarm, HoverPlayCard, BrandBar, FluencyBand, footer |
| `05-media-pipeline.md` | ffmpeg remux/re-encode math, faststart, remote video via .env, PNG budgets |
| `06-deploy-vercel.md` | dedicated macterm build, static Vercel deploy, the whole war story |
| `07-problems-and-fixes.md` | every incident in this project: root cause, fix, prevention |
| `08-checklists.md` | pre-build, SSR probe, pre-deploy, "never do this" list |

---

## THE TWO SUB-SYSTEMS OF THIS REPO

1. **The platform app** (`src/main.jsx`, `src/App.jsx`): multi-page site
   (`/`, `/projects`, `/blog`, `/ver5`...`/ver10`, `/products`, `/macterm`,
   `/mactermv2`), full stack of providers
   (ThemeProvider + AuthProvider + QueryClientProvider + Router + Toaster),
   react-query data layer, dashboard, GSAP-based Ver7/Ver10 chrome.
   Entry HTML: `index.html` (RTL, Arabic-first brand shell).

2. **The standalone macterm product site** (deployed on
   `https://macterm-001m.vercel.app`): a DEDICATED bundle
   (`macterm.html` + `src/macterm-main.jsx` + `vite.macterm.config.js`)
   that ships ONLY `MacTermV2` at `/`, with the full provider stack copied
   from App.jsx (missing one = black page — see 07). Deployed as prebuilt
   static output from `dist-macterm/` — Vercel builds are NOT run in cloud
   (see 06 for why). Entry point:

```jsx
// src/macterm-main.jsx — the standalone mount
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
  <AuthProvider>
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<MacTermV2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  </AuthProvider>
</ThemeProvider>
```

**Rule:** any new standalone page deploy MUST clone this provider stack
exactly. Skipping `QueryClientProvider` once cost us a full black page
(child component called `useQuery` -> React unmount -> solid blank).

---

## THE IDENTITY IN ONE PARAGRAPH

Dark, neutral, premium, print-inspired product pages. Page background
`#0a0807`, ink `#F2F2F0`, two grays only (`#A8A8A4` body, `#8A8A86`
muted, `#3f3f3f` hairlines), single accent cobalt `#2E5BFF` (scarce).
Content scrolls through stacked full-width "sheets" with rounded top
corners, each covering the previous in a z-ladder; a sticky hero pins
behind the first sheets; media is real product artifact (RGB terminals,
full-bleed screenshots) on rare cobalt backdrops; marquees and one-sided
reveals carry rhythm; everything above the fold renders FULLY PRE-FORMED
because a first-load asset loader counts the critical media before
revealing the page. Typography is IBM Plex Sans Arabic + JetBrains Mono
(labels/percentages/tickers). NO warm/maroon/brown casts — the user
hates them. NO hover-zoom on media cards — banned.

Versions pinned by the lockfile: React 18.3.1, Vite 5.4.21,
framer-motion 11.18.2, GSAP 3.15.0, Tailwind 3.4.19,
react-router-dom 6.30.6, @tanstack/react-query 5.104, lucide 0.414.

---

## HARD RULES (the ones humans repeat)

1. Never write project files with PowerShell `Get-Content/Set-Content` /
   `echo > file` round-trips — UTF-8 becomes mojibake. Use the write/edit
   tools or Node `fs`. (Incident: the macterm band copy was corrupted to
   `â€“` garbage; repaired byte-exact via a Node script.)
2. Never deploy a media file >= 100 MB to Vercel — hard per-file limit,
   CLI dies mid-upload after burning the whole transfer.
3. Never trust an empty browser as "it works" — black page == a client
   exception, SSR probes can't catch render-time hook crashes. Headless
   Chrome (`puppeteer-core` + system Chrome, `check-live.mjs`) is the
   acceptance test.
4. Every page must render under the FULL provider stack; standalone
   entries clone App.jsx's wrappers.
5. First-load reveals nothing until the critical set (above-fold images +
   video first frame) is counted — `PageLoader` (see 04) — with a 3.5 s
   hard cap so a stalled file can never hang the page.
6. Product pages use `framer-motion` for scroll choreography; GSAP stays
   on the platform chrome (Ver7/TiltCard/LiquidButton). Mixing two
   transform owners on one element is how you get jitter (see 03).
7. Deploying macterm = `deploy-macterm.ps1` ritual (build -> restore
   static vercel.json -> strip heavy/unneeded media -> link -> deploy).
   A rebuild WIPES `dist-macterm/` including the `.vercel` link and the
   deploy-time `vercel.json` — never hand-edit inside dist.
