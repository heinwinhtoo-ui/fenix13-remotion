# FENIX /13 — NIGHT ENGINE

Version 4 is a new **30-second Remotion film**, replacing the earlier HyperFrames
approach. All artwork is procedural motion graphics and typography. No live
action, photographs, characters, animals, stock footage, or AI images are used.

1080 × 1920 • 9:16 • 30 fps • 900 frames • H.264 / AAC stereo.

## Open and edit

Requires Node.js 22 or newer. Dependencies are locked to the included lockfile.

```bash
npm ci
npm run studio
```

Studio opens on port 3003. Choose `FenixNightEngine`, then scrub or play the film.
The cloud render uses installed Chromium with software ANGLE/SwiftShader WebGL.
On a computer without `/usr/bin/chromium`, Remotion uses its managed browser.
To select an existing browser on macOS:

```bash
REMOTION_BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run render
```

```bash
npm run check                 # TypeScript verification
npm run stills                # Scene and intermediate motion previews
npm run render -- --draft     # Half-size timing / playback review
npm run render                # Full HD, all 900 frames
npm run verify                # Verify final export with FFmpeg + NumPy
```

The master export is written to the parent folder as
`FENIX13_REMOTION_V4_30S.mp4`. The preview render and stills go to `out/`.
All required media and fonts are bundled; no runtime CDN requests or API keys.

## Editable source map

- `src/Film.tsx`: typography, masks, editorial layouts, safe-area sizing, timing.
- `src/World.tsx`: physical materials, studio lighting/environment, twisted ribbons,
  camera choreography, tunnel, extruded lettering, individual logo assembly, and
  the light conductor. Every pose depends only on the current Remotion frame.
- `src/motion.ts`: easing curves and palette.
- `src/Root.tsx`: resolution, frame rate, duration, composition registration.
- `scripts/score.py`: original score, synchronized sound design, separate stems,
  and mastering recipe. Rebuild with Python 3, NumPy, and FFmpeg.
- `public/audio/cue-sheet.json`: sound-effect events and exact timing.
- `scripts/typeface.py`: font-outline conversion recipe. The resulting native
  typeface is included, so conversion is optional. Rebuilding needs `fonttools`,
  `brotli`, and `skia-pathops` in addition to Python.

To change copy, edit the strings and cue times in `Film.tsx`. `Hinge` automatically
fits wide Syne lettering to a 900-pixel mobile-safe column. Keep important copy
inside x=64…1016 and y=180…1720. The final main wordmark is native 3D geometry;
edit `Brand` in `World.tsx` to change its layout or materials.

Music, effects, and the brand motif are separate 48 kHz stereo WAV stems. Their
shared gain reconstructs `premaster.wav`; the final master additionally receives
a loudness pass. Edit stems and re-master rather than normalizing each separately.

## Asset provenance

The 3D geometry, reflection environment, light sprite, score, and effects were
created for this project. The score uses tonal synthesis with no noise samples,
crackle, downloaded music, voice, or third-party recordings. Syne, Manrope, and
Space Mono are included under the SIL Open Font License; see `public/fonts/`.
Third-party application dependencies retain their own package licenses.

Earlier V1–V3 exports and the HyperFrames source are preserved in the repository.
See `QUALITY.md` and `QUALITY_REPORT.json` for review notes and export validation.
