"""Convert the bundled Montserrat font's actual outlines to Three.js typeface data."""
from pathlib import Path
import json
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.ttLib.removeOverlaps import removeOverlaps

root = Path(__file__).resolve().parent
font = TTFont(root.parent / 'fonts/montserrat-latin-900-normal.woff2')
removeOverlaps(font, glyphNames=list({font.getBestCmap()[ord(c)] for c in 'FENIX/13 ?'}))
glyph_set = font.getGlyphSet()


class ThreePen(BasePen):
    def __init__(self, gs):
        super().__init__(gs)
        self.commands = []
        self.first = None

    def xy(self, p):
        return f'{p[0]:.3f} {p[1]:.3f}'

    def _moveTo(self, p):
        self.first = p
        self.commands.append('m ' + self.xy(p))

    def _lineTo(self, p):
        self.commands.append('l ' + self.xy(p))

    def _qCurveToOne(self, control, end):
        self.commands.append('q ' + self.xy(end) + ' ' + self.xy(control))

    def _curveToOne(self, a, b, end):
        self.commands.append('b ' + self.xy(end) + ' ' + self.xy(a) + ' ' + self.xy(b))

    def _closePath(self):
        if self.first:
            self.commands.append('l ' + self.xy(self.first))

    def _endPath(self):
        pass


cmap = font.getBestCmap()
glyphs = {}
for char in 'FENIX/13 ?':
    name = cmap.get(ord(char), cmap[ord('?')])
    pen = ThreePen(glyph_set)
    glyph_set[name].draw(pen)
    glyphs[char] = {'ha': font['hmtx'][name][0], 'x_min': 0,
                    'x_max': font['hmtx'][name][0], 'o': ' '.join(pen.commands)}
result = {'glyphs': glyphs, 'familyName': 'Montserrat Black',
          'resolution': font['head'].unitsPerEm,
          'boundingBox': {'yMin': font['head'].yMin, 'yMax': font['head'].yMax},
          'underlineThickness': 50}
(root / 'montserrat.typeface.json').write_text(json.dumps(result, separators=(',', ':')))
print('Bundled Montserrat outlines converted for real extruded 3D lettering.')
