# 03 · Frontend Architecture (`seanime/seanime-web`)

It is **React 19 + TypeScript**, bundled with **rsbuild** (Rspack, a faster webpack clone). It is not Vite or Next, despite what older docs say.

| Concern | Library |
|---|---|
| Routing | TanStack Router, file-based (`src/routes/**`, generated into `routeTree.gen.ts`) |
| Server data | TanStack Query; hooks are **generated** from Go handlers into `src/api/hooks/*` |
| Global state | Jotai atoms (`_atoms/`, `atomWithStorage` for persisted UI prefs) |
| Styling | Tailwind 3 + CSS variables in `src/app/globals.css`, cva-based component anatomies |
| Primitives | Radix UI, wrapped in `src/components/ui/*` (button, modal, vertical-menu…) |
| Motion | `motion/react` (Framer Motion) |
| Player | VideoCore (custom), mpv-prism in Electron, jassub for ASS subtitles |

## Folder layout

```
src/
├── routes/                 ← thin route files: createFileRoute("/_main/schedule") → imports a page component
├── app/
│   ├── (main)/             ← all real screens
│   │   ├── _features/      ← cross-page features: layout, navigation, home, media cards, players, plugins…
│   │   ├── _hooks/, _atoms/, _listeners/  ← server status, collections, WebSocket listeners
│   │   ├── entry/          ← anime detail page (episodes, torrent search, streaming tabs)
│   │   ├── manga/          ← manga library, entry, reader
│   │   ├── schedule/, discover/, lists/, search/
│   │   ├── auto-downloader/, torrent-list/, debrid/, extensions/, settings/
│   │   └── ...
│   ├── globals.css         ← design tokens (colors, radius) + Shiori visual layer
│   └── websocket-provider.tsx
├── components/
│   ├── ui/                 ← design-system primitives
│   └── shared/             ← shared composites (sea-image, sea-link, shiori/*)
├── api/generated/          ← AUTO-GENERATED types/endpoints from Go (do not hand-edit)
├── api/hooks/              ← React Query hooks per domain (anilist, torrent, autodownloader…)
└── assets/shiori/          ← NEW: drop-in artwork folders (see 05-DESIGN-SYSTEM)
```

## Data flow

```
Route → Page component → useXxx() generated hook → axios → /api/v1/... (Go)
                                   ▲
WebSocket /events → _listeners/*.ts → queryClient.invalidateQueries / jotai atoms → UI re-renders
```

## Screens (IA, unchanged by the redesign)

Sidebar: Home · Schedule · Manga · My lists · Discover · Search · Auto downloader · Torrent list · Debrid · Extensions · Offline · Settings.
Top nav (web): Home · Schedule · Manga · My lists · Discover.

## Theming hooks that matter

- `useThemeSettings()` reads per-user UI settings saved in the DB (`models.Theme`): banner type, sidebar transparency, custom CSS and more.
- If "Enable color settings" is turned on in Settings → UI, the user's colours override the CSS variables at runtime. The Shiori palette is now the **default**, and "Shiori" is the first preset in `theme-bank.ts`.
