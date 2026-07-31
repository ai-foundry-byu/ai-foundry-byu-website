#!/usr/bin/env python3
"""
Second pass on the wordmark, against Scott's 2026-07-30 note.

    python3 scripts/build-glyph-pass2.py

Scott asked for four things:

    1. file down rough edges (the ones Enoch raised, which I have not seen)
    2. finesse it, make it cleaner
    3. draw out the AI-and-anvil double read a little more
    4. get the thicknesses right to gently move into the FOUNDRY font

(1) and (2) are served by the two measured defects below, which are objective
and fixable without design judgement. (4) is served by the weight variants.
(3) is genuinely judgement work and is left for the designer Enoch is bringing
in; what this produces for that is the measurement sheet in docs/, not an edit.

## Two defects found in the shipped asset

Both are real, both are in public/brand/wordmark-glyph-white.png today.

**The glyph never reaches full opacity.** Peak alpha across the glyph is 232 and
not one pixel hits 255, while the BYU block and FOUNDRY both hit 255 across tens
of thousands of pixels. So on navy the glyph composites to rgb(232,236,240), a
pale blue-grey, while the type beside it renders pure white. The mark is
visibly greyer than the word it belongs to.

This one interacts with Scott's thickness note in a way worth knowing before
anyone edits anything. The glyph is currently heavier in stroke but lighter in
colour, and those two errors partly cancel. Fix the opacity alone and the glyph
jumps to full white, which makes it look heavier still and makes Scott's
complaint worse. The opacity fix and the weight fix have to land together.

**A two-pixel orphan speck** sits detached at x2159, y262-263, alpha 141 and
176, floating just off the glyph's left leg. Invisible at display size, but it
is loose dirt in the artwork and it belongs in the bin.

## The thickness gap, measured

Modal stroke width across the live lockup, sampled by run length so stems
dominate the count:

    BYU MARRIOTT          38px
    AI glyph              41px
    FOUNDRY               29px
    SCHOOL OF BUSINESS    22px

So the glyph runs 1.41x FOUNDRY's stem. That is the jump Scott is feeling, and
it matters more than a normal logo-beside-type mismatch because the glyph is not
sitting next to the word, it IS the "AI" in "AI FOUNDRY". One phrase is
currently set in two different weights.

Closing it from one side only is wrong in both directions. Bolding FOUNDRY all
the way to 41px pushes it past BYU MARRIOTT at 38px, so the program would
out-weigh the school it belongs to. Thinning the glyph all the way to 29px
strips the mass the anvil needs to survive at small sizes.

So these variants close it from both sides and deliberately stop short of
parity. A solid mark reads optically heavier than a letterform measuring the
same, because the letterform is broken up by its counters, so the glyph should
sit a little above FOUNDRY on the ruler in order to look equal to it on the page.

## How the weights are faked, and why that limits them

There is no font file and no vector master here, only flat raster. So:

    FOUNDRY heavier   dilate the alpha (MaxFilter), growing the letterforms out
    glyph lighter     erode the alpha (MinFilter) at source resolution, then
                      scale back into the same box so the mark does not shrink

Both approximate drawing. A real weight change is redrawn: counters stay open,
corners stay sharp. Dilation and erosion move every edge at once, so corners
round by the filter radius and counters tighten or open by the same amount.

Good enough to judge WEIGHT and pick a target. Not final artwork. The ratio each
variant is labelled with is the number to hit; the designer should hit it by
drawing, not by filtering.
"""

import os
from collections import Counter

from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "..", "_brand-src")
OUT = os.path.join(SRC, "pass2")

# Measured off public/brand/wordmark-glyph-white.png, 3407x360, scanning at
# alpha > 8 rather than > 128. The divider between the two halves is a
# semi-transparent rule (peak alpha 57) at x 2026-2031, so a scan at the usual
# 128 threshold reports it as empty and puts the glyph's left edge 41px too far
# right, which clips its leg.
GLYPH_BOX = (2161, 82, 2430, 278)  # where the glyph sits in the lockup
GLYPH_CUT = (2100, 2470)  # empty gutters either side, safe to repaint
FOUNDRY_X0 = 2516
SPECK = (2159, 262, 2160, 264)  # the orphan fragment, x0 y0 x1 y1

# Notch geometry, measured on the 535x391 source glyph in pass 1. The round
# part of the A is not an enclosed hole, it is an open bite in the bottom edge:
# a circle centred (196,342) radius 60, running past the baseline at y=388.
CIRCLE_CX, CIRCLE_CY, CIRCLE_R = 196, 342, 60
NOTCH_TOP = 284
NOTCH_L, NOTCH_R = 137, 255


def modal_stroke(im, x0, x1, y0, y1):
    """Most common run length in a band. Stems repeat, so they win the count."""
    px = im.convert("RGBA").load()
    c = Counter()
    for y in range(y0, y1):
        run = 0
        for x in range(x0, x1):
            if px[x, y][3] > 128:
                run += 1
            else:
                if run >= 8:
                    c[run] += 1
                run = 0
        if run >= 8:
            c[run] += 1
    return c.most_common(1)[0][0] if c else None


def dilate(im, passes):
    r, g, b, a = im.convert("RGBA").split()
    for _ in range(passes):
        a = a.filter(ImageFilter.MaxFilter(3))
    return Image.merge("RGBA", (r, g, b, a))


