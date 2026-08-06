# Shiori System Architecture

## Overview
Shiori (栞) is designed as a modular monolith backend system. Modules are built with clear, independent boundaries so that they can be easily extracted into microservices in the future.

---

## Current Architecture (Phase 0 Scaffolded)

```
Client
  │
  │ (HTTP requests with Supabase JWT in Authorization header)
  ▼
API Gateway (Express App - app.js)
  │
  ├── Middlewares (CORS, Helmet, Rate Limiter, Pino HTTP Logger)
  ├── Authentication Middleware (auth.middleware.js checking Supabase JWT)
  ├── Shared Utilities (response.js, errors.js, constants.js)
  └── Global Error Middleware (error.middleware.js using AppError)
  │
  ▼
Modules Layer
  ├── Health Module (/api/health - Uptime & sub-system statuses)
  ├── Auth Module (/api/auth - Authentication framework status)
  ├── Profile Module (/api/profile - Preferences & local paths)
  ├── Anime Module (/api/anime - Metadata & AniList gateway)
  ├── Integration Module (/api/integration - Seanime API integration bridge placeholder)
  ├── Provider Module (/api/provider - Provider engine placeholder, 501 Not Implemented)
  ├── Download Module (/api/download - Download engine placeholder, 501 Not Implemented)
  └── Automation Module (/api/automation - AI/workflow pipeline placeholder, 501 Not Implemented)
  │
  ▼
Services Layer (`src/services/` - Service abstraction boundaries)
  │
  ▼
Database (MongoDB via Mongoose schemas)
```

---

## Future Architecture (Target State)

```
API Gateway
  │
  ├── Anime Service (Metadata & AniList integration)
  ├── Provider Service (Provider orchestration & scrapers)
  ├── Stream Service (Dynamic stream parsing & HLS resolution)
  ├── Download Service (Automation and local media ingestion)
  ├── Voice Service (AI voice assistant Integration)
  └── Automation Service (n8n & LangGraph workflow endpoints)
```

---

## Module Responsibilities

### 1. Health Module (`src/modules/health`)
Checks backend availability, tracks system uptime, and reports system health status across database, supabase, integration, provider, and automation modules.

### 2. Auth Module (`src/modules/auth`)
Coordinates authentication capabilities, JWT inspection, and Supabase client integration status.

### 3. Profile Module (`src/modules/profile`)
Stores user preferences, application styling states, and downloader paths. Maps 1:1 with Supabase Auth users in MongoDB.

### 4. Anime Module (`src/modules/anime`)
Interacts with the AniList API (and other metadata providers) to search, fetch details, and manage watchlist progress.

### 5. Integration Module (`src/modules/integration`)
Serves as the gateway boundary to Seanime server instances via REST API & WebSockets. Returns connection status.

### 6. Provider Module (`src/modules/provider`)
Defines the interface for provider engine resolution and crawler orchestration. Currently returns 501 Not Implemented placeholders.

### 7. Download Module (`src/modules/download`)
Defines the download queue and file manager interfaces. Currently returns 501 Not Implemented placeholders.

### 8. Automation Module (`src/modules/automation`)
Defines AI, LangGraph, and workflow execution endpoints. Currently returns 501 Not Implemented placeholders.


---

## System Boundaries and Integration

```
Shiori Backend
      │
      ▼
  API Layer
      │
      ▼
Future Integration
      │
      ▼
Seanime Client
```

Shiori Backend operates as an independent server API. The Seanime codebase resides in a separate repository. All interactions, data sharing, or orchestration between Shiori and Seanime will occur over API request/response flows rather than direct code dependency sharing, ensuring clean separation of concerns and independent deployment options.

