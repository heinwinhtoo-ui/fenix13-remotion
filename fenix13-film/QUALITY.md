# Version 4 — delivery checks

The final film was rendered with Remotion 4.0.535, React Three Fiber, and Three.js.
Every video frame was rendered from the editable composition. The MP4 is not a
slideshow of the preview stills. The previous V3 export is preserved separately.

## Picture review

Reviewed scene stills and contact sheets extracted from the rendered draft and
final MP4, including intermediate logo poses at 0.25-second intervals. Corrected
wide-font overflow in the hook and COMING SOON, reduced 3D text and logo widths,
and replaced dark metallic word fronts with brighter fronts and copper sides.
Changed the receding word echoes from triangle wireframes to contour edges.

Checked the hook, tunnel, both attitude palettes, all three 3D word sculptures,
all three social messages, the assembly, the light-conductor sweep, and the final
hold. Cropped glyphs during the close camera pass are intentional; the completed
wordmark and main call to action sit inside the safe composition.

## Export verification

`npm run verify` checks the actual delivered master, not the source settings.
Machine-readable results and the SHA-256 checksum are in `QUALITY_REPORT.json`.

- H.264, yuv420p, 1080 × 1920, 30 fps, exactly 900 frames.
- Video, audio, and container presentation duration: exactly 30.000 seconds.
- Full-file FFmpeg decoding completed without errors.
- AAC, 48 kHz, stereo; the final audio is encoded directly from the master WAV.
- MP4 metadata precedes media data for fast-start playback.
- Decoded audio / master waveform correlation: 0.9999879567.
- Decoded audio sample peak: −2.53 dBFS; no clipping.
- Master loudness: −15.35 LUFS integrated, −2.70 dBTP, LRA 6.60 LU.
- Original master energy above 9 kHz: 0.000000336% of total spectral energy.
  This supports the clean, dark tonal palette; no continuous noise source is used.

The original score and sound effects are synthesized from pitched oscillators.
The cue sheet records each transition impact, swish, and final logo event. Music,
sound design, and ident remain separately editable as stereo WAV stems.

`npm run check` passes. `npm ls --depth=0` reports matching locked packages.
The render log's Three Clock deprecation notice is informational; WebGL rendering
completed successfully using the installed Chromium browser and software ANGLE.

This environment permits visual frame inspection and signal analysis. Audio
checks above describe measurements, rather than a claim of speaker listening.
