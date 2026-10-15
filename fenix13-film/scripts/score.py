"""FENIX /13: NIGHT ENGINE. Original 30-second stereo music and sound design.

All sounds synthesized here. No downloaded recordings, samples, white noise,
crackle, hats or voice. Clean sub impacts, pitched swishes, metal resonances,
analogue harmonic pads, sequenced plucks, and a bespoke resolving brand motif.
Python 3 + numpy. The final loudness pass uses FFmpeg.
"""
from pathlib import Path
import wave, subprocess, json
import numpy as np

ROOT=Path(__file__).resolve().parent.parent
SR=48000
DUR=30
N=SR*DUR
music=np.zeros((N,2),np.float64)
sfx=np.zeros_like(music)
ident=np.zeros_like(music)
events=[]

def place(bus,x,at,gain=1,pan=0):
    a=round(at*SR)
    if a<0:
        x=x[-a:];a=0
    n=min(len(x),N-a)
    if n<=0:return
    bus[a:a+n,0]+=x[:n]*gain*np.sqrt((1-pan)/2)
    bus[a:a+n,1]+=x[:n]*gain*np.sqrt((1+pan)/2)

def envelope(t,length,attack=.01,decay=.8):
    return (1-np.exp(-t/attack))*np.exp(-t/decay)*np.minimum(1,(length-t)/.12)

def echoes(bus,x,at,gain,pan,spread=.26):
    place(bus,x,at,gain,pan)
    for d,g in [(.1875,.105),(.375,.09),(.5625,.05),(.75,.03)]:
        place(bus,x,at+d,gain*g,-pan if d<.5 else pan+spread)

def pluck(at,f,gain=.16,pan=0,bus=music,length=1.8,bright=1):
    t=np.arange(round(length*SR))/SR
    x=np.zeros_like(t)
    for k,a,d in [(1,1,1.2),(2,.24,.55),(3,.13,.24),(4,.05,.14),(5,.018,.1)]:
        x+=a*(bright if k>1 else 1)*np.sin(2*np.pi*f*k*t)*np.exp(-t/d)
    x*=envelope(t,length,.004,.72)
    echoes(bus,x,at,gain,pan)

def bass(at,f=43.654,gain=.24,length=.43):
    t=np.arange(round(length*SR))/SR
    x=np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*2*f*t)+.07*np.sin(2*np.pi*3*f*t)
    x*=envelope(t,length,.009,.19)
    place(music,x,at,gain)

def pad(at,chord,length,gain=.13,bus=music):
    t=np.arange(round(length*SR))/SR
    env=np.sin(np.clip(np.minimum(t/.75,(length-t)/1.6),0,1)*np.pi/2)**2
    for i,f in enumerate(chord):
        # Slow beating, band-limited harmonic oscillators; no noise layer.
        for offset,pan in [(-.002,-.7),(.002,.7)]:
            x=sum(a*np.sin(2*np.pi*f*k*(1+offset)*t) for k,a in [(1,1),(2,.13),(3,.045)])
            place(bus,x*env,at,gain/len(chord)/2,pan)

def kick(at,gain=.4):
    length=.55;t=np.arange(round(length*SR))/SR
    phase=2*np.pi*(46*t+70*.027*(1-np.exp(-t/.027)))
    x=np.sin(phase)*envelope(t,length,.0025,.105)
    x+=.065*np.sin(2*np.pi*120*t)*envelope(t,length,.002,.032)
    place(music,x,at,gain)

def rim(at,gain=.055,pan=.25):
    length=.19;t=np.arange(round(length*SR))/SR
    x=sum(a*np.sin(2*np.pi*f*t) for f,a in [(360,1),(720,.25),(1060,.09),(1440,.03)])
    x*=envelope(t,length,.0015,.026)
    echoes(music,x,at,gain,pan)

def impact(at,gain=.5,kind='sub'):
    length=2.2;t=np.arange(round(length*SR))/SR
    x=np.sin(2*np.pi*(35*t+90*.06*(1-np.exp(-t/.06))))*envelope(t,length,.003,.34)
    for f,a,d in [(73.4,.21,.65),(146.8,.1,.35),(293.6,.045,.18),(587.2,.012,.1)]:
        x+=a*np.sin(2*np.pi*f*t)*envelope(t,length,.004,d)
    echoes(sfx,x,at,gain,0)
    events.append(dict(time=at,event=kind))

def swish(at,length=.6,gain=.12,up=True,pan=0):
    t=np.arange(round(length*SR))/SR
    # A pitched, softened movement effect: harmonic chirp instead of broadband hiss.
    f0,f1=(140,1050) if up else (1050,100)
    k=np.log(f1/f0)/length
    phase=2*np.pi*f0*(np.exp(k*t)-1)/k
    env=np.sin(np.pi*t/length)**2
    x=(np.sin(phase)+.16*np.sin(2*phase)+.035*np.sin(3*phase))*env
    echoes(sfx,x,at,gain,pan)
    events.append(dict(time=at,event='rising tonal swish' if up else 'falling tonal swish'))

