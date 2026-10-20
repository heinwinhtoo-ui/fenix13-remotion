"""Make review files and contact sheets after master QA."""
from pathlib import Path
import subprocess,json,hashlib,zipfile,os
root=Path(__file__).resolve().parent.parent;parent=root.parent
master=parent/'FENIX13_V10_FINAL_40S.mp4'
def run(a):subprocess.run(a,check=True)
def meta(p):
 d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
 v=next(x for x in d['streams'] if x['codec_type']=='video');return dict(file=p.name,width=v['width'],height=v['height'],fps=v['r_frame_rate'],frames=int(v['nb_frames']),duration=float(d['format']['duration']),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
preview=parent/'FENIX13_V10_PREVIEW.mp4';hero=parent/'FENIX13_V10_PHOENIX_PREVIEW.mp4'
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','scale=540:960','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(preview)])
run(['ffmpeg','-y','-v','error','-ss','27','-i',str(master),'-t','9','-vf','scale=540:960','-af','afade=t=out:st=8.6:d=0.4','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','256k','-movflags','+faststart',str(hero)])
for p in [preview,hero]:run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'])
report={'preview':meta(preview),'phoenix_preview':meta(hero)}
assert report['preview']['fps']=='30/1' and report['preview']['frames']==1200
assert report['phoenix_preview']['fps']=='30/1' and report['phoenix_preview']['frames']==270
(root/'PREVIEW_REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
run(['ffmpeg','-y','-v','error','-i',str(master),'-vf','fps=1,scale=216:384,tile=8x5','-frames:v','1',str(root/'REVIEW_CONTACT_SHEET.jpg')])
run(['ffmpeg','-y','-v','error','-ss','27','-i',str(master),'-t','8','-vf','fps=4,scale=216:384,tile=8x4','-frames:v','1',str(root/'PHOENIX_CONTACT_SHEET.jpg')])
run(['ffmpeg','-y','-v','error','-ss','37','-i',str(master),'-frames:v','1',str(parent/'FENIX13_V10_POSTER.jpg')])
print(json.dumps(report,indent=2))
