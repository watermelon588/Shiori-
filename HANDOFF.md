# HANDOFF — start here (Shiori 栞, 2026-09-18)

You are picking up a long session. Everything you need is on disk; this file is the map. Read in the order below and stop reading as soon as you have what the task needs.

## 1. Read order (minimal tokens)

| # | File | Why | Cost |
|---|---|---|---|
| 1 | this file | state, next steps, owner rules | small |
| 2 | `AGENTS.md` (repo root) | the contract: repo map, run commands, §4 current state, §5 hard rules, §8 gotchas | medium |
| 3 | `docs/shiori/00-VISION.md` | only if the task is a new feature | small |
| 4 | `docs/shiori/12-SECURITY.md` | only if touching auth, middleware, server, deployment | small |
| 5 | `docs/shiori/13-DONATIONS.md` | only if touching the Support page / payments | small |
| 6 | `docs/shiori/09-DESIGN-DIRECTION.md` | only for UI work (two themes, sidebar, page headers) | medium |
| 7 | `docs/shiori/08-PROVIDERS.md` | only if touching streaming/torrent/manga sources | medium |

Do **not** read whole large files blind (`home-screen.tsx` 1k lines, `settings/page.tsx` 1k lines, `main-sidebar.tsx` 700 lines, `onlinestream-page.tsx` 1k lines). Grep for the symbol, then read the range.
`CLAUDE.md` just includes `AGENTS.md`. The global `~/.claude/CLAUDE.md` asks you to load `using-agent-skills` and the skills index `~/.claude/skills/my-skills/SKILL.md`: skim the index, load only the skills the task needs.

## 2. Owner preferences (follow these)

- **Token-thrifty.** The owner is running low. Small, targeted edits; no re-reading; short answers. Ponytail mode (simplest thing that works) is on by default.
- **Report before big or irreversible actions.** Never `git commit` / `push` without an explicit OK. Nothing has been committed or pushed yet.
- **Public identity is the pseudonym `Zaxxewu`.** Never write the owner's real name in UI, docs or commits. It lives only in `seanime-web/src/lib/shiori/credits.ts` (plus the support email and UPI ID, which the owner chose to keep for now).
- Owner knows JS/React well, **no Go**: explain every Go change in plain words.
- Never put secrets in chat output, docs or git. The server password is in `seanime/dev-datadir/.env` (git-ignored). Do not print it.

## 3. Skills to load by task

| Task | Skills |
|---|---|
| UI / pages | `frontend-ui-engineering`, `emil-design-eng` (motion rules), `impeccable` only for big redesigns |
| Keep it small | `ponytail` (always on), `ponytail-review` before finishing |
| Security / server | `security-and-hardening` |
| Debugging | `debugging-and-error-recovery` |
| Codebase questions | `graphify` (only if `graphify-out/` exists; it does not yet) |

## 4. How to run and verify

```powershell
# servers (Claude Code desktop): preview_start "seanime-server" then "seanime-web"
#   seanime-server = seanime/seanime-shiori.exe (UI embedded, :43000, reads dev-datadir/.env → password + strict mode)
#   seanime-web    = rsbuild dev server with hot reload (:43210, talks to :43000)

# after UI changes
cd seanime/seanime-web
npx rsbuild build                  # also regenerates routeTree.gen.ts for new routes
npx tsc --noEmit -p .              # must be clean
Copy-Item -Recurse -Force out\* ..\web\   # then delete stale chunks in web\static not present in out\static (never touch web\assets)

# after Go changes (stop seanime-server first: the exe is locked while running)
cd seanime
$env:CGO_ENABLED = "0"             # the local C compiler is 32-bit
go build -o seanime-shiori.exe -trimpath -ldflags="-s -w" -tags=nosystray .
go test ./internal/handlers/ ./internal/core/    # 2 upstream tests fail on Windows only (symlink / macOS paths): pre-existing, ignore

# security regression (server must be running)
$env:SHIORI_PASSWORD = "<from dev-datadir/.env>"; node scripts/security-probe.mjs     # 23/23 must pass

# real screenshots (Framer Motion freezes in the browser pane): scripts/capture-ui.mjs
# copy it to %USERPROFILE%\shiori-capture-tool, set $env:SHIORI_BASE = "http://127.0.0.1:43000"
```

Bash heredocs with apostrophes break in this environment: for multi-line edits write a small `.py` in the scratchpad and run it, or use the Edit tool.

## 5. Current state (what exists and works)

