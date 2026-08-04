# Shiori System Architecture

## Overview
Shiori (栞) is designed as a modular monolith backend system. Modules are built with clear, independent boundaries so that they can be easily extracted into microservices in the future.

---

## Current Architecture

```
Client
  │
  │ (HTTP requests with Supabase JWT in Authorization header)
  ▼
API Gateway (Express App - app.js)
  │
  ├── Middlewares (CORS, Helmet, Rate Limiter)
  ├── Authentication Middleware (auth.middleware.js checking Supabase JWT)
  └── Global Error Middleware (error.middleware.js using AppError)
  │
  ▼
Modules
  ├── Health Module (Health check endpoints and status monitoring)
  └── Profile Module (Preferences and local paths)
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
  └── Automation Service (n8n workflow endpoints)
```

---

## Module Responsibilities

### 1. Health Module (`src/modules/health`)
Checks backend availability, tracks system uptime, and reports system health status.

### 2. Profile Module (`src/modules/profile`)
Stores user preferences, application styling states, and downloader paths. Maps 1:1 with Supabase Auth users.

### 3. Anime Module (`src/modules/anime`)
Interacts with the AniList API (and other metadata providers) to search, fetch details, and manage watchlist progress.

### 4. Providers Module (`src/modules/providers`)
Defines the scraping and crawling engine for stream sources. Orchestrates individual anime provider crawlers.

### 5. Streams Module (`src/modules/streams`)
Takes provider source references, decodes/decrypts them, and returns raw playback stream configurations (HLS/M3U8 playlists).

### 6. Downloads Module (`src/modules/downloads`)
Automates downloading episodes locally, handles filesystem path construction, and updates tracking lists.

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

