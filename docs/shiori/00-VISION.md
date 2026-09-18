# 00 · Vision: Shiori is an otaku's Jarvis

> The north star. Every feature decision gets checked against this page. (Set 2026-09-17.)

**Shiori (栞)** is a personal, private anime and manga companion for someone who lives in their room, and it keeps working while they're away.

## At home: the heaven

- Open the laptop and everything is already there: downloaded episodes, continue-watching, the manga shelf.
- The app itself should feel like being inside an anime: Japanese title-card aesthetic, character art everywhere, no generic dashboard feel.

## Away (at work): the agent

The backend runs **24/7** and acts on its own:

1. **Auto-download**: new episodes of followed shows are grabbed as soon as they release.
2. **Industry briefing**: what's airing, what just got announced, sequels, trending, and "what you should look up", kept up to date.
3. **Recommendations**: what to watch next, based on the AniList list.
4. **Status feedback**: what was downloaded, what failed, what's next and when.

## Control surface

- ~~Telegram bot~~ **dropped** (it was only an illustration of the automation idea).
- **Lightweight PWA mobile app** (installable, push notifications): follow/unfollow shows, see the download queue, read briefings, talk to the agent.
- The desktop web app (Seanime redesign) stays the main place to watch and read.

## Constraints

- Personal use only. Never published to GitHub.
- The owner knows JS/React well but not Go, so Go changes must be explained.
- Stream URLs are never stored.

## Roadmap (current order, updated 2026-09-17)

1. ✅ Providers installed, reviewed and tested end to end (`08-PROVIDERS.md`).
2. ✅ Project agent setup: `AGENTS.md`, vendored skills (`10-SKILLS.md`).
3. **Next:** light-theme, animation-heavy redesign with two variations, using the owner's references and artwork (`09-DESIGN-DIRECTION.md`).
4. Pick hosting so the backend runs 24/7 (`07-HOSTING.md`).
5. Later: PWA mobile companion, then the agent layer (briefings, recommendations). Parked by the owner for now.
