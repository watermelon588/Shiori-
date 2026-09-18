<div align="center">

<img src="site/assets/logo.png" alt="Shiori logo" width="96" height="96" />

# Shiori (栞)

**Your anime, kept like a bookmark.**

A private anime and manga hub that runs on your own computer.
Stream, download single episodes or whole seasons, read manga, track with AniList. No ads, no accounts.

</div>

![The Shiori website hero](docs/readme/site-hero.webp)

---

## What it is

Shiori is a personal build of the open-source media server [Seanime](https://github.com/5rahim/seanime) with its own interface, security layer and website. It is one program: you run it on your computer and open it in your browser. It hosts no media and there is no Shiori account. Your copy, your password, your folders.

| | |
|---|---|
| **Watch online** | Anime pages open on the player. If a streaming source fails, Shiori moves to the next one on its own. |
| **Download** | Every episode has its own download button. Finished seasons come as one batch torrent. |
| **Auto downloader** | Write a rule once (show, resolution, release group). New episodes arrive every 20 minutes. |
| **Manga** | Read manga, manhwa and manhua in the built-in reader, download chapters for offline. |
| **AniList** | Optional. Progress and lists sync as you watch. |
| **Two worlds** | 凪 **Nagi**, calm like the credits after the last episode, and 乱舞 **Ranbu**, a loud konbini poster wall. One switch. |
| **Private by default** | A server password, login lockout, rate limiting, strict security headers. Nothing leaves your computer except what your sources need. |

## The app

<table>
<tr>
<td width="50%"><img src="site/assets/shots/home-nagi.webp" alt="Home in the Nagi theme" /><br /><sub>Home, Nagi theme</sub></td>
<td width="50%"><img src="site/assets/shots/home-ranbu.webp" alt="Home in the Ranbu theme" /><br /><sub>Home, Ranbu theme</sub></td>
</tr>
<tr>
<td><img src="site/assets/shots/entry.webp" alt="An anime page on Watch online" /><br /><sub>An anime page opens on Watch online, with a download button per episode</sub></td>
<td><img src="site/assets/shots/downloads.webp" alt="The Downloads page" /><br /><sub>Built-in torrent client</sub></td>
</tr>
<tr>
<td><img src="site/assets/shots/auto-downloader.webp" alt="The auto downloader" /><br /><sub>Auto downloader rules</sub></td>
<td><img src="site/assets/shots/manga-nagi.webp" alt="The manga page" /><br /><sub>Manga</sub></td>
</tr>
<tr>
<td><img src="site/assets/shots/discover-nagi.webp" alt="Discover" /><br /><sub>Discover</sub></td>
<td><img src="site/assets/shots/schedule.webp" alt="Schedule" /><br /><sub>Schedule</sub></td>
</tr>
<tr>
<td><img src="site/assets/shots/search.webp" alt="Search" /><br /><sub>Search by title, genre, season or format</sub></td>
<td><img src="site/assets/shots/settings.webp" alt="Settings" /><br /><sub>Settings</sub></td>
</tr>
</table>

<p align="center"><img src="site/assets/shots/mobile-nagi.webp" alt="Shiori on a phone" width="260" /> &nbsp; <img src="site/assets/shots/mobile-ranbu.webp" alt="Shiori on a phone, Ranbu theme" width="260" /></p>

## The website

A static marketing site lives in [`site/`](site/): the calm flagship page, the loud Pop version, a gallery of 169 stills, docs and legal pages. Plain HTML, CSS and GSAP, no build step.

| | |
|---|---|
| ![Features](docs/readme/site-features.webp) | ![A wall of stills](docs/readme/site-stills.webp) |
| Four features that pin and stack | A still wall |
| ![Seasons](docs/readme/site-seasons.webp) | ![Tour](docs/readme/site-tour.webp) |
| A year of evenings | Every screen, panned sideways |
| ![Cast](docs/readme/site-cast.webp) | ![Manga](docs/readme/site-manga.webp) |
| Cut-out characters that float and lean | Manga columns drifting against each other |
| ![Two worlds](docs/readme/site-worlds.webp) | ![Bento](docs/readme/site-bento.webp) |
| Scroll wipes Nagi into Ranbu | What a streaming site will never do |
| ![Gallery wall](docs/readme/site-wall.webp) | ![Install](docs/readme/site-install.webp) |
| A tilted wall of art leading to the gallery | Running in five minutes |
| ![Gallery page](docs/readme/site-gallery.webp) | ![Gallery wall](docs/readme/site-gallery-wall.webp) |
| The gallery page | Filters, shuffle and a lightbox |
| ![Pop version](docs/readme/site-pop.webp) | ![Docs](docs/readme/site-docs.webp) |
| The Ranbu (Pop) version of the site | Docs |

<p align="center"><img src="docs/readme/site-mobile.webp" alt="The site on a phone" width="260" /></p>

Preview it locally:

```bash
python -m http.server 4600 --directory site
```

Deploy: import this repository on Vercel or Netlify and set the root directory to `site`. Links (download, GitHub, demo video, support) live in [`site/assets/js/config.js`](site/assets/js/config.js). More in [`site/README.md`](site/README.md).

## Install (Windows)

1. Download `Shiori-windows-x64.zip` from [Releases](../../releases/latest) and unzip it anywhere.
2. Copy `.env.example` to `data\.env` and set a password:
   ```
   SEANIME_SERVER_PASSWORD=pick-a-long-random-password
   SEANIME_SECURE_MODE=strict
   ```
3. Double-click `Start Shiori.bat`, then open **http://localhost:43000**.
4. In Settings pick a library folder, then install sources from Extensions. Connecting AniList is optional.

Never forward port 43000 on your router. To use Shiori from your phone, put both devices on [Tailscale](https://tailscale.com).

The full guide ships inside the app (sidebar, Guide) and on the site ([`site/docs.html`](site/docs.html)).

## Security

- Password from an environment variable or `<data dir>/.env`, never from the repository.
- Constant-time token checks, 10 wrong tries lock a device out for 5 minutes.
- Per-IP rate limiting, CSP and hardening headers, protected media folders.
- Plugin SVG icons are sanitised before rendering.

The audit and how to verify it: [`docs/shiori/12-SECURITY.md`](docs/shiori/12-SECURITY.md), probe script [`scripts/security-probe.mjs`](scripts/security-probe.mjs).

## Repository layout

```
├── site/               the website (static)
├── docs/shiori/        architecture, design direction, providers, security, donations
├── docs/readme/        screenshots used in this README
├── scripts/            provider smoke test, security probe, screenshot tools
├── shiori-backend/     Node/Express companion skeleton (not connected yet)
├── AGENTS.md           rules for AI agents working in this repo
└── HANDOFF.md          current state and next steps
```

The app itself is a fork of Seanime 3.10.2 kept in `seanime/` next to this repository. Build from source: [`site/docs.html#source`](site/docs.html).

## Credits and licence

- Built on [Seanime](https://github.com/5rahim/seanime) by 5rahim, licensed GPL-3.0. Shiori's app changes are GPL-3.0 as well.
- Maintained by **Zaxxewu**.
- Anime and manga titles, characters and artwork belong to their creators. The art on the site is fan art and stills collected as mood pieces.
- Shiori hosts no media. You are responsible for the sources you install and what you download. See the [privacy and terms](site/legal.html).
