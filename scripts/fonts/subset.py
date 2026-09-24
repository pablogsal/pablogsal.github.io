import json, sys, os
from fontTools.ttLib import TTFont
from fontTools import subset

def charset(used_json):
    used = json.load(open(used_json))
    chars = set()
    for v in used.values(): chars |= set(v)
    chars |= set(chr(c) for c in range(0x20, 0x7F))
    chars |= set(chr(c) for c in range(0xA0, 0x100))
    chars |= set("·→←↑↓↗↘★■^~łŁáéíóúñü–—‘’‚“”„•…′″€™ćč")
    chars -= {"\n"}
    main = sorted(ord(c) for c in chars)
    ext = sorted((set(range(0x100, 0x250)) | set(range(0x1E00, 0x1F00)) | set(range(0x2000, 0x2070))
                  | set(range(0x20A0, 0x20D0)) | set(range(0x2100, 0x2200)) | set(range(0x2500, 0x2600))) - set(main))
    return main, ext

def ranges(cps):
    out, start, prev = [], None, None
    for c in cps:
        if start is None: start = prev = c; continue
        if c == prev + 1: prev = c; continue
        out.append((start, prev)); start = prev = c
    if start is not None: out.append((start, prev))
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in out)

def make(src, dst, cps, hinting=False):
    font = TTFont(src)
    cmap = font.getBestCmap()
    cps = [c for c in cps if c in cmap]
    if not cps: return []
    o = subset.Options()
    o.flavor = 'woff2'
    o.layout_features = o.layout_features + ['tnum']
    o.name_IDs = [1, 2]
    o.name_languages = [0x409]
    o.notdef_outline = True
    o.hinting = hinting
    s = subset.Subsetter(o)
    s.populate(unicodes=cps)
    s.subset(font)
    font.flavor = 'woff2'
    font.save(dst)
    return cps
