# Project Memory (Shiori Backend)

## Current State

Completed:
- **Express Server Foundation**: Setup using Express 5, CORS, Helmet security headers, rate limiting, and global request logging via Pino HTTP.
- **Database Connection**: MongoDB connection via Mongoose with configuration, error logging, and standard lifecycle handlers.
- **Authentication System**: Supabase Auth client initialization and middleware to extract and verify user bearer JWTs.
- **Health Module**: Basic health check, uptime, and sub-system health reporting route (`GET /api/health`).
- **Profile Module**: Profile controller, service, Zod validation, and schema definitions to retrieve/create/update user profiles (`GET /api/profile`, `PATCH /api/profile`).
- **AI Agent Onboarding**: Initialized global and project agent instruction rules (`AGENT_INSTRUCTION.md` and `.agents/AGENTS.md`) and project documentation structure under `/docs`.
- **Seanime Environment Setup & Build Validation**: Verified Go 1.26+ and Node.js dependencies, `go mod download`, `go mod tidy`, and `npm install` for `seanime-web`.
- **Seanime Architecture Analysis**: Published 27-section architectural analysis (`docs/SEANIME_ARCHITECTURE_ANALYSIS.md`) detailing Seanime's facade pattern, Goja extension engine, AniList GraphQL integration, media pipelines, and recommended network API integration strategy.
- **Phase 0 Foundation Setup Completed**: Built bare-minimum architecture with modular placeholders for `auth`, `integration`, `provider`, `download`, `automation`, `services/` layer, and `shared/` (`response.js`, `errors.js`, `constants.js`). Seanime remains strictly untouched, and all future communication will occur via API boundaries.

Currently working:
- Phase 0 verification & foundation validation completed. Preparing next architectural modules.

Next Priority:
- Implement Provider Engine abstraction and scraper contracts.
- Anime metadata service: integration with AniList GraphQL API to look up anime details, sync history, and search listings.
- Seanime integration client setup via network API boundaries.


---

## Important Decisions
- **Modular Monolith**: Keeping all services in a single repository and code structure for speed and simplicity. The modules (`health`, `profile`, `anime`, `downloads`, `providers`, `streams`) are strictly separated by directories to allow easy microservice extraction later.
- **Supabase JWT Verification**: Verification happens inside `auth.middleware.js` using `supabase.auth.getUser()`, ensuring JWT legitimacy directly against Supabase.
- **MongoDB Mapping**: Users are mapped to profiles in MongoDB using the unique `supabaseId` returned by Supabase Auth.
- **No Temporary HLS Url Storage**: Dynamic stream URLs are not persisted in database. They are fetched on demand and discarded by client after usage.
- **Workspace Restructure**: Separated Shiori Backend and Seanime into standalone subdirectories under the workspace root (`shiori-backend/` and `seanime/`). They operate as independent codebases with separate git environments and dependency isolation. Future integrations will occur exclusively via network API boundaries.

---

## Known Problems
- None currently reported.
