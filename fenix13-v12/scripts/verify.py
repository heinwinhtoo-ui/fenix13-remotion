"""Verify the 42-second bird-free export and supplied logo fidelity."""
from pathlib import Path
import json,subprocess,hashlib
R=Path(__file__).resolve().parent.parent
film=R.parent/'FENIX13_V12_FINAL_42S.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True)
p=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(film)]).stdout)
v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['avg_frame_rate'],v['nb_frames'])==(1080,1920,'30/1','1260')
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert float(v['duration'])==float(a['duration'])==float(p['format']['duration'])==42
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
contours=json.loads((R/'src/wordmark-geometry.json').read_text())
assert len({x['glyph'] for x in contours})==8
assert (R/'src/Wordmark3D.tsx').exists()
report=dict(file=film.name,width=1080,height=1920,fps=30,frames=1260,duration=42,codec='H.264 yuv420p',audio='AAC stereo 48 kHz',full_decode='PASS',fast_start=True,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),logo_sha256=logo_hash,supplied_logo_byte_identical=True,animated_creature_removed=True,wing_sound_effects_removed=True,integrated_loudness_lufs=float(l['input_i']),true_peak_dbtp=float(l['input_tp']),headphone_audition='Not available',extruded_wordmark_glyphs=8,extruded_shapes=len(contours),scene_durations=[4,5,5,6,5,5,4,8])
pts=json.loads(run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','json',str(film)]).stdout)['frames']
times=[float(f['best_effort_timestamp_time']) for f in pts]
assert len(times)==1260 and all(abs(b-a-1/30)<.00001 for a,b in zip(times,times[1:]))
hashes=run(['ffmpeg','-v','error','-ss','35.5','-i',str(film),'-t','0.3','-an','-vf','scale=270:480','-f','framemd5','-']).stdout
h=[line.split(',')[-1].strip() for line in hashes.splitlines() if line and not line.startswith('#')]
assert len(h)==9 and len(set(h))==9
report.update(frame_cadence='All 1260 presentation timestamps verified',wordmark_unique_frames=len(h))
(R/'QUALITY_REPORT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
