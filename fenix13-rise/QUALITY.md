# V9 review notes

The approved phoenix image is unchanged. Its continuous depth mesh now includes
asymmetric wing phase, feather-tip lag, a travelling tail wave, chest movement
and subtle head motion. This is a 2.5D image rig, not a volumetric creature model.

Reviewed rendered frames of the new skewers, wings dish and friends scenes for
text overlap and composition at phone size. The main copy remains in dark upper
negative space, with faces and food below. Reduced the scene edit to 40 seconds.
The final full-film contact sheet revealed tight clearance between GREAT NIGHTS
and the macro wing; raised that scene's headline by 110 px and reframed the macro rig at 1.25 scale on a full-height canvas to prevent
internal clipping of wing and tail tips, then re-rendered it.

Reviewed the moving ident proof as a dense frame contact sheet. The wordmark is
made from true extruded contour meshes with warm metal sides and ivory/orange
fronts. Each letter enters separately. The bird shrinks into the emerging crest,
and the final card resolves to the prepared brand image for clean readability.
Small contour bevels preserve fine features in the prepared identity.

Audio is a newly timed original synthesis, with clean bass/beat, electric piano,
tonal transitions, wing cues, eight glyph cues and logo impact. No broadband
noise bed or crackling layer. The WAV measures −15.10 LUFS integrated,
−2.70 dBTP and 4.80 LU loudness range. Audio review uses technical signal analysis, not
a physical speaker listening test.

`npm run verify` checks the delivered MP4 for exact 40-second duration, 2400
frames, 1080×1920, native 60 fps, H.264/yuv420p, AAC stereo 48 kHz, full decode,
fast start, master correlation, clipping, and unique consecutive frames in the
globe, phoenix and 3D logo movement. Results are in QUALITY_REPORT.json.

Final delivery passed the complete decode and format checks. The revised full-film
contact sheet and extracted GREAT NIGHTS frame were inspected after the spacing
fix. The phone preview retains 60 fps and passed an end-to-end decode; metadata
and checksum are recorded in PREVIEW_REPORT.json.
