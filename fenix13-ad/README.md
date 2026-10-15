# FENIX /13 — The Arrival / Version 3

An original 20-second HyperFrames advertisement: 1080×1920, 30 fps, H.264 MP4.
The active version has a new clean tonal score and an actual 3D studio ident.

## Start and render

Node 22+ and FFmpeg are required. Fonts, Three.js, GSAP and all graphics/audio
assets are bundled locally. There are no external browser requests during render.

```sh
npm ci
npm run check
npm run dev
npm run render -- --quality delivery --fps 30 --output ../FENIX13_COMING_SOON_V3_CLEAN_20S.mp4
```

Cloud overrides used for validation/rendering:

```sh
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npm run check
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npx --yes hyperframes@0.8.157 preview --background
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npm run render -- --quality delivery --fps 30 --output ../FENIX13_COMING_SOON_V3_CLEAN_20S.mp4
```

## Edit the motion and logo

- index.html: scene timing, active audio, and track layout.
- compositions/v3/: separately editable scene HTML/CSS/GSAP.
- assets/v3/studio-stage.js: physical lighting, camera choreography, letter
  assembly, original light arc and reflection.
- assets/v3/montserrat.typeface.json: actual Montserrat outlines for 3D extrusion.
- assets/STYLE_V3.css: palette, embedded fonts, typography and common layout.
- DESIGN.md: active visual and sound direction.

After editing the Three.js source, run `npm run build:3d`, then `npm run check`.
The checked-in bundle is already built. Final lettering is vector geometry, not
a pre-rendered picture; edit its mesh, lighting and timing in studio-stage.js.

## Clean original audio

The active timeline uses only assets/v3/clean-master.wav. The score is generated
from mathematical tonal oscillators: warm pads, mellow piano-like partials,
gentle sine bass and an original logo chime. It uses no samples, random/noise
generators, crackle, noise risers or noisy percussion. Separate clean music and
logo-chime stems are included.

Optional regeneration requires Python 3.11+ and these pinned helper packages:

```sh
python3 -m pip install -r assets/v3/requirements.txt
python3 assets/v3/build_clean_score.py
ffmpeg -y -i assets/v3/clean-mix.wav -af 'loudnorm=I=-17:TP=-2:LRA=10,volume=-1.4dB' -ar 48000 -t 20 assets/v3/clean-master.wav
```

To regenerate the 3D font outlines from the bundled Montserrat WOFF2:

```sh
python3 assets/v3/build_typeface.py
npm run build:3d
```

The font converter unions overlapping contours before beveling them so internal
font construction seams do not show on the 3D front faces.

## Assets and provenance

Anton, Montserrat and Space Mono are bundled with their licenses. Three.js is
pinned to 0.160.1 and its MIT license is included. GSAP is pinned to 3.14.2;
HyperFrames is pinned to 0.8.157. All live graphics are deterministic from the
HyperFrames playhead. No photography, footage, people, animals or mascots appear.

The studio-ident treatment is original: no borrowed studio wordmark, mascot,
castle/lamp icon, soundtrack or theme melody.

Version 1 is preserved at versions/v1.html. Version 2's entry point, scene copies
and README are preserved in versions/v2/. To restore an archived entry point,
copy it to the project root; its asset paths are relative to that root. Old audio
remains archived for earlier versions and is absent from the active V3 timeline.

The original reference upload exceeded the file-transfer tool's 32 MiB limit;
no direct frame analysis is claimed. This treatment follows the user's written
brief and their revisions.
