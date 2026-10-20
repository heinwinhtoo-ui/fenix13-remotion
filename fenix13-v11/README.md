# FENIX /13 V11 — supplied cream logo, no flying creature

32 seconds · 1080×1920 · native 30 fps · 960 frames.

The eight-second animated phoenix sequence is removed. The first 27 seconds of
V10 remain, followed by a five-second cream/brown brand ending using the exact
JPEG supplied by the user. The bird emblem inside that logo remains part of the
unchanged artwork. No flying bird, 3D rig, GLB or wing sound effects are used.

```sh
npm ci
npm run check
npm run studio
npm run score
npm run render
npm run verify
```

Node 24, Chromium at `/usr/bin/chromium`, FFmpeg, Python and NumPy are required.
Set `REMOTION_BROWSER_EXECUTABLE` for another Chromium installation. Studio uses
port 3011. All render assets are local; no generation service or Blender is needed.

`src/PhoenixFilm.tsx` controls the edit; `src/EndCard.tsx` displays the supplied
logo without redrawing it. `scripts/score32.py` creates original music/stems and
removes all creature cues in favor of a quiet tonal logo resolution.

Full rendering creates eight scene segments and joins their video without
recompression. `RESUME_SEGMENT=N` reuses existing segments before index N only
when their content is unchanged. This delivery reused V10's verified full-size
first seven scene segments, and freshly rendered the entire new ending. A fresh
checkout can render all segments from source with `npm run render`.

Outputs go to the repository root. See ASSETS.md and QUALITY_REPORT.json.
