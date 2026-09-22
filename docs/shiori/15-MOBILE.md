# 15 · Mobile — install Shiori as a phone app (PWA)

Shiori's web interface is an installable **Progressive Web App**. There is no separate
mobile codebase and no app store: the same UI the desktop app serves can be added to a
phone's home screen and opened like a native app. It talks to the Shiori server running
on your computer, so the computer must be reachable — at home over your network, or from
anywhere over **Tailscale** (recommended, and required for a full install because service
workers need HTTPS).

## What makes it a PWA

- `seanime-web/public/manifest.json` — name, icons, `display: standalone`, theme colour.
- `seanime-web/public/sw.js` — a deliberately minimal service worker. It makes the app
  installable and shows `offline.html` when the phone can't reach the server. It never
  caches API responses, app data or stream/media URLs, so nothing goes stale or leaks.
- Registration lives in `seanime-web/public/shiori-boot.js` (an external file, so the
  strict Content-Security-Policy can keep forbidding inline scripts).
- `index.html` carries the manifest link, `theme-color`, and the Apple home-screen meta
  tags and icon.

Service workers only run in a **secure context** (HTTPS, or `localhost`). Over a plain
`http://192.168.x.x` LAN address the app still works in the browser, but it won't install
as a standalone app — use Tailscale for the real thing.

## Reach Shiori from your phone, securely (Tailscale)

The server stays bound to `127.0.0.1` and never listens on your public network. Tailscale
gives your own devices an encrypted private network and can put an HTTPS front on the
local server without exposing it to the internet.

On the computer running Shiori:

1. Install Tailscale and sign in (same account on the phone).
2. Enable HTTPS for your tailnet (Tailscale admin console → **DNS** → enable MagicDNS and
   HTTPS certificates).
3. Publish the local server over your tailnet:

   ```powershell
   tailscale serve --bg 43000
   ```

   This maps `https://<your-computer>.<your-tailnet>.ts.net/` to `http://127.0.0.1:43000`.
   Check it with `tailscale serve status`.

On the phone (Tailscale installed and connected):

4. Open `https://<your-computer>.<your-tailnet>.ts.net/` in the browser.
5. Log in with your Shiori password (strict mode is still enforced).
6. Install it (below).

Because access rides the tailnet, only your own signed-in devices can reach Shiori, the
connection is HTTPS, and the server never accepts a public connection. Do **not** forward
port 43000 on your router as an alternative.

## Add to Home Screen

- **iPhone / iPad (Safari):** Share button → **Add to Home Screen** → Add.
- **Android (Chrome):** menu (⋮) → **Install app** / **Add to Home screen**.

The icon opens Shiori full-screen, without browser chrome. When the phone can't reach the
computer (it's off, asleep, or you're not on the tailnet) you get a short "Can't reach
Shiori" page instead of a browser error.

## Scope and limits

- This is the **full Shiori UI**, sized for mobile — not a stripped-down companion. It is
  enough to browse, manage the library, queue downloads and control the auto-downloader
  from your phone.
- No web push notifications yet, and no offline library playback — the app needs the
  server for data and streams by design.
- A dedicated lightweight companion screen and an agent layer remain parked (Vision §
  "away"); revisit only if the full UI proves too heavy on a phone.