def normalise_alpha(im):
    """Push the solid interior to alpha 255 without hardening the edge ramp.

    A flat multiply by 255/peak scales the antialiased edge too, which fattens
    the outline by a fraction of a pixel. Scaling and clamping is the right
    shape: interior saturates at 255, the ramp keeps its gradient.
    """
    r, g, b, a = im.convert("RGBA").split()
    peak = a.getextrema()[1]
    if peak == 0 or peak == 255:
        return im
    a = a.point(lambda v: min(255, round(v * 255 / peak)))
    return Image.merge("RGBA", (r, g, b, a))


def recut_notch(glyph, shape):
    """Replace the round bite with an angular one, in the same footprint."""
    if shape == "circle":
        return glyph
    g = glyph.copy()
    W, H = g.size
    base = H - 1
    px = g.load()
    # Force alpha 255 when sampling ink: a pixel above 200 can land on an
    # antialiased edge, and filling with partial alpha leaves a ghost disc.
    opaque = [px[x, y] for y in range(H) for x in range(W) if px[x, y][3] == 255]
    ink = (opaque[0][0], opaque[0][1], opaque[0][2], 255) if opaque else (255, 255, 255, 255)
    d = ImageDraw.Draw(g)
    d.ellipse(
        [CIRCLE_CX - CIRCLE_R - 2, CIRCLE_CY - CIRCLE_R - 2,
         CIRCLE_CX + CIRCLE_R + 2, CIRCLE_CY + CIRCLE_R + 2],
        fill=ink,
    )
    clear = (0, 0, 0, 0)
    if shape == "triangle":
        d.polygon(
            [(CIRCLE_CX, NOTCH_TOP), (NOTCH_R, base + 2), (NOTCH_L, base + 2)],
            fill=clear,
        )
    elif shape == "diamond":
        d.polygon(
            [(CIRCLE_CX, NOTCH_TOP), (NOTCH_R, CIRCLE_CY),
             (CIRCLE_CX + 26, base + 2), (CIRCLE_CX - 26, base + 2),
             (NOTCH_L, CIRCLE_CY)],
            fill=clear,
        )
    return g


def build_glyph(shape, thin_passes):
    """Regenerate the lockup's glyph from the source art at full resolution.

    Working from the 535x391 source rather than the 269px copy already baked
    into the lockup means the notch recut and the thinning both happen before
    the downsample, so neither one compounds the lockup's own resampling.
    """
    g = Image.open(os.path.join(SRC, "ai-anvil-glyph-source.png")).convert("RGBA")
    g = g.crop(g.getbbox())
    # The source art is black on transparent; the lockup carries the white
    # reversal. Recolour every pixel to white and keep alpha, so the shape and
    # its antialiasing survive untouched.
    r, gr, b, a = g.split()
    white = Image.new("L", g.size, 255)
    g = Image.merge("RGBA", (white, white, white, a))
    g = recut_notch(g, shape)
    g = normalise_alpha(g)

    if thin_passes:
        w, h = g.size
        r, gr, b, a = g.split()
        for _ in range(thin_passes):
            a = a.filter(ImageFilter.MinFilter(3))
        thin = Image.merge("RGBA", (r, gr, b, a))
        box = thin.getbbox()
        if box:
            g = thin.crop(box).resize((w, h), Image.LANCZOS)

    x0, y0, x1, y1 = GLYPH_BOX
    return g.resize((x1 - x0, y1 - y0), Image.LANCZOS)


def rebuild(lockup, shape, thin_passes, foundry_passes, clean=True):
    im = lockup.convert("RGBA")
    W, H = im.size
    out = im.copy()

    if clean:
        # wipe the gutter and repaint the glyph, which also removes the speck
        out.paste(Image.new("RGBA", (GLYPH_CUT[1] - GLYPH_CUT[0], H), (0, 0, 0, 0)),
                  (GLYPH_CUT[0], 0))
        out.alpha_composite(build_glyph(shape, thin_passes), GLYPH_BOX[:2])

    if foundry_passes:
        f = im.crop((FOUNDRY_X0, 0, W, H))
        out.paste(dilate(f, foundry_passes), (FOUNDRY_X0, 0))
    return out


VARIANTS = [
    ("a-current",  None,       0, 0, "as shipped today, untouched"),
    ("b-cleaned",  "circle",   0, 0, "defects fixed only, weight unchanged"),
    ("c-weight",   "circle",   1, 1, "defects fixed, weights closed"),
    ("d-tri",      "triangle", 1, 1, "defects fixed, weights closed, angular notch"),
    ("e-tri-more", "triangle", 2, 1, "same, weights closed further"),
]


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    lockup = Image.open(
        os.path.join(HERE, "..", "public", "brand", "wordmark-glyph-white.png")
    ).convert("RGBA")

    print(f"{'variant':14} {'glyph':>6} {'FOUND':>6} {'ratio':>6} {'peakA':>6}   note")
    for name, shape, tp, fp, note in VARIANTS:
        im = rebuild(lockup, shape, tp, fp, clean=shape is not None)
        im.save(os.path.join(OUT, f"lockup-{name}.png"))
        g = modal_stroke(im, GLYPH_CUT[0], GLYPH_CUT[1], 60, 300)
        f = modal_stroke(im, FOUNDRY_X0, im.width, 60, 300)
        import numpy as np
        peak = np.array(im)[:, GLYPH_BOX[0]:GLYPH_BOX[2], 3].max()
        print(f"  {name:12} {g:>6} {f:>6} {g / f:>5.2f}x {peak:>6}   {note}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
