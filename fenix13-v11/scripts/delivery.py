"""Export the review and package the current bird-free editable project."""
from pathlib import Path
import subprocess,json,hashlib,zipfile,shutil
R=Path(__file__).resolve().parent.parent;P=R.parent
master=P/'FENIX13_V11_FINAL_32S.mp4';preview=P/'FENIX13_V11_PREVIEW.mp4'
def run(args):subprocess.run(args,check=True)
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','scale=540:960','-c:v','libx264','-crf','22','-preset','medium','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(preview)])
run(['ffmpeg','-v','error','-i',str(preview),'-f','null','-'])
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','fps=1,scale=180:320,tile=8x4','-frames:v','1',str(R/'REVIEW_CONTACT_SHEET.jpg')])
run(['ffmpeg','-y','-v','error','-ss','27','-i',str(master),'-t','2','-vf','fps=5,scale=216:384,tile=5x2','-frames:v','1',str(R/'ENDING_REVIEW.jpg')])
run(['ffmpeg','-y','-v','error','-ss','30','-i',str(master),'-frames:v','1',str(P/'FENIX13_V11_POSTER.jpg')])
q=json.loads((R/'QUALITY_REPORT.json').read_text())
report=f'''# FENIX /13 V11 QA

- Master: 1080×1920, H.264 yuv420p, native 30 fps, 960 frames, exactly 32 seconds.
- Audio: AAC stereo, 48 kHz. Integrated loudness {q['integrated_loudness_lufs']} LUFS;
  true peak {q['true_peak_dbtp']} dBTP. No clipping. Final original-score fade is retained.
- Full master and compressed preview decoded successfully. Fast-start metadata enabled.
- The entire 27–35 second animated creature sequence from V10 is absent. V11 has
  no creature component or model, and no wing/flight audio cues.
- Seconds 0–27 reuse the verified original full-resolution V10 scene segments.
  Seconds 27–32 are newly rendered from the edited source; the 5-second ending
  uses the actual supplied logo, preserved byte-for-byte and at its original ratio.
- Supplied logo SHA-256: `{q['logo_sha256']}`.
- Master SHA-256: `{q['sha256']}`.
- Master size: {q['bytes']:,} bytes; preview size: {preview.stat().st_size:,} bytes.
- Preview SHA-256: `{hashlib.sha256(preview.read_bytes()).hexdigest()}`.
- Ending stills at 27, 27.4, 28.5 and 31 seconds were reviewed for transition,
  alignment, readability and logo fidelity. Whole-film and dense ending contact
  sheets are included for review. No source artwork was redrawn or recolored.
- The phoenix emblem within the user's supplied static logo is intentionally kept.
- Retained food/interior scenes are animated generated concept plates, not actual
  venue footage. Their V10 provenance is unchanged. Headphone audition and physical
  phone/Mac playback are unavailable; no such tests are claimed.

Editable source: `fenix13-v11/`. Previous campaign versions remain separately archived.
'''
(P/'FENIX13_V11_QA_REPORT.md').write_text(report)
for name in ['FENIX13_V11_CHANGELOG.md','FENIX13_V11_QA_REPORT.md']:shutil.copy2(P/name,R/name)
dest=P/'FENIX13_V11_EDITABLE_PROJECT.zip';exclude={'node_modules','out','.remotion','__pycache__','.git'}
with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(R.rglob('*')):
  rel=p.relative_to(R)
  if p.is_file() and not any(x in exclude for x in rel.parts) and p.suffix not in {'.log','.pyc'} and p.name!='premaster.wav':z.write(p,Path(R.name)/rel)
with zipfile.ZipFile(dest) as z:assert z.testzip() is None
print('Preview, contact sheets, QA and editable archive ready. ZIP CRC passed.')
print('Preview:',preview.stat().st_size,'bytes; ZIP:',dest.stat().st_size,'bytes')
