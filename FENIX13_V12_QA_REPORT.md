# FENIX /13 V12 QA

## Verified export

- 1080×1920, H.264 yuv420p, native 30 fps, 1260 frames, exactly 42 seconds.
- All 1260 presentation timestamps were checked for 1/30-second cadence.
- Audio: AAC stereo, 48 kHz. Integrated loudness -15.57 LUFS;
  true peak -2.62 dBTP. No clipping. The score has a one-second final fade.
- Master, compressed 42-second review and 8-second logo review decode completely.
  Fast-start metadata is enabled. Master SHA-256: `5b4126da2dc1d0d0c99db674b8bf84139b7808b7c9cba8fcab731962b82d25c7`.
- Preview SHA-256: `b5d86bad180a1fc8f6bc3b6d6b5fcbb60823ad0e0fb9ac73a446ae972847b40f`.
- Master size: 27,291,082 bytes; preview size: 8,041,302 bytes.

## Pacing and visual review

Opening 0–4; map 4–9; CHILL 9–14; GRILL 14–20; GOOD FOOD 20–25;
GOOD COMPANY 25–30; GREAT NIGHTS 30–34; brand ending 34–42.
All eight scenes were freshly rendered from source; encoded V11 footage was not
slowed down. Scene changes dissolve over 0.65 seconds. Main type reveals last
1.05 seconds with a 0.18-second line stagger. The grill uses a 0.8-second dissolve
and continuous close-to-wide movement rather than the old abrupt crop cut.

Representative map, grill and ending stills were inspected. The complete
8-second ending preview was decoded and reviewed through quarter-second samples.
Whole-film and dense ending contact sheets accompany this report. The final
original artwork holds from 38.2 to 42 seconds, with all supporting copy settled.
This is headless sampled-frame review, not physical-phone or headphone testing.

## Dimensional name and brand fidelity

- Eight glyphs and ten polygons are extracted from the supplied lettering. The E
  contains three separate bars. Contours are analyzed without changing the JPEG.
- Three.js ExtrudeGeometry creates real front faces, sidewalls and bevels:
  depth 0.24, bevel size 0.012 and bevel thickness 0.016 model units.
- Individual depth arrivals, slight rotations, metallic bronze edges, environment
  reflections and a travelling light are rendered in an orthographic 3D scene.
- Soft shadows are composited from the 3D canvas silhouette; they are not a claim
  of physically simulated area-light shadows. Initial hard shadows were softened
  after visual inspection.
- Nine consecutive sampled wordmark frames have distinct decoded hashes, confirming
  rendered motion at the native frame rate.
- The supplied static crest remains. The wordmark resolves into the unmodified
  original full logo artwork; final artwork aspect ratio is preserved.
- Supplied JPEG SHA-256: `f5eb2170e5bc5d191d3c3d86b0ed5cb82a8314d42e77e33faffa9d5b51a1de14`.
- No flying creature model, creature animation or wing/flight sound cues return.

## Audio and remaining limitations

Music, tonal letter cues and scene effects are original synthesis. Separate stems
and executable source are included. No commercial song or external sample is
used. Brief grill texture remains at low level; there is no continuous hiss bed.
Physical headphone listening and user-device playback were not performed.

Food and interiors remain generated concept plates with shader effects, not
actual venue footage. Their approximately 940-pixel-wide source receives modest
resampling; typography, maps and 3D are rendered at Full HD. The city pin identifies
Taunggyi, not the venue address. No people, faces or hands are introduced.

Source: `fenix13-v12/`. See ASSETS.md, the changelog and QUALITY_REPORT.json.
