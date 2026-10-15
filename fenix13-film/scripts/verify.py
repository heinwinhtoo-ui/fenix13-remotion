"""Delivery QA: format, frame count, decode, audio fidelity and MP4 fast start."""
from pathlib import Path
import subprocess, json, tempfile, wave, hashlib
import numpy as np

root=Path(__file__).resolve().parent.parent
movie=root.parent/'FENIX13_REMOTION_V4_30S.mp4'
def run(args):
    return subprocess.run(args,check=True,text=True,capture_output=True)
probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)]).stdout)
video=next(s for s in probe['streams'] if s['codec_type']=='video')
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'])==(1080,1920)
assert video['codec_name']=='h264' and video['pix_fmt']=='yuv420p'
assert video['r_frame_rate']=='30/1' and int(video['nb_frames'])==900
assert abs(float(probe['format']['duration'])-30)<.001
assert audio['codec_name']=='aac' and audio['sample_rate']=='48000' and audio['channels']==2
decode=run(['ffmpeg','-v','error','-i',str(movie),'-f','null','-'])
assert not decode.stderr.strip(),decode.stderr

def read_wav(p):
    with wave.open(str(p)) as f:
        assert f.getnchannels()==2 and f.getframerate()==48000
        return np.frombuffer(f.readframes(f.getnframes()),'<i2').reshape(-1,2).astype(float)/32768

master=read_wav(root/'public/audio/FENIX_ORIGINAL_MASTER.wav')
with tempfile.TemporaryDirectory(prefix='fenix-qa-') as td:
    decoded=Path(td)/'decoded.wav'
    run(['ffmpeg','-y','-v','error','-i',str(movie),'-vn','-t','30','-acodec','pcm_s16le',str(decoded)])
    actual=read_wav(decoded)
n=min(len(master),len(actual))
correlation=float(np.corrcoef(master[:n].ravel(),actual[:n].ravel())[0,1])
assert correlation>.99,correlation
assert float(np.max(np.abs(actual)))<1,'Audio clipping'
freq=np.fft.rfftfreq(n,1/48000)
spec=np.abs(np.fft.rfft(master[:n].mean(axis=1)))**2
hf=float(spec[freq>9000].sum()/spec.sum())
data=movie.read_bytes()
moov=data.find(b'moov');mdat=data.find(b'mdat')
assert 0<moov<mdat,'MP4 is not optimized for streaming'
report=dict(file=movie.name,width=1080,height=1920,fps=30,frames=900,duration=30,
    video_codec='H.264',pixel_format='yuv420p',audio_codec='AAC',sample_rate=48000,channels=2,
    full_decode='PASS',fast_start=True,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),
    audio_master_correlation=correlation,decoded_audio_sample_peak_dbfs=20*np.log10(np.max(np.abs(actual))),
    master_energy_above_9khz_fraction=hf)
(root/'QUALITY_REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
