<div align="center">

# 栞 Shiori

### Your Personal Anime Companion.

*A modern AI-powered platform for discovering, organizing, streaming, and automating your anime experience.*

---

</div>

## Overview

Shiori is a backend-first platform built around one simple idea:

> Anime should be effortless.

Instead of juggling multiple websites, trackers, downloads, and media libraries, Shiori acts as a unified orchestration layer that connects metadata, provider services, automation workflows, and your personal library into one seamless experience.

This project is designed as a distributed system and serves as an experimental playground for provider abstraction, media pipelines, AI automation, and scalable backend architecture.

---

## Vision

Shiori is **not** another anime streaming website.

It is a personal media platform that combines:

- Anime metadata
- Intelligent provider routing
- Stream resolution
- Download automation
- Voice interaction
- Personal watch library
- AI-powered workflows

The goal is to make anime consumption feel like interacting with an intelligent assistant rather than navigating multiple disconnected services.

---

## Planned Features

- AniList Integration
- Provider Management Engine
- Stream Resolution Pipeline
- Health Monitoring & Provider Failover
- Download Queue
- Local Media Library
- AI Voice Commands
- Automation Workflows (n8n)
- Watch Progress Synchronization
- Personalized Recommendations

---

## Architecture

```text
                 Client

                    │

            API Gateway

                    │

     ┌──────────────┼──────────────┐

 Anime Service   Provider Engine   Profile Service

                    │

           Stream Resolver

                    │

           Download Service

                    │

          Local Media Library
```

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Supabase Authentication
- Redis
- BullMQ

### AI

- Whisper
- ElevenLabs
- n8n

### Metadata

- AniList GraphQL

### Infrastructure

- Docker
- Docker Compose

---

## Project Status

🚧 Under active development.

The current milestone focuses on building the backend foundation before implementing provider orchestration and media services.

---

## License

MIT

---

> 栞 (Shiori) — *A bookmark for every story.*
