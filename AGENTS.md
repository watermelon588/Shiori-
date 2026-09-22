# AGENTS.md: Shiori (栞)

Read this first in every session. It is the contract for any AI agent working in this repo.

## 1. What this is

**Shiori** is a personal "Jarvis for an otaku": a private anime and manga hub built on a local fork of **Seanime 3.10.2**.

- **At home:** watch, read, and see downloaded episodes waiting.
- **Away:** the backend keeps downloading and tracking (later: a PWA companion plus an agent layer).
- **Personal use only.** It is never pushed to GitHub. Third-party providers breaking is acceptable; just keep fallbacks.
- **Owner profile:** strong in JS/React, no Go experience. Explain every Go change in plain words.
- **Public identity is the pseudonym `Zaxxewu`.** Never put the owner's real name in the UI, docs shown to users, or commits meant for others. The maintainer identity and support email live only in `seanime-web/src/lib/shiori/credits.ts`.

The north star is `docs/shiori/00-VISION.md`. Check features against it.

## 2. Repo map

```
Shiori (栞)/
├── AGENTS.md / CLAUDE.md      ← you are here
├── seanime/                   ← THE APP (own git repo, branch `shiori-redesign`)
│   ├── internal/              ← Go backend (Echo API :43000, SQLite, Goja extensions)
│   ├── seanime-web/           ← React 19 + rsbuild + Tailwind 3 + TanStack Router/Query + motion
│   ├── dev-datadir/           ← live data: seanime.db, config.toml, extensions/, logs/
│   └── seanime.exe            ← prebuilt server binary (Go source changes need a rebuild)
├── shiori-backend/            ← Node/Express skeleton, NOT connected; its rules live in AGENT_INSTRUCTION.md
├── scripts/test-providers.mjs ← live smoke test for every provider (torrent / stream playback / manga)
├── docs/shiori/               ← architecture, schema, design, providers, hosting, skills
└── .claude/
    ├── launch.json            ← dev servers (seanime-server, seanime-web)
    └── skills/                ← 74 vendored skills (design, motion, GSAP, ponytail, graphify…)
```

`AGENT_INSTRUCTION.md` and `.agents/AGENTS.md` describe the **Node `shiori-backend` only** (Postman docs, Mongo, Supabase). They do not govern `seanime/`.

## 3. Run it

Daily use: double-click `start-shiori.cmd` in the repo root (or run it from a terminal). It starts `seanime/seanime-shiori.exe` with `seanime/dev-datadir` and opens http://localhost:43000; if Shiori is already running it just opens the browser.

```bash
# Go server (the data dir MUST be an absolute path)
seanime/seanime.exe --datadir "C:/path/to/Shiori (栞)/seanime/dev-datadir"
# Frontend with hot reload → http://127.0.0.1:43210 (talks to :43000)
cd seanime/seanime-web && npm run dev
# Provider health check (server must be running)
node scripts/test-providers.mjs            # or --only torrent|stream|manga

# Portable Windows desktop release + site download
powershell -ExecutionPolicy Bypass -File scripts/build-desktop.ps1

# Production frontend (much smoother than the dev server; rebuild after UI changes)
cd seanime/seanime-web && npm run build && cp -r out/. ../web/     # keeps web/assets (owner originals)
```

`seanime.exe` (prebuilt, 2026-08-04) was compiled in dev configuration: it serves the API only and points at :43210, so it cannot serve `web/`. `seanime-shiori.exe` is built from source (`go build -o seanime-shiori.exe -trimpath -ldflags="-s -w" -tags=nosystray .`) and serves the built UI on :43000.

In Claude Code desktop, use `preview_start` with `seanime-server` then `seanime-web`.
Checks before calling frontend work done: `cd seanime/seanime-web && npx tsc --noEmit -p .`, then a visual check in the browser pane.

## 4. Current state (2026-09-17)

