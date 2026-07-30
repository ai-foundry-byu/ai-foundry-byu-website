#!/usr/bin/env python3
"""
Mockups for two pieces of feedback on the wordmark, 2026-07-29.

    python3 scripts/build-glyph-variants.py

1. "The thickness of the letters in the anvil make FOUNDRY look too skinny.
    If we could bold that font just a tad."
2. "Not sold on the round part of the A. Everything else is angular."

## The round part

Measured off the source glyph rather than guessed. The notch is not an enclosed
hole, it is an open bite in the bottom edge: a circle centred at (196, 342) with
radius about 60, running past the baseline at y=388 so it reads as a bite rather
than a hole. Traced row by row, widest at y=341 spanning x 137 to 255.

Every replacement occupies that same footprint, so the A's legs, its weight and
its baseline are untouched. Only the shape of the void changes.

    circle     the original, for comparison
    triangle   apex up, echoing the A's own counter directly above it
    diamond    apex up, widest at the circle's widest row, truncated by baseline
    none       no notch, solid base

## Bolding FOUNDRY

There is no font file here, only flat raster, so FOUNDRY cannot be re-set at a
heavier weight. What is possible is dilation: growing the letterforms outward by
a pixel or two, which thickens the strokes.

This is an approximation and it is worth knowing how it differs from real
bolding. A true bold is drawn, so counters stay open and corners stay sharp.
Dilation grows every edge equally, so counters tighten slightly and sharp corners
round by the dilation radius. At the sizes here that is subtle, but it is why
this is a mockup for judging the WEIGHT rather than a final asset. If the weight
is right, the real fix is to ask BYU Marriott Marketing for the lockup with
FOUNDRY set one weight heavier.

Only FOUNDRY is dilated. The BYU MARRIOTT block is untouched.
"""

import os

from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "_brand-src", "variants")

# measured, see the docstring
CIRCLE_CX, CIRCLE_CY, CIRCLE_R = 196, 342, 60
NOTCH_TOP = 284
NOTCH_L, NOTCH_R = 137, 255


def glyph_variants(src):
    """Return {name: RGBA glyph} with the round notch replaced by angular ones."""
    g = src.convert("RGBA")
    g = g.crop(g.getbbox())
    W, H = g.size
    base = H - 1

    def filled():
        """The glyph with the notch filled in, as the base for recutting."""
        out = g.copy()
        d = ImageDraw.Draw(out)
        # Paint the void solid. Force alpha 255: sampling a pixel at
        # alpha > 200 can land on an antialiased edge, and filling with a
        # partially transparent ink leaves a visible ghost disc.
        px = g.load()
        r_, g_, b_, _ = next(
            px[x, y] for y in range(H) for x in range(W) if px[x, y][3] == 255
        )
        ink = (r_, g_, b_, 255)
        d.ellipse(
            [CIRCLE_CX - CIRCLE_R - 2, CIRCLE_CY - CIRCLE_R - 2,
             CIRCLE_CX + CIRCLE_R + 2, CIRCLE_CY + CIRCLE_R + 2],
            fill=ink,
        )
        return out, ink

    solid, ink = filled()
    clear = (0, 0, 0, 0)

    out = {"circle": g}

    # no notch at all
    out["none"] = solid.copy()

    # triangle, apex up: the same move the A's counter above it makes
    tri = solid.copy()
    ImageDraw.Draw(tri).polygon(
        [(CIRCLE_CX, NOTCH_TOP), (NOTCH_R, base + 2), (NOTCH_L, base + 2)],
        fill=clear,
    )
    out["triangle"] = tri

    # diamond, apex up, widest where the circle was widest, cut off by baseline
    dia = solid.copy()
    ImageDraw.Draw(dia).polygon(
        [(CIRCLE_CX, NOTCH_TOP),
         (NOTCH_R, CIRCLE_CY),
         (CIRCLE_CX + 26, base + 2),
         (CIRCLE_CX - 26, base + 2),
         (NOTCH_L, CIRCLE_CY)],
        fill=clear,
    )
    out["diamond"] = dia
    return out


def bolden(lockup, foundry_x0, passes):
    """Dilate only the FOUNDRY portion of the lockup.

    Works on the alpha channel so it thickens the letterforms without touching
    colour. MaxFilter grows the opaque area by one pixel per pass in every
    direction, so one pass is about two pixels of added stroke width.
    """
    im = lockup.convert("RGBA")
    left = im.crop((0, 0, foundry_x0, im.height))
    right = im.crop((foundry_x0, 0, im.width, im.height))
    r, g, b, a = right.split()
    for _ in range(passes):
        a = a.filter(ImageFilter.MaxFilter(3))
    right = Image.merge("RGBA", (r, g, b, a))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(left, (0, 0))
    out.paste(right, (foundry_x0, 0))
    return out


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    src = Image.open(os.path.join(HERE, "..", "_brand-src", "ai-anvil-glyph-source.png"))
    for name, im in glyph_variants(src).items():
        p = os.path.join(OUT, f"glyph-{name}.png")
        im.save(p)
        print(f"  glyph-{name}.png  {im.size[0]}x{im.size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
