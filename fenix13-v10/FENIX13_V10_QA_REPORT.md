# FENIX /13 V10 — QA and production report

Verified 2026-10-20 03:34 UTC.

## Outcome and scope

A working 40-second V10 master, compressed review, separate phoenix review and
editable project were produced from the existing campaign. Technical export
checks pass. The result includes a genuine articulated 3D bird, but the requested
photorealistic creature / studio-cinema quality target is **not fully achieved**.
The remaining visual and workflow limits are listed below; they are not hidden
behind a successful encode.

## Master verification

| Check | Result |
| --- | --- |
| Master | `FENIX13_V10_FINAL_40S.mp4` |
| Dimensions / aspect | 1080 × 1920 / 9:16 |
| Duration | Exactly 40.000 seconds, video and audio |
| Native frame rate | 30 fps / 1200 frames |
| Cadence | All 1200 presentation timestamps checked at 1/30-second intervals |
| Video | H.264, yuv420p, CRF 17, x264 medium |
| Audio | AAC 320 kb/s target, 48 kHz stereo |
| Complete decode | PASS: no FFmpeg decoding errors |
| Web playback preparation | Fast-start moov atom precedes media data |
| File size | 26,149,060 bytes |
| Integrated loudness | -15.57 LUFS |
| True peak | -2.54 dBTP |
| Loudness range | 4.90 LU |
| Last 100 ms audio RMS | -89.32 dBFS |
| Audio correlation with original WAV | 0.999991 |

SHA-256: `cc998b34d2aa9661d20629d5fc135b85b7751bbed3ea9afa5a04deebdfe160f0`

Frame hashes are distinct across nine consecutive frames in each sampled
charcoal, glass, grill, table, power-stroke, banking and transformation window.
No 30-to-60 interpolation or FPS-label substitution was used. The requested
minimum of 30 native frames per second is met.

Black detection found only: `[[0.0, 0.366667, 0.366667]]`. The short initial dark
interval is the intentional ember opening. No later nearly-black gap was found
using a 99% image threshold, 4% pixel threshold and 0.1-second minimum.

## Review files

| File | Dimensions | Native FPS | Duration | Frames |
| --- | --- | --- | --- | --- |
| FENIX13_V10_PREVIEW.mp4 | 540 × 960 | 30 | 40.000 s | 1200 |
| FENIX13_V10_PHOENIX_PREVIEW.mp4 | 540 × 960 | 30 | 9.000 s | 270 |

Both review files were decoded completely without errors. The phoenix review
contains seconds 27–36 of the finished master, including the brand resolution,
with a short audio fade added at its own ending.

## Visual review

The entire V9 and working V10 were decoded. Sampled image sequences covered the
whole timeline: one-second overview sheets, half-second scene review sheets,
and quarter-second hero / dissolve sheets. Full-resolution master contact sheets
and representative individual frames were also inspected. This is headless
sampled-frame review, not a claim of realtime human playback on a physical phone.

| Scene | Review finding |
| --- | --- |
| 0–3 | Tiny ember leads into charcoal; headline settles clearly; highlights remain controlled. |
| 3–6 | Globe, Myanmar/Shan and city locator preserve the geographic concept; Taunggyi is 20.781999 N, 97.038001 E. The city pin is not a venue address. |
| 6–11 | Warm drink plate, subtle liquid/caustic motion and a stable readable CHILL headline. |
| 11–16 | Charcoal, tighter skewers and wider grill follow successive cues; GRILL remains readable. |
| 16–20 | Separate glazed-wing dish with warm food color and light vapor. |
| 20–24 | Empty four-place table, sharing platter and drinks; no people, hands, faces or human silhouettes observed. |
| 24–27 | Empty night terrace and GREAT NIGHTS; phoenix does not appear before its dedicated scene. |
| 27–35 | Two authored wing strokes, glide/bank/rise, delayed tail motion and fragment-to-emblem transition; no obvious detached parts, gross mesh collapse or silhouette clipping in inspected frames. Surface finish remains stylized. |
| 35–40 | Prepared artwork, COMING SOON, location and tagline form a clear five-second ending; no overflow or overlap observed. |

