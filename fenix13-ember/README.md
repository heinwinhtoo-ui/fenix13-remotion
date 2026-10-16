# FENIX /13 — EMBER (V8)

60 seconds · 1080 × 1920 · native 60 fps · editable Remotion composition.

This edition replaces the rejected ornamental bird and simple object models with
new cinematic CGI artwork: an ivory phoenix with detailed feather anatomy and
orange flame tips, a macro charcoal grill, and an amber-lit lounge still with
diffuse adult silhouettes. All three new images were generated for this project.

The phoenix artwork is animated on a continuous subdivided depth mesh with
separate spatial influences for wings, tips and tail, then banked through the
composition and absorbed into the brand crest. This is **2.5D compositing of a
CGI image**, not a fully rigged volumetric creature model. Lounge/grill scenes use
camera movement, moving reflections, heat distortion, light pulses and sparse
embers. No live-action footage, real venue photographs or third-party music.

```sh
npm ci
npm run studio
npm run check
npm run stills
npm run render
npm run verify
```

Node 24, Chromium and FFmpeg are required. Set `REMOTION_BROWSER_EXECUTABLE`
for a nonstandard browser location. The optional `npm run score` regenerates
the original 60-second soundtrack with Python 3 and NumPy.

Edit `src/Cinema3D.tsx` for image compositing, depth deformation, camera poses,
heat and reflections. Edit `src/PhoenixFilm.tsx` for copy and scene timing;
`src/Phoenix.tsx` for glyph reveal and final logo. Artwork is in `public/art/`.
All runtime assets are local; the source ZIP excludes node_modules and renders.

The renderer makes four contiguous, same-format segments, enabling SwiftShader
only for the depth-mesh bird shots, then joins them and encodes the WAV once.
The final export is 3600 frames at 60 fps, with no frame-rate interpolation.
`--ident-proof` is an internal half-size 30 fps review export, not the delivery.

The prepared logo and geographic locator retain the provenance described in
`ASSETS.md`. The generated lounge is a visual concept, not the actual venue.