| Area | State |
|---|---|
| AniList login | Works (user `zaxxewu`; list currently empty) |
| Torrent providers | AnimeTosho (NEW) ✅, Nyaa ✅, SeaDex ✅ |
| Torrent client | Built-in Seanime client ✅ (experimental flag enabled in `config.toml`) |
| Auto-downloader | Enabled, provider AnimeTosho, every 20 min. It only acts on rules/followed shows |
| Online streaming | KickAssAnime ✅ plays, AniZone ✅ plays, Anikoto ⚠️ lists episodes but its CDN 404s, AnimePahe ❌ needs "Aqua's Utils" solver on :8191 |
| Manga | MangaBuddy, Atsumaru, MangaFreak, MangaBats, MangaFire ✅; AsuraScans, KuraManga ✅ (manhwa-only catalogues) |
| Library folder | `%USERPROFILE%/Videos/Shiori/Anime` (**C: has ~20 GB free**) |
| Frontend | **Two light variants** over every screen: 凪 Nagi (calm) and 乱舞 Ranbu (loud). Switch from the top bar, the sidebar, the profile page, or `?variant=nagi|ranbu`. Owner is choosing. |
| Shell | **Sidebar is the only navigation** (top navbar removed 2026-09-18): 80px rail, expands on hover, pin to keep open; back/forward, search field, grouped Browse / Library / Downloads sections, account menu at the bottom. Mobile gets a floating menu button. Persistent footer, `/profile` page |
| Pages | Home = hero + search + Aired recently + format/genre browser (season/TV/movie/short/ONA/OVA) + trending/season/coming soon/movies/manga. Anime pages open on **Watch online**; every episode has its own download button. Schedule, Settings, Lists, Manga, Downloads, Auto downloader, Debrid, Scan summaries, Offline all have a `ShioriPageHeader` and a real empty state |
| Security | **Server password + strict mode via env vars** (`SEANIME_SERVER_PASSWORD`, `SEANIME_SECURE_MODE=strict`), rate limiting, CSP and hardening headers, protected media folders. Owner has not set the password yet. Audit: `docs/shiori/12-SECURITY.md`; verify with `scripts/security-probe.mjs` (23/23 pass) |
| Public pages | `/public/auth` (login), `/public/guide`, `/public/privacy`, `/public/terms`, `/public/credits`, `/public/support` (donations): readable without the password. Support email in footer and legal pages |
| Donations | `/public/support`, configured in `src/lib/shiori/support.ts` (all methods empty → "not open yet"). Setup and risks: `docs/shiori/13-DONATIONS.md` |
| Secrets file | The server reads `<data dir>/.env` at startup (`SEANIME_SERVER_PASSWORD`, `SEANIME_SECURE_MODE`); template in `seanime/.env.example`. `dev-datadir/` is git-ignored |
| Guide | `/guide` (sidebar → Guide): in-app manual for users + developers, screenshots in `public/shiori/guide/*.webp` (re-shoot with `scripts/capture-ui.mjs`, convert to webp) |
| Launch video | `brag-output/brag.mp4` (20 s, 1920×1080, `/brag` + Hyperframes; source in `brag-output/composition/`, re-render with `npx hyperframes render --quality delivery --output ../brag.mp4`). Plain 60 s app demo: `brag-output-demo/demo.mp4` (full-page captures of every page panned in ffmpeg, captions, no audio; how-to in `brag-output-demo/README.md`). Not yet copied to `site/assets/demo.mp4` / `config.js → demoVideo` |
| Owner art | 178 curated images in `seanime-web/public/shiori/art` (30 cut-outs), built by `scripts/build-art.py` from `art-source/` |
| Desktop app | Portable Windows x64 tray app. First launch opens a loopback-only password setup, stores data in `%APPDATA%/Shiori`, enables strict mode, seeds the reviewed providers, **auto-creates a Desktop + Start-Menu "Shiori" shortcut** (`internal/server/desktop_shortcut_windows.go`, pure-Go shell COM — no installer, no powershell spawn) and opens `127.0.0.1:43000`; later launches are one click from that icon. Build: `scripts/build-desktop.ps1`; download: `site/downloads/Shiori-Windows-x64.zip` (79,060,758 bytes, sha256 `04f6bbb3…bdd083`). Verified 2026-09-22: isolated packaged-exe run → loopback-only, 14 providers, strict mode, shortcut created, PWA files served, security probe 23/23 |
| Mobile / PWA | The web UI is an **installable PWA** (Add to Home Screen): `manifest.json` + minimal service worker (`sw.js`, offline page only — never caches API/streams) + registration in `shiori-boot.js`, all in `seanime-web/public/`. Reach it from a phone securely over Tailscale (`tailscale serve --bg 43000` → HTTPS to loopback; server stays 127.0.0.1 + strict). It's the full UI on mobile, not a slimmed companion. Docs: `docs/shiori/15-MOBILE.md`. Push notifications / offline playback still parked. **Requires a fresh exe build to ship** (PWA files are embedded in `web/`) |

