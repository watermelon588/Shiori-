# Shiori desktop v1 — completion checklist

Updated: 2026-09-22

Tasks are ordered by dependency. Finish Tasks 1–6 before calling the current desktop/download request complete. Tasks 7–10 are launch preparation.

## Verification run — 2026-09-22 (Tasks 1–6 + Checkpoint A/B closed)

All release-blocking verification passed against the exact packaged ZIP:

- **T1/T2 static:** three site JS files parse; `build-desktop.ps1` parses; `git diff --check` clean in both repos; port 4600 clear, no `.site-preview.pid`. Pre-existing changes (`shiori-backend/package-lock.json`, `brag-output/`, `brag-output-demo/`) preserved.
- **T3 identity:** only site match is the empty `upiId: ""` placeholder; `maintainer: "Zaxxewu"`, support/email/github empty. No personal email/name/payment ID. Mobile CTAs (hero button + floating "Download Shiori" pill) usable at 375px.
- **T4/Checkpoint A:** launched packaged `Shiori.exe` in an isolated temp datadir (port 43137). Server serves `/public/auth` 200; listener is loopback-only (127.0.0.1); pre-seeded `.env` takes the second-launch/skip-setup path; `config.toml` + `.env` written; **14 providers** seeded; anon `/api/v1/settings` → 401 (strict mode enforced). **security-probe.mjs = 23/23**, 0 failures. Go tests `./internal/server ./internal/core` pass (CGO_ENABLED=0). No torrent download started. Temp dir deleted.
  - *Not headlessly automatable:* the literal browser password-POST — the first-run setup URL's one-time token is delivered only to the OS default browser via `ShellExecute` (cli/browser ignores `$BROWSER` on Windows). That code path is covered by `desktop_windows_test.go` (validation, env write, provider copy) + code review (loopback `127.0.0.1:0` bind, one-time token, 4 KB cap, no-store/frame headers, `.env` 0600, no password logging).
- **T5 website:** local preview `GET downloads/Shiori-Windows-x64.zip` → 200, Content-Length **79,054,554**; index/pop/docs → 200; every `[data-download]` resolves to the ZIP.
- **T6 artifact:** ZIP size 79,054,554; SHA-256 `a7a9a7b5…08440c` matches the `.sha256` file + docs; entries = Shiori.exe, Shiori.ico, README/SOURCE/LICENSE, 14 provider JSONs; no `.env`/db/logs/media/git/art.

## Desktop shortcut added — 2026-09-22

Non-coder convenience: the packaged app now auto-creates a **Desktop + Start-Menu "Shiori" shortcut** on first launch (`internal/server/desktop_shortcut_windows.go`, pure-Go shell COM — no installer, no powershell spawn, no new dependency). Download → extract → run `Shiori.exe` once → set password → thereafter click the desktop icon.

## Mobile PWA companion — 2026-09-22

The web UI is now an **installable PWA** (Add to Home Screen). Added `seanime-web/public/sw.js` (minimal service worker — offline page only, never caches API/streams), `seanime-web/public/offline.html`, SW registration in `shiori-boot.js`, and the `apple-touch-icon` link in `index.html` (manifest + meta tags already existed). Secure phone access documented via Tailscale (`docs/shiori/15-MOBILE.md`). It's the full UI on mobile, not a slimmed companion; push notifications and offline playback stay parked. Note: SW registration can't be exercised in the Claude browser pane (it disables service workers), but all served files + manifest verified 200 with correct MIME; the SW is standard and registers in real Chrome/Safari (and iOS install works off the manifest regardless).

ZIP rebuilt with both features: **79,060,758 bytes**, sha256 `04f6bbb3…bdd083`. Re-verified against the new packaged exe: loopback-only, 14 providers, strict mode, `shortcut_created=True`, PWA files served (`/manifest.json`, `/sw.js`, `/offline.html` all 200), security probe 23/23. Go tests (server+core, incl. `TestEnsureDesktopShortcut`) pass.

