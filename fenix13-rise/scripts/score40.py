"""Original 40-second FENIX score: clean beats, phoenix flight and glyph cues.

120 BPM with half-time emphasis. All sounds are synthesized here. No recorded
samples, voice, noise generators, hiss beds, crackle or noisy hi-hats.
The included stems have a shared gain so they reconstruct the premaster.
"""
from pathlib import Path
import json, wave, subprocess
import numpy as np

ROOT=Path(__file__).resolve().parent.parent
SR=48000; DUR=40; N=SR*DUR
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

def rhodes(at,notes,gain=.12,length=2.8):
    """Bell-tine electric piano: damped FM attack, warm fundamental sustain."""
    t=np.arange(round(length*SR))/SR
    for j,f in enumerate(notes):
        phase=2*np.pi*f*t
        modulation=.8*np.exp(-t/.13)*np.sin(phase*2)
        x=np.sin(phase+modulation)*env(t,length,.008,1.25)
        x+=.15*np.sin(phase*2)*env(t,length,.005,.27)
        space(music,x,at+j*.012,gain/np.sqrt(len(notes)),(j/(len(notes)-1)-.5)*1.2)

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

F=[174.614,207.652,261.626]; DB=[138.591,174.614,207.652]; AB=[207.652,261.626,311.127]; EB=[155.563,196,233.082]
pad(0,[87.307,174.614,207.652],4.6,.17)
pluck(.1,349.228,.19,-.25,length=3)
swish(3.6,.7,.10,True,-.25,'Myanmar approach');impact(4.1,.28,'Myanmar locator')
pad(3.8,F,3.9,.17);bell(4.6,523.251,.07,.2)
swish(6.6,.7,.10,True,.25,'Taunggyi approach');impact(7.1,.3,'Taunggyi locator')
pad(6.8,[130.813,174.614,261.626],3.9,.17)
for at,f in [(7.5,698.456),(8.4,830.609),(9.1,1046.5)]:bell(at,f,.055)

sections=[(10,4,F,43.654),(14,4,DB,34.648),(18,3,AB,51.913),(21,3,EB,38.891),(24,3,F,43.654)]
for n,(start,length,chord,root) in enumerate(sections):
    pad(start-.1,chord,length+.7,.18)
    for j in range(length*2):
        at=start+j*.5
        kick(at,.34 if j%2==0 else .2);bass(at+.025,root,.22,length=.45)
        if j%2:rim(at,.065,(-1)**j*.3)
        pluck(at,chord[j%3]*2,.075 if j%2 else .11,.35*np.sin(j*1.5),length=1.6)
    rhodes(start+.02,chord+[chord[0]*2],.17,length+1)
    rhodes(start+1.25,chord,.09,2)
    tom(start+length-.25,110,.1)
    swish(start-.25,.55,.08,True,.2,'scene sweep');impact(start,.31,'scene beat')

pad(26.7,[87.307,174.614,207.652],4,.2,bus=ident)
impact(27,.35,'phoenix return');swish(27.2,.8,.1,True,-.5,'banking flight')
for at in [27.3,29.38,31.46]:swish(at,.42,.035,False,.2,'wing stroke')
letter_times=[30.1+i*.22 for i in range(8)]
for i,(at,f) in enumerate(zip(letter_times,[174.614,207.652,261.626,349.228,415.305,523.251,622.254,698.456])):
    bell(at+.05,f,.095,(-1)**i*.25);events.append(dict(time=at,event='3D logo glyph '+list('FENIX/13')[i]))
pad(30,F+[349.228],5.6,.21,bus=ident)
swish(31.9,1.1,.13,True,.15,'phoenix absorption')
impact(32.8,.43,'phoenix crest joins');swish(33.1,1.15,.08,True,-.2,'logo light orbit')
impact(34.65,.4,'full brand resolves')
for f,g,p in [(349.228,.19,0),(415.305,.1,-.3),(523.251,.1,.3),(1046.5,.035,.4)]:bell(34.7,f,g,p)
pad(34.4,F+[349.228],5.6,.24,bus=ident)
pluck(36.6,523.251,.075,.3,bus=ident,length=3)
pluck(38.2,415.305,.05,-.3,bus=ident,length=1.8)

for at in np.arange(10,27,.5):
    start=round(at*SR);n=min(round(.32*SR),N-start)
    music[start:start+n]*=(1-.16*np.exp(-np.arange(n)/SR/.095))[:,None]
mix=music+beats+sfx+ident
fade=np.minimum(1,np.arange(N)/SR/.035)*np.minimum(1,(DUR-np.arange(N)/SR)/1.0)
scale=.86/max(.86,float(np.max(np.abs(mix))))
out=ROOT/'public/audio';out.mkdir(parents=True,exist_ok=True)
for name,bus in [('music',music),('beats',beats),('sound-design',sfx),('brand-motif',ident),('premaster',mix)]:
    x=np.clip(bus*scale*fade[:,None],-.99,.99)
    with wave.open(str(out/(name+'.wav')),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.round(x*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(out/'premaster.wav'),'-af','loudnorm=I=-15:TP=-2:LRA=10,volume=-0.7dB','-ar','48000','-t','40',str(out/'FENIX_ORIGINAL_MASTER.wav')],check=True)
(out/'cue-sheet.json').write_text(json.dumps(dict(duration=40,tempo=120,key='F minor',composer='Original FENIX /13 score',source='scripts/score40.py',noise_sources=False,letter_times=letter_times,events=events),indent=2))
print('Original 40-second score and synchronized 3D-ident cues written.')