Full provider details are in `docs/shiori/08-PROVIDERS.md`.

## 5. Hard rules

1. **Never break the IA.** Keep routes, nav labels and API contracts unless the owner asks.
2. **`api/generated/*` is codegen output.** Don't hand-edit it.
3. **Never store stream URLs** (HLS/m3u8) in the DB or files; they're temporary and signed.
4. **Secrets** (debrid keys, AI keys) go in env vars only, never in git or docs.
5. **Before installing any extension,** read its code (fetched domains, `$os`/filesystem/eval usage) and record it in `08-PROVIDERS.md`.
6. **Privileged API calls** (install extensions, torrent client) need a trusted local origin. From scripts, send `Origin: http://127.0.0.1:43210`. Once a server password is set, scripts must also send `X-Seanime-Token: <sha256 of the password>`.
10. **Security changes need the probe.** After touching auth, middleware or `core/echo.go`, rebuild `seanime-shiori.exe` and run `scripts/security-probe.mjs`; every check must pass.
7. **Prefer extending Seanime over forking logic.** Keep changes small, in `lib/shiori/*` and `components/shared/shiori/*` where possible, so upstream merges stay easy.
8. **Downloads are file writes.** Don't start real torrent downloads without the owner's OK (the disk is nearly full).
9. **Ponytail mindset:** the simplest thing that works; no new dependency when the platform or an installed library already does it.

## 6. Design direction (active)

Two switchable light worlds, both applied to every screen (details: `docs/shiori/09-DESIGN-DIRECTION.md`, contract: `seanime/.impeccable/surfaces/`):
- **凪 Nagi**: an anime ending sequence. Sky-white ground, ink navy, one cobalt accent, Zen Maru Gothic, drifting stills, credits-style copy.
- **乱舞 Ranbu**: a konbini POP wall. Fluorescent white, POP yellow, magenta, shelf blue, Dela Gothic One + Mochiy Pop One, die-cut stickers, cut-out characters, an LED ticker.

How it works: `html[data-shiori-variant]` inverts Seanime's gray/brand/white/black tokens (Seanime was dark-only), so hard-coded dark classes flip without edits. Styles live in `src/app/shiori.css` (tokens), `shiori-surfaces.css` (heroes, shell), `shiori-components.css` (UI primitives). Home heroes: `src/components/shared/shiori/`. The old dark vermilion pass (`05-DESIGN-SYSTEM.md`) is retired.

Motion budget (from the `animate` / `emil-design-eng` skills):
- Animate `transform` / `opacity` (plus `clip-path`) only. Never `transition: all`.
- UI motion 150–300 ms, strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; springs only for gestures and drag.
- Nothing animates on actions used 100+ times a day (keyboard shortcuts, the command palette).
- Stagger groups by 30–80 ms; never block interaction.
- Always ship `prefers-reduced-motion` and `(hover: hover) and (pointer: fine)` gating.
- CSS first, `motion/react` for exits, layout and springs. GSAP only for scroll-pinned showpieces.

