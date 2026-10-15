# Version 5 — review and verification

## Composition

The production composition is `FenixAtlas`: **1080 × 1920, 60 fps, 1920 frames,
32 seconds**. Motion reads `useCurrentFrame()/useVideoConfig().fps`; the production
renderer visits every frame. It does not duplicate a 30 fps film or interpolate
a lower-rate video. The separately documented `--draft` option is only a faster
30 fps review mode; the delivered preview retains the master's 60 fps rate.

## Picture review

Reviewed the globe's Africa-to-Asia rotation, curved borders, Myanmar highlight,
the full Myanmar outline and Shan State, the zoom to Taunggyi, real generalized
regional roads and coordinate grid, all typography scenes, intermediate logo
assembly poses, and the final call-to-action layout.

Preview review corrected the map's overlap with the title, made the map viewport
explicit, darkened the city region while preserving road contrast, added a fine
coordinate grid, moved the GRILL supporting line away from the mountain shapes,
and moved the logo's screen blending to its composited parent to remove the
black rectangular background. The final globe and map are mathematical geographic
projections, with no stock planet photographs or live map service dependency.

A rendering performance probe found that forced software ANGLE was unnecessary
for this vector/HTML film. The final uses Chromium's normal rendering path; this
preserves the artwork and avoids a software-GPU bottleneck. The source retains
a `--probe` option for a short native 60 fps globe test.

## Sound

The score was rewritten for this 32-second edit. Its effects match the map zooms,
city locator, typography cuts, and phoenix reveal. The separate music, sound-design,
and brand-motif WAV stems are included. All sounds are original tonal synthesis;
there are no downloaded tracks, crackling layers, noise beds, hats, or voice.

Master measurements: **−14.59 LUFS integrated, −2.70 dBTP, LRA 3.50 LU**. These
are signal measurements, not a claim of listening through physical speakers.
The final AAC is encoded once from the original master WAV, not from draft AAC.

## Delivery checks

`npm run check` passes. `npm run verify` tests the actual delivered master:

- H.264 / yuv420p / 1080 × 1920 / 60 fps / 1920 frames.
- Exact 32.000-second video, audio, and container presentation duration.
- Whole-file decoding without errors.
- AAC / 48 kHz / stereo, no sample clipping, close master-waveform correlation.
- Distinct hashes for consecutive globe frames, checking motion at 60 fps.
- MP4 fast-start metadata and a SHA-256 checksum.

Actual values are stored in `QUALITY_REPORT.json`. `ASSETS.md` explains the
prepared logo asset and the generalized geographic data. The map pin denotes
Taunggyi city, not a claimed restaurant address.

The delivered master passed all checks. Twelve consecutive globe frames have
distinct hashes. Decoded audio correlates with the master at 0.9999940995 and
peaks at −2.69 dBFS. The 540 × 960 phone preview also contains all 1920 frames at
60 fps, has a 32.000-second audio/video timeline, and decodes without errors.
