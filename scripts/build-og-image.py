#!/usr/bin/env python3
"""
Builds public/og-image.png, the 1200x630 card shown when the site is shared.

    python3 scripts/build-og-image.py

Navy field, the white-reversed wordmark centred on it. Uses the same asset the
header uses, so a shared link and the site itself carry the same mark. The old
one predated the glyph and still showed the lettered "AI".

1200x630 is the size Open Graph consumers crop to. Keep the wordmark inside
about 70 percent of the width: Slack, LinkedIn and iMessage all crop the edges
differently and a mark that touches the sides loses its ends in at least one of
them.
"""
import os
from PIL import Image

HERE = os.path.dirname(__file__)
PUBLIC = os.path.join(HERE, "..", "public")
NAVY = (0, 46, 93, 255)
W, H = 1200, 630
SAFE = 0.70

def main() -> int:
    mark = Image.open(os.path.join(PUBLIC, "brand", "wordmark-glyph-white.png")).convert("RGBA")
    mark = mark.crop(mark.getbbox())
    target_w = int(W * SAFE)
    mark = mark.resize((target_w, round(mark.height * target_w / mark.width)), Image.LANCZOS)
    card = Image.new("RGBA", (W, H), NAVY)
    card.alpha_composite(mark, ((W - mark.width) // 2, (H - mark.height) // 2))
    out = os.path.join(PUBLIC, "og-image.png")
    card.convert("RGB").save(out, optimize=True)
    print(f"  og-image.png  {W}x{H}  wordmark {mark.width}x{mark.height}  "
          f"{os.path.getsize(out)/1024:.0f} KB")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
