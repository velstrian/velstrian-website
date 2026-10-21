"""build-serif.py - the recipe for Assets/fonts/VelstrianDocumentSerif-400.woff2.

R285-WEB-ENTERPRISE-REDESIGN-01, strategy section 9 point 3: Source Serif 4 is the
document voice, used only for quoted tender and evidence text.

RUN BY HAND, NEVER BY THE BUILD (like build-fonts.py). Needs Python and fontTools
with brotli. Input is the official Adobe release, 4.005R,
source-serif-4.005_WOFF2.zip, VAR/SourceSerif4Variable-Roman.ttf.woff2 (426,716 B).

    python astro/scripts/build-serif.py <SourceSerif4Variable-Roman.ttf.woff2> Assets/fonts/VelstrianDocumentSerif-400.woff2

What it does, and why:
  1. Pins wght 400 and opsz 20. The page uses one weight at reading size, so a
     static instance is the smallest file that paints it.
  2. Subsets to exactly the unicode-range every face in fonts.css declares, which
     check-font-coverage.js requires to read identically across faces.
  3. RENAMES the family to Velstrian Document Serif. The SIL OFL lets Adobe
     reserve the font name 'Source', and a subset is a Modified Version, so a
     modified copy may not carry the reserved name. The licence is kept beside
     the file as Assets/fonts/SourceSerif4-OFL-LICENSE.md.
Measured output 2026-10-21: 18,244 B.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
src, out = sys.argv[1], sys.argv[2]
f = TTFont(src)
print('axes', [(a.axisTag,a.minValue,a.defaultValue,a.maxValue) for a in f['fvar'].axes])
f = instancer.instantiateVariableFont(f, {'wght':400, 'opsz':20})
# OFL Reserved Font Name 'Source': a subset is a Modified Version, so rename.
NEW = 'Velstrian Document Serif'
name = f['name']
for rec in list(name.names):
    if rec.nameID in (1,4,16,21):
        name.setName(NEW, rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    elif rec.nameID == 6:
        name.setName('VelstrianDocumentSerif-Regular', rec.nameID, rec.platformID, rec.platEncID, rec.langID)
    elif rec.nameID == 3:
        name.setName('VelstrianDocumentSerif-Regular;derived from Source Serif 4 4.005', rec.nameID, rec.platformID, rec.platEncID, rec.langID)
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['kern','liga','calt','onum','pnum','lnum','tnum']
opts.name_IDs = ['*']; opts.name_languages=['*']
opts.notdef_outline = True
opts.hinting = False
opts.desubroutinize = True
unicodes=[]
for t in 'U+0000-00FF, U+0102, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0300-0304, U+0308, U+0309, U+0323, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'.split(','):
    t=t.strip()[2:]
    a,_,b=t.partition('-')
    unicodes+=list(range(int(a,16),int(b or a,16)+1))
s = subset.Subsetter(opts); s.populate(unicodes=unicodes); s.subset(f)
f.flavor='woff2'; f.save(out)
import os; print(out, os.path.getsize(out))
