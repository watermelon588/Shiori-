# 11 · Art Pipeline

The owner's images drive both variants. Raw files are never used directly.

| Step | Where |
|---|---|
| Originals (copied from `seanime/web/assets`, which frontend builds overwrite) | `art-source/` (+ `bg/`, `manga/`) |
| Processing script | `scripts/build-art.py` |
| Output (served statically) | `seanime/seanime-web/public/shiori/art/<id>.webp`, `.sm.webp` (640px), `.cut.webp` (transparent cut-out) |
| Manifest the UI reads | `seanime/seanime-web/src/lib/shiori/art-manifest.json` via `src/lib/shiori/art.ts` |

What the script does:
1. **Rotation:** 16 sideways images are turned upright (decided by eye; list in `ROTATE`).
2. **Letterbox trim:** flat black or white bars are cropped off, so art never shows dead bands.
3. **Cut-outs:** 30 characters on plain backgrounds are cut out with rembg's `isnet-anime` model and cropped to their alpha bounds.
4. **Two sizes:** full (≤1600px) and small (≤640px) WebP, used with `srcset`.
5. **Tags:** orientation (wide/square/tall), mood (calm/loud), role (scene/character/manga). The UI picks images that fit a slot's shape instead of cropping.

Totals: 178 images, 30 cut-outs, ~23 MB. Four blank `download*.png` placeholders and two near-duplicates are skipped.

Re-run after adding images: drop files into `art-source/`, adjust the `CALM`/`SCENE`/`CUTOUT`/`ROTATE` sets if needed, then `python scripts/build-art.py`. It needs `pip install "rembg[cpu]"`; the first run downloads the model.
