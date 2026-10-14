"""Build smaller WebP variants used by the homepage's responsive img tags."""

from pathlib import Path
from PIL import Image

images = Path(__file__).resolve().parent / "images"
variants = {
    "business-leaders-digital-network": (768, 960),
    "digital-city-infrastructure": (960,),
    "technician-inspecting-industrial-valve": (960,),
    "industrial-processing-plant-piping": (960,),
    "oil-gas-refinery-at-sunset": (360, 480, 640, 960),
    "drone-surveying-pipeline": (360, 480, 640, 960),
    "industrial-facility-construction": (360, 480, 640, 960),
    "aerial-power-generation-plant": (360, 480, 640, 960),
    "naval-defense-digital-network": (360, 480, 640, 960),
    "griffin-integrity-white-logo": (240, 480, 640),
}

for name, widths in variants.items():
    with Image.open(images / f"{name}.webp") as original:
        for width in widths:
            output = images / f"{name}-{width}.webp"
            if output.exists() and output.stat().st_mtime >= (images / f"{name}.webp").stat().st_mtime:
                continue
            height = round(original.height * width / original.width)
            image = original.resize((width, height), Image.Resampling.LANCZOS)
            image.save(output, "WEBP", quality=76, method=6)
            print(f"{output.name}: {output.stat().st_size / 1024:.1f} KiB")
