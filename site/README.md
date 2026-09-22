# Shiori website

Static marketing site for Shiori: no build step, no framework. Two designs of the same content:

| Page | What |
|---|---|
| `index.html` | 凪 Nagi, calm and cinematic (default landing) |
| `pop.html` | 乱舞 Ranbu, loud konbini poster wall |
| `gallery.html` | All 169 art pieces: masonry, filters, shuffle, lightbox, deep links (`gallery.html#a147`) |
| `docs.html` | Install, first run, downloads, auto downloader, phone access, build from source |
| `legal.html` | Privacy policy and terms of use |

All links and numbers live in **`assets/js/config.js`**: download URL, optional public links, demo video,
donations raised and the goal. The desktop build script writes the release to `downloads/Shiori-Windows-x64.zip`; empty
`downloadUrl` makes every Download button scroll to the install steps.

## Preview locally

```bash
python -m http.server 4600 --directory site      # then open http://localhost:4600
```
(In Claude Code desktop: `preview_start shiori-site`.)

## Deploy (free)

- **Vercel:** New Project, import the repo, set *Root Directory* to `site`, framework *Other*, no build command. Deploy.
- **Netlify:** Add new site, set *Base directory* `site`, *Publish directory* `site`, no build command. Or drag the `site` folder onto app.netlify.com/drop.

When the domain is bought, add it in the Vercel/Netlify dashboard and point the DNS records they show you at your registrar.

## Refresh the screenshots

The shots in `assets/shots/` are real captures of the app. With the Shiori server running:

```powershell
# from %USERPROFILE%\shiori-capture-tool (copy of scripts/capture-ui.mjs), password read from the data folder .env
$env:SHIORI_PASSWORD = (Get-Content <data>/.env | ? { $_ -like "SEANIME_SERVER_PASSWORD=*" }).Substring(24)
$env:SHIORI_BASE = "http://127.0.0.1:43000"
node capture-ui.mjs site "desktop-nagi-home,desktop-ranbu-home,..."
```
then convert to WebP (see the asset script in the handoff). `scripts/capture-site.mjs` screenshots this site itself at 12 scroll depths.

## Demo video

Record it (the `brag` skill can turn the site into a launch video), save it as `assets/demo.mp4`, set
`demoVideo: "assets/demo.mp4"` in `config.js`. A YouTube embed URL also works.

## Art

`assets/g/` holds every usable piece from the owner's art library (full + `.sm` thumbnail + `.cut` cut-outs), listed in `assets/js/gallery-data.js`. `assets/hero/` holds 26 refined plates (Lanczos upscale to 2400px, sharpened); a CSS film grain hides the remaining softness. A few suggestive pieces are excluded on purpose (list in the asset script). True AI upscaling would need Real-ESRGAN installed.

## Notes

- Motion is GSAP 3.13 (ScrollTrigger, SplitText) from jsDelivr, all behind `prefers-reduced-motion`.
- Both designs are light-only on purpose: they mirror the app's two light themes.
- Public repository, email and payment links stay disabled until pseudonymous destinations exist.
