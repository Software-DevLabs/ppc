# 08 — CHECKLISTS (run these, in this order, every time)

## A. FILE SAFETY (before ANY session hands-on)

- [ ] Non-ASCII content? write/edit tools only — NEVER PowerShell
      `Get-Content/Set-Content/echo >`.
- [ ] Touched a PS-generated config? READ IT BACK and eyeball for
      quote-backtick garbage before trusting.
- [ ] Deleting a page component? `grep` its symbol repo-wide first
      (data const + component + JSX usage + z-ladder comment).

## B. BUILD + SSR PROBE (local truth)

- [ ] `npm run build:macterm` -> `built in Xs` line, zero errors.
- [ ] SSR probe (temp `.mjs` at repo root, ascii-only, DELETE after):
      `vite.createServer` middlewareMode + `ssrLoadModule` +
      `renderToStaticMarkup` inside `QueryClientProvider` +
      `queryClientInstance` + MemoryRouter. Assert the strings that
      MUST exist (band classes, absent removed sections) + page length
      in a sane range.
- [ ] Expected noise, ignore: Vite CJS-node-API deprecation,
      MODULE_TYPELESS_PACKAGE_JSON on postcss/query-client,
      framer useLayoutEffect-on-server, Tailwind ease-[..] ambiguous,
      chunk > 500 kB.

## C. PRE-DEPLOY (dist hygiene)

- [ ] dist-macterm contains EXACTLY: macterm.html, vercel.json,
      logo.png, favicon.png, favicon.ico, assets/, macterm/
      (macterm/ = beforefooter, bluetex, featur1, Featur2, main,
       overview.mp4 = 74.5 MB).
- [ ] NO Recording_*, no "before footer.png" (space), no design.png,
      no products_ogi/, no card*/lnd/logo strays, NO .env.local,
      NO .gitignore inside dist.
- [ ] vercel.json present + identical to vercel.static.json.

## D. DEPLOY

- [ ] From dist-macterm: `vercel link --yes --project macterm-001m`
      (rebuild knew no links); expect "Linked".
- [ ] `vercel --prod --yes` -> "Aliased https://macterm-001m.vercel.app".
- [ ] If size-limit error: find the >100 MB file in dist (usually a
      resurrected copy after fresh build), strip, re-deploy.

## E. POST-DEPLOY (HTTP + browser truth)

- [ ] `HEAD /logo.png` -> 200; `HEAD /assets/<bundle>.js` -> 200;
      `HEAD /macterm/overview.mp4` -> 200 + Accept-Ranges: bytes.
- [ ] `node check-live.mjs https://macterm-001m.vercel.app`:
      ERRORS [] (video ERR_ABORTED noise tolerable), text starts with
      BrandBar content, video src = VITE_MACTERM_VIDEO_URL value.
- [ ] After layout-feature deploys: screenshot via shot.mjs style run
      to D: (profile + cache on D:, C: too small), kill chrome after.

## F. NEVER-DO LIST (the permanent bans)

1. Don't write project files via PowerShell round-trips (E-01).
2. Don't ship >= 100 MB files to Vercel; don't trust an upload that
   already reached high percentages (E-03).
3. Don't hand-edit anything inside dist-macterm; it is disposable
   (E-04/E-05). Whitespace-only truth lives in configs at repo root.
4. Don't mount a standalone page without the full provider stack (E-02).
5. Don't fix C: disk pressure by writing temp profiles to C: (E-08).
6. Don't remove sections without the grep-then-delete dance (E-11).
7. Don't run `powershell -File` nested inside an active PS session for
   repo scripts (E-12).
8. Don't declare a deploy live purely on HTTP text checks — images and
   video need HEAD/200 too (E-06).
9. Don't let hero/LCP images be `loading="lazy"`.
10. Don't restyle product identity blues into warm tones, and don't
    reintroduce hover-zoom on media — user law.

## G. HAPPY-PATH REDEPLOY (TL;DR)

```
cd D:\workstation\project
npm run build:macterm                      # wait for built in X s
Copy-Item vercel.static.json dist-macterm\vercel.json -Force
# strip: Recording/before footer.png/design.png/products_ogi/card*/lnd/logo/
#        + everything in dist root except html/vercel.json/logo/favicons
PS D:\...\dist-macterm> vercel link --yes --project macterm-001m
PS D:\...\dist-macterm> vercel --prod --yes     # expect Aliased
# verify E section, kill chrome/node strays
```
(deploy-macterm.ps1 wraps B-F but on this machine run its steps
directly when npm stderr noise kills it.)
