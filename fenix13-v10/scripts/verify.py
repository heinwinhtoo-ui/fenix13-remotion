"""Verify the delivered V10 video, synchronized audio, and actual skinned model."""
from pathlib import Path
import json,struct,subprocess,tempfile,wave,hashlib,re
import numpy as np
root=Path(__file__).resolve().parent.parent
movie=root.parent/'FENIX13_V10_FINAL_40S.mp4'
def run(a):return subprocess.run(a,check=True,capture_output=True,text=True)
def probe(p):return json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]).stdout)
p=probe(movie);v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['r_frame_rate'],v['avg_frame_rate'],v['nb_frames'])==(1080,1920,'30/1','30/1','1200')
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert float(p['format']['duration'])==40 and float(v['duration'])==40 and float(a['duration'])==40
assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2
r=run(['ffmpeg','-v','error','-i',str(movie),'-f','null','-']);assert not r.stderr.strip(),r.stderr
b=movie.read_bytes();assert 0<b.find(b'moov')<b.find(b'mdat')
def wav(p):
 with wave.open(str(p)) as f:return np.frombuffer(f.readframes(f.getnframes()),'<i2').reshape(-1,2).astype(float)/32768
master=wav(root/'public/audio/FENIX_ORIGINAL_MASTER.wav')
with tempfile.TemporaryDirectory() as d:
 out=Path(d)/'audio.wav';run(['ffmpeg','-y','-v','error','-i',str(movie),'-vn','-t','40','-c:a','pcm_s16le',str(out)]);audio=wav(out)
n=min(len(audio),len(master));corr=float(np.corrcoef(audio[:n].ravel(),master[:n].ravel())[0,1]);assert corr>.99
peak=float(np.max(abs(audio)));assert peak<1
tail_rms=20*np.log10(max(1e-12,float(np.sqrt(np.mean(audio[-4800:]**2)))))
assert tail_rms < -35,('Abrupt audio tail',tail_rms)
loudness_log=run(['ffmpeg','-hide_banner','-i',str(movie),'-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-vn','-f','null','-']).stderr
loudness=json.loads(loudness_log[loudness_log.rfind('{'):loudness_log.rfind('}')+1])
assert float(loudness['input_tp']) < -1, loudness
timestamps=json.loads(run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','json',str(movie)]).stdout)
pts=np.array([float(f['best_effort_timestamp_time']) for f in timestamps['frames']])
assert len(pts)==1200 and np.max(abs(np.diff(pts)-1/30)) < .00001
motion={}
for sec,label in [(1.5,'charcoal'),(7.5,'glass'),(13,'grill'),(22,'table'),(28.6,'powerstroke'),(30.5,'bank'),(33.5,'transformation')]:
 output=run(['ffmpeg','-v','error','-ss',str(sec),'-i',str(movie),'-t','0.3','-an','-vf','scale=270:480','-f','framemd5','-']).stdout
 h=[x.split(',')[-1].strip() for x in output.splitlines() if x and not x.startswith('#')];assert len(h)>=8 and len(set(h))==len(h),(label,h)
 motion[label]=len(h)
black=run(['ffmpeg','-hide_banner','-i',str(movie),'-vf','blackdetect=d=0.1:pix_th=0.04:pic_th=0.99','-an','-f','null','-']).stderr
black_intervals=[tuple(map(float,m)) for m in re.findall(r'black_start:([0-9.]+) black_end:([0-9.]+) black_duration:([0-9.]+)',black)]
assert all(start<.5 and end<.7 for start,end,duration in black_intervals),black_intervals
# Check actual animation data rather than trusting filenames or documentation.
glb=(root/'public/models/FENIX_V10_CREATURE.glb').read_bytes();jl=struct.unpack_from('<I',glb,12)[0];g=json.loads(glb[20:20+jl]);binstart=20+jl+8
node_names={i:n.get('name','') for i,n in enumerate(g['nodes'])}
components={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}
def access(i):
 ac=g['accessors'][i];bv=g['bufferViews'][ac['bufferView']];assert ac['componentType']==5126
 offset=binstart+bv.get('byteOffset',0)+ac.get('byteOffset',0);return np.frombuffer(glb,dtype='<f4',count=ac['count']*components[ac['type']],offset=offset).reshape(ac['count'],-1)
changed=set();duration=0
for c in g['animations'][0]['channels']:
 s=g['animations'][0]['samplers'][c['sampler']];values=access(s['output']);duration=max(duration,float(access(s['input']).max()))
 if np.max(np.ptp(values,axis=0))>1e-5:changed.add(node_names[c['target']['node']])
required={'root','chest','neck','head','shoulderL','shoulderR','elbowL','elbowR','wristL','wristR','tail0','tail8','gaze-1','gaze1'}
assert required<=changed,(required-changed)
assert duration>=7.99 and len(g['skins'][0]['joints'])==43
positions=[g['accessors'][m['attributes']['POSITION']] for mesh in g['meshes'] for m in mesh['primitives']]
zrange=max(x['max'][2] for x in positions)-min(x['min'][2] for x in positions);assert zrange>.5,'Model is flat'
report=dict(file=movie.name,width=1080,height=1920,fps=30,frames=1200,duration=40,codec='H.264 yuv420p',audio='AAC stereo 48 kHz',full_decode='PASS',fast_start=True,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),audio_master_correlation=corr,audio_sample_peak_dbfs=20*np.log10(peak),last_100ms_rms_dbfs=tail_rms,motion_unique_frames=motion,black_intervals=black_intervals,model_joints=43,animated_joint_count=len(changed),animation_duration=duration,model_depth=zrange,model_type='Volumetric skinned geometry; procedural/stylized-natural finish',headphone_audition='Not available in this environment')
report.update(integrated_loudness_lufs=float(loudness['input_i']),true_peak_dbtp=float(loudness['input_tp']),loudness_range_lu=float(loudness['input_lra']),frame_timestamps='All 1200 presentation timestamps verified at 1/30 second cadence')
(root/'QUALITY_REPORT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
