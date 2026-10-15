"""FENIX /13: FROM THE WORLD TO TAUNGGYI. Original 32-second stereo score.

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
DUR=32
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

# Geographic overture: a sparse original motif makes room for the travel.
pluck(.2,349.228,.23,-.3,length=3.3)
pad(.1,[87.307,174.614,207.652],5.6,.16)
pluck(2.0,523.251,.11,.3,length=2.7)
pluck(3.5,415.305,.11,-.2)
swish(4.25,.95,.15,True,-.25)
impact(5.05,.39,'globe to Myanmar')
pad(4.7,[130.813,174.614,261.626],4.4,.17)
bell(5.5,523.251,.09,-.3)
swish(7.6,.8,.15,True,.2)
impact(8.15,.34,'Shan highlands zoom')
pad(8,[174.614,207.652,261.626],4.6,.19)
for at,f,p in [(8.8,698.456,-.2),(9.55,830.609,.25),(10.5,1046.50,0)]:
    bell(at,f,.075,p)
    events.append(dict(time=at,event='clean city-locator chime'))
for at in [8,9,10,11]:bass(at+.1,43.654,.14,length=.7)
swish(11.5,.5,.16,False,-.2)

# A progressively stronger electronic groove under CHILL / GRILL / SOCIAL.
chords=[[174.614,207.652,261.626],[207.652,261.626,311.127],[155.563,196,233.082]]
roots=[43.654,51.913,38.891]
arp=[[349.228,523.251,415.305,698.456,523.251,415.305,622.254,523.251],
     [415.305,622.254,523.251,830.609,622.254,523.251,698.456,622.254],
     [311.127,466.164,391.995,622.254,466.164,391.995,523.251,466.164]]
for section in range(3):
    start=12+section*4
    pad(start-.15,chords[section],4.7,.18)
    for j in range(8):
        at=start+j*.5
        bass(at+.025,roots[section],.23+section*.035)
        kick(at,.32+section*.045 if j%2==0 else .22)
        rim(at+.25,.046+section*.008,(-1)**j*.35)
    for j in range(16):
        pluck(start+j*.25,arp[section][j%8],.13 if j%2==0 else .05,
              .55*np.sin(j*1.7),length=1.3,bright=.65)
for at in [12,16,20,20+4/3,20+8/3]:
    swish(at-.25,.4,.10,True,(-1)**round(at)*.3)
    impact(at,.44 if at in [12,16,20] else .3,'brand typographic impact')

# The supplied phoenix identity assembles over an ascending original ident.
impact(24,.4,'phoenix reveal begins')
pad(24,[87.307,174.614,207.652],4.7,.18,bus=ident)
for at,f,g,p in [(24.3,174.614,.12,-.5),(24.85,261.626,.14,.3),
                 (25.4,349.228,.17,-.25),(25.95,415.305,.18,.35),
                 (26.5,523.251,.19,-.2),(27.1,698.456,.14,.25)]:
    bell(at,f,g,p)
    swish(at-.18,.44,.045,True,p)
swish(27.3,.7,.13,True,-.3)
impact(28,.55,'FENIX /13 CHILL & GRILL logo resolve')
pad(27.5,[174.614,207.652,261.626,349.228],4.5,.25,bus=ident)
for f,g,p in [(349.228,.23,0),(415.305,.13,-.3),(523.251,.12,.3),(1046.50,.05,.45)]:
    bell(28,f,g,p)
pluck(29.5,523.251,.085,.3,bus=ident,length=2.5)
pluck(30.5,415.305,.06,-.3,bus=ident,length=1.5)

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
    '-af','loudnorm=I=-15:TP=-2:LRA=9,volume=-0.7dB','-ar','48000','-t',str(DUR),
    str(ROOT/'public/audio/FENIX_ORIGINAL_MASTER.wav')],check=True)
(ROOT/'public/audio/cue-sheet.json').write_text(json.dumps(dict(duration=DUR,tempo=120,key='F minor',
    composer='Original procedural score for FENIX /13',source='scripts/score.py',
    noise_sources=False,events=events),indent=2))
print('Original 32-second geographic score and synchronized sound-design stems written.')
