# Shiori Service Map

This map outlines the repository structure, identifying modules, shared layers, and configuration files.

---

## 1. Directory Tree Overview

```
src/
├── app.js                 # Express Application Configuration
├── server.js              # Entrypoint server execution script
├── config/                # Environment, logger, DB, and Supabase config
├── middleware/            # Auth gates, custom parser, errors & 404 filters
├── modules/               # Domain-specific modules (modular monolith)
│   ├── anime/             # Anime search, metadata, and watchlists
│   ├── downloads/         # File downloading and local asset automation
│   ├── health/            # Server availability checks
│   ├── profile/           # User preference storage
│   ├── providers/         # Source scrapers & dynamic crawling logic
│   └── streams/           # Playback link decoding & HLS formatting
└── shared/                # Code common to multiple modules (utils, errors)
```

---

## 2. Configuration Layer (`src/config/`)
- **`env.js`**: Orchestrates environment variables parsing and validation (Zod schema checking).
- **`database.js`**: Initializes connection pool for MongoDB.
- **`logger.js`**: Defines the system log writer via `pino` and `pino-pretty`.
- **`supabase.js`**: Initializes Supabase Client using standard environment key/url.

---

## 3. Middleware Layer (`src/middleware/`)
- **`auth.middleware.js`**: Evaluates `req.headers.authorization` JWT using Supabase. Mounts `req.user` on success.
- **`error.middleware.js`**: Intercepts operational errors, translates Zod schema validation errors, logs error details via logger, and formats standardized client responses.
- **`notFound.middleware.js`**: Catch-all handler for invalid URLs, returning 404.

---

## 4. Module Layer Map (`src/modules/`)

### Health Module (`src/modules/health/`)
- **Endpoints**: `GET /api/health`
- **Components**:
  - [health.routes.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/health/health.routes.js)
  - [health.controller.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/health/health.controller.js)
  - [health.service.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/health/health.service.js)

### Profile Module (`src/modules/profile/`)
- **Endpoints**: `GET /api/profile`, `PATCH /api/profile`
- **Components**:
  - [profile.routes.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/profile/profile.routes.js)
  - [profile.controller.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/profile/profile.controller.js)
  - [profile.service.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/profile/profile.service.js)
  - [profile.model.js](file:///c:/Users/Rohit%20Maity/Desktop/coding/Webdev/project/Shiori%20%28%E6%A0%9E%29/src/modules/profile/profile.model.js) (MongoDB profile schema)
