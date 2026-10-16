# V8 quality review

The rejected ornamental bird and basic product models were replaced by three
newly generated CGI assets. Inspected the source images, alpha transparency of
the phoenix, and rendered CHILL, GRILL, social, macro bird, flight and closing
frames. Inspected a 12-second moving ident proof through a frame contact sheet.

The bird uses a continuous 84×56 subdivided surface so wing and tail motion does
not expose rigid cut-out seams. Deformation stays restrained to preserve feather
anatomy. This is animated CGI artwork with depth compositing, not a fully rigged
volumetric model. Its body remains above the wordmark during the glyph reveal.

Moved the GRILL support line above the bright flames and added a subtle text
shadow. Kept the closing logo and COMING SOON large and readable. Reviewed the
new photographic-quality CGI scenes for text overlap and mobile-safe composition.
Lounge imagery is fictional campaign concept art, not an actual venue photograph.

The original clean soundtrack is preserved. Its measured WAV loudness is about
−15 LUFS and −2.70 dBTP; no noise bed, sampled song or voiceover is present.
Audio review uses technical signal analysis, not a physical speaker listening test.

`npm run verify` checks the actual delivery: exact 60 seconds, 3600 frames,
1080×1920, H.264 yuv420p, 60 fps, AAC stereo 48 kHz, complete decode, fast start,
audio/master correlation, clipping and unique consecutive motion-frame hashes.
Results are recorded in `QUALITY_REPORT.json`. The full rendered film and merge
sequence are reviewed in contact sheets before publication. The phone preview
retains 60 fps and is decoded end to end.
