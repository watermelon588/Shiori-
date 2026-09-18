# 09 · Design Direction: Two Built Variants

> Built 2026-09-17. The owner is choosing between them, or a merge. Switch in the sidebar ("Switch to Ranbu 乱舞" / "Switch to Nagi 凪") or open `http://localhost:43210/?variant=nagi` / `?variant=ranbu`.

The owner's brief: forget the chaos, hop on, watch that twelve-episode romance with no season two. The tone is soothing and Japanese, poetic about life, graphics-first and minimal, with good motion that stays fast. The owner asked for one calm version and one aggressive "visual masterclass".

## 凪 Nagi (calm): an anime ending sequence

| | |
|---|---|
| World | The quiet credits after the last episode: one still at a time, small type, lots of air |
| Palette | Sky-white `#F6F8FB` ground, ink navy `#141A26`, one cobalt accent `#245CFF` (restrained strategy; the art carries colour) |
| Type | Zen Maru Gothic (display), M PLUS 1 (body) |
| Home | A full-bleed owner still that develops from blur into focus and slowly drifts, then crossfades every 9 s. The tagline sits bottom-left like credits: "Forget everything, for twelve episodes." A vertical Japanese credit column: 何もかも忘れて、ただここにいて. The featured title ("Continue with episode N" or "Tonight, perhaps") has a cobalt Watch pill. Below, a slow gallery marquee of the owner's portraits pauses on hover. |
| Everywhere | Pill buttons, 12–18px rounded surfaces, soft tinted shadows, cards lift 4px on hover with a slow image zoom, a cobalt rail on the active sidebar item, a short cobalt underline on the active top-nav tab, native Japanese titles set vertically on detail pages |

## 乱舞 Ranbu (loud): a late-night konbini POP wall

| | |
|---|---|
| World | Fluorescent-lit shelves covered in hand-lettered POP ads, starburst price stickers and die-cut character stickers |
| Palette | Fluorescent white `#FCFCFC`, POP yellow `#FFE400` fields, magenta `#FF1B6B`, shelf blue `#1E3CFF`, ink `#0C0C10` (full palette) |
| Type | Dela Gothic One (display, uppercase), Mochiy Pop One (sticker lettering), M PLUS 1 (body) |
| Home | A tilted yellow sticker with "FORGET EVERYTHING!!", a magenta 12話完結 starburst, the featured title on a white die-cut shelf card with a NEW EP burst, a magenta price-tag "Watch now", an owner cut-out character plus a smaller sticker breaking out of the frame, a wall of owner art behind, and an ink LED ticker of trending titles below. Elements slap on in sequence at load. |
| Everywhere | Yellow highlighter behind the active nav tab, a tilted yellow sticker for the active sidebar item, white die-cut borders on cards that tilt on hover, 3px ink borders on cards, modals and menus, yellow selected tabs and menu items, a raised magenta primary button, cut-out characters on the Discover banner at wide screens |

## Shared mechanics

- **Token inversion:** Seanime is dark-only, so each variant inverts the gray, brand, white and black ramps under `html[data-shiori-variant]`. Every screen (settings, torrent lists, player, reader, extensions) turns light without per-component edits.
- **Motion budget:** transform, opacity, filter and clip-path only; strong ease-out `cubic-bezier(0.23,1,0.32,1)`; hover motion gated to fine pointers; `prefers-reduced-motion` collapses animations; press feedback `scale(0.97)`; popovers scale from their trigger.
- **Art:** 178 curated owner images (see `11-ART-PIPELINE.md`), chosen per slot by orientation and mood, so nothing is cropped into the wrong shape.
- **No flash:** `index.html` applies the saved variant before first paint.

## Shell, profile and footer (added 2026-09-18)

