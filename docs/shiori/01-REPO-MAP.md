# 01 Â· Repository Map

> Snapshot taken 2026-09-17. Workspace root: `Shiori (æ ž)/`.

## What is in this workspace

```
Shiori (æ ž)/
â”œâ”€â”€ seanime/              â† The real app. Fork of Seanime v3.10.2 "Saisei" (own .git, gitignored by the parent repo)
â”‚   â”œâ”€â”€ main.go           â† Go entrypoint (one binary = API server + embedded web UI)
â”‚   â”œâ”€â”€ internal/         â† All Go server code (~53 packages)
â”‚   â”œâ”€â”€ seanime-web/      â† React frontend (rsbuild/rspack + Tailwind 3 + TanStack Router)
â”‚   â”œâ”€â”€ seanime-denshi/   â† Electron desktop wrapper (not needed for local browser use)
â”‚   â”œâ”€â”€ codegen/          â† Generates TS types/hooks from Go handlers (keeps FE and BE in sync)
â”‚   â”œâ”€â”€ dev-datadir/      â† Your local data dir: seanime.db (SQLite), config.toml, extensions/, logs/
â”‚   â”œâ”€â”€ web/              â† Built frontend that seanime.exe serves in production mode
â”‚   â””â”€â”€ seanime.exe       â† Prebuilt server binary (built 2026-08-04)
â”œâ”€â”€ shiori-backend/       â† Separate Node/Express 5 service (Supabase auth, MongoDB). Mostly placeholders.
â”œâ”€â”€ docs/                 â† Workspace docs (this folder + SEANIME_ARCHITECTURE_ANALYSIS.md)
â”œâ”€â”€ AGENTS.md / coding assistant.md â† Agent contract (read first)
â”œâ”€â”€ scripts/              â† test-providers.mjs (live provider smoke test)
â”œâ”€â”€ .coding assistant/launch.json   â† Dev launch configs (seanime-server :43000, seanime-web :43210)
â”œâ”€â”€ .coding assistant/skills/       â† 74 vendored skills
â”œâ”€â”€ AGENT_INSTRUCTION.md  â† Rules for the Node backend (Postman docs, response shapesâ€¦)
â””â”€â”€ hello.go              â† Go hello-world scratch file, unused
```

## How the two backends relate today

| | `seanime/` (Go) | `shiori-backend/` (Node) |
|---|---|---|
| Status | Complete, working media server | Skeleton: health + profile work; provider/download/automation modules are empty stubs |
| Data | SQLite `dev-datadir/seanime.db` | MongoDB + Supabase (needs `.env`) |
| Talks to | AniList GraphQL, torrent clients, debrid, extensions | Nothing yet |
| Port | 43000 (API + WebSocket `/events`) | `PORT` from `.env` |

They are **not connected**. The Node service was planned as an "orchestrator" that calls Seanime over HTTP.

## Running locally

```bash
# terminal 1: Go server (uses the prebuilt binary; `go run main.go` also works)
seanime/seanime.exe --datadir "<absolute path>/seanime/dev-datadir"

# terminal 2: frontend dev server with hot reload
cd seanime/seanime-web && npm run dev      # http://127.0.0.1:43210 â†’ proxies API to :43000
```

The data dir path **must be absolute** or the server exits with `Data directory path must be absolute`.

## Git state

- `seanime/` is on branch **`shiori-redesign`** (created from `main`). The redesign lives there, uncommitted.
- `seanime/main` already had uncommitted codegen/endpoint changes before this session. They were left untouched.
