# FENIX /13 V11 QA

- Master: 1080×1920, H.264 yuv420p, native 30 fps, 960 frames, exactly 32 seconds.
- Audio: AAC stereo, 48 kHz. Integrated loudness -15.46 LUFS;
  true peak -2.54 dBTP. No clipping. Final original-score fade is retained.
- Full master and compressed preview decoded successfully. Fast-start metadata enabled.
- The entire 27–35 second animated creature sequence from V10 is absent. V11 has
  no creature component or model, and no wing/flight audio cues.
- Seconds 0–27 reuse the verified original full-resolution V10 scene segments.
  Seconds 27–32 are newly rendered from the edited source; the 5-second ending
  uses the actual supplied logo, preserved byte-for-byte and at its original ratio.
- Supplied logo SHA-256: `f5eb2170e5bc5d191d3c3d86b0ed5cb82a8314d42e77e33faffa9d5b51a1de14`.
- Master SHA-256: `751f98199847da5216b5fd071eda948bb184110bbf96af1da828622e1f1ace13`.
- Master size: 21,391,507 bytes; preview size: 5,610,678 bytes.
- Preview SHA-256: `41dbabfb8a82951942da6bf8b722b5e38ae59d9f64508a0a81fc143caa70bafc`.
- Ending stills at 27, 27.4, 28.5 and 31 seconds were reviewed for transition,
  alignment, readability and logo fidelity. Whole-film and dense ending contact
  sheets are included for review. No source artwork was redrawn or recolored.
- The phoenix emblem within the user's supplied static logo is intentionally kept.
- Retained food/interior scenes are animated generated concept plates, not actual
  venue footage. Their V10 provenance is unchanged. Headphone audition and physical
  phone/Mac playback are unavailable; no such tests are claimed.

Editable source: `fenix13-v11/`. Previous campaign versions remain separately archived.
