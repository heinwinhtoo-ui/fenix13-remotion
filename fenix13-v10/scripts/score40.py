"""Original 40-second FENIX score: clean beats, phoenix flight and brand cues.

120 BPM with half-time emphasis. All sounds are synthesized here. No recorded
samples, voice or continuous hiss bed. V10 adds brief original band-limited
sizzle, crackle and wing-air cues at low level.
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

# V10 original arrangement: restrained transient textures, never a hiss bed.
rng=np.random.default_rng(13)
def texture(at,length,gain,lo=400,hi=3500,pan=0,event='air movement'):
 n=round(length*SR);t=np.arange(n)/SR;noise=rng.normal(0,1,n)
 spectrum=np.fft.rfft(noise);freq=np.fft.rfftfreq(n,1/SR)
 spectrum*=np.exp(-(freq/hi)**6)*(1-np.exp(-(freq/lo)**4))
 x=np.fft.irfft(spectrum,n);x/=max(1,np.max(np.abs(x)))
 x*=np.sin(np.pi*t/length)**2*(.75+.25*np.sin(2*np.pi*33*t))
 place(sfx,x,at,gain,pan);events.append(dict(time=at,event=event))
F=[174.614,207.652,261.626];DB=[138.591,174.614,207.652];AB=[207.652,261.626,311.127];EB=[155.563,196,233.082]
pad(0,[65.406,130.813,174.614],3.8,.12)
impact(.35,.32,'ember ignition');texture(.35,.22,.035,300,2400,event='small ignition')
pluck(.65,349.228,.13,-.2,length=3)
swish(2.75,.7,.09,True,-.25,'globe approach');pad(2.7,F,3.8,.14)
swish(4.35,.65,.07,True,.2,'Taunggyi approach');bell(5.0,523.251,.075,.2)
for n,(start,length,chord,root) in enumerate([(6,5,F,43.654),(11,5,DB,34.648),(16,4,AB,51.913),(20,4,EB,38.891),(24,3,F,43.654)]):
 pad(start-.12,chord,length+.6,.18)
 for j in range(length*2):
  at=start+j*.5;kick(at,.26 if j%2==0 else .14);bass(at+.025,root,.19,.46)
  if j%2:rim(at,.047,(-1)**j*.25)
  pluck(at,chord[j%3]*2,.075 if j%2 else .095,.3*np.sin(j*1.5),length=1.7)
 rhodes(start+.03,chord+[chord[0]*2],.17,length+.3)
 rhodes(start+1.5,chord,.09,2.5)
 swish(start-.19,.45,.048,True,.2,'light transition');impact(start,.22,'scene accent')
# Small glass/ice resonances, no voices or sampled recordings.
for at,f in [(6.5,1396.9),(6.57,1661.2),(8.4,1046.5)]:bell(at,f,.027,.2)
for at,d,g in [(11.35,.4,.025),(12.15,.7,.042),(13.8,.55,.033),(15.0,.35,.022)]:texture(at,d,g,700,4700,event='synthesized grill sizzle')
texture(11.05,.35,.032,180,1600,event='charcoal flame swell')
for at in [11.32,11.58,12.22,13.87]:texture(at,.045,.022,900,3600,event='small charcoal crack')
pad(26.5,[87.307,174.614,207.652],4.2,.22,bus=ident)
swish(26.6,1.0,.10,True,0,'embers gather');impact(27.6,.22,'phoenix anticipation')
for at in [28.6,29.36]:
 texture(at-.12,.42,.13,170,1700,pan=-.12 if at<29 else .12,event='power downstroke air')
 swish(at-.13,.38,.055,False,0,'wing power stroke');impact(at,.25,'wing weight')
 texture(at+.02,.18,.027,900,4200,event='reactive embers')
swish(30.05,.95,.075,True,-.4,'banking glide')
pad(29.7,[130.813,174.614,207.652,261.626,349.228],5.5,.24,bus=ident)
for at,f in [(31.25,349.228),(31.8,415.305),(32.4,523.251)]:bell(at,f,.09,.2)
swish(32.55,1.5,.12,True,.1,'creature to emblem');texture(32.7,.65,.035,400,2200,event='ember transformation')
impact(34.35,.38,'FENIX brand resolution')
for f,g,p in [(349.228,.18,0),(415.305,.09,-.3),(523.251,.1,.3),(1046.5,.03,.4)]:bell(34.4,f,g,p)
pad(34.25,F+[349.228],5.75,.22,bus=ident)
pluck(36.65,523.251,.065,.3,bus=ident,length=3);pluck(38.0,415.305,.035,-.3,bus=ident,length=2)
letter_times=[]
for at in np.arange(6,27,.5):
 a=round(at*SR);n=min(round(.32*SR),N-a);music[a:a+n]*=(1-.13*np.exp(-np.arange(n)/SR/.095))[:,None]
mix=music+beats+sfx+ident
fade=np.minimum(1,np.arange(N)/SR/.035)*np.minimum(1,(DUR-np.arange(N)/SR)/1.0)
scale=.86/max(.86,float(np.max(np.abs(mix))))
out=ROOT/'public/audio';out.mkdir(parents=True,exist_ok=True)
for name,bus in [('music',music),('beats',beats),('sound-design',sfx),('brand-motif',ident),('premaster',mix)]:
    x=np.clip(bus*scale*fade[:,None],-.99,.99)
    with wave.open(str(out/(name+'.wav')),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.round(x*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(out/'premaster.wav'),'-af','loudnorm=I=-15:TP=-2:LRA=10,volume=-0.7dB','-ar','48000','-t','40',str(out/'FENIX_ORIGINAL_MASTER.wav')],check=True)
(out/'cue-sheet.json').write_text(json.dumps(dict(duration=40,tempo=120,key='F minor',composer='Original FENIX /13 score',source='scripts/score40.py',noise_sources="Brief original band-limited transient effects only",letter_times=letter_times,events=events),indent=2))
print('Original 40-second score and synchronized 3D-ident cues written.')
