"""Check maintained pages for unresolved image paths and missing img attributes."""

from pathlib import Path
import re

root = Path(__file__).resolve().parent
files = list((root / "src").rglob("*.html")) + list((root / "partials").rglob("*.html"))
files += [p for p in root.iterdir() if p.suffix in {".css", ".js"}]
files += [root / path.relative_to(root / "src") for path in (root / "src").rglob("*.html")]
references = re.compile(r"(?:/)?images/+([^\"'<>?)]+\.(?:webp|png|jpe?g))", re.I)
images = re.compile(r"<img\b[^>]*>", re.I)
issues = []
checked = 0

for file in files:
    content = file.read_text(encoding="utf-8")
    for match in references.finditer(content):
        checked += 1
        name = match.group(1)
        if not (root / "images" / name).exists():
            issues.append(f"{file.relative_to(root)}: missing {name}")
        if not name.lower().endswith(".webp"):
            issues.append(f"{file.relative_to(root)}: legacy format {name}")
    for match in images.finditer(content):
        tag = match.group(0)
        if not all(re.search(rf"\b{attr}=", tag) for attr in ("alt", "width", "height")):
            issues.append(f"{file.relative_to(root)}: incomplete {tag[:100]}")
        if re.search(r"/\s+width=", tag):
            issues.append(f"{file.relative_to(root)}: malformed {tag[:100]}")

print(f"Checked {checked} image references in {len(files)} maintained files")
if issues:
    print("\n".join(issues))
    raise SystemExit(1)
print("All referenced images exist and image tags have alt text and dimensions")
