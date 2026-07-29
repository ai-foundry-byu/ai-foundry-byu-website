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

Out come the rasters:

    lockup.png         full colour, background knocked out, for light surfaces
    lockup-white.png   white reversal, for navy surfaces
    lockup-navy.png    all-navy reversal, for white surfaces
    anvil.png          full colour, trimmed
    anvil-white.png    white reversal, trimmed
    anvil-navy.png     all-navy reversal

and, for the anvil only, vectors traced from the raster:

    anvil.svg          navy, for light surfaces
    anvil-white.svg    white, for navy surfaces
    anvil-black.svg    black, matches the source

The SVGs are a TRACE of a 290x181 bitmap, not the original vector artwork.
They are clean enough for screen and for large print, but if the anvil is
going on anything where the true outline matters, get the real vector from
whoever drew it. Tracing cannot recover precision the source never had.

This recolours and trims. It never redraws. BYU's rule is "never create your
own version" of the logo, and a single-colour white reversal is the sanctioned
treatment for a mark on a dark surface, since marks appear in navy or white
only. Every letterform here is the one that arrived in the source file.
"""

import os
import sys

from PIL import Image

try:
    import numpy as np
    import potrace  # the pure-Python "potracer" package
except ImportError:  # tracing is optional, the rasters still build
    np = potrace = None

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


def to_solid(im: Image.Image, rgb: tuple) -> Image.Image:
    """Single-colour reversal.

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
            dst[x, y] = (*rgb, int(255 * ((src[x, y][3] / 255) ** 0.6)))
    return out


def to_white(im: Image.Image) -> Image.Image:
    """White reversal for dark surfaces.

    The gamma matters. Orange is a lighter ink than navy, so a straight alpha
    copy renders the "AI" visibly translucent next to "FOUNDRY", which the
    original lockup does not do. Lifting the mid alphas evens the two words
    out, and 0 stays 0 so the edges stay clean.
    """
    return to_solid(im, (255, 255, 255))


def trim(im: Image.Image) -> Image.Image:
    return im.crop(im.getbbox())


def trace_svg(im: Image.Image, stem: str) -> None:
    """Trace the alpha channel to SVG, at the source resolution.

    Do not upsample first. This mark is hard-edged geometry, and tracing an
    interpolated upsample reproduces the interpolation wobble as hundreds of
    extra segments: 20748 characters of path data against 1639 for the same
    shape traced at 1x.

    potracer treats FALSE as the shape, the opposite of the obvious reading.
    Verified by rendering all four polarity and fill-rule combinations against
    the source PNG; only the inverted mask reproduces it.
    """
    if potrace is None:
        print("  (skipped SVG: pip3 install --user numpy potracer)")
        return
    w, h = im.size
    alpha = np.array(im.convert("RGBA"))[:, :, 3]
    path = potrace.Bitmap(alpha <= 128).trace(
        turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2
    )

    def pt(p):
        return f"{p.x:.2f} {p.y:.2f}"

    d = []
    for curve in path:
        d.append(f"M{pt(curve.start_point)}")
        for seg in curve:
            d.append(
                f"L{pt(seg.c)}L{pt(seg.end_point)}"
                if seg.is_corner
                else f"C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}"
            )
        d.append("Z")
    d = "".join(d)

    tpl = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        'role="img" aria-label="AI Foundry anvil">'
        "<title>AI Foundry anvil</title>"
        '<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>\n'
    )
    for suffix, fill in [("", "#002E5D"), ("-white", "#FFFFFF"), ("-black", "#000000")]:
        with open(os.path.join(OUT, f"{stem}{suffix}.svg"), "w") as fh:
            fh.write(tpl.format(w=w, h=h, fill=fill, d=d))
    print(f"  {stem}.svg + 2 variants, {len(d)} chars of path data")


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
        # All-navy, for placing on white. Distinct from the full-colour file
        # above, which keeps the orange "AI". BYU allows navy or white, so both
        # the navy reversal and the original colourway are legal on a light
        # surface; which one to use is a design call, not a compliance one.
        to_solid(im, (0, 46, 93)).save(os.path.join(OUT, f"{stem}-navy.png"))
        print(f"{stem:8} {im.size[0]}x{im.size[1]}")
        # Only the anvil gets vectorised. The lockup is type, and tracing type
        # produces outlines that are not the typeface: ask BYU Marriott
        # Marketing for the real EPS or SVG instead.
        if stem == "anvil":
            trace_svg(im, stem)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
