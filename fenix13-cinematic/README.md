# FENIX /13 — cinematic 3D edition (V7)

60 seconds · 1080 × 1920 · 60 fps · Remotion + React Three Fiber + Three.js.

The returning phoenix is now an articulated three-dimensional sculpture. Its
layered feather meshes have cambered vanes, thickness, engraved surface detail,
copper/ivory materials and moving studio reflections. A slow banking approach,
shoulder strokes and folding wings lead into the existing letter-by-letter
FENIX /13 reveal and prepared brand crest.

The earlier flat BBQ and avatar drawings are replaced by original dimensional
grill and lounge objects: black metal, copper rims, luminous coals, glassware,
architectural rings and a macro view of the phoenix. These are stylized CGI
objects, not footage or photographs. The original geographic opening is kept.

## Run and edit

```sh
npm ci
npm run studio
npm run check
npm run score
npm run stills
npm run render
npm run verify
```

Node 24, Chromium and FFmpeg are needed. The score generator additionally uses
Python 3 and NumPy. Set `REMOTION_BROWSER_EXECUTABLE` if Chromium is elsewhere.
The renderer uses SwiftShader for 3D segments and the normal compositor for
vector scenes, then joins identical-format 60 fps streams and encodes the master
WAV once. It does not interpolate a lower-frame-rate export.

- `src/Cinema3D.tsx`: editable feather geometry, body, wings, materials, lighting,
  studio environment, grill and lounge models.
- `src/Phoenix.tsx`: exact crop intervals from the prepared brand image, sequential
  glyph timing, light-point merge and readable final card.
- `src/PhoenixFilm.tsx`: script, scenes and typography.
- `src/Atlas.tsx` and `src/geodata.json`: globe and regional locator maps.
- `scripts/score60.py`: original music, electric piano, bass, beats and tonal SFX.
- `scripts/render.mjs`: final film, stills and optional internal review render.
- `scripts/verify.py`: full-file technical QA.

The source bundle contains every runtime asset. No online font, image, audio,
map, environment texture, or model fetch is required when rendering.

The brand image is the prepared reconstruction used in V5/V6, not the original
downloadable logo artwork. The user supplied no new bird reference file during
this revision; the existing phoenix identity guided the new sculpture.

Internal `--draft` / `--ident-proof` exports are 30 fps review copies; final
delivery is always 60 fps. See `QUALITY_REPORT.json` for the verified final file.
