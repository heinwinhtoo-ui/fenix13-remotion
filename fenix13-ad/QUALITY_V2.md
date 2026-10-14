# Version 2 validation

- HyperFrames 0.8.157 delivery render completed successfully using system Chromium.
- 1080×1920, H.264, progressive 4:2:0, 30/1 fps, exactly 600 video frames.
- Video, audio, and MP4 container each have exactly 20.000000 seconds duration.
- AAC audio is 48 kHz stereo. The original WAV measures -16.41 LUFS and -1.47 dBTP.
- Entire MP4 decoded by FFmpeg with exit status 0 and no decode errors.
- Final HyperFrames check passed: no lint, runtime, motion, persistent layout,
  or contrast warnings/errors; 30/30 text contrast checks passed.
- Informational findings during masked entrances are intentional clipping. The
  copper slash edge received a false connector association with an earlier
  scene's text; the actual edge is part of the same SVG emblem throughout.
- Snapshots inspected at every scene midpoint, the first ember, all five
  transition boundaries, logo assembly, and the final frame at 19.9667 seconds.
- A focused keyframe audit and the complete animation map were run. Offscreen
  motion belongs to entering text and transition curtains; intentional layer
  overlaps belong to copper planes, extrusion, light fields, and background accents.
- One clipped text edge visible too early in the hook was corrected before render.
- Fonts, GSAP, all procedural graphics, and the audio master are bundled locally.

The uploaded reference could not be decoded due to its size exceeding the 32 MiB
transfer limit. No direct reference-video analysis is claimed.
