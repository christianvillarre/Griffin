"""Create bounded WebP assets and update site image references.

Run with: python optimize_images.py
Requires Pillow. Original source images are retained for editing.
"""

from pathlib import Path
from PIL import Image, ImageOps
import re

ROOT = Path(__file__).resolve().parent
IMAGES = ROOT / "images"
EXTENSIONS = {".jpg", ".jpeg", ".png"}
DESCRIPTIVE_NAMES = {
    "stock34": "business-leaders-digital-network",
    "stock40": "digital-city-infrastructure",
    "ldar5": "technician-inspecting-industrial-valve",
    "FIA": "industrial-processing-plant-piping",
    "stock28": "oil-gas-refinery-at-sunset",
    "stock56": "drone-surveying-pipeline",
    "stock55": "industrial-facility-construction",
    "stock43": "aerial-power-generation-plant",
    "stock59": "naval-defense-digital-network",
    "stock32": "offshore-oil-platform-and-vessel",
    "Griffin Integrity Logo wt": "griffin-integrity-white-logo",
}


def optimize():
    dimensions = {}
    before = after = 0
    for source in IMAGES.iterdir():
        if source.suffix.lower() not in EXTENSIONS:
            continue
        target = IMAGES / (DESCRIPTIVE_NAMES.get(source.stem, source.stem) + ".webp")
        if not target.exists() or target.stat().st_mtime < source.stat().st_mtime:
            with Image.open(source) as original:
                image = ImageOps.exif_transpose(original)
                image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                transparent = image.mode in ("RGBA", "LA") or "transparency" in image.info
                if transparent:
                    image = image.convert("RGBA")
                    image.save(target, "WEBP", quality=82, method=6)
                else:
                    image = image.convert("RGB")
                    image.save(target, "WEBP", quality=75, method=6)
        with Image.open(target) as optimized:
            dimensions[target.name] = optimized.size
        before += source.stat().st_size
        after += target.stat().st_size

    # Only edit the maintained source and site entry files. build.js regenerates
    # the root HTML pages from src and partials.
    paths = list((ROOT / "src").rglob("*.html"))
    paths += list((ROOT / "partials").rglob("*.html"))
    paths += [p for p in ROOT.iterdir() if p.suffix == ".html" and "copy" not in p.name and "gsap" not in p.name]
    paths += list((ROOT / "capabilities").rglob("*.html"))
    paths += [p for p in ROOT.iterdir() if p.suffix in {".css", ".js"}]
    image_ref = re.compile(r"(?i)((?:/)?images/+)([^\"'<>?)]*?)\.(jpe?g|png)(?=[\"'?)]|$)")
    img_tag = re.compile(r"<img\b[^>]*>", re.I)

    def update_tag(match):
        tag = match.group(0)
        src = re.search(r'\bsrc="/images/([^\"]+\.webp)"', tag, re.I)
        if not src:
            return tag
        name = src.group(1)
        if name not in dimensions:
            return tag
        width, height = dimensions[name]
        # Append before the closing slash in self-closing tags.
        closing = " />" if tag.rstrip().endswith("/>") else ">"
        tag = tag.rstrip()[:-2].rstrip() if closing == " />" else tag.rstrip()[:-1]
        if not re.search(r"\bwidth=", tag):
            tag += f' width="{width}"'
        if not re.search(r"\bheight=", tag):
            tag += f' height="{height}"'
        if not re.search(r"\balt=", tag):
            tag += ' alt=""'
        if not re.search(r"\bdecoding=", tag):
            tag += ' decoding="async"'
        if not re.search(r"\bloading=", tag) and "topbar-nav__logo-box" not in tag:
            tag += ' loading="lazy"'
        return tag + closing

    for path in paths:
        content = path.read_text(encoding="utf-8")
        updated = image_ref.sub(lambda m: m.group(1) + m.group(2) + ".webp", content)
        for old, new in DESCRIPTIVE_NAMES.items():
            updated = updated.replace(f"/images/{old}.webp", f"/images/{new}.webp")
            updated = updated.replace(f"images/{old}.webp", f"images/{new}.webp")
        updated = img_tag.sub(update_tag, updated)
        if updated != content:
            path.write_text(updated, encoding="utf-8")

    print(f"Converted {len(dimensions)} images: {before / 1048576:.1f} MiB -> {after / 1048576:.1f} MiB")


if __name__ == "__main__":
    optimize()
