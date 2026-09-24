"""Build the self-hosted, subsetted woff2 fonts for pablogsal.com.

Inputs (downloaded from Google Fonts / google/fonts on GitHub):
  JetBrainsMono[wght].ttf  (variable, instanced to wght 400..700)
  Jacquard24-Regular.ttf, Silkscreen-Regular.ttf
Outputs: public/fonts/*.woff2 and prints the @font-face CSS.

Each family gets a "main" file (ASCII + Latin-1 + the extra symbols the site
uses) and an "-ext" file (Latin Extended A/B/Additional, punctuation, arrows,
box drawing) that the browser downloads only if the page uses one of those
characters (unicode-range).
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import subset as S
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

used_json, outdir = sys.argv[1], sys.argv[2]
main, ext = S.charset(used_json)
os.makedirs(outdir, exist_ok=True)

v = instancer.instantiateVariableFont(TTFont('jbm-var.ttf'), {'wght': (400, 700)})
v.save('jbm-400-700.ttf')

ascii_ = list(range(0x20, 0x7F))
latin1 = [c for c in main if c >= 0x7F]
fams = [
    # family, css weight, source, [(suffix, codepoints)]
    # TT hinting is kept everywhere: Chrome on Linux and Windows uses it, and
    # dropping it changes glyph edges and advance widths of the pixel fonts.
    ('JetBrains Mono', '400 700', 'jbm-400-700.ttf', 'jetbrains-mono', [('', main), ('-ext', ext)]),
    # Jacquard 24 is heavily hinted (~180 B per glyph) and only renders titles,
    # which are ASCII today: split Latin-1 out so it downloads only if needed.
    ('Jacquard 24', '400', 'jVyO7nf_B2zO5jVpUGU8lgQE.ttf', 'jacquard-24', [('', ascii_), ('-latin1', latin1), ('-ext', ext)]),
    ('Silkscreen', '400', 'm8JXjfVPf62XiF7kO-i9ULQ.ttf', 'silkscreen', [('', main), ('-ext', ext)]),
]
css = []
for fam, wght, src, base, parts in fams:
    for suffix, cps in parts:
        dst = os.path.join(outdir, f'{base}{suffix}.woff2')
        got = S.make(src, dst, cps, True)
        if not got:
            continue
        print(f'{dst}: {os.path.getsize(dst)} bytes, {len(got)} chars', file=sys.stderr)
        css.append(f'''@font-face {{
  font-family: "{fam}";
  font-style: normal;
  font-weight: {wght};
  font-display: swap;
  src: url("/fonts/{base}{suffix}.woff2") format("woff2");
  unicode-range: {S.ranges(got)};
}}''')
print("\n".join(css))
