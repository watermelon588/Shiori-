# Changelog

All notable changes to the Shiori project will be documented in this file.

---

## [Unreleased]

### Added
- **Phase 0 (Foundation Setup)**:
  - Scaffolded `src/shared/` layer (`response.js`, `errors.js`, `constants.js`) for standardized API responses, HTTP errors, and system constants.
  - Created `src/services/` layer directory for future domain services.
  - Scaffolded `src/modules/integration/` (`GET /api/integration/status`).
  - Scaffolded `src/modules/provider/` (`GET /api/provider/status`, `GET /api/provider/providers`, `POST /api/provider/resolve` returning 501 Not Implemented).
  - Scaffolded `src/modules/download/` (`POST /api/download`, `GET /api/download/:id`, `DELETE /api/download/:id` returning 501 Not Implemented).
  - Scaffolded `src/modules/automation/` (`POST /api/automation/execute` returning 501 Not Implemented).
  - Scaffolded `src/modules/auth/` (`GET /api/auth/status`).
  - Extended `src/modules/health/` (`GET /api/health`) to report component status across `backend`, `database`, `supabase`, `integration`, `provider`, and `automation`.
  - Registered all new modules inside `src/app.js`.
- **Seanime Architecture Analysis**: Created comprehensive 27-section documentation in `docs/SEANIME_ARCHITECTURE_ANALYSIS.md` detailing startup sequence, Goja JS extension runtime, HTTP REST endpoints, WebSocket event model, GORM models, and Shiori integration options.


### Changed
- **Seanime Environment Verification**: Validated Go 1.26+ and Node.js environment, downloaded and tidied all Go module dependencies (`go mod download`, `go mod tidy`), and installed React frontend dependencies (`seanime-web` npm packages).
- **Workspace Restructure**:
  - Moved Shiori Backend code (`src/`, `.env`, `.gitignore`, `package.json`, `package-lock.json`, `README.md`, and `docs/`) into the `shiori-backend/` subdirectory.
  - Initialized a fresh, isolated git repository inside `shiori-backend/` with a clean commit.
  - Isolated Seanime codebase into the `seanime/` subdirectory as a separate project with its own git configuration and independent dependencies.
  - Relocated environment variables and resolved paths, ensuring strict package boundaries.

---

## [1.0.0] - 2026-08-03

### Added
- **AI Agent Instruction Rules**: Created `AGENT_INSTRUCTION.md` and `.agents/AGENTS.md` (Workspace Customizations Root) configuration files to enforce coding practices, security guidelines, and documentation requirements.
- **Project Documentation Files**: Configured the `/docs` directory including:
  - `docs/POSTMAN_API_TESTS.md` (Single source of truth for API routes verification)
  - `docs/PROJECT_MEMORY.md` (Session state tracking)
  - `docs/ARCHITECTURE.md` (Modular monolith flow diagrams)
  - `docs/DEVELOPMENT_RULES.md` (Coding and security standards)
  - `docs/DATABASE_SCHEMA.md` (Profile model description)
  - `docs/API_CONVENTIONS.md` (Response schemas and naming rules)
  - `docs/SERVICE_MAP.md` (Filesystem mapping reference)
  - `docs/CHANGELOG.md` (This file)
- **Express Server Foundation**: Setup using Express 5, CORS configuration, Helmet, rate limiting, and Pino request logger.
- **MongoDB Connection**: Setup using Mongoose configurations inside `src/config/database.js`.
- **Supabase Authentication**: Protect middleware in `src/middleware/auth.middleware.js` utilizing token check.
- **Health Module**: Added health status monitor route `/api/health`.
- **Profile Module**: Created retrieval and updating routes for user preference configuration (`GET /api/profile`, `PATCH /api/profile`).
- **Git Ignored Agent & Doc Folders**: Appended `.agents/` and `docs/` to `.gitignore` to prevent tracking metadata/memory folders in git.
