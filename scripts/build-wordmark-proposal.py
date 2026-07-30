#!/usr/bin/env python3
"""
Builds a PROPOSAL wordmark: the AI-anvil glyph standing in for the letters "AI"
inside the BYU Marriott / AI Foundry co-brand lockup.

    pip3 install --user Pillow
    python3 scripts/build-wordmark-proposal.py <glyph.png> <lockup.png>

Scott's idea, 2026-07-29: if the mark reads as "AI" then it can BE the "AI" in
the wordmark, and the program stops needing a separate logo beside the lockup.

## How the substitution works

The lockup arrives as flat raster on white, but its structure is recoverable
because the "AI" is the only ORANGE thing in it. Selecting by colour finds the
two letters exactly, with no guessing at crop boxes. Measured on the supplied
file, at 3687x900:

    192 .. 2086   BYU MARRIOTT / SCHOOL OF BUSINESS
    2219 .. 2223  the divider rule
    2351 .. 2520  the orange "AI"        <- replaced
    2606 .. 3496  FOUNDRY
    gap AI to FOUNDRY: 86px              <- preserved

So this keeps everything left of the "AI" untouched, drops the glyph in at the
same cap height and baseline, and slides FOUNDRY right by exactly the width the
glyph gained. The word space, the divider spacing and the right margin all stay
what BYU Marriott set them to. Nothing is re-typeset and no letterform is
redrawn.

## Compliance, read this before shipping anything it makes

This produces a DERIVATIVE of an approved co-brand lockup. BYU's rule is that
the lockup comes from BYU Marriott Marketing and you never make your own
version, which is exactly the rule that ruled out the old af-* Block Y mark.
Substituting a glyph for two letters is a smaller change than redrawing a mark,
but it is still a change to an approved asset.

Treat the output as a proposal to show Scott and then take to Marriott
Marketing. It is deliberately written outside public/ so it cannot be served or
deployed by accident.
"""

import os
import sys

from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "_brand-src", "proposed")

NAVY = (0, 46, 93)
ORANGE = (209, 65, 36)


def orange_box(im):
    """Find the orange "AI" by colour. Red dominant, green mid, blue low."""
    px = im.convert("RGB").load()
    w, h = im.size
    xs, ys = [], []
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r > 150 and 40 < g < 120 and b < 90:
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit("No orange found. Is this the right lockup file?")
    return min(xs), min(ys), max(xs), max(ys)


def ink_runs(im, gap=40):
    """Column ranges holding ink, merged across letter spacing into words."""
    px = im.convert("RGB").load()
    w, h = im.size
    cols = []
    for x in range(w):
        for y in range(h):
            if min(px[x, y]) < 235:
                cols.append(x)
                break
    runs = []
    for x in cols:
        if runs and x - runs[-1][1] <= gap:
            runs[-1][1] = x
        else:
            runs.append([x, x])
    return runs


def knockout(im):
    """White background to transparent, alpha from the darkest channel so the
    navy, the orange and the grey keep their relative weight."""
    im = im.convert("RGBA")
    w, h = im.size
    src, out = im.load(), Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            dst[x, y] = (r, g, b, int((255 - min(r, g, b)) * (a / 255)))
    return out


def solid(im, rgb):
    """Single-colour reversal. The gamma evens out inks of differing lightness,
    otherwise the orange reads translucent beside the navy."""
    im = im.convert("RGBA")
    w, h = im.size
    src, out = im.load(), Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            dst[x, y] = (*rgb, int(255 * ((src[x, y][3] / 255) ** 0.6)))
    return out


def tint(glyph, rgb):
    """Recolour the glyph, preserving its alpha. Shape is never touched."""
    glyph = glyph.convert("RGBA")
    w, h = glyph.size
    src, out = glyph.load(), Image.new("RGBA", (w, h))
    dst = out.load()
    for y in range(h):
        for x in range(w):
            dst[x, y] = (*rgb, src[x, y][3])
    return out


def compose(lockup, glyph, glyph_rgb, scale=1.0):
    """Swap the glyph in for the orange AI, sliding FOUNDRY to keep the gap.

    `scale` multiplies the glyph's cap height, for trying it slightly larger
    than the letters it replaces. 1.0 means exactly cap height.
    """
    ai_l, ai_t, ai_r, ai_b = orange_box(lockup)
    ai_w, ai_h = ai_r - ai_l + 1, ai_b - ai_t + 1

    runs = ink_runs(lockup)
    foundry = next(r for r in runs if r[0] > ai_r)
    f_l, f_r = foundry
    word_gap = f_l - ai_r - 1
    right_margin = lockup.size[0] - f_r - 1

    g = glyph.convert("RGBA")
    g = g.crop(g.getbbox())
    new_h = int(round(ai_h * scale))
    new_w = int(round(g.size[0] * new_h / g.size[1]))
    g = tint(g.resize((new_w, new_h), Image.LANCZOS), glyph_rgb)

    # vertical centre on the AI it replaces, so the optical baseline holds
    g_top = ai_t + (ai_h - new_h) // 2

    total_w = ai_l + new_w + word_gap + (f_r - f_l + 1) + right_margin
    canvas = Image.new("RGBA", (total_w, lockup.size[1]), (255, 255, 255, 255))

    # everything up to the AI, untouched
    canvas.paste(lockup.convert("RGBA").crop((0, 0, ai_l, lockup.size[1])), (0, 0))
    # FOUNDRY, slid right by whatever width the glyph gained
    canvas.paste(
        lockup.convert("RGBA").crop((f_l, 0, f_r + 1, lockup.size[1])),
        (ai_l + new_w + word_gap, 0),
    )
    canvas.alpha_composite(g, (ai_l, g_top))
    return canvas, dict(ai=(ai_l, ai_t, ai_w, ai_h), glyph=(new_w, new_h),
                        gap=word_gap, width=total_w)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 2
    os.makedirs(OUT, exist_ok=True)
    glyph = Image.open(sys.argv[1])
    lockup = Image.open(sys.argv[2])

    for label, rgb, scale in [
        ("orange", ORANGE, 1.0),
        ("orange-large", ORANGE, 1.18),
        ("navy", NAVY, 1.0),
    ]:
        flat, info = compose(lockup, glyph, rgb, scale)
        base = f"wordmark-{label}"
        colour = knockout(flat)
        colour.save(os.path.join(OUT, f"{base}.png"))
        solid(colour, (255, 255, 255)).save(os.path.join(OUT, f"{base}-white.png"))
        solid(colour, NAVY).save(os.path.join(OUT, f"{base}-navy.png"))
        print(f"{base:22} glyph {info['glyph'][0]}x{info['glyph'][1]}"
              f"  replaced AI {info['ai'][2]}x{info['ai'][3]}"
              f"  total width {info['width']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