- **App:** Seanime 3.10.2 fork in `seanime/` (own git repo, branch `shiori-redesign`, ~80 uncommitted files, remote still points to upstream `5rahim/seanime`: **never push there**).
- **Shell:** the sidebar is the only navigation (rail → expands on hover, pin, back/forward, search, grouped sections, account menu). Mobile: floating menu button. Top navbar removed; `hideTopNavbar` is forced `true`.
- **Pages done:** Home (hero + search + aired recently + browse by format/genre + trending/season/coming soon/movies/manga), anime page (opens on **Watch online**, per-episode download button everywhere), Schedule, Settings, My lists, Manga, Downloads, Auto downloader, Debrid, Scan summaries, Offline, Profile, in-app **Guide** (`/guide`).
- **Public pages (no password):** `/public/auth` (login), `/public/guide`, `/public/privacy`, `/public/terms`, `/public/credits`, `/public/support` (donations). Shared shell: `components/shared/shiori/shiori-public-shell.tsx`.
- **Security (details in 12-SECURITY.md):** server password + strict mode from `dev-datadir/.env` (loader in `internal/core/config.go`), constant-time token checks, protected media folders via HttpOnly `shiori_auth` cookie, per-IP rate limit, login lockout (also on the public status check), CSP + hardening headers (in `internal/core/echo.go`, before the embedded-UI middleware), plugin SVG sanitizer, `dev-datadir/` git-ignored. New Go files: `internal/handlers/shiori_security.go` (+ test), `internal/core/config_env_test.go`.
- **Donations:** `/public/support` configured in `seanime-web/src/lib/shiori/support.ts`. UPI ID set; QR (cropped, name removed) at `seanime-web/public/shiori/support/upi-qr.png`. Goal ₹1,500 for a domain, updated by hand. PayPal / Stripe / Dodo / Ko-fi empty.
- **Logo:** the pig mark (source: `seanime-web/src/assets/logo/ChatGPT Image Sep 18, 2026, 03_50_15 PM.png`; the other images there are for branding). Generated into `public/icons/*` (favicon, Android, Apple), `public/shiori-logo.png` (sidebar, public header, footer via `.shiori-logo__img`) and `public/seanime-logo.png` (loading screen, getting-started, offline).
- **Marketing site:** `site/` (static, no build): `index.html` (Nagi, the flagship: hero plates + thumbnails, static still wall, seasons, cast, manga columns, 3D gallery wall; no QR, tipping lives in the app), `pop.html` (Ranbu), `gallery.html` (169 pieces), `docs.html`, `legal.html`; settings in `site/assets/js/config.js` (download/GitHub URLs empty until a release exists, demo video empty). Real app screenshots in `site/assets/shots`, mascots in `site/assets/brand`. Preview: `preview_start shiori-site` (:4600). Deploy notes: `site/README.md`. `scripts/capture-site.mjs` screenshots it; `scripts/capture-ui.mjs` now logs in via `SHIORI_PASSWORD`.
- **Install manifest:** branded "Shiori", light colours (installable as a browser app on localhost; phones need HTTPS).

## 6. Known issues / loose ends

1. The original QR `seanime-web/src/assets/upi.jpeg` shows the owner's real name: move it out of the repo before any push.
2. Support email and UPI ID contain the real name: swap when the owner creates pseudonymous ones (`credits.ts`, `support.ts`).
3. Links to Guide / Privacy / Terms / Credits / Support from inside the app exist only in the footer (and Guide in the sidebar): add them to the sidebar account menu so the app and the public pages feel connected.
4. Repo files still contain the Windows path with the real name (`AGENTS.md` §3/§4, `.claude/launch.json`, `shiori-backend/docs/SERVICE_MAP.md`). Only matters if the repo goes public; git commit author is also the real name.
5. Providers: Anikoto CDN 404s, AnimePahe needs a localhost solver (blocked by strict mode anyway). Drop them from `src/lib/shiori/provider-priority.ts` or fix.
6. `govulncheck` never run (needs a tool download; ask first).
7. The owner shared the server password in chat once; recommend changing it to a longer one in `dev-datadir/.env`.
8. C: has ~20 GB free: point the library at a bigger drive before auto-downloads.

## 7. What to build next (owner's order)

1. **Small fix:** item 3 above (account-menu links to public pages). ~15 minutes.
2. **Phone access:** Tailscale on PC + phone, HTTPS via `tailscale serve`, install Shiori as a home-screen app. Mostly setup, little code.
3. **Phone companion (postponed by owner):** lightweight PWA view to queue downloads / toggle the auto-downloader remotely, later a voice assistant and an agent layer (see `00-VISION.md`, `07-HOSTING.md`).
4. **Distribution (only if the owner decides to publish):** keep the repo **private** (recommended; DMCA risk, copyrighted art in `art-source/`, real name in history). If public: GitHub Release zip with `shiori.exe` + `.env.example` + README, and a small static landing site (Vercel/Netlify) with Guide, Download, Support, Privacy, Terms, on the donated domain. The app itself is never hosted publicly: every user runs their own copy with their own password, folders and sources.
5. **Not recommended:** hosting the Go server on Render/Railway (torrent ToS bans, ephemeral disk, bandwidth), native mobile apps, a multi-user/guest mode on this server (needs a separate read-only service).

## 8. Answers already given to the owner (don't re-derive)

- License: Seanime is GPL-3.0, so MIT is impossible for the app; owner is fine without a new license.
- Guests: without the server password a visitor sees only the public pages, by design.
- Other people never use the owner's server or password; each runs their own copy.
- Donations: UPI is lowest-risk; processors may freeze accounts tied to unofficial content; donors see the bank-verified name; gifts above ₹50,000/yr are taxable in India.
