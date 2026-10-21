"""Export review videos and package the paced 3D-wordmark project."""
from pathlib import Path
import subprocess,json,hashlib,zipfile,shutil
R=Path(__file__).resolve().parent.parent;P=R.parent
master=P/'FENIX13_V12_FINAL_42S.mp4';preview=P/'FENIX13_V12_PREVIEW.mp4';logo=P/'FENIX13_V12_LOGO_PREVIEW.mp4'
def run(args):subprocess.run(args,check=True)
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','scale=540:960','-c:v','libx264','-crf','22','-preset','medium','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(preview)])
run(['ffmpeg','-y','-v','error','-ss','34','-i',str(master),'-t','8','-vf','scale=540:960','-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-movflags','+faststart',str(logo)])
for p in [preview,logo]:run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'])
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','fps=1,scale=162:288,tile=7x6','-frames:v','1',str(R/'REVIEW_CONTACT_SHEET.jpg')])
run(['ffmpeg','-y','-v','error','-ss','34','-i',str(master),'-t','8','-vf','fps=4,scale=162:288,tile=8x4','-frames:v','1',str(R/'ENDING_REVIEW.jpg')])
run(['ffmpeg','-y','-v','error','-ss','40','-i',str(master),'-frames:v','1',str(P/'FENIX13_V12_POSTER.jpg')])
q=json.loads((R/'QUALITY_REPORT.json').read_text())
report=f'''# FENIX /13 V12 QA

## Verified export

- 1080×1920, H.264 yuv420p, native 30 fps, 1260 frames, exactly 42 seconds.
- All 1260 presentation timestamps were checked for 1/30-second cadence.
- Audio: AAC stereo, 48 kHz. Integrated loudness {q['integrated_loudness_lufs']} LUFS;
  true peak {q['true_peak_dbtp']} dBTP. No clipping. The score has a one-second final fade.
- Master, compressed 42-second review and 8-second logo review decode completely.
  Fast-start metadata is enabled. Master SHA-256: `{q['sha256']}`.
- Preview SHA-256: `{hashlib.sha256(preview.read_bytes()).hexdigest()}`.
- Master size: {q['bytes']:,} bytes; preview size: {preview.stat().st_size:,} bytes.

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
- Supplied JPEG SHA-256: `{q['logo_sha256']}`.
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
'''
(P/'FENIX13_V12_QA_REPORT.md').write_text(report)
for name in ['FENIX13_V12_CHANGELOG.md','FENIX13_V12_QA_REPORT.md']:shutil.copy2(P/name,R/name)
dest=P/'FENIX13_V12_EDITABLE_PROJECT.zip';exclude={'node_modules','out','.remotion','__pycache__','.git'}
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(R.rglob('*')):
  rel=p.relative_to(R)
  if p.is_file() and not any(x in exclude for x in rel.parts) and p.suffix not in {'.log','.pyc'} and p.name!='premaster.wav':z.write(p,Path(R.name)/rel)
with zipfile.ZipFile(dest) as z:assert z.testzip() is None
print('Preview, logo review, contact sheets, QA and source archive ready. ZIP CRC passed.')
print('Preview:',preview.stat().st_size,'bytes; ZIP:',dest.stat().st_size,'bytes')
