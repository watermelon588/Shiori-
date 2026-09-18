# 05 · Shiori Design System (栞)

**Direction:** a late-night anime title card. The base is sumi ink, the one accent is shu vermilion (the colour of torii gates and hanko seals), and the texture comes from manga print: screentone dots and speed lines. Japanese type is used as texture, never as noise.

## Tokens (`src/app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--background` | `#0b0a10` | sumi ink with an indigo cast |
| `--color-brand-500` | `rgb(240 78 55)` / `#f04e37` | **the only accent**: primary buttons, active nav, tags, today marker |
| `--color-brand-300` | `rgb(255 157 136)` | native titles, active icons |
| gray scale | indigo-tinted neutrals 50 to 950 | surfaces, text |
| `--radius` / `--radius-md` | `0.375rem` | one radius everywhere |

## Type

| Role | Font | Where |
|---|---|---|
| Display | **Dela Gothic One** (`font-display`) | h1, h2, hero titles, kanji watermarks, hanko logo |
| Body / UI | **M PLUS 1 Variable** (`font-sans`), with Inter as fallback | everything else; it covers kana and kanji, so Japanese titles render natively |

Both are self-hosted through `@fontsource`. Tailwind needs the names **quoted** (`'"M PLUS 1 Variable"'`). An unquoted family name that contains a number is invalid CSS, and the browser drops the whole rule.

## Signature pieces (utility classes)

| Class | What it does |
|---|---|
| `.shiori-hanko` | Rotated vermilion seal (sidebar 栞 logo) |
| `.shiori-tag` / `.shiori-tag-ghost` | Slanted title-card labels (`放送中 Airing`, `TV`, `Fall 2025`) |
| `.shiori-poster-frame` | Vermilion plate offset behind a cover image |
| `.shiori-speedlines` | Manga 集中線 radiating from `--sl-x/--sl-y` |
| `.shiori-screentone`, `.shiori-screentone-brand` | Halftone dot texture |
| `.shiori-vertical` | Vertical Japanese type (`writing-mode: vertical-rl`) |
| `.shiori-kenburns`, `.shiori-float` | Slow banner drift and floating character; disabled under `prefers-reduced-motion` |
| `.shiori-grain` | Film grain |

## Where it shows up

- **Global wallpaper** (`ShioriAtmosphere`, mounted in `main-layout.tsx`): optional background art, screentone patches, a faint 栞 watermark, six sparse sakura petals (hidden on player/reader routes and under reduced motion), grain. It sits at `z-index:-1`, so it never covers the UI.
- **Sidebar:** hanko 栞 logo; active item gets a vermilion rail and tint.
- **Top nav:** skewed vermilion underline on the current tab.
- **Home / Discover hero:** a title card with a slanted status tag, display-font title, native title in vermilion, offset poster frame, Open + Preview CTAs, speed lines, a screentone band, and the Japanese title set vertically on the right. Banner art slowly drifts.
- **Anime / manga detail header:** the same poster frame, speed lines and vertical native title.
- **Cards:** lift 4px with a vermilion edge on hover.
- **Empty home:** "Your shelf is empty." with a 空白 watermark and a floating character.
- **Schedule:** today is marked in vermilion.
- Primary badges, active filter icons and the theme default/preset now use the brand colour instead of Seanime indigo.

## Your artwork: `seanime-web/src/assets/shiori/`

Drop files in, and the dev server picks them up. No code changes are needed.

| Folder | Used for | Best format |
|---|---|---|
| `hero/` | Wide art behind the Home/Discover hero when a show has no banner | 1920×1080+ JPG/WEBP |
| `characters/` | Cut-out character beside the hero (xl screens) and on empty states | **transparent PNG/WEBP**, 800 to 1400px tall |
| `backgrounds/` | Very faint page wallpaper, picked per section | darker JPG/WEBP |

Selection is deterministic (`pickShioriArt(list, seed)`), so the same show always gets the same character.

## Not restyled yet (inherits tokens only)

Settings forms, torrent list, debrid, extensions, auto-downloader tables, player chrome, and the manga reader. They pick up the new colours, fonts and radius, but they have no bespoke layout work yet.
