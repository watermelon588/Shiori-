# 06 · Providers, Automation & Telegram: Feasibility and Plan

Status: **partly superseded (2026-09-17).** The Telegram bot was dropped in favour of a PWA mobile companion (see 00-VISION.md and 07-HOSTING.md). The provider and auto-downloader findings below still apply.

## Verdict

| Goal | Possible? | What already exists | What's missing |
|---|---|---|---|
| Watch anime from online sources | Yes | Online-stream player, provider contract, episode mapping | An installed `onlinestream-provider` extension |
| Download episodes | Yes | Torrent search, qBittorrent/Transmission/built-in client, debrid, destination folders | An installed `anime-torrent-provider` extension + a torrent client or debrid |
| Auto-download new episodes | Yes, **fully built** | Rule engine, profiles, scoring, delays, queue, `/auto-downloader/*` API | A provider extension + enabling it in Settings |
| Read manga | Yes | Reader, chapter downloader, local manga | A `manga-provider` extension (MangaDex is in the official marketplace) |
| "Episode airs Saturday 07:00" alerts | Yes | AniList airing data (`/library/upcoming-episodes`) | A reminder loop + a delivery channel |
| Control the backend from Telegram | Yes | Everything is exposed as REST on `:43000` | A Telegram bot module |

**Bottom line:** you don't need to build a provider engine, a downloader or a scheduler. Seanime already has all three.
The real work is (1) installing provider extensions and (2) adding a Telegram bridge. The bridge is roughly 400 to 600 lines.

## 1. Providers

How it works: providers are JS extensions loaded at runtime (see `02-BACKEND-ARCHITECTURE.md`). They are never compiled into the Go code.
To install one: **Extensions → Add extension → paste a manifest URL**, then pick it in **Settings → Torrent / Online streaming / Manga**.

What I will and won't do here:

- I **won't** go and pull third-party scraper extensions from unvetted repos and drop them into your data dir. They are remote code that runs with network access inside your server, and many target sites that host content without a licence. Which sources you add is your call, and whether they're legal depends on your country.
- I **will** audit any manifest/extension you choose before you install it (read the JS, check what it fetches, and confirm it implements the contract), and I can write a provider extension against a source you have the right to use.
- Legitimate building blocks that work today: **debrid services** (Real-Debrid/TorBox), **your own local library folder**, **MangaDex** (official marketplace), and AniList/TMDB/MAL metadata sources.

Recommended minimum setup for your "open laptop, episode is there" goal:

1. One `anime-torrent-provider` extension of your choice.
2. The built-in torrent client, or qBittorrent with WebUI enabled.
3. Settings → Library: set your anime folder, turn on the auto-scanner.
4. Settings → Auto downloader: enable it, interval 15 min, "download automatically" on.

## 2. Telegram bridge: three ways to build it

| | A. Go module inside Seanime (**recommended**) | B. Seanime JS plugin | C. Node service in `shiori-backend` |
|---|---|---|---|
| Runs as | part of `seanime.exe`, one process | inside Seanime's Goja sandbox | a second process |
| Language | Go (I write it; you won't need to touch it) | JavaScript | JavaScript (you know it) |
| Downloaded-episode alerts | hooks straight into `notifier.Notify` | via plugin hooks | via WebSocket `/events` |
| Bot commands (long polling) | clean goroutine | awkward (cron-driven polling) | clean |
| Needs Mongo/Supabase | no | no | not for this (can skip) |
| Survives Seanime updates | small merge surface (1 new package + 3 hook lines) | best | best |

**Why A:** one binary to start, no extra database, and immediate access to the auto-downloader and the AniList collection. Seanime's notifier is a single choke point (`notifier.GlobalNotifier.Notify`), so every "downloaded / scanned / debrid finished" event reaches Telegram through a small fan-out change.
**Choose C instead** if you want to own and edit the bot code yourself in JS.

## 3. Proposed design (Option A)

```
internal/shiori/telegram/
├── client.go      ← tiny Bot API client: sendMessage, getUpdates (long polling, no public URL / no port forwarding needed)
├── bridge.go      ← subscribes to notifier fan-out → formats → sends to the allowed chat
├── reminders.go   ← every 5 min: read anime collection nextAiringEpisode → "airs in 60 min" and "out now" messages, deduped
└── commands.go    ← /upcoming /queue /rules /follow <title> /unfollow /run /status /help, with inline buttons
```

Config via environment (never stored in the DB or committed):

```
SHIORI_TELEGRAM_BOT_TOKEN=...      # from @BotFather
SHIORI_TELEGRAM_CHAT_ID=...        # only this chat is obeyed; everything else is ignored
SHIORI_REMINDER_LEAD_MINUTES=60
```

Example flow for your Saturday 07:00 case:

```
Fri 20:00  AniList says Ep 7 of <show> airs Sat 07:00
Sat 06:00  Bot: "Ep 7 of <show> airs in 1h."  [Auto-download] [Remind at release]
           you tap Auto-download → bot POSTs /api/v1/auto-downloader/rule (1080p, your folder)
Sat 07:00  Bot: "Ep 7 is out."
Sat 07:40  auto-downloader finds the release → torrent client downloads → notifier → Bot: "Downloaded Ep 7 (1080p)."
Later      open Shiori → Home → Continue watching shows the local file
```

## 4. One real-world constraint

Telegram can't wake a sleeping laptop. For 7 AM auto-downloads, Seanime must be running at that time:

- Start `seanime.exe` at login (Windows Task Scheduler or a Startup shortcut), and
- set "never sleep when plugged in", **or** run Seanime on an always-on machine (mini PC / old laptop) and open the UI from your laptop over LAN.

If the laptop was asleep, the auto-downloader catches up on its next run, and the bot reports what it grabbed.

## 5. Build phases (after your approval)

1. **Provider setup session**: you pick sources, I review the extensions, we configure the client, library folder and auto-downloader, then verify with one real episode.
2. **Telegram notifications**: bridge + airing reminders. Test by triggering `POST /auto-downloader/run/simulation`.
3. **Telegram commands**: follow/unfollow creates or deletes rules, plus queue and status.
4. **Frontend**: a Shiori "Automation" page showing followed shows, upcoming reminders and the Telegram connection state.

## Decisions I need from you

1. Option **A (Go, inside Seanime)** or **C (Node, shiori-backend)**?
2. Torrent client: built-in, qBittorrent, or a debrid service?
3. Which provider sources do you want? Send the manifest URLs so I can review them.
4. Reminder lead time and quiet hours (e.g. no messages 01:00 to 06:00)?
