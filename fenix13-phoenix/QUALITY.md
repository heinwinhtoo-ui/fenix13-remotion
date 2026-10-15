# Version 6 — review and delivery checks

## Native 60 fps and slower pacing

`FenixPhoenix` is 1080 × 1920, 60 fps, 3600 frames, exactly 60 seconds.
The final renderer visits every frame and never uses draft frame skipping.
Motion is computed from the frame directly; there is no lower-rate video being
duplicated or interpolated. Static reading holds are intentional.

The geographic introduction is expanded to 18 seconds. CHILL and GRILL each
receive eight seconds. Social phrases receive 2.67 seconds each. The phoenix
ident gets twelve seconds, followed by the six-second final logo/CTA section.
Main typography takes approximately 1–1.6 seconds to settle and then holds.
The existing source-logo characters reveal at 0.65-second offsets, each taking
1.1 seconds to settle.

## Visual review

Reviewed stills of the bar silhouettes, BBQ grate/lid/skewers/smoke, avatar group,
the flight, intermediate letter states, the absorption, and the completed logo.
A 12-second ident motion proof was rendered at 30 fps / half resolution to review
the flight and sequence. The delivered master and phone preview are 60 fps.

Preview corrections connected the bird's body, wing and tail roots, simplified
the far wing, lifted the hovering bird to protect the wordmark, and replaced a
double-image crossfade with a light-point contraction and expanding crest reveal.
The crest reveal was softened with symmetric easing. A safe clip keeps the
temporary orbital line away from the completed wordmark. The final image switches
to a single full-logo image after assembly to eliminate crop seams.

The moving bird is an original vector interpretation of the brand phoenix.
The final mark uses the prepared logo asset from V5; see `ASSETS.md`. BBQ and
avatars are original contextual silhouettes, explicitly requested for this edit.

## Audio

`scripts/score60.py` creates the new original 60-second score and four separate
shared-gain stems: music, beats, sound design and brand motif. The beat balances
at about 2.2 dB below the music stem's RMS during 18–42 seconds, before mastering.
Eight glyph notes and the phoenix flight/merge effects follow the visual cues.

Master measurements: −15.16 LUFS integrated, −2.70 dBTP, LRA 3.60 LU.
No white-noise generators, continuous hiss, crackle, sampled hats, downloaded
music or voice are used. Audio checks are signal measurements, not a claim of
physical-speaker listening. The final AAC is encoded once from the original WAV.

## Final-file verification

`npm run check` passes. `npm run verify` checks the delivered master for:

- H.264 / yuv420p / 1080 × 1920 / 60 fps / exactly 3600 frames.
- Exactly 60.000 seconds of video, audio and container presentation duration.
- Whole-file decoding without errors.
- AAC, 48 kHz stereo; no clipping and close master-waveform correlation.
- Distinct consecutive frames in both the globe and phoenix-flight intervals.
- MP4 fast-start metadata and a SHA-256 checksum.

Actual measurements are written to `QUALITY_REPORT.json`. The delivered phone
preview is downscaled from the verified full master and retains all 3600 frames.

The final master passed all checks. Twelve consecutive globe frames and twelve
consecutive phoenix-flight frames have distinct hashes. Decoded audio correlates
with the master at 0.9999871463 and peaks at −2.49 dBFS. The delivered 540 × 960
preview also has 3600 frames, native 60 fps, an exact 60.000-second presentation
timeline, and no whole-file decode errors. Final rendered contact sheets were
reviewed for the complete edit and the light-point-to-crest transition.