- **Top bar**: sticky, transparent at the top of a page and fading to a blurred ground once you scroll (a 3px ink edge in Ranbu). Right side carries search, the theme toggle and your avatar, which links to the profile.
- **Sidebar**: expands on hover to show labels (Seanime's own setting, now on by default), with a Profile entry above Extensions and the theme switch above Settings.
- **`/profile`**: your AniList avatar and banner, real stats (anime tracked, episodes, days watched, mean score, manga, library count) with a real empty state, a "waiting for you" rail of continue-watching, your top genres, the world picker (Nagi / Ranbu), a gallery from your own art, and shortcuts. Server version and library path sit at the bottom.
- **Footer** (persistent, hidden only inside the player, reader and webviews): the 栞 mark, the tagline in both languages, an honest "personal build, not affiliated" note, and credit columns: Built on (Seanime by 5rahim, AniList), Sources (AnimeTosho, Nyaa, SeaDex, KickAssAnime, AniZone, MangaBuddy, MangaFire), Made with (React, TanStack, Tailwind, Motion, Fontsource, rembg), plus the owner's links (GitHub, X, Instagram, LinkedIn, AniList, email, and a click-to-copy Discord handle). Links live in `src/lib/shiori/credits.ts`.

## Performance work (2026-09-18)

The owner reported the UI "glitching rigorously after some time of use". Measured in-browser: 12 long tasks in 57s and heap climbing 124 → 162 MB while navigating. Fixed by:

1. The Nagi hero mounts only the outgoing and incoming still (was six full-bleed layers), and its blur is lighter.
2. Both marquees and the hero rotation stop when off-screen (`useInView`), and the rotation already stopped on hidden tabs.
3. `scrollbar-color` moved off the universal selector onto `html` (it inherits anyway).

After: heap settles around 110 MB instead of climbing. The remaining long tasks in dev come from the dev server recompiling; the production build is the fix for daily use.

## Known limits (honest list)

- Screens other than Home, Discover, the detail pages, schedule, settings, search and the auto-downloader were verified only through the shared skins, not individually screenshotted: manga reader, torrent list, debrid, extensions playground, scan summaries.
- The video player follows the theme, as the owner chose. Its controls use light scrims over the video, which can read softer on very bright scenes.
- Variant choice is per browser (localStorage), not per account.
- The finish reviewer's remaining asks were applied except one, which was struck from the contract instead: Schedule rows reranking in place. `/schedule` is a month calendar, not a ranked feed, and the owner never asked for one.

## One navigation (2026-09-18, later)

The owner asked for one nav instead of two. The top navbar is gone; the sidebar is the only navigation.

- **Sidebar** (`navigation/main-sidebar.tsx`, `shiori-sidebar.css`): white `--paper` surface with a hairline edge (ink border in Ranbu), 80px rail that expands to 268px on hover or focus, pin button to keep it open (localStorage `shiori-sidebar-pinned`). Header: 栞 mark, back / forward, ⌘K, search field. Sections: Browse (Home, Discover, Schedule), Library (My lists, Manga, Scan summaries), Downloads (Downloads, Auto downloader, Debrid), plugins, then Extensions, Offline mode, theme switch, Settings and the account menu (Profile, Settings, Refresh AniList, Sign out). All icons are Lucide.
- `useThemeSettings().hideTopNavbar` is forced to `true` so every layout that offset for a top bar lines up. The "Hide top navbar" and "Expand sidebar on hover" switches were removed from Settings; "Unpinned menu items" is now "Hidden sidebar items".
- **Page headers** (`ShioriPageHeader`, `ShioriEmptyPanel` in `components/shared/shiori/shiori-page-header.tsx`): kicker in Japanese, title, a sentence about what the page is for, and one owner cut-out (seeded per page).
- **Home deck** (`shiori-home-deck.tsx`, `shiori-browse-by-format.tsx`) under the hero; the hidden duplicate trending carousels were removed.
- **Anime pages** open on Watch online when nothing is downloaded (order: Downloaded if files exist → online → debrid → torrent). The `EpisodeDownloadButton` sits on every episode in the online, torrent, debrid and library lists.
