# 08 · Providers: Installed, Reviewed, Tested

Installed 2026-09-17 from the community marketplace index

The Windows desktop release bundles these reviewed extension JSON files from `seanime/dev-datadir/extensions`. On first launch it copies only providers that are missing from `%APPDATA%\Shiori\extensions`; it never overwrites a user's installed provider.
(`raw.githubusercontent.com/Bas1874/Seanime-Marketplace/main/Marketplace/Main.json`) through
`POST /api/v1/extensions/external/install`. They live in `seanime/dev-datadir/extensions/`.

## Status (live test, `node scripts/test-providers.mjs`)

Test titles: Frieren (AniList 154587) for anime, One Piece (30013) for manga, Solo Leveling (105398) for manhwa-only sources.

### Torrent (search → download / auto-download)

| Priority | ID | Name | Result | Fetches from |
|---|---|---|---|---|
| 1 | `animetosho-new` | AnimeTosho (NEW) 2.4.5, Faddix & Island | ✅ smart search, 31 results, 3.2 s | feed.animetosho.xyz |
| 2 | `nyaa` | Nyaa 2.1.0, Island | ✅ 25 results, 4.3 s | nyaa.si |
| 3 | `seadex` | SeaDex 1.0.4, Island | ✅ 2 "best release" results, 4.5 s | releases.moe |

The default torrent provider, auto-select provider and auto-downloader provider are all `animetosho-new`.
Auto-downloader rules accept a `providers: []` list; use `["animetosho-new","nyaa"]` for fallback.

### Online streaming

| Priority | ID | Name | Result | Fetches from |
|---|---|---|---|---|
| 1 | `kaa` | KickAssAnime 1.0.7 | ✅ 28 eps, **plays** (verified in the UI: 1080p, 26 min) | kaa.to / krussdomi.com |
| 2 | `aq-anizone` | AniZone 1.1.36, aquaryuo | ✅ 28 eps, **plays** (segment 200) | anizone.to |
| 3 | `aq-anikoto` | Anikoto 1.4.1, aquaryuo | ⚠️ episodes list, but video segments 404 (CDN side) | anikoto.* |
| 4 | `aq-animepahe-beta` | AnimePahe BETA 0.2.43, aquaryuo | ❌ needs a Cloudflare solver ("Aqua's Utils") at `http://127.0.0.1:8191/v1` | animepahe.* |

Fallback: the player's built-in auto provider cycler tries providers in `SHIORI_ONLINESTREAM_PRIORITY` order
(`seanime-web/src/lib/shiori/provider-priority.ts`). The default provider for new browsers is the first one listed there.

### Manga

| Priority | ID | Result |
|---|---|---|
| 1 | `mangabuddy` | ✅ 1308 chapters, pages load |
| 2 | `atsumaru` | ✅ 1193 chapters |
| 3 | `mangafreak` | ✅ 1199 chapters |
| 4 | `mangabats` | ✅ 1379 chapters (slow, 23 s) |
| 5 | `dipland-mangafire` | ✅ 6000 chapter entries (all languages, slow) |
| 6 | `asurascans` | ✅ manhwa only (Solo Leveling: 68 chapters) |
| 7 | `kuramanga` | ✅ manhwa only (Solo Leveling: 201 chapters) |

The default manga provider is `mangabuddy`. Seanime remembers a per-series provider once you pick one.

## Security review notes

Every payload was downloaded and scanned before install: fetched domains, `$os`, filesystem, `eval` / `new Function`, `process.env`.

- There was no filesystem, OS or dynamic-eval usage in any provider.
- Each provider only contacts its own site.
- `$store` usage in the aquaryuo providers is Seanime's per-extension key/value store (it caches the working mirror domain).
- `127.0.0.1:8191` in Anikoto/AnimePahe is an **optional** user-configurable solver endpoint (FlareSolverr-style). Nothing listens there today.

## Maintenance

- **Re-test:** `node scripts/test-providers.mjs` (`--only stream` checks real playback through the proxy).
- **Update:** Extensions page → updates badge, or reinstall the same manifest URL.
- **Add another:** find it in the marketplace `Main.json`, review the payload, install via the UI or API, add it to `provider-priority.ts` and to the test script, then update this page.
- **Enable AnimePahe:** run a FlareSolverr-compatible solver on port 8191 (the owner must approve downloading and running it).
