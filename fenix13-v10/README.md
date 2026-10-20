# FENIX /13 V10 — cinematic brand film

40 seconds · 1080×1920 · native 30 fps · Remotion / Three.js / Blender.

```sh
npm ci
npm run studio
npm run check
npm run stills
npm run render
npm run verify
python3 scripts/delivery.py
python3 scripts/package.py
```

Node 24, Chromium and FFmpeg are required. Set REMOTION_BROWSER_EXECUTABLE if
Chromium is not at `/usr/bin/chromium`. All runtime assets are local. Python 3
and NumPy regenerate the original score with `npm run score`. Blender 4.3.2
regenerates the creature with:

```sh
blender -b --python blender/build_phoenix.py
node scripts/render.mjs --hero
node scripts/render.mjs --draft
```

`--hero` exports the separate 27–36 second animation and brand resolution with synchronized sound.
`--draft` exports a 540×960 review. Both use native 30 fps. `STILL_TIMES=1.5,22,32.2`
selects representative stills; add `--hero` for times relative to the 9-second
creature/brand sequence. No interpolation or duplicated 30-to-60 frames are used.

The full renderer exports nine contiguous scene segments at CRF 17, joins the
video without recompression and encodes the original WAV once to AAC 320 kb/s.
`RESUME_SEGMENT=N` reuses previously completed segments before index N, and must
only be used if those earlier scenes are unchanged. SwiftShader enables WebGL
on CPU-only cloud hosts. Final output is one directory above this project.

After master verification, `delivery.py` exports the compressed review, the
nine-second phoenix excerpt, contact sheets and a poster. `package.py` includes
the source, assets and completed QA reports in an archive and verifies its CRCs;
it excludes dependencies, render intermediates and Blender backups. The delivered
changelog and QA Markdown files are also included inside the editable project.

## Editable structure

- `src/PhoenixFilm.tsx`: timeline, typography, lens bridges and ending.
- `src/GeoV10.tsx`: three-second globe → Myanmar → Shan → Taunggyi locator.
- `src/Plate.tsx`: independently animated photographic-plate effects.
- `src/Hero.tsx`: GLB playback, lighting, reactive fire and emblem transformation.
- `blender/FENIX_V10_CREATURE.blend`: native mesh, skeleton and animation.
- `blender/build_phoenix.py`: reproducible mesh and flight authoring.
- `public/models/FENIX_V10_CREATURE.glb`: render-ready animated 3D asset.
- `scripts/score40.py`: original composition and sound effect synthesis.

The people-free environment shots are generated concept plates, not documentary
footage of the actual venue. The 3D bird is a procedural creature, not a claim of
photorealistic studio VFX. See ASSETS.md, the delivery QA report and changelog for
exact scope, provenance and limits. Earlier versions remain in their own folders.
