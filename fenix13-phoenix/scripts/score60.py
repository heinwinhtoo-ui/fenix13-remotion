"""Original 60-second FENIX score: clean beats, phoenix flight and glyph cues.

120 BPM with half-time emphasis. All sounds are synthesized here. No recorded
samples, voice, noise generators, hiss beds, crackle or noisy hi-hats.
The included stems have a shared gain so they reconstruct the premaster.
"""
from pathlib import Path
import json, wave, subprocess
import numpy as np

ROOT=Path(__file__).resolve().parent.parent
SR=48000; DUR=60; N=SR*DUR
music=np.zeros((N,2),np.float64)
beats=np.zeros_like(music); sfx=np.zeros_like(music); ident=np.zeros_like(music)
events=[]

def place(bus,x,at,gain=1,pan=0):
    a=round(at*SR)
    if a<0:x=x[-a:];a=0
    n=min(len(x),N-a)
    if n<=0:return
    pan=np.clip(pan,-.98,.98)
    bus[a:a+n,0]+=x[:n]*gain*np.sqrt((1-pan)/2)
    bus[a:a+n,1]+=x[:n]*gain*np.sqrt((1+pan)/2)

def env(t,length,attack=.01,decay=.8):
    return (1-np.exp(-t/attack))*np.exp(-t/decay)*np.minimum(1,(length-t)/.12)

def space(bus,x,at,gain,pan):
    place(bus,x,at,gain,pan)
    for d,g in [(.25,.10),(.5,.075),(.75,.035),(.93,.018)]:
        place(bus,x,at+d,gain*g,-pan)

def pluck(at,f,gain=.12,pan=0,bus=music,length=2.2):
    t=np.arange(round(length*SR))/SR
    x=np.zeros_like(t)
    for k,a,d in [(1,1,1.2),(2,.22,.55),(3,.09,.24),(4,.028,.14)]:
        x+=a*np.sin(2*np.pi*f*k*t)*np.exp(-t/d)
    space(bus,x*env(t,length,.006,.8),at,gain,pan)

def pad(at,chord,length,gain=.16,bus=music):
    t=np.arange(round(length*SR))/SR
    shape=np.sin(np.clip(np.minimum(t/1.2,(length-t)/1.8),0,1)*np.pi/2)**2
    for f in chord:
        for detune,pan in [(-.0015,-.7),(.0015,.7)]:
            x=np.sin(2*np.pi*f*(1+detune)*t)+.12*np.sin(2*np.pi*f*2*(1+detune)*t)
            place(bus,x*shape,at,gain/len(chord)/2,pan)

def bass(at,f=43.654,gain=.23,length=.65):
    t=np.arange(round(length*SR))/SR
    x=np.sin(2*np.pi*f*t)+.26*np.sin(2*np.pi*f*2*t)+.07*np.sin(2*np.pi*f*3*t)
    place(music,x*env(t,length,.012,.24),at,gain)

def kick(at,gain=.4):
    length=.58;t=np.arange(round(length*SR))/SR
    phase=2*np.pi*(45*t+80*.029*(1-np.exp(-t/.029)))
    x=np.sin(phase)*env(t,length,.0028,.13)
    x+=.06*np.sin(2*np.pi*120*t)*env(t,length,.0025,.035)
    place(beats,x,at,gain)

def rim(at,gain=.075,pan=.25):
    length=.23;t=np.arange(round(length*SR))/SR
    x=(np.sin(2*np.pi*360*t)+.3*np.sin(2*np.pi*720*t)+.09*np.sin(2*np.pi*1060*t))*env(t,length,.002,.035)
    space(beats,x,at,gain,pan)

def tom(at,f=110,gain=.15):
    length=.4;t=np.arange(round(length*SR))/SR
    phase=2*np.pi*(f*t+f*.25*.025*(1-np.exp(-t/.025)))
    place(beats,np.sin(phase)*env(t,length,.003,.105),at,gain,.2)

def bell(at,f,gain=.14,pan=0):
    length=4.4;t=np.arange(round(length*SR))/SR
    x=np.zeros_like(t)
    for m,a,d in [(1,1,1.7),(2,.14,.8),(3.01,.035,.35)]:
        x+=a*np.sin(2*np.pi*f*m*t)*env(t,length,.006,d)
    space(ident,x,at,gain,pan)

def impact(at,gain=.43,event='scene impact'):
    length=2.5;t=np.arange(round(length*SR))/SR
    phase=2*np.pi*(36*t+85*.065*(1-np.exp(-t/.065)))
    x=np.sin(phase)*env(t,length,.004,.4)
    for f,a,d in [(73.4,.2,.7),(146.8,.08,.32),(293.6,.028,.17)]:
        x+=a*np.sin(2*np.pi*f*t)*env(t,length,.005,d)
    space(sfx,x,at,gain,0);events.append(dict(time=at,event=event))

def swish(at,length=.75,gain=.1,up=True,pan=0,event='tonal movement'):
    t=np.arange(round(length*SR))/SR
    f0,f1=(100,720) if up else (720,100)
    k=np.log(f1/f0)/length
    phase=2*np.pi*f0*(np.exp(k*t)-1)/k
    shape=np.sin(np.pi*t/length)**2
    x=(np.sin(phase)+.12*np.sin(2*phase)+.018*np.sin(3*phase))*shape
    space(sfx,x,at,gain,pan);events.append(dict(time=at,event=event))

