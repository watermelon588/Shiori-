# Shiori completion roadmap

Updated: 2026-09-22

This roadmap separates the release-blocking work for a trustworthy desktop v1 from later improvements. The north star remains `docs/shiori/00-VISION.md`.

## Phase 0 — Freeze and verify the Windows release

Goal: prove that the existing ZIP works for a new user without developer tools.

- Finish the interrupted static checks and diff audit.
- Test the actual first-run password page from an empty data directory.
- Confirm a second launch opens the existing local instance.
- Confirm extraction works from a normal Downloads folder whose path contains spaces.
- Rebuild and checksum only if package inputs change.
- Review the ZIP for secrets, development data, stale assets, and personal identifiers.

Exit criteria: a clean Windows user can extract the ZIP, choose a password, reach Shiori, close it, and reopen it with one click; all automated checks pass.

## Phase 1 — Distribution readiness

Goal: make the artifact safe and understandable to download.

- Decide whether to buy a code-signing certificate. Signing is strongly recommended before broad distribution because it reduces SmartScreen friction.
- Embed the executable icon with a compatible 64-bit resource compiler, or explicitly accept the fallback icon.
- Publish the exact GPL-3.0 corresponding source for every released binary.
- Add a visible version number and build date to the package README and website.
- Define a release-retention policy and a manual upgrade guide that preserves `%APPDATA%\Shiori`.
- Keep GitHub, support email, and payment links disabled until pseudonymous destinations exist.

Exit criteria: the ZIP has provenance, matching source, versioning, checksum, and clear upgrade/uninstall instructions.

## Phase 2 — Website launch

Goal: turn the local site into a reliable download surface.

- Finish browser checks at desktop and mobile widths for both Nagi and Ranbu.
- Verify every Download button resolves to the ZIP after deployment.
- Add file size, version, checksum, Windows x64 requirement, and SmartScreen guidance near the primary CTA.
- Deploy to the selected static host and configure the domain/HTTPS.
- Test the deployed ZIP with a clean browser download, not only localhost.
- Verify Privacy, Terms, Credits, Guide, and Support pages match the shipped app.

Exit criteria: the deployed landing page downloads the same verified artifact and contains no broken or identity-leaking links.

## Phase 3 — Product reliability

Goal: make daily local use boring and dependable.

- Add graceful diagnostics when port 43000 is occupied by another app.
- Add a clear tray status/error state and a way to open logs/data folder.
- Test corrupted/missing `.env`, read-only data directories, and antivirus quarantine behavior.
- Add backup/restore guidance for `%APPDATA%\Shiori` and the media library.
- Verify upgrade behavior across at least two consecutive builds.
- Run the provider smoke test periodically, without starting real torrent downloads.

Exit criteria: common failures produce actionable messages and upgrades preserve user data.

## Phase 4 — Portable release lifecycle

Goal: reduce manual maintenance without turning Shiori into a heavy desktop shell.

- Evaluate a small signed installer only if ZIP onboarding proves confusing.
- Design a lightweight update check that never replaces files without consent.
- Add release-channel metadata and signed checksums before implementing automatic downloads.
- Consider Windows arm64 only after demand is demonstrated.

Exit criteria: updates are verifiable, opt-in, and preserve the lightweight local architecture.

## Phase 5 — Companion access

Goal: support the original at-home/away vision after desktop v1 is stable.

- Document secure phone access over Tailscale/HTTPS.
- Build the postponed PWA companion for queueing downloads and controlling the auto-downloader.
- Add agent/voice features only after permissions and destructive-action boundaries are specified.

Exit criteria: remote features do not expose the local server publicly and cannot start downloads without clear authorization.

## Explicitly out of scope for v1

- Hosting the Shiori backend as a public multi-user service.
- Electron or another heavyweight desktop wrapper.
- Native mobile apps.
- Automatic torrent downloads during tests.
- Public repository publication without a separate licensing, copyrighted-art, secret, and identity audit.