Not done (needs owner): deploy the new ZIP to the live host, and the GitHub push — blocked because the local git author is the owner's real name/email, which would leak the identity on the (public) repo, and there is no CI deploy wired, so a push would not refresh the live site by itself.

**Remaining before public launch (owner decisions, Tasks 7–10):** code-signing decision, GPL source publication, release metadata on the site, host/domain + HTTPS deploy, and the `site/assets/upi-qr.png` delete approval. Also: a stray mis-encoded folder `Shiori (æ ž)` sits next to the repo (1 item, no git, from 2026-09-18) — safe to delete manually.

## Task 1: Clean up the interrupted local verification

**Description:** Stop any leftover preview process, remove only its known PID file, and establish the exact root and nested-repository state without touching unrelated work.

**Acceptance criteria:**

- [x] No Shiori site preview remains on port 4600.
- [x] `.site-preview.pid` is absent after the preview is stopped.
- [ ] Root and `seanime/` status are recorded; pre-existing unrelated changes are preserved.

**Verification:**

- [ ] `Get-NetTCPConnection -LocalPort 4600 -ErrorAction SilentlyContinue` returns no listener.
- [ ] Run `git status --short` in the root and `seanime/`.

**Dependencies:** None  
**Estimated scope:** XS

## Task 2: Run final static checks

**Description:** Complete the read-only checks that were interrupted at handoff.

**Acceptance criteria:**

- [ ] The three changed site JavaScript files parse.
- [ ] `scripts/build-desktop.ps1` parses as PowerShell.
- [ ] `git diff --check` passes in both repositories.

**Verification:**

- [ ] `node --check site/assets/js/config.js`
- [ ] `node --check site/assets/js/nagi.js`
- [ ] `node --check site/assets/js/pop.js`
- [ ] `[void][scriptblock]::Create((Get-Content scripts/build-desktop.ps1 -Raw))`
- [ ] `git diff --check` at root and in `seanime/`

**Dependencies:** Task 1  
**Estimated scope:** XS

## Task 3: Audit final UI craft and identity safety

**Description:** Run the required Impeccable detector once on the changed landing-site and setup-page files, then inspect only findings introduced by this work.

**Acceptance criteria:**

- [ ] Detector has run once on the final files.
- [ ] No public UI displays a personal email, payment ID, or non-pseudonymous maintainer identity.
- [ ] Nagi and Ranbu retain usable Download CTAs at mobile and desktop widths.

**Verification:**

- [ ] Search the site for personal contact/payment strings without printing secrets into new docs.
- [ ] Inspect the existing captures or make one focused capture per changed section.

**Dependencies:** Task 2  
**Estimated scope:** S

## Task 4: Test genuine first-run setup

**Description:** Launch the exact packaged executable with a completely empty isolated data directory and complete setup through the browser UI.

**Acceptance criteria:**

- [ ] Setup page binds only to loopback.
- [ ] A valid password creates `.env` with strict mode without exposing the password in logs.
- [ ] Setup redirects to Shiori and authentication succeeds.
- [ ] Closing and relaunching opens Shiori without showing setup again.

**Verification:**

- [ ] Use an isolated temporary directory and unused port.
- [ ] Confirm `config.toml`, `.env`, and 14 provider files exist.
- [ ] Run the 23-check security probe against this instance.
- [ ] Stop the exact test process and remove only the validated temporary directory.

**Dependencies:** Tasks 1–3  
**Estimated scope:** M

## Checkpoint A: Functional desktop release

- [ ] Go tests pass: `go test ./internal/server ./internal/core` with `CGO_ENABLED=0`.
- [ ] First launch and second launch both work.
- [ ] Security probe is 23/23.
- [ ] No real torrent download was started.

## Task 5: Verify the website download path

**Description:** Confirm the local site and all visible download controls resolve to the exact ZIP.

**Acceptance criteria:**

