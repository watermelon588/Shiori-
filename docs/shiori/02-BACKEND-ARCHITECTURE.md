# 02 · Backend Architecture (Go, `seanime/internal`)

Plain-language version first, for readers who don't know Go.

## The 30-second version

Seanime's backend is **one Go program**. When it starts it:

1. Reads `config.toml` from the data dir.
2. Opens a SQLite file (`seanime.db`) through GORM, Go's equivalent of Mongoose or Prisma.
3. Builds one big `core.App` object that holds every service (AniList client, torrent clients, auto-downloader, extension engine, players…).
4. Starts an **Echo** HTTP server (Echo is roughly Express for Go) on `:43000` with ~300 routes under `/api/v1`.
5. Opens a **WebSocket** at `/events`, which the React UI listens on for live updates.
6. Starts background loops (cron) and the auto-downloader timer.

```
Browser (React) ──HTTP /api/v1──▶ Echo router ──▶ handlers/ ──▶ core.App services ──▶ SQLite / AniList / torrent clients
       ▲                                                             │
       └───────────────WebSocket /events◀── events.WSEventManager ◀──┘
```

## Key packages (what to open when)

| Package | Job | Node analogy |
|---|---|---|
| `core/` | Boots everything; `App` struct = service container | `app.js` + DI container |
| `handlers/` | 62 files; `routes.go` registers every endpoint | Express controllers + router |
| `database/models` | GORM models (tables) | Mongoose schemas |
| `api/anilist` | AniList GraphQL client (auth, lists, airing schedule) | axios client |
| `extension/`, `extension_repo/` | Loads **providers** written in JavaScript and runs them inside **Goja** (a JS engine embedded in Go) | a plugin sandbox |
| `torrents/`, `torrent_clients/` | Torrent search (via provider extensions) + control of qBittorrent / Transmission / built-in client | – |
| `debrid/` | Real-Debrid, TorBox, AllDebrid, Premiumize | – |
| `onlinestream/` | Episode lists and stream sources from online-stream provider extensions | – |
| `manga/` | Manga chapters, reader, chapter downloader (provider extensions + local files) | – |
| `library/autodownloader` | Rule engine: checks providers every N minutes, grabs new episodes | cron worker |
| `library/scanner`, `autoscanner` | Scans your anime folder, matches files to AniList | – |
| `notifier/` | Desktop toast notifications (**single choke point, see Telegram plan**) | – |
| `cron/` | Tickers: AniList refresh 10 min, local data 30 min, releases 1 h | node-cron |
| `plugin/`, `hook/` | Plugin API: JS plugins can subscribe to dozens of app lifecycle events (hooks) | event emitter |
| `mediaplayers/`, `videocore/`, `mpvcore/` | MPV/VLC/MPC-HC control + built-in player | – |
| `nakama/` | Watch-party / share library between Seanime instances | – |

## Providers: the most important fact

**This build ships with zero built-in anime torrent or online-stream providers.** The only built-in provider is `local-manga`.
Every source (Nyaa-style torrent indexers, streaming sites, manga sites) is an **extension**: a small JS file with a `manifest.json`, installed into `dev-datadir/extensions/`.

Each extension type implements a fixed contract (TypeScript defs in `extension_repo/goja_plugin_types/`):

| Type | Must implement |
|---|---|
| `anime-torrent-provider` | `search`, `smartSearch`, `getTorrentInfoHash`, `getTorrentMagnetLink`, `getLatest`, `getSettings` |
| `onlinestream-provider` | `search`, `findEpisodes`, `findEpisodeServer`, `getSettings` |
| `manga-provider` | `search`, `findChapters`, `findChapterPages`, `getSettings` |
| `plugin` | free-form; gets hooks, `fetch`, storage, UI slots, cron |

This matches the `search / getEpisodes / getSources / healthCheck` contract described in `AGENT_INSTRUCTION.md`. **The provider abstraction you planned for the Node backend already exists inside Seanime.**

Installation paths: Settings → Extensions → "Add extension" (paste a manifest URL), or the marketplace
(`raw.githubusercontent.com/5rahim/seanime-extensions/.../marketplace.json`). The official marketplace currently lists **only plugins and metadata/manga custom sources** (AniList sync, MangaDex, TMDB…). It lists no anime torrent or stream providers; those come from community repositories.

## Auto-downloader (already built)

- Settings (`AutoDownloaderSettings`): provider, interval (minutes), enabled, download automatically, use debrid.
- Rules (`anime.AutoDownloaderRule`, stored as JSON blobs): media id, destination folder, release groups, resolutions, episode numbers, title comparison, include/exclude terms, optional profile.
- Loop: fetch latest torrents from the selected provider → group by rule → score against profiles → skip already-downloaded hashes → send to the torrent client/debrid → store `AutoDownloaderItem` → `notifier.Notify(AutoDownloader, …)`.
- REST: `GET/POST/PATCH/DELETE /api/v1/auto-downloader/rule(s)`, `POST /auto-downloader/run`, `GET /auto-downloader/items`.
- **Requires**: an installed anime-torrent-provider extension and a torrent client (qBittorrent/Transmission/built-in) or debrid account.

## Airing data

AniList gives `nextAiringEpisode { airingAt, episode }` for every show in your list. Seanime already exposes it through
`GET /api/v1/library/upcoming-episodes`, `GET /api/v1/library/schedule` and `GET /api/v1/library/missing-episodes`.

## Security model (relevant for Telegram)

- Requests from localhost are trusted; a server password can be set for LAN access.
- Stream URLs are HMAC-signed and short-lived. Never persist them (this matches your "never store HLS URLs" rule).