Copy uses local Manrope 800/500, main horizontal margins of 84 px and masked
0.7-second line reveals. The prepared logo retains its aspect ratio. Primary
headlines and final brand are readable at the 540-pixel-wide review scale.
The small ATMOSPHERE CONCEPT disclosure identifies fictional social interiors.
The geography is a simplified vector visualization, not a satellite map.

## Creature and brand checks

- Actual volumetric mesh: 100,044 vertices and 98,895 polygons in the model report.
- 43-joint Blender armature, one skinned GLB animation, 241 authored samples over
  eight seconds. Numeric inspection confirms 43 animated joints,
  including shoulder, elbow, wrist, head, neck, chest, gaze and independent tails.
- Non-flat mesh depth verified: 0.768 model units.
- Downstroke/recovery have different timing, right/left delay, wingtip lag,
  head-leading turn, body pitch, chest movement and tail follow-through.
- Creature is rendered by Three.js from the GLB; editable Blender geometry,
  animation, camera/lights and construction script are included.
- Fragment dissolve and controlled particles connect to sampled brand-crest
  positions. This is a coordinated transition, not an exact topology morph.
- Prepared brand PNG is byte-identical to V9. SHA-256:
  `e58ea5792264999a19e166b4ac934ae05ed9f19dcf26e6b47a71dc98097b1c39`.

## Audio review and provenance

Original synthesized music and effects are supplied with executable composition
code and separate stems. No commercial song, recorded copyrighted sample or
voiceover is used. Scene accents and phoenix stroke cues follow the cue sheet.
Sizzle, crackle and air textures are brief, low-level synthesized cues; there is
no continuous hiss bed. Signal analysis found no clipping and a quiet ending.
Physical headphone audition is unavailable and **was not performed**; subjective
mix balance on the user's playback device remains unverified.

## Render environment

Node 24.19.0; Remotion 4.0.535; Three.js 0.183.2; Blender 4.3.2; Chromium
154.0.8037.57; FFmpeg 7.1.5; Python with NumPy 2.3.5. CPU-only WebGL uses
SwiftShader with three concurrent render tabs. Nine contiguous scene segments
were rendered at full resolution, concatenated without video recompression and
muxed once with the original soundtrack. TypeScript checking passed.

HyperFrames authoring/CLI workflow and the earlier HyperFrames source were
inspected. No callable cinematic video-generation service was available through
that workflow. The actual V10 rendering pipeline is Remotion / Three.js / Blender.
A Three.Clock deprecation notice is emitted by the dependency; it did not cause
missing frames or a render failure.

## Remaining limitations

1. The procedural phoenix is a genuine 3D creature but has a stylized, somewhat
   sculptural feather finish. It does not meet the requested photorealistic
   studio-character standard. No claim of Disney/Pixar/Marvel production quality
   or flawless anatomical/feather collision simulation is made.
2. Fire is emissive shader, fragment and particle VFX, not fluid-simulated flame
   or cached volumetric smoke. Silhouette clarity takes priority over fire density.
3. Food/drink/interior imagery uses generated still plates with independent
   refraction, vapor, light and camera animation. It is not newly filmed or
   fully generated live-action video. Plates around 940 pixels wide are modestly
   resampled to the 1080-wide master. The grill and wing plates are retained from V9.
4. The original downloadable/vector logo was absent. The existing prepared V9
   reconstruction is preserved; exact original vector fidelity cannot be certified.
5. Headphone listening and playback on the user's iPhone/Mac were not performed.
   Standard H.264/AAC, fast-start layout and full decoding were checked instead.

See `ASSETS.md`, `V9_REVIEW.md`, `QUALITY_REPORT.json`, `PREVIEW_REPORT.json` and
both contact sheets in the editable project for provenance and supporting data.
