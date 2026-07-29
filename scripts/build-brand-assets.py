#!/usr/bin/env python3
"""
Builds the brand assets in public/brand/ from the two source files.

Run it when a source file changes:

    pip3 install --user Pillow
    python3 scripts/build-brand-assets.py <lockup.png> <anvil.png>

Sources are the official co-brand lockup (BYU Marriott School of Business |
AI Foundry) and the official anvil mark. They arrive as flat artwork: the
lockup on a solid white background with no alpha, the anvil as a small shape
adrift on a 1024 square canvas.

Four files come out:

    lockup.png         full colour, background knocked out, for light surfaces
    lockup-white.png   white reversal, for navy surfaces
    anvil.png          full colour, trimmed
    anvil-white.png    white reversal, trimmed

This recolours and trims. It never redraws. BYU's rule is "never create your
own version" of the logo, and a single-colour white reversal is the sanctioned
treatment for a mark on a dark surface, since marks appear in navy or white
only. Every letterform here is the one that arrived in the source file.
"""

import os
import sys

from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "brand")


def knockout(im: Image.Image) -> Image.Image:
    """White background to transparent.

    Alpha is measured on the darkest channel rather than on luminance, so the
    navy, the orange and the grey keep their relative weight instead of the
    lighter inks dissolving.
    """
    im = im.convert("RGBA")
    w, h = im.size
    src, out = im.load(), Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            dst[x, y] = (r, g, b, int((255 - min(r, g, b)) * (a / 255)))
    return out


def to_white(im: Image.Image) -> Image.Image:
    """White reversal for dark surfaces.

    The gamma matters. Orange is a lighter ink than navy, so a straight alpha
    copy renders the "AI" visibly translucent next to "FOUNDRY", which the
    original lockup does not do. Lifting the mid alphas evens the two words
    out, and 0 stays 0 so the edges stay clean.
    """
    im = im.convert("RGBA")
    w, h = im.size
    src, out = im.load(), Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            dst[x, y] = (255, 255, 255, int(255 * ((src[x, y][3] / 255) ** 0.6)))
    return out


def trim(im: Image.Image) -> Image.Image:
    return im.crop(im.getbbox())


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    os.makedirs(OUT, exist_ok=True)
    for source, stem, needs_knockout in [
        (sys.argv[1], "lockup", True),
        (sys.argv[2], "anvil", False),
    ]:
        im = Image.open(source).convert("RGBA")
        im = trim(knockout(im) if needs_knockout else im)
        im.save(os.path.join(OUT, f"{stem}.png"))
        to_white(im).save(os.path.join(OUT, f"{stem}-white.png"))
        print(f"{stem:8} {im.size[0]}x{im.size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
