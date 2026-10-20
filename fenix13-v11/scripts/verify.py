"""Verify the 32-second bird-free export and supplied logo fidelity."""
from pathlib import Path
import json,subprocess,hashlib
R=Path(__file__).resolve().parent.parent
film=R.parent/'FENIX13_V11_FINAL_32S.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True)
p=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(film)]).stdout)
v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['avg_frame_rate'],v['nb_frames'])==(1080,1920,'30/1','960')
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert float(v['duration'])==float(a['duration'])==float(p['format']['duration'])==32
assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2
r=run(['ffmpeg','-v','error','-i',str(film),'-f','null','-']);assert not r.stderr.strip()
b=film.read_bytes();assert 0<b.find(b'moov')<b.find(b'mdat')
log=run(['ffmpeg','-hide_banner','-i',str(film),'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-vn','-f','null','-']).stderr
l=json.loads(log[log.rfind('{'):log.rfind('}')+1]);assert float(l['input_tp']) < -1
logo_hash=hashlib.sha256((R/'public/brand/FENIX13_OFFICIAL_CREAM.jpg').read_bytes()).hexdigest()
assert logo_hash=='f5eb2170e5bc5d191d3c3d86b0ed5cb82a8314d42e77e33faffa9d5b51a1de14'
assert not (R/'src/Hero.tsx').exists() and not (R/'public/models').exists()
assert 'Hero' not in (R/'src/PhoenixFilm.tsx').read_text()
cue=json.loads((R/'public/audio/cue-sheet.json').read_text())
assert not any(any(word in e['event'] for word in ['wing','phoenix','creature','banking']) for e in cue['events'])
report=dict(file=film.name,width=1080,height=1920,fps=30,frames=960,duration=32,codec='H.264 yuv420p',audio='AAC stereo 48 kHz',full_decode='PASS',fast_start=True,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),logo_sha256=logo_hash,supplied_logo_byte_identical=True,animated_creature_removed=True,wing_sound_effects_removed=True,integrated_loudness_lufs=float(l['input_i']),true_peak_dbtp=float(l['input_tp']),headphone_audition='Not available')
(R/'QUALITY_REPORT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