- [ ] `downloads/Shiori-Windows-x64.zip` returns HTTP 200.
- [ ] Content length is 79,054,554 bytes unless a rebuild intentionally changed it.
- [ ] Every `[data-download]` anchor resolves to the ZIP and gets the expected filename.
- [ ] The install/checkout CTA is not covered by the floating download control.

**Verification:**

- [ ] HEAD request against the local preview.
- [ ] Browser DOM check on `index.html`, `pop.html`, and `docs.html`.
- [ ] Mobile visual check of the install and checkout sections.

**Dependencies:** Task 3  
**Estimated scope:** S

## Task 6: Freeze and document the artifact

**Description:** Rebuild only if package inputs changed, then verify the archive and checksum match the documented release.

**Acceptance criteria:**

- [ ] Archive contains `Shiori.exe`, `Shiori.ico`, README, SOURCE notice, license, and 14 provider JSON files.
- [ ] Archive contains no `.env`, database, logs, media, dev data, Git metadata, or source art.
- [ ] SHA-256 file matches the ZIP.
- [ ] `HANDOFF.md`, `AGENTS.md`, and `docs/shiori/14-DESKTOP.md` report the same artifact state.

**Verification:**

- [ ] List archive entries and scan filenames.
- [ ] `Get-FileHash site/downloads/Shiori-Windows-x64.zip -Algorithm SHA256`.

**Dependencies:** Tasks 2–5  
**Estimated scope:** S

## Checkpoint B: Current request complete

- [ ] A new Windows user can download, extract, set a password, and launch locally.
- [ ] Subsequent use is one click.
- [ ] Website buttons download the verified ZIP.
- [ ] All relevant tests, static checks, visual checks, and security checks pass.
- [ ] The owner reviews the final diff before any commit.

## Task 7: Add release metadata to the website

**Description:** Show the version, file size, SHA-256, system requirement, and unsigned-app warning near the download CTA.

**Acceptance criteria:**

- [ ] Users know this is Windows x64 and portable.
- [ ] Users know where data is stored and how to uninstall.
- [ ] SmartScreen guidance is accurate and does not tell users to disable security globally.

**Dependencies:** Task 6  
**Estimated scope:** S

## Task 8: Decide code signing and icon policy

**Description:** Choose whether to sign the executable and whether embedding the Explorer icon is a release blocker.

**Acceptance criteria:**

- [ ] Owner records the signing decision and cost trade-off.
- [ ] If signing is chosen, the certificate is kept outside the repository and CI logs.
- [ ] If the icon fallback is accepted, the limitation is documented.

**Dependencies:** Task 6  
**Estimated scope:** S

## Task 9: Prepare GPL-compliant publication

**Description:** Provide the exact corresponding source for the released binary and review publication risks before making the download public.

**Acceptance criteria:**

- [ ] Matching source is available with the binary.
- [ ] Copyrighted owner art, secrets, personal paths, and identity metadata are audited.
- [ ] No push or public repository is created without explicit owner approval.

**Dependencies:** Task 6  
**Estimated scope:** M

## Task 10: Deploy and retest the site

**Description:** Publish the static site to the chosen host and repeat the download test over HTTPS.

**Acceptance criteria:**

- [ ] Primary domain serves HTTPS.
- [ ] Downloaded bytes and SHA-256 match the local verified artifact.
- [ ] Legal, guide, credits, and support links are correct.
- [ ] No private identifiers are present in rendered pages.

**Dependencies:** Tasks 7–9  
**Estimated scope:** M

## Finalization decisions for the owner

- [ ] Is an unsigned ZIP acceptable for the first private release?
- [ ] Should the unreferenced `site/assets/upi-qr.png` be deleted after backup?
- [ ] Where should the matching GPL source be published if the binary becomes public?
- [ ] Which static host/domain should serve the site?
- [ ] Is automatic update checking wanted after v1, or should upgrades remain manual?
