"""
Shiori art pipeline.

Source:  art-source/ (+ bg/, manga/)   <- owner's raw Pinterest library (copied from seanime/web/assets)
Output:  seanime/seanime-web/public/shiori/art/<slug>.webp (+ <slug>.sm.webp)
         seanime/seanime-web/src/lib/shiori/art-manifest.json

Fixes rotation, trims letterbox bars, cuts out characters that sit on plain backgrounds (rembg isnet-anime),
and records orientation + mood + role so the UI can pick images that fit a slot instead of cropping badly.

Usage: python scripts/build-art.py [--no-cutouts]
"""
import json, os, sys, hashlib
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "art-source")  # safe copy; seanime/web is overwritten by frontend builds
OUT = os.path.join(ROOT, "seanime", "seanime-web", "public", "shiori", "art")
MANIFEST = os.path.join(ROOT, "seanime", "seanime-web", "src", "lib", "shiori", "art-manifest.json")
FULL, SMALL = 1600, 640

# Rotation fixes decided by eye (degrees counter-clockwise, PIL convention).
ROTATE = {13: 90, 16: 90, 35: 90, 42: 90, 48: 90, 50: 90, 52: 90, 82: 90, 90: 90, 104: 90,
          117: 90, 121: 90, 84: -90, 105: -90, 143: -90, 145: -90}
# Near-duplicates / placeholders to skip.
SKIP = {82, 85}

CALM = {2, 4, 6, 8, 9, 12, 13, 16, 19, 20, 25, 32, 33, 35, 36, 42, 43, 46, 48, 50, 52, 53, 54, 65, 72, 76, 78, 87, 89,
        90, 93, 100, 102, 103, 106, 110, 112, 115, 116, 117, 118, 120, 121, 122, 125, 129, 130, 131, 132, 133, 134,
        135, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 150, 151, 154, 155, 157, 158, 159, 160, 163, 164,
        168, 170, 179}
SCENE = {2, 8, 12, 13, 25, 36, 43, 50, 54, 65, 93, 102, 103, 117, 122, 129, 130, 131, 132, 133, 134, 135, 136, 137,
         138, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 154, 155, 157, 158, 159, 160, 23, 44, 7}
MANGA = set(range(162, 180)) | {10, 11, 0, 3, 55, 61, 114}
# Characters on plain backgrounds that make clean cut-outs.
CUTOUT = {0, 6, 14, 15, 17, 22, 26, 29, 32, 37, 46, 49, 51, 53, 60, 63, 67, 72, 74, 76, 78, 83, 87, 92, 98, 108, 112,
          116, 123, 128}


def trim_bars(im: Image.Image, tol=14, min_frac=0.02) -> Image.Image:
    """Crop uniform letterbox/pillarbox bars (black, white or flat colour) off each edge."""
    g = ImageOps.grayscale(im)
    w, h = g.size
    px = g.load()

    def flat_row(y):
        vals = [px[x, y] for x in range(0, w, max(1, w // 64))]
        return max(vals) - min(vals) <= tol

    def flat_col(x):
        vals = [px[x, y] for y in range(0, h, max(1, h // 64))]
        return max(vals) - min(vals) <= tol

    top = 0
    while top < h // 3 and flat_row(top): top += 1
    bottom = h - 1
    while bottom > h * 2 // 3 and flat_row(bottom): bottom -= 1
    left = 0
    while left < w // 3 and flat_col(left): left += 1
    right = w - 1
    while right > w * 2 // 3 and flat_col(right): right -= 1
    box = (left, top, right + 1, bottom + 1)
    # only trim real bars, not a character standing on white
    if (top + (h - 1 - bottom)) / h < min_frac and (left + (w - 1 - right)) / w < min_frac:
        return im
    return im.crop(box)


def orientation(w, h):
    r = w / h
    return "wide" if r >= 1.3 else "square" if r >= 0.85 else "tall"


def main():
    use_cutouts = "--no-cutouts" not in sys.argv
    session = None
    if use_cutouts:
        from rembg import new_session, remove
        session = new_session("isnet-anime")

    index = []
    for d in ["", "bg", "manga"]:
        folder = os.path.join(SRC, d)
        for f in sorted(os.listdir(folder)):
            p = os.path.join(folder, f)
            if os.path.isfile(p) and f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) \
                    and f not in {"download.png", "download (1).png", "download (3).png", "download (4).png"}:
                index.append(p)

    os.makedirs(OUT, exist_ok=True)
    items = []
    for i, path in enumerate(index):
        if i in SKIP:
            continue
        im = Image.open(path)
        im = ImageOps.exif_transpose(im).convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        if i in ROTATE:
            im = im.rotate(ROTATE[i], expand=True)
        if im.mode == "RGB":
            im = trim_bars(im)
        slug = f"a{i:03d}-" + hashlib.sha1(os.path.basename(path).encode()).hexdigest()[:6]
        w, h = im.size
        role = "manga" if i in MANGA else "scene" if i in SCENE else "character"
        entry = {"id": slug, "w": w, "h": h, "orientation": orientation(w, h),
                 "mood": "calm" if i in CALM else "loud", "role": role,
                 "source": os.path.relpath(path, SRC).replace("\\", "/")}

        full = im.copy(); full.thumbnail((FULL, FULL), Image.LANCZOS)
        small = im.copy(); small.thumbnail((SMALL, SMALL), Image.LANCZOS)
        full.save(os.path.join(OUT, slug + ".webp"), "WEBP", quality=82, method=6)
        small.save(os.path.join(OUT, slug + ".sm.webp"), "WEBP", quality=78, method=6)
        entry["w"], entry["h"] = full.size

        if use_cutouts and i in CUTOUT:
            cut = remove(im.convert("RGB"), session=session, post_process_mask=True)
            bbox = cut.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox()
            if bbox:
                cut = cut.crop(bbox)
                cut.thumbnail((1200, 1200), Image.LANCZOS)
                cut.save(os.path.join(OUT, slug + ".cut.webp"), "WEBP", quality=85, method=6)
                entry["cutout"] = {"w": cut.size[0], "h": cut.size[1]}
        items.append(entry)
        print(f"{i:3d} {slug} {entry['orientation']:6s} {entry['mood']:4s} {role:9s}{' +cut' if 'cutout' in entry else ''}")

    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    json.dump(items, open(MANIFEST, "w"), indent=1)
    print(f"{len(items)} images -> {OUT}")


if __name__ == "__main__":
    main()
