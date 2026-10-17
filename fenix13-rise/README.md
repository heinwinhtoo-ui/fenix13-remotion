# FENIX /13 — RISE (V9)

40 seconds · 1080 × 1920 · native 60 fps · editable Remotion + Three.js.

The approved ivory phoenix returns with subtle asymmetric wing beats, flexible
feather tips, a travelling tail wave and chest/head micro-motion. The bird remains
CGI artwork on a continuous deforming depth mesh (2.5D), preserving its approved
appearance. The logo reveal uses actual bevelled, extruded 3D geometry: individual
letters move into place, a light orbit traces the identity, and the bird dissolves
into the emerging crest. An unobstructed final card holds the campaign message.

New generated imagery adds skewers on the grill, a separate glazed-wing dish for
GOOD FOOD and four adult friends toasting for GOOD COMPANY. These are fictional
campaign concepts, not photographs of the actual venue, customers or menu.

```sh
npm ci
npm run studio
npm run check
npm run stills
npm run render
npm run verify
```

Requires Node 24, Chromium and FFmpeg. Set `REMOTION_BROWSER_EXECUTABLE` if needed.
The final render is written one directory above the project as
`FENIX13_RISE_V9_40S_60FPS.mp4`. All runtime artwork, fonts and audio are local.
The source ZIP excludes node_modules and temporary renders.

Edit `src/PhoenixFilm.tsx` for timing/copy; `src/Cinema3D.tsx` for the phoenix rig
and scene cameras; `src/Logo3D.tsx` for logo depth, lighting and choreography;
`src/Phoenix.tsx` for the closing layout. `SCRIPT.md` lists the edit timing.

The renderer exports four contiguous segments at native 60 fps, using SwiftShader
for WebGL scenes on CPU-only hosts. It joins the video without re-encoding and
encodes the original WAV once. No frame interpolation is used. `--ident-proof`
is a half-resolution, 30 fps internal review export, not the delivery format.

Optional regeneration:

- `npm run score`: original 40-second soundtrack, Python 3 + NumPy + FFmpeg.
- `python3 scripts/logo_geometry.py`: reconstruct extrusion contours from the
  prepared logo; requires NumPy and opencv-python-headless. Render-ready contour
  JSON is included, so OpenCV is not required to edit or render the film.

See `ASSETS.md` for prepared-logo, imagery, fonts and map provenance.

`src/geodata.json` includes all render-ready map vectors. The optional
`python3 scripts/geodata.py` rebuilds them from Natural Earth upstream GeoJSON
(downloads to `out/geodata-source/`). The retained typeface helper requires
fontTools, brotli and skia-pathops; its output is included and is not used by the
new contour-based brand reveal. Neither helper is needed for rendering.