def bell(at,f,gain=.14,pan=0):
    length=4.3;t=np.arange(round(length*SR))/SR
    x=np.zeros_like(t)
    for mult,a,d in [(1,1,1.6),(2,.16,.85),(3.01,.05,.38),(4.01,.014,.24)]:
        x+=a*np.sin(2*np.pi*f*mult*t)*envelope(t,length,.005,d)
    echoes(ident,x,at,gain,pan)

# Opening / ignition: space around the initial musical spark.
pluck(.18,349.228,.25,-.25,length=3.2)
pluck(1.55,523.251,.13,.32,length=2.2)
pluck(2.55,415.305,.1,-.15)
pad(.25,[174.614,207.652,261.626],4.4,.15)
swish(3.4,.58,.16,True,-.2)
impact(4,.6,'tunnel arrival')

# Progressive electronic pulse. F minor -> Ab -> Eb -> F minor.
chords=[[174.614,207.652,261.626],[207.652,261.626,311.127],
        [155.563,196,233.082],[174.614,207.652,261.626]]
roots=[43.654,51.913,38.891,43.654]
arp=[[349.228,523.251,415.305,698.456,523.251,415.305,622.254,523.251],
     [415.305,622.254,523.251,830.609,622.254,523.251,698.456,622.254],
     [311.127,466.164,391.995,622.254,466.164,391.995,523.251,466.164],
     [349.228,523.251,415.305,698.456,622.254,523.251,415.305,523.251]]
for section in range(4):
    start=4+section*4
    pad(start-.2,chords[section],4.8,.18)
    for j in range(8):
        at=start+j*.5
        bass(at+.02,roots[section],.28 if section<2 else .31)
        kick(at,.45 if j%2==0 else .28)
        rim(at+.25,.052 if section<2 else .066,(-1)**j*.35)
    for j in range(16):
        at=start+j*.25
        pluck(at,arp[section][j%8],.15 if j%2==0 else .055,
              .55*np.sin(j*1.7),length=1.3,bright=.7)

# Deliberately designed movement effects, only at visible actions.
for at in [8,10,12,16,17.25,18.5]:
    swish(at-.24,.36,.095,True,(-1)**round(at)*.35)
    impact(at,.30 if at in [17.25,18.5] else .44,'typographic scene impact')
for at in [13.25,14.5]:
    swish(at-.18,.32,.09,False,.3)
    impact(at,.27,'3D word hit')
for at in [16.15,17.4,18.65]:
    pluck(at,698.456,.12,.2,bus=ident)
swish(19.45,.55,.19,False,-.2)
impact(20,.47,'ident threshold')

# Studio ident: a suspenseful breath, then a scored assembly and bright resolve.
pad(20,[87.307,174.614,207.652],4.5,.18,bus=ident)
for at,f,g,p in [(20.8,174.614,.12,-.5),(21.35,261.626,.14,.3),
                 (21.9,349.228,.17,-.25),(22.45,415.305,.18,.35),
                 (22.95,523.251,.19,-.2),(23.4,698.456,.14,.25)]:
    bell(at,f,g,p)
    swish(at-.18,.44,.045,True,p)
swish(23.65,.8,.13,True,-.3)
impact(24.45,.57,'final FENIX logo resolve')
pad(24.1,[174.614,207.652,261.626,349.228],5.9,.25,bus=ident)
for f,g,p in [(349.228,.24,0),(415.305,.13,-.3),(523.251,.12,.3),(1046.50,.05,.45)]:
    bell(24.5,f,g,p)
pluck(26.5,523.251,.1,.3,bus=ident,length=3)
pluck(27.5,415.305,.06,-.3,bus=ident,length=2.4)

# Short reflections on the effects supply space without a continuous noise bed.
# All component levels use one shared scale, so stems reconstruct the mix.
mix=music+sfx+ident
fade=np.minimum(1,np.arange(N)/SR/.025)*np.minimum(1,(DUR-np.arange(N)/SR)/.75)
scale=.86/max(.86,float(np.max(np.abs(mix))))
def write(name,bus):
    x=np.clip(bus*scale*fade[:,None],-.99,.99)
    with wave.open(str(ROOT/'public/audio'/name),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes(np.round(x*32767).astype('<i2').tobytes())
for name,bus in [('music.wav',music),('sound-design.wav',sfx),('brand-motif.wav',ident),('premaster.wav',mix)]:
    write(name,bus)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(ROOT/'public/audio/premaster.wav'),
    '-af','loudnorm=I=-15:TP=-2:LRA=9,volume=-0.7dB','-ar','48000','-t','30',
    str(ROOT/'public/audio/FENIX_ORIGINAL_MASTER.wav')],check=True)
(ROOT/'public/audio/cue-sheet.json').write_text(json.dumps(dict(duration=30,tempo=120,key='F minor',
    composer='Original procedural score for FENIX /13',source='scripts/score.py',
    noise_sources=False,events=events),indent=2))
print('Original 30-second score and synchronized sound-design stems written.')
