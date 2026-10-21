# FENIX /13 V12 — relaxed pacing and dimensional wordmark

42 seconds · 1080×1920 · native 30 fps · 1260 freshly rendered frames.

The map and shorter lifestyle sections have more time to read, the grill switches
shots through an 0.8-second dissolve and smooth camera widening, and all major
scenes use a 0.65-second dissolve. Main type reveals last 1.05 seconds.

The last eight seconds feature a genuinely extruded, bevelled FENIX /13 wordmark.
Its contours come from the supplied JPEG, rather than a substitute font. Metallic
materials, per-letter depth/rotation, a moving light and soft composited shadows
resolve into the unmodified official image. No flying bird returns.

```sh
npm ci
npm run check
npm run score
npm run studio
node scripts/render.mjs --ending
npm run render
npm run verify
python3 scripts/delivery.py
```

Node 24, Chromium, FFmpeg, Python and NumPy are required. Override
`REMOTION_BROWSER_EXECUTABLE` if Chromium is not `/usr/bin/chromium`.
Studio uses port 3012. `--draft` renders a half-resolution whole-film preview;
`--ending` renders the eight-second brand ending. `STILL_TIMES=35.5,36.5,41`
selects frames for `npm run stills`. Final outputs go one directory above.

`src/PhoenixFilm.tsx` owns the scene timings and dissolves. `GeoV10.tsx` contains
the revised five-second map. `Wordmark3D.tsx` builds actual Three.js extruded meshes
from `wordmark-geometry.json`; `EndCard.tsx` resolves them into the supplied artwork.
The original score is in `scripts/score42.py`, with separate editable audio stems.
To regenerate contours, install opencv-python-headless and run
`python3 scripts/logo_geometry.py`. This reads the JPEG without modifying it.

All eight segments are rendered anew at 30 fps. No slowed-down encoded V11 video,
frame duplication or frame interpolation is used. `RESUME_SEGMENT=N` is only for
resuming unchanged, already rendered V12 segments. See ASSETS.md and the QA report.

For a targeted correction with all other segments already present and unchanged,
`RENDER_SEGMENT=1 npm run render` rebuilds only the map and remuxes the master.
The map's first 20 frames use WebGL for the outgoing charcoal dissolve; remaining
map frames use the standard browser renderer. Fractional fragment durations are
explicit in the concat list so presentation timestamps remain continuous.
