# HANDOFF — Shiori desktop release

Updated: 2026-09-22

This is the continuation point for Claude Code. The current request was to make Shiori a downloadable, lightweight Windows desktop app with first-launch password setup and later one-click local launch, then wire the website Download buttons to it.

## Read first

1. Read `AGENTS.md` completely. It is the repository contract.
2. Read `docs/shiori/14-DESKTOP.md` for the desktop architecture and user flow.
3. Read `TODO.md` for the ordered finish checklist.
4. Use `ROADMAP.md` only for larger project sequencing.

Do not push to GitHub. Do not start a real torrent download. Do not print the password from `dev-datadir/.env`. Public identity must remain `Zaxxewu`; personal contact or payment identifiers must not appear on the website.

## What is implemented

### Native desktop app

- Uses Seanime's existing Go server and Windows tray integration; no Electron and no new runtime dependency.
- First launch defaults to `%APPDATA%\Shiori` and `127.0.0.1:43000`.
- If no password exists, Shiori opens a temporary loopback-only setup page.
- Password rules: 20–256 characters, confirmation required, no line breaks or surrounding whitespace.
- Setup writes `.env` with `SEANIME_SERVER_PASSWORD` and `SEANIME_SECURE_MODE=strict`.
- Reviewed provider JSON files are copied on first launch without overwriting user files.
- Later launches are one click: start the local server, open Shiori in the browser, and keep tray controls available.
- A second launch detects the running local app and only opens it instead of starting another server.
- Fresh configs enable the built-in torrent client, but no torrent download was started during this work.

Go files:

- Modified `seanime/internal/server/server_windows.go` (calls `ensureDesktopShortcut()` after provider seeding)
- Added `seanime/internal/server/desktop_windows.go`
- Added `seanime/internal/server/desktop_setup.html`
- Added `seanime/internal/server/desktop_windows_test.go`
- Added `seanime/internal/server/desktop_shortcut_windows.go` (Desktop + Start-Menu shortcut via shell COM)
- Added `seanime/internal/server/desktop_shortcut_windows_test.go`
- Modified `seanime/internal/core/config.go`

Desktop shortcut (2026-09-22): on the first launch that starts the server, the app creates a "Shiori" shortcut on the Desktop and in the Start Menu pointing at the running `Shiori.exe`, so non-technical users open the app from a normal icon. It uses the Windows shell COM API directly (no installer, no powershell spawn, no new dependency), resolves the real Desktop through `KnownFolderPath` (OneDrive-safe), and only creates the shortcut when it is missing. `SHIORI_SHORTCUT_DIR` redirects both shortcuts to one folder (tests use this).

Plain-English Go summary: the Windows entry point now prepares a private per-user data folder, collects a password locally on first run, starts the existing Shiori server, and opens the browser. It does not add a second backend or store credentials in the executable.

### Packaging

- Added `scripts/build-desktop.ps1`.
- Added `desktop/README.txt` and `desktop/SOURCE.txt`.
- Output exists at `site/downloads/Shiori-Windows-x64.zip`.
- SHA-256 file exists beside it at `site/downloads/Shiori-Windows-x64.zip.sha256`.
- Current ZIP size: 79,058,883 bytes (rebuilt 2026-09-23: shortcut + PWA + first-run redirect fix).
- Current SHA-256: `3317ab19a02c060a6cbac11c75d238dc3220e1220f166594bab2b5541632ad36`.
- Prior builds: 79,060,758 / `04f6bbb3…bdd083` (shortcut + PWA); 79,057,527 / `3bf39e3a…fbfe3ed` (shortcut only); 79,054,554 / `a7a9a7b5…08440c` (original).

First-run redirect fix (2026-09-23): the setup-complete page used to auto-redirect after 3 s, but a cold start measured 3.1 s on a fast machine, so slower laptops would land on "site can't be reached". The page no longer redirects; `openDesktopWhenReady` now always runs (deadline raised to 90 s) and opens Shiori in a new tab only once the server answers. Site + README now warn about the SmartScreen "More info → Run anyway" screen and point to the desktop icon. Windows Defender scan of the live download: no threats.
- ZIP contents include `Shiori.exe`, `Shiori.ico`, README, SOURCE notice, GPL license, and 14 reviewed providers.
- The script builds a clean source copy so old frontend chunks and the owner's source art are not bundled.
- `windres` is optional. Without a compatible 64-bit resource compiler, the tray icon still works but Explorer may show Go's default executable icon.

