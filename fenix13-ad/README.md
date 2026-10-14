# FENIX /13 — Night Ignition

Editable HyperFrames advertisement: exactly 20 seconds, 1080×1920, 30 fps.
Version 2 is the default index.html. Version 1 HTML is preserved in versions/v1.html.

To restore the previous version locally, copy versions/v1.html to index.html;
its asset paths are relative to the project root, not the archive directory.

## Start and render

Node 22+ and FFmpeg are required. Fonts and GSAP are bundled locally; no browser
network fetch is needed. Eight separately editable sub-compositions contain six
scenes, the light field, and transitions.

```sh
npm ci
npm run check
npm run dev
npm run render -- --quality delivery --fps 30 --output ../FENIX13_COMING_SOON_V2_20S.mp4
```

Cloud runtime overrides for unwritable default home caches:

```sh
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npm run check
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npx --yes hyperframes@0.8.157 preview --background
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium XDG_CACHE_HOME=/tmp/hf-cache XDG_STATE_HOME=/tmp/hf-state npm_config_cache=/tmp/npm-cache npm run render -- --quality delivery --fps 30 --output ../FENIX13_COMING_SOON_V2_20S.mp4
```

## Original audio

assets/build_score_v2.py synthesizes the original 120 BPM F-minor music and sound
design. No third-party samples or recordings are used. NumPy is required to
regenerate the music/SFX stems, mix, and master.

```sh
python3 assets/build_score_v2.py
ffmpeg -y -i assets/fenix13_v2_mix.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 48000 -t 20 assets/fenix13_v2_master.wav
```

## Assets and provenance

Anton, Montserrat, and Space Mono fonts and their licenses live in assets/fonts.
GSAP is pinned to 3.14.2; HyperFrames is pinned to 0.8.157. The slash and FENIX /13
wordmark are original typography/vector treatments, not an official supplied logo.
Light ribbons, embers, and grain are computed deterministically from the playhead.
All creative visuals are abstract graphics and typography.

The reference upload exceeded the transfer tool's 32 MiB limit and could not be
decoded here. This treatment follows the written creative brief and feedback;
no direct reference-frame analysis is claimed.
