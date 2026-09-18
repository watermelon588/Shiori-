# 12 · Security

Audit and hardening done 2026-09-18. Re-check with `scripts/security-probe.mjs` after any server change:

```powershell
$env:SHIORI_PASSWORD = "<server password>"; node scripts/security-probe.mjs http://127.0.0.1:43000
```

It behaves like an outsider (no password, wrong passwords, spoofed headers, floods, media URLs) and prints PASS/FAIL per check. Last run: **23/23 pass**.

## Model

One server, one owner. Everything behind the **server password** (`SEANIME_SERVER_PASSWORD`). Visitors without it can only open the public pages under `/public/*`: login, guide, privacy, terms, credits. There is no guest browsing of the server on purpose: the events socket is a two-way control channel (plugins, Nakama, playback) and many "read" endpoints leak file paths, so a safe guest mode would need a separate read-only service, not this server.

AniList sign-in is a second, separate login for tracking only.

## Findings and fixes

| # | Finding | Severity | Fix | Where |
|---|---|---|---|---|
| 1 | Server on `0.0.0.0` with no password: anyone on the network had full control (files, torrents, extensions = code execution) | Critical | Password via `SEANIME_SERVER_PASSWORD`, applied after config writes so it never lands in `config.toml`; `SEANIME_SECURE_MODE=strict` | `internal/core/config.go` |
| 2 | Passwordless guard trusted the `Origin` header, which any script can fake | High | Moot once a password is set; probe confirms spoofed `Origin`/`X-Forwarded-For` get 401 | probe §5 |
| 3 | `/manga-downloads`, `/offline-assets`, `/assets` served with no auth at all | Medium | Require the password: header, or the new HttpOnly `shiori_auth` cookie (SameSite=Strict, only accepted on these read-only GET routes) | `handlers/shiori_security.go` |
| 4 | No general request limit (only failed logins were limited) | Medium | Per-IP limiter, 25 req/s, burst 150; streaming, image and media routes exempt; key from the spoof-resistant `requestClientIP` | `handlers/shiori_security.go` |
| 5 | The public status check let wrong passwords through uncounted (brute force at 25/s) | Medium | Wrong tokens there count toward the lockout (10 per 5 min) | `handlers/server_auth_middleware.go` |
| 6 | Password hash compared with `==` (timing leak) | Low | `crypto/subtle.ConstantTimeCompare` everywhere (API, socket, media) | `tokenMatches` |
| 7 | No browser hardening headers | Medium | CSP `script-src 'self' 'wasm-unsafe-eval' blob:` + `object-src 'none'`, `frame-ancestors 'self'`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` — registered first in `NewEchoApp` so the embedded UI gets them | `internal/core/echo.go` |
| 8 | Inline script in `index.html` would force `unsafe-inline` | Low | Moved to `public/shiori-boot.js` | `seanime-web/index.html` |
| 9 | Plugin SVG icons rendered as raw HTML (XSS if a plugin is hostile) | Low | `sanitizeSvg` strips scripts, foreignObject, `on*` handlers, external links | `src/lib/shiori/sanitize-svg.ts` |
| 10 | Wrong password on the login page looped silently | UX | Login verifies against the server first; clear errors for wrong / locked out / offline | `src/app/public/auth/server-auth.tsx` |
| 11 | npm: 6 advisories (postcss, browserslist, nanoid…) | Low (build tools) | `npm audit fix`: production deps now 0; 5 low remain in dev-only tooling | `package-lock.json` |

Verified in the browser on the production build with the CSP on: login, Home, and online playback (HLS blob stream, `readyState 4`) with **zero CSP violations**.

## Known limits (accepted)

- **Plugin webviews** that rely on inline scripts will not run under the CSP. None are installed. If one is ever needed, relax `script-src` for that case only.
- **"Log out of this server"** clears the browser token; the HttpOnly media cookie stays until it expires (30 days) and only unlocks media folders, never the API.
- **Strict mode** blocks remote changes to library folders and private-network requests: change library paths from the PC itself. AnimePahe's localhost solver is blocked in strict mode (it was already broken).
- The password hash (SHA-256 of the password) is the bearer credential and lives in the browser's localStorage, as in upstream Seanime. Use a long random password; the CSP and SVG sanitizer reduce the XSS risk that would expose it.
- Two upstream tests fail on Windows only (`TestExtractMacAppArchive` needs symlink privilege; `TestUsesPrivilegedCommandSettings` checks macOS paths). They fail identically without the Shiori changes.
- `govulncheck` has not been run (needs a tool download). Run `go run golang.org/x/vuln/cmd/govulncheck@latest ./...` before a real deployment.

## Before exposing the server beyond this PC

1. Set `SEANIME_SERVER_PASSWORD` (long, random) and `SEANIME_SECURE_MODE=strict`, restart from a fresh terminal. Commands are in the in-app Guide → Secure your server.
2. Never forward port 43000. Reach it from the phone through Tailscale.
3. Only install extensions whose code you have read (AGENTS.md rule 5).
4. Run `scripts/security-probe.mjs`: everything must pass.
