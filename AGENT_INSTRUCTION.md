# Shiori Backend - AI Agent Instructions

## Project Identity

Project Name: Shiori (栞)

Meaning:
栞 = Bookmark / Guidepost

Shiori is an AI-powered personal anime companion platform.

The long-term vision:
- Anime metadata management
- Provider orchestration
- Stream resolution
- Download automation
- Voice assistant
- n8n workflows
- AI interaction
- Personal media library

This is NOT a simple anime website.
Treat this as a long-term production-grade backend system.

---

# Core Development Rules

## 1. Documentation First

Before implementing any major feature:
- Update relevant documentation.
- Explain architecture decisions.
- Keep API documentation updated.

Never add undocumented routes or services.

---

# Postman API Documentation Requirement

Maintain:
```
docs/
└── POSTMAN_API_TESTS.md
```
This file is the single source of truth for API testing.

---

## Every New Route Must Update POSTMAN_API_TESTS.md

Whenever a new route is created:
Example:
```
GET /api/anime/search
```

Immediately update `docs/POSTMAN_API_TESTS.md` with:
- Route name
- HTTP method
- Endpoint URL
- Authentication requirement
- Headers
- Request body
- Query parameters
- Example request
- Example response
- Success cases
- Error cases
- Required environment variables

No route should exist without documentation.

---

# POSTMAN_API_TESTS.md Format

Follow this structure:

```markdown
# Shiori API Testing Guide

Base URL:
http://localhost:8080

## Health Module

### GET /api/health
Purpose: Checks backend availability.
Authentication: None

Request:
GET /api/health

Response:
200 OK
{
    "status": "healthy",
    "service": "shiori-api",
    "timestamp": "..."
}

Errors:
500 Internal Server Error
```

---

# Authentication Documentation

Every protected endpoint must clearly mention:

Headers:
```
Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
```

Explain how to obtain token:
1. Login using Supabase Auth
2. Copy access_token
3. Add Bearer token in Postman

---

# Project Memory Files

Create and maintain:
```
docs/
├── POSTMAN_API_TESTS.md
├── PROJECT_MEMORY.md
├── ARCHITECTURE.md
├── DEVELOPMENT_RULES.md
├── DATABASE_SCHEMA.md
├── API_CONVENTIONS.md
├── SERVICE_MAP.md
└── CHANGELOG.md
```

---

# PROJECT_MEMORY.md

Purpose: A persistent memory file for future AI sessions.

Maintain:
* Current project state
* Completed features
* Pending tasks
* Important decisions
* Architecture choices
* Known problems

Example:
```markdown
# Current State

Completed:
- Express server
- MongoDB connection
- Supabase authentication
- Profile module

Currently working:
Anime metadata service

Next:
Provider engine
```

---

# ARCHITECTURE.md

Maintain system architecture.

Include:

Current:
```
Client
↓
API Gateway
↓
Modules
↓
Database
```

Future:
```
API Gateway
|
├── Anime Service
├── Provider Service
├── Stream Service
├── Download Service
├── Voice Service
└── Automation Service
```

Explain service responsibilities.

---

# DATABASE_SCHEMA.md

Maintain all MongoDB schemas.

For every collection document:
* Collection name
* Purpose
* Fields
* Types
* Relationships
* Indexes

Never store unnecessary data.

---

# API_CONVENTIONS.md

Define:

## Naming
Use:
```
/api/resource/action
```
Example:
```
/api/anime/search
```

## Responses

Success:
```json
{
 "success": true,
 "data": {}
}
```

Error:
```json
{
 "success": false,
 "message": "Error description"
}
```

---

# DEVELOPMENT_RULES.md

Include:

## Code Rules
* Use async/await
* No callback style
* Controllers contain no business logic
* Business logic belongs in services
* Validate all input
* Never trust client input

## Security
Never:
* Commit .env
* Store passwords
* Store Supabase tokens
* Store temporary HLS URLs
* Store unnecessary API responses

---

# Shiori Data Rules

Important:

## Never store HLS URLs
HLS URLs are temporary.

Flow:
```
Provider
↓
Stream Resolver
↓
HLS URL
↓
Player / Downloader
↓
Discard
```

Database stores:

YES:
* users
* preferences
* provider health
* download history
* configuration

NO:
* passwords
* tokens
* temporary stream URLs
* unnecessary scraped data

---

# Architecture Principles

The current implementation can be a modular monolith.
Do NOT create premature microservices.

However:
Every module must have clear boundaries.

Future extraction:
```
module
↓
service
↓
microservice
```
should be possible.

---

# Provider System Future Rules

When implementing providers:
Every provider must implement:
```
search()
getAnimeInfo()
getEpisodes()
getSources()
healthCheck()
```
Never directly couple application logic with a provider.

---

# Testing Requirement

After every implementation:
Agent must:
1. Run server.
2. Test affected endpoints.
3. Update Postman documentation.
4. Update CHANGELOG.
5. Update PROJECT_MEMORY.

---

# CHANGELOG.md

Every feature addition:
Example:
```markdown
## 2026-08-03

Added:
- Supabase authentication
- Profile module
- Health endpoint

Changed:
- Initial backend structure
```

---

# Agent Behavior Rules

Before coding:
* Read all docs in /docs.
* Understand current architecture.
* Do not break existing modules.

After coding:
* Update documentation.
* Explain changes.
* Mention testing steps.

---

# Current Priority

Build Shiori backend foundation.

Completed:
* Express server
* MongoDB
* Supabase Auth

Next:
* Anime metadata service
* AniList integration
* Provider abstraction design

Do not skip architectural planning.