## 7. Skills: which to use when

Vendored in `.claude/skills/`. The full map is in `docs/shiori/10-SKILLS.md`.

| Task | Skill(s) |
|---|---|
| Any UI build or redesign | `design-taste-frontend`, `redesign-existing-projects`, `impeccable`, `high-end-visual-design` |
| Motion | `animate` (build), `review-animations`, `improve-animations`, `find-animation-opportunities`, `emil-design-eng`, `apple-design` |
| Scroll showpieces | `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance` |
| Component choice | `pick-ui-library`, `frontend-ui-engineering` |
| Generated art / mockups | `imagegen-frontend-web`, `image-to-code`, `higgsfield-generate` (needs the Higgsfield CLI) |
| Keep code minimal | `ponytail` (+ `ponytail-review`, `ponytail-audit`) |
| Understand the codebase | `graphify` (`python -m graphify`, package `graphifyy` installed) |
| Workflow | `planning-and-task-breakdown`, `incremental-implementation`, `debugging-and-error-recovery`, `performance-optimization`, `security-and-hardening` |

## 8. Gotchas already paid for

- A font family name containing a digit **must be quoted** in `tailwind.config.ts` (`'"M PLUS 1 Variable"'`), or the browser drops the whole rule.
- Windows paths sent through bash + JSON lose their backslashes. Build payloads in a `.mjs` file with `String.raw`, or use forward slashes.
- Changing `defaultTorrentClient` needs a **server restart**. The built-in client also needs `[experimental] builtintorrentclient = true`.
- The video proxy **rewrites playlist URIs** to `/api/v1/proxy?...`; fetch those as-is.
- The auto-downloader's first check at startup runs about 1 s before extensions load and logs "no providers found". The next interval works.
- Online streaming already has automatic provider fallback (`use-onlinestream-auto-provider-cycler.ts`). The order comes from `seanime-web/src/lib/shiori/provider-priority.ts`.
- `seanime/` had uncommitted upstream codegen changes before Shiori work began. Leave them alone.
- The browser pane often reports `visibilityState: hidden`; Framer Motion fades then freeze at opacity 0 in screenshots. That is a capture artifact, not a bug. Use `scripts/capture-ui.mjs` (puppeteer-core + installed Chrome, real time, `?capture` settles motion) for real evidence.
- Plain `chrome --headless --screenshot` is unreliable here: virtual time freezes Framer Motion, it cannot write into paths containing 栞, and it has a ~500px minimum width. Use the puppeteer script.
- `seanime/web/` is build output, but it also holds the owner's original image drop (`web/assets`). Deploy with `cp -r out/. ../web/` (never delete the folder); the processed copies live in `public/shiori/art` and the safe originals in `art-source/`.
- Frontend performance rules learned the hard way: never stack more than two full-bleed images in the hero (the compositor holds each as a layer), pause marquees off-screen with `useInView`, and never put `scrollbar-color` (or any inherited property) on a universal selector: it forces a style recalc across the whole DOM.
- `npm run build` type-checks before the router plugin regenerates `routeTree.gen.ts`, so a brand-new route fails the build. Run `npx rsbuild build` once (regenerates the tree), then `npx tsc --noEmit -p .`.
- Go builds need `CGO_ENABLED=0` on this machine (the installed C compiler is 32-bit).
- The embedded web UI is served by a middleware in `core/echo.go` that answers without calling `next`: headers meant for the UI must be set before it, not in `handlers/routes.go`.
- The rsbuild dev server itself gets janky after a long session (HMR accumulation). For daily use, run the production build.

## 9. After every task

Update `AGENTS.md` §4 if the state changed, update the relevant `docs/shiori/*` page, and rerun `scripts/test-providers.mjs` if providers were touched.