### Website

- All Download buttons now point to `downloads/Shiori-Windows-x64.zip`.
- `site/index.html`, `site/pop.html`, and `site/docs.html` explain the ZIP → extract → double-click → choose password → one-click future launch flow.
- Mobile floating download controls hide while the main install/checkout CTA is visible, preventing overlap.
- Public GitHub, email, and payment destinations are empty until pseudonymous replacements exist.
- The Pop support area now says support is not open yet and no longer renders the payment QR.
- Relevant files: `site/assets/js/config.js`, `site/assets/js/nagi.js`, `site/assets/js/pop.js`, `site/assets/css/nagi.css`, `site/assets/css/pop.css`, and `site/README.md`.

### Documentation

- Added `docs/shiori/14-DESKTOP.md`.
- Updated `docs/shiori/README.md`, `docs/shiori/08-PROVIDERS.md`, and `AGENTS.md`.

## Verification already completed

- `CGO_ENABLED=0 go test ./internal/server` passed.
- `CGO_ENABLED=0 go test ./internal/core` passed.
- A native Windows GUI build completed successfully.
- The exact packaged ZIP was extracted and launched with an isolated data directory on port 43123.
- Packaged `/public/auth` returned HTTP 200.
- Fresh packaged config used loopback and enabled the built-in torrent client.
- All 14 reviewed providers were seeded.
- `scripts/security-probe.mjs` passed 23/23 checks against the exact packaged executable.
- The smoke-test process and temporary extraction were removed.
- Desktop and mobile website captures were reviewed. The install CTA overlap was fixed and visually confirmed.

## Work stopped here

The user explicitly asked to stop and hand off. A final parallel read-only check was interrupted, so its results must not be assumed.

Still required before calling the release complete:

1. Run JavaScript syntax checks, PowerShell parser validation, both repositories' `git diff --check`, and final status review.
2. Run the Impeccable detector once on the changed site/setup files; address only relevant regressions.
3. Verify the local download URL returns HTTP 200 and the expected content length.
4. Perform a true empty-data first-run browser test: submit a password through the setup page, confirm redirect/login, close, and relaunch with one click.
5. Rebuild the ZIP only if native app, embedded frontend, providers, or package inputs change. Site-only text changes do not require rebuilding it.
6. Recompute and update the checksum after any rebuild.
7. Review all diffs carefully. Preserve the pre-existing root changes `shiori-backend/package-lock.json`, `brag-output/`, and `brag-output-demo/`.

The local preview on port 4600 was stopped and `.site-preview.pid` was removed during handoff cleanup.

## Known release caveats

- The executable is not code-signed. Windows SmartScreen may warn users. Signing is the main distribution-quality gap.
- There is no auto-updater. New releases require replacing the extracted folder while keeping `%APPDATA%\Shiori`.
- The downloadable build is Windows x64 only.
- The site is wired locally but has not been deployed by this task.
- Public distribution of the binary must provide the matching GPL-3.0 source, not only `SOURCE.txt`.
- A compatible 64-bit `windres` is needed to embed the Explorer executable icon; this does not affect runtime or the tray icon.
- `site/assets/upi-qr.png` is now unreferenced but may contain personal payment data. Get explicit approval before deleting it.

## Commands to resume

```powershell
# Site/script syntax
node --check site/assets/js/config.js
node --check site/assets/js/nagi.js
node --check site/assets/js/pop.js
[void][scriptblock]::Create((Get-Content scripts/build-desktop.ps1 -Raw))

# Go tests
Set-Location seanime
$env:CGO_ENABLED = "0"
go test ./internal/server ./internal/core
Set-Location ..

# Build the release after any package-input change
powershell -ExecutionPolicy Bypass -File scripts/build-desktop.ps1

# Worktree audits: run once at the root, then once in seanime/
git status --short
git diff --check
git diff --stat
```

Do not commit or push unless the owner explicitly asks.
