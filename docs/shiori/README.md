# Shiori (栞) docs

Agents: start with [`/AGENTS.md`](../../AGENTS.md).

Personal, local-only anime & manga hub built on a Seanime fork.

| Doc | Read it for |
|---|---|
| [00-VISION](00-VISION.md) | **North star**: the otaku Jarvis goal and roadmap |
| [01-REPO-MAP](01-REPO-MAP.md) | What each folder is, how to run it, git state |
| [02-BACKEND-ARCHITECTURE](02-BACKEND-ARCHITECTURE.md) | The Go server explained for JS developers; providers; auto-downloader |
| [03-FRONTEND-ARCHITECTURE](03-FRONTEND-ARCHITECTURE.md) | React app structure, routing, data flow |
| [04-DATA-SCHEMA](04-DATA-SCHEMA.md) | SQLite tables and planned additions |
| [05-DESIGN-SYSTEM](05-DESIGN-SYSTEM.md) | Retired dark first pass (kept for history) |
| [06-PROVIDERS-AUTOMATION-TELEGRAM](06-PROVIDERS-AUTOMATION-TELEGRAM.md) | Provider and auto-downloader feasibility (Telegram part superseded) |
| [07-HOSTING](07-HOSTING.md) | Running the backend 24/7 |
| [08-PROVIDERS](08-PROVIDERS.md) | Installed providers, test results, fallback order, security review |
| [09-DESIGN-DIRECTION](09-DESIGN-DIRECTION.md) | **Active**: the two built variants, Nagi and Ranbu |
| [10-SKILLS](10-SKILLS.md) | The 74 vendored skills and when to use each |
| [11-ART-PIPELINE](11-ART-PIPELINE.md) | How owner images are fixed, cut out and served |

The older deep-dive, [`../SEANIME_ARCHITECTURE_ANALYSIS.md`](../SEANIME_ARCHITECTURE_ANALYSIS.md), is still accurate on internals. Note that it calls the frontend "Vite"; it is actually rsbuild/Rspack.
