# 01 · Repository Map

> Snapshot taken 2026-09-17. Workspace root: `Shiori (栞)/`.

## What is in this workspace

```
Shiori (栞)/
├── seanime/              ← The real app. Fork of Seanime v3.10.2 "Saisei" (own .git, gitignored by the parent repo)
│   ├── main.go           ← Go entrypoint (one binary = API server + embedded web UI)
│   ├── internal/         ← All Go server code (~53 packages)
│   ├── seanime-web/      ← React frontend (rsbuild/rspack + Tailwind 3 + TanStack Router)
│   ├── seanime-denshi/   ← Electron desktop wrapper (not needed for local browser use)
│   ├── codegen/          ← Generates TS types/hooks from Go handlers (keeps FE and BE in sync)
│   ├── dev-datadir/      ← Your local data dir: seanime.db (SQLite), config.toml, extensions/, logs/
│   ├── web/              ← Built frontend that seanime.exe serves in production mode
│   └── seanime.exe       ← Prebuilt server binary (built 2026-08-04)
├── shiori-backend/       ← Separate Node/Express 5 service (Supabase auth, MongoDB). Mostly placeholders.
├── docs/                 ← Workspace docs (this folder + SEANIME_ARCHITECTURE_ANALYSIS.md)
├── AGENTS.md / CLAUDE.md ← Agent contract (read first)
├── scripts/              ← test-providers.mjs (live provider smoke test)
├── .claude/launch.json   ← Dev launch configs (seanime-server :43000, seanime-web :43210)
├── .claude/skills/       ← 74 vendored skills
├── AGENT_INSTRUCTION.md  ← Rules for the Node backend (Postman docs, response shapes…)
└── hello.go              ← Go hello-world scratch file, unused
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
cd seanime/seanime-web && npm run dev      # http://127.0.0.1:43210 → proxies API to :43000
```

The data dir path **must be absolute** or the server exits with `Data directory path must be absolute`.

## Git state

- `seanime/` is on branch **`shiori-redesign`** (created from `main`). The redesign lives there, uncommitted.
- `seanime/main` already had uncommitted codegen/endpoint changes before this session. They were left untouched.
