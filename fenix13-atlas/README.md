# FENIX /13 — FROM THE WORLD TO TAUNGGYI

Version 5 adapts the campaign to the supplied **FENIX /13 — CHILL & GRILL**
phoenix identity. It is a new **32-second, 1080 × 1920, 60 fps** Remotion
composition, with a rotating globe, Myanmar outline, Taunggyi regional map,
logo-inspired feather and mountain motion, kinetic type, and a masked logo reveal.

Read `SCRIPT.md` for the revised script and shot timings. Read `ASSETS.md` for
logo preparation and geographic provenance.

## Preview and render

Node.js 22+ and FFmpeg are required. Fonts, geographic features, brand image,
and audio are bundled. No API keys or runtime network requests are needed.

```bash
npm ci
npm run studio               # Select FenixAtlas; Studio uses port 3005
npm run check                # TypeScript verification
npm run stills               # Scene and intermediate pose stills in out/
npm run render -- --draft    # 540 × 960, 30 fps motion/timing preview
npm run render               # 1080 × 1920, native 60 fps, all 1920 frames
npm run verify               # Final codec, duration, audio and motion checks
```

The final master is written to the parent folder as
`FENIX13_CHILL_GRILL_V5_60FPS.mp4`. The final render never skips or duplicates
frames. The `--draft` switch intentionally samples alternate composition frames
for faster review; the delivered phone preview is made from the full 60 fps master.

The renderer uses installed `/usr/bin/chromium` in this cloud. Elsewhere it uses
Remotion's managed browser, or an explicit path:

```bash
REMOTION_BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run render
```

## Edit

- `src/AtlasFilm.tsx`: script, typography, brand motifs, transitions, logo assembly.
- `src/Atlas.tsx`: orthographic globe, spherical rotation, Mercator zoom, map labels.
- `src/geodata.json`: bundled geographic vectors and the Taunggyi city coordinate.
- `src/Root.tsx`: 60 fps, 1920 frames, 1080 × 1920 composition.
- `src/motion.ts`: deterministic easing and palette.
- `public/brand/fenix13-chill-grill.png`: replaceable prepared brand image.
- `scripts/score.py`: original 32-second soundtrack and synchronized sound effects.
- `public/audio/`: master, separate music/SFX/brand-motif stems, cue sheet.

To regenerate sound, install Python 3 and NumPy, then run `npm run score`.
Geographic extraction is optional; the bundled JSON is all rendering requires.
Its extraction recipe expects Natural Earth source files at the paths documented
in `scripts/geodata.py`. `typeface.json` supplies measured Syne glyph widths;
no font conversion is needed for normal editing or rendering.

The map pin identifies Taunggyi city. Replace it with venue coordinates only
when an actual restaurant address is available.
