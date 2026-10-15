"""Convert the OFL Syne outlines to native Three geometry; union contours first."""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.ttLib.removeOverlaps import removeOverlaps

root = Path(__file__).resolve().parent.parent
font = TTFont(root / 'public/fonts/syne-latin-800-normal.woff2')
chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/13 .?'
cmap = font.getBestCmap()
removeOverlaps(font, glyphNames=list({cmap[ord(c)] for c in chars}))
gs = font.getGlyphSet()

class Pen(BasePen):
    def __init__(self):
        super().__init__(gs)
        self.cmds = []
        self.first = None
    def xy(self, p): return f'{p[0]:.3f} {p[1]:.3f}'
    def _moveTo(self, p):
        self.first = p
        self.cmds.append('m ' + self.xy(p))
    def _lineTo(self, p): self.cmds.append('l ' + self.xy(p))
    def _qCurveToOne(self, c, p): self.cmds.append('q ' + self.xy(p) + ' ' + self.xy(c))
    def _curveToOne(self, a, b, p): self.cmds.append('b ' + self.xy(p) + ' ' + self.xy(a) + ' ' + self.xy(b))
    def _closePath(self):
        if self.first: self._lineTo(self.first)
    def _endPath(self): pass

glyphs = {}
for c in chars:
    name = cmap[ord(c)]
    pen = Pen()
    gs[name].draw(pen)
    glyphs[c] = dict(ha=font['hmtx'][name][0], x_min=0,
                    x_max=font['hmtx'][name][0], o=' '.join(pen.cmds))
result = dict(glyphs=glyphs, familyName='Syne ExtraBold', resolution=font['head'].unitsPerEm,
              boundingBox=dict(yMin=font['head'].yMin, yMax=font['head'].yMax), underlineThickness=50)
(root/'src/typeface.json').write_text(json.dumps(result, separators=(',', ':')))
print('Syne native 3D typeface created, 32 glyphs, overlapping outlines resolved.')