F=[174.614,207.652,261.626]; AB=[207.652,261.626,311.127]; EB=[155.563,196,233.082]
# Earth / Myanmar / Taunggyi: sparse, spacious, legible pacing.
pad(.1,[87.307,174.614,207.652],7,.16)
pluck(.25,349.228,.22,-.3,length=3.6)
pluck(2.5,523.251,.1,.25,length=3)
swish(1.9,.65,.055,True,-.5,'first phoenix hint')
swish(3.5,.65,.05,True,.45,'phoenix departs')
swish(5.45,.95,.14,True,-.2,'globe to Myanmar')
impact(6.15,.35,'Myanmar arrival')
pad(5.8,F,6.2,.17)
bell(7.1,523.251,.085,-.3)
pluck(8.5,415.305,.1,.3)
swish(10.7,1,.14,True,.25,'Shan and Taunggyi zoom')
impact(11.45,.33,'Taunggyi locator')
pad(10.8,[130.813,174.614,261.626],7.8,.19)
for at,f,p in [(12.4,698.456,-.2),(13.7,830.609,.25),(15,1046.50,0)]:
    bell(at,f,.065,p)
for at in [12,13.5,15,16.5]:
    bass(at+.05,43.654,.13,length=.8);kick(at,.18)

# Half-time lounge pulse, then a stronger grill / friends groove. No hiss hats.
sections=[(18,F,43.654),(22,AB,51.913),(26,F,43.654),(30,EB,38.891),
          (34,AB,51.913),(38,F,43.654)]
motifs=[[349.228,523.251,415.305,523.251,349.228,622.254,523.251,415.305],
        [415.305,622.254,523.251,622.254,415.305,698.456,622.254,523.251],
        [311.127,466.164,391.995,466.164,311.127,523.251,466.164,391.995]]
for section,(start,chord,root) in enumerate(sections):
    pad(start-.15,chord,4.9,.18)
    energetic=start>=26
    for j in range(8):
        at=start+j*.5
        if j%2==0 or energetic:
            kick(at,.4 if j%2==0 else .26)
            bass(at+.025,root,.23 if not energetic else .28,length=.48)
        if j%2:rim(at,.065 if not energetic else .085,(-1)**j*.3)
        pluck(at,motifs[section%3][j],.12 if j%2==0 else .07,.45*np.sin(j*1.7),length=1.8)
    if energetic:
        for d,f in [(2.75,146.8),(3.25,110),(3.5,73.4)]:tom(start+d,f,.12)

for at in [18,26,34,34+8/3,34+16/3,42]:
    swish(at-.45,.75,.095,True,(-1)**round(at)*.25,'editorial scene sweep')
    impact(at,.42 if at in [18,26,34,42] else .29,'scene beat impact')

# Return of the phoenix: wing gestures, suspense, and individually scored glyphs.
pad(41.7,[87.307,174.614,207.652],6.2,.18,bus=ident)
swish(42.3,1.1,.13,True,-.55,'phoenix returns from left')
swish(44.3,1.2,.12,True,.55,'phoenix banks through frame')
for i in range(8):
    at=43+i/.85
    swish(at,.34,.025,False,.45*np.sin(i),'soft wing stroke')
letter_times=[46+i*.65 for i in range(8)]
notes=[174.614,207.652,261.626,349.228,415.305,523.251,622.254,698.456]
for i,(at,f) in enumerate(zip(letter_times,notes)):
    bell(at+.08,f,.13 if i<5 else .105,(-1)**i*.28)
    tom(at+.05,146.8,.055)
    events.append(dict(time=at,event='logo glyph '+list('FENIX/13')[i]))
pad(46,F+[349.228],7.2,.18,bus=ident)
swish(51.7,1.15,.12,True,.15,'phoenix merges with crest')
impact(52.8,.5,'phoenix and FENIX wordmark unite')
for f,g,p in [(349.228,.2,0),(415.305,.11,-.3),(523.251,.11,.3),(1046.50,.04,.4)]:bell(52.9,f,g,p)
pad(52.3,F+[349.228],7.7,.25,bus=ident)
bell(54.2,698.456,.07,.2)
pluck(56.5,523.251,.08,.3,bus=ident,length=3)
pluck(58,415.305,.055,-.3,bus=ident,length=2)

mix=music+beats+sfx+ident
fade=np.minimum(1,np.arange(N)/SR/.035)*np.minimum(1,(DUR-np.arange(N)/SR)/1.1)
scale=.86/max(.86,float(np.max(np.abs(mix))))
out=ROOT/'public/audio';out.mkdir(parents=True,exist_ok=True)
for name,bus in [('music',music),('beats',beats),('sound-design',sfx),('brand-motif',ident),('premaster',mix)]:
    x=np.clip(bus*scale*fade[:,None],-.99,.99)
    with wave.open(str(out/(name+'.wav')),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes(np.round(x*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(out/'premaster.wav'),
    '-af','loudnorm=I=-15:TP=-2:LRA=10,volume=-0.7dB','-ar','48000','-t','60',str(out/'FENIX_ORIGINAL_MASTER.wav')],check=True)
(out/'cue-sheet.json').write_text(json.dumps(dict(duration=60,tempo=120,feel='half-time emphasis',key='F minor',
    composer='Original FENIX /13 score',source='scripts/score60.py',noise_sources=False,letter_times=letter_times,events=events),indent=2))
print('Original 60-second score, separate beat stem, flight effects and eight glyph cues written.')
