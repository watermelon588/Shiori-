# 04 · Data Schema (SQLite, `internal/database/models/models.go`)

All tables embed `BaseModel { ID uint, CreatedAt, UpdatedAt }`. GORM auto-migrates on startup.
Many domain objects are stored as a **JSON blob in a `value` column**, so the schema of those lives in Go structs, not in SQL.

| Table (model) | Purpose | Notable fields |
|---|---|---|
| `Account` | AniList login | `username`, `token` (AniList OAuth), `viewer` (blob) |
| `Token` | Misc stored token | `value` |
| `Mal` | MyAnimeList link | access/refresh token, expiry |
| `Settings` | Everything in the Settings page | nested: `Library`, `MediaPlayer`, `Torrent`, `Manga`, `Anilist`, `ListSync`, `Discord`, `Notifications`, `Nakama`, `AutoDownloader` |
| `Theme` | UI settings | banner type/size, sidebar options, custom CSS, colours, spoiler hiding |
| `HomeItem` | Home screen layout blocks | ordered list of item types + options |
| `LocalFiles` / `ShelvedLocalFiles` | Scanned library (blob) | file path, parsed title/episode, matched media id |
| `ScanSummary` | Scanner reports (blob) | – |
| `AutoDownloaderRule` | Rule (blob → `anime.AutoDownloaderRule`) | mediaId, destination, releaseGroups, resolutions, episodeNumbers, titleComparison, additional/exclude terms, profileId |
| `AutoDownloaderProfile` | Reusable scoring profile (blob) | preferred groups/resolutions, min score, delays |
| `AutoDownloaderItem` | Queued/downloaded episode | ruleId, mediaId, episode, hash, magnet, torrentName, downloaded, isDelayed, delayUntil, score |
| `AutoSelectProfile` | Auto-select torrent for streaming (blob) | – |
| `SilencedMediaEntry` | Muted shows | – |
| `Playlist`, `PlaylistEntry` | Playlists | – |
| `ChapterDownloadQueueItem` | Manga download queue | provider, mediaId, chapterId, status |
| `MangaMapping`, `MangaChapterContainer` | Manga ↔ provider id mapping + cached chapters | – |
| `OnlinestreamMapping` | Anime ↔ stream-provider id mapping | provider, mediaId, animeId |
| `TorrentstreamSettings`, `TorrentstreamHistory` | Torrent streaming prefs + last torrent per show | – |
| `MediastreamSettings` | Transcoding / direct play | ffmpeg paths, hw accel |
| `DebridSettings`, `DebridTorrentItem`, `DebridTransferHash` | Debrid provider config + tracked transfers | – |
| `MediaFiller` | Filler episode data | – |
| `LocalTorrent` | Built-in torrent client state | – |
| `PluginData` | Per-plugin key/value storage | pluginId, value |
| `CustomSourceCollection`, `CustomSourceIdentifier`, `MediaMetadataParent` | Custom metadata sources | – |

## Planned additions for Shiori automation (not created yet)

Proposed, pending your approval. See `06-PROVIDERS-AUTOMATION-TELEGRAM.md`.

| Table | Purpose |
|---|---|
| `ShioriTelegramSettings` | bot token reference (env var name, **not** the token), allowed chat id, reminder lead time, quiet hours |
| `ShioriAiringReminder` | mediaId, episode, airingAt, `notifiedAt`. Prevents duplicate "airs in 1h" messages |
