# FENIX /13 — THE FIRE COMES HOME

Version 6 is a **60-second, 1080 × 1920, native 60 fps** Remotion film.
It expands the V5 pacing and adds scene-specific BBQ/avatar silhouettes,
an articulated flying phoenix, character-by-character source-logo reveals,
and a light-point merge into the full brand crest. A new original 60-second
score includes a separately editable beat stem and synchronized flight effects.

See `SCRIPT.md` for the revised script and `ASSETS.md` for source provenance.

## Open and render

Requires Node.js 22+, Chromium/Chrome, and FFmpeg. All rendering media and fonts
are included. No API keys or runtime downloads are required.

```bash
npm ci
npm run studio                  # FenixPhoenix, port 3006
npm run check                   # TypeScript check
npm run stills                  # Scene and ident stills
npm run render -- --ident-proof # 12-second ident review at half size / 30 fps
npm run render -- --draft       # Full timing draft at half size / 30 fps
npm run render                  # Full HD, 60 fps, all 3600 frames
npm run verify                  # Final-file checks; needs Python + NumPy
```

The master goes to the parent folder as
`FENIX13_PHOENIX_RETURN_V6_60S_60FPS.mp4`. Delivered phone previews retain 60 fps;
the `--draft` and `--ident-proof` switches are only for faster internal review.
The renderer uses `/usr/bin/chromium` in the cloud, a managed browser elsewhere,
or `REMOTION_BROWSER_EXECUTABLE` to select a local Chrome installation.

## Source map

- `src/PhoenixFilm.tsx`: the 60-second edit, scene timing and transitions.
- `src/Phoenix.tsx`: vector phoenix, smooth flight path, articulated wings/tails,
  the eight source-logo glyph crops, light connections and final crest reveal.
- `src/Shadows.tsx`: original BBQ, smoke, bar and featureless avatar silhouettes.
- `src/Design.tsx`: slower character animation, typography and font readiness.
- `src/Atlas.tsx`, `src/geodata.json`: real globe/Myanmar/Taunggyi geography.
- `src/Root.tsx`: composition resolution, duration and frame rate.
- `public/brand/fenix13-chill-grill.png`: the prepared brand asset from V5.
- `scripts/score60.py`: original score, beats, effects and ident generation.
- `public/audio/`: shared-gain stems, final master and cue sheet.

The custom FENIX lettering is cropped directly from the brand asset. If replacing
the image, update the measured character intervals in `Phoenix.tsx` to suit it.
The main glyph cue times are exported there as `letterTimes` and matched exactly
by `scripts/score60.py`.

To rebuild audio, install Python 3 and NumPy, then run `npm run score`. The stems
are music, beats, sound design and brand motif. Their shared gain reconstructs
the premaster; the final master additionally receives the documented loudness
pass. Do not normalize each stem separately if you want the same mix balance.
