#!/usr/bin/env python3
"""
Builds the favicons and app icons from the anvil mark.

    pip3 install --user Pillow
    python3 scripts/build-icons.py

Replaces the previous icon set, which was an orange "AI" on navy. Two problems
with that one: orange on navy measures 2.90:1, which fails the contrast contract
this repo enforces everywhere else, and a bare "AI" is a standalone mark with no
BYU identification, which the naming rules do not allow.

The anvil is the right mark for a square: it is the program's own symbol, it
reads at 16px, and white on navy is 13.56:1.

Out:

    public/icon.svg          vector, what modern browsers prefer
    public/favicon-32.png    classic tab icon
    public/favicon-180.png   apple-touch-icon, full bleed, no alpha
    public/favicon-512.png   PWA / large surfaces
    src/app/favicon.ico      16 + 32 + 48, for anything old

Everything is drawn at 4x and downsampled, because a rounded corner rasterised
directly at 32px has visible steps.
"""

import os
import re

from PIL import Image, ImageDraw

HERE = os.path.dirname(__file__)
PUBLIC = os.path.join(HERE, "..", "public")
APP = os.path.join(HERE, "..", "src", "app")

NAVY = (0, 46, 93, 255)
WHITE = (255, 255, 255, 255)

# How much of the tile the mark spans. The anvil is a wide mark, roughly 1.6:1,
# so sizing it by width is what keeps it from looking lost in a square.
MARK_WIDTH = 0.68
CORNER = 0.18  # corner radius as a fraction of the tile
SS = 4  # supersample factor


def tile(size: int, rounded: bool, mark: Image.Image) -> Image.Image:
    """One icon: navy tile, white anvil centred on it."""
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    if rounded:
        draw.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * CORNER), fill=NAVY)
    else:
        draw.rectangle([0, 0, s - 1, s - 1], fill=NAVY)

    w = int(s * MARK_WIDTH)
    h = max(1, round(w * mark.height / mark.width))
    img.alpha_composite(mark.resize((w, h), Image.LANCZOS), ((s - w) // 2, (s - h) // 2))
    return img.resize((size, size), Image.LANCZOS)


def svg_icon(anvil_svg: str) -> str:
    """The vector icon: the traced anvil path, centred on a navy tile.

    Reuses the path out of anvil-white.svg rather than re-tracing, so the two
    can never drift apart.
    """
    d = re.search(r'\sd="([^"]+)"', anvil_svg).group(1)
    vb = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', anvil_svg)
    aw, ah = float(vb.group(1)), float(vb.group(2))

    box = 512
    w = box * MARK_WIDTH
    scale = w / aw
    x = (box - w) / 2
    y = (box - ah * scale) / 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {box} {box}" '
        f'role="img" aria-label="AI Foundry">'
        f"<title>AI Foundry</title>"
        f'<rect width="{box}" height="{box}" rx="{box * CORNER:.0f}" fill="#002E5D"/>'
        f'<g transform="translate({x:.2f} {y:.2f}) scale({scale:.5f})">'
        f'<path fill="#FFFFFF" fill-rule="evenodd" d="{d}"/></g></svg>\n'
    )


def main() -> int:
    anvil = Image.open(os.path.join(PUBLIC, "brand", "anvil-white.png")).convert("RGBA")

    with open(os.path.join(PUBLIC, "brand", "anvil-white.svg")) as fh:
        with open(os.path.join(PUBLIC, "icon.svg"), "w") as out:
            out.write(svg_icon(fh.read()))
    print("  icon.svg")

    for name, size, rounded in [
        ("favicon-32.png", 32, True),
        ("favicon-512.png", 512, True),
        # Apple applies its own mask and composites on black if there is alpha,
        # so this one is a full-bleed square.
        ("favicon-180.png", 180, False),
    ]:
        path = os.path.join(PUBLIC, name)
        tile(size, rounded, anvil).save(path)
        print(f"  {name:18} {os.path.getsize(path):>6} bytes")

    ico = os.path.join(APP, "favicon.ico")
    tile(48, True, anvil).save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  favicon.ico        {os.path.getsize(ico):>6} bytes  (16, 32, 48)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
