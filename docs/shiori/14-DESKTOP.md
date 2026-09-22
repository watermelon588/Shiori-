# 14 · Windows desktop release

Shiori ships as a lightweight portable Windows app. It uses Seanime's existing native system-tray integration and the embedded production web UI, so it does not bundle Electron or another browser engine.

## User flow

1. Download and extract `Shiori-Windows-x64.zip`.
2. Double-click `Shiori.exe`.
3. On the first launch, a loopback-only setup page opens in the default browser. The user chooses a password of at least 20 characters.
4. Shiori writes `%APPDATA%\Shiori\.env` with the password and `SEANIME_SECURE_MODE=strict`, then starts at `http://127.0.0.1:43000`.
5. On that first successful start it drops a **Shiori** shortcut on the Desktop and in the Start Menu, so non-technical users open the app from a familiar icon instead of the extracted folder.
6. Later launches open Shiori automatically. Launching it while it is already running opens the existing copy instead of starting a second server.
7. Shiori stays in the Windows tray. `Quit Shiori` stops the server.

### Desktop / Start-Menu shortcut

The shortcut is created by the app itself using the Windows shell COM API (`internal/server/desktop_shortcut_windows.go`) — no installer and no PowerShell is spawned (that pattern trips antivirus). It targets the running `Shiori.exe`, uses `Shiori.ico`, resolves the real Desktop via `KnownFolderPath` (so it works when Desktop is redirected to OneDrive), and is created only when missing (a user who deletes it is respected). Set `SHIORI_SHORTCUT_DIR` to redirect both shortcuts to one folder (used by tests).

The setup server binds to a random loopback port, uses a one-time random token, accepts a maximum 4 KB form body, sends no-store and frame-blocking headers, and stops immediately after setup. The password never appears in a URL or log.

## Data and defaults

- Data: `%APPDATA%\Shiori`
- Server: `127.0.0.1:43000`
- Security: password required, strict mode enabled
- Torrent client: built-in client enabled for new configurations
- Providers: the reviewed JSON files from `seanime/dev-datadir/extensions` ship in the portable folder and are copied only when that provider is missing. Existing provider files are never overwritten.

Advanced users can still pass `--datadir`, `--host` or `--port`, or use the matching Seanime environment variables.

## Build the release

From the project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-desktop.ps1
```

The script:

1. Builds the React production UI and copies it over `seanime/web` without deleting owner assets.
2. Runs the focused Go tests.
3. Builds a stripped Windows GUI executable with `CGO_ENABLED=0` and the Shiori icon.
4. Adds the reviewed providers, GPL license and release notes.
5. Writes `site/downloads/Shiori-Windows-x64.zip` and its SHA-256 checksum.

Use `-SkipWebBuild` only when `seanime/web` is already known to match the frontend source. Use `-SkipTests` only in a diagnostic build, never for a published archive.

## Go changes in plain words

The Windows startup file now does a small amount of work before starting Seanime:

- It chooses Shiori's AppData folder and local port.
- It opens the first-run password page when no password exists.
- It copies the reviewed provider files into a fresh data folder.
- It places a Desktop and Start-Menu shortcut so the next launch is one click.
- It starts the unchanged Seanime application and waits until the local site answers before opening the browser.

The normal `nosystray` development build is unchanged. It still uses the explicit `--datadir` flow in `start-shiori.cmd`.
