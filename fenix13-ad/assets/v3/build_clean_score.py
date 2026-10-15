"""Original clean FENIX V3 music. Deterministic tonal synthesis; no noise/sample sources.

20 seconds, F minor, 120 BPM. Mellow piano-like partials, gentle sine bass,
stereo pads, and an original resolving logo chime. Every attack is smoothed.
"""
from pathlib import Path
import wave
import numpy as np

SR = 48000
N = SR * 20
root = Path(__file__).resolve().parent
music = np.zeros((N, 2), np.float64)
logo = np.zeros_like(music)


def place(bus, mono, at, gain=1., pan=0.):
    a = round(at * SR)
    n = min(len(mono), N - a)
    if n <= 0:
        return
    bus[a:a+n, 0] += mono[:n] * gain * np.sqrt((1-pan)/2)
    bus[a:a+n, 1] += mono[:n] * gain * np.sqrt((1+pan)/2)


def note(at, f, length=2.5, gain=.15, pan=0., bus=music):
    t = np.arange(round(length * SR)) / SR
    env = (1-np.exp(-t/.009)) * np.exp(-t/.72) * np.minimum(1, (length-t)/.08)
    tone = np.zeros_like(t)
    for k, amp, decay in [(1, 1., .95), (2, .25, .5), (3, .10, .24),
                           (4, .035, .18), (6, .009, .12)]:
        tone += amp * np.sin(2*np.pi*f*k*t) * np.exp(-t/decay)
    sample = tone * env
    place(bus, sample, at, gain, pan)
    place(bus, sample, at+.375, gain*.12, -pan)
    place(bus, sample, at+.75, gain*.045, pan)


def pad(at, chord, length, gain=.07):
    t = np.arange(round(length * SR)) / SR
    env = np.minimum(1, t/.8) * np.minimum(1, (length-t)/1.2)
    env = np.sin(np.clip(env, 0, 1)*np.pi/2)**2
    for i, f in enumerate(chord):
        tone = np.sin(2*np.pi*f*t) + .16*np.sin(2*np.pi*f*2*t)
        place(music, tone*env, at, gain/len(chord), -.55+i*.36)


def soft_bass(at, f=43.654, gain=.10, length=.39):
    t = np.arange(round(length*SR))/SR
    env = (1-np.exp(-t/.018)) * np.exp(-t/.16) * np.minimum(1, (length-t)/.05)
    place(music, (np.sin(2*np.pi*f*t)+.08*np.sin(2*np.pi*f*2*t))*env, at, gain)


def round_hit(at, gain=.14):
    t = np.arange(round(.45*SR))/SR
    phase = 2*np.pi*(45*t + 29*.035*(1-np.exp(-t/.035)))
    env = (1-np.exp(-t/.006))*np.exp(-t/.11)*np.minimum(1, (.45-t)/.05)
    place(music, np.sin(phase)*env, at, gain)


def bell(at, f, gain=.12):
    t=np.arange(round(3.5*SR))/SR
    env=(1-np.exp(-t/.008))*np.exp(-t/1.2)*np.minimum(1,(3.5-t)/.1)
    tone=np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2*t)*np.exp(-t/.3)
    place(logo,tone*env,at,gain,np.sin(f)*.35)


# Opening: one clear note, then a warm bed, no fire/crackle/noise ambience.
note(.18, 349.228, gain=.18, pan=-.2)
note(1.5, 523.251, gain=.085, pan=.24)
pad(.2, [174.614, 207.652, 261.626], 5.0, .075)
pad(3.7, [155.563, 207.652, 261.626], 5.0, .08)
pad(7.7, [155.563, 196.0, 233.082], 5.0, .075)
pad(11.4, [130.813, 174.614, 207.652], 3.7, .085)
pad(15.0, [174.614, 207.652, 261.626, 349.228], 5.0, .135)

# Quiet plucked ostinato: musical pitch replaces the old noisy hats.
sequence = [349.228, 523.251, 415.305, 311.127, 349.228, 622.254, 523.251, 415.305]
for i, at in enumerate(np.arange(3,14.25,.5)):
    note(float(at),sequence[i%len(sequence)],length=1.65,
         gain=.115 if i%2==0 else .065,pan=.35*np.sin(i*1.7))
for i, at in enumerate(np.arange(3,14.1,.5)):
    soft_bass(float(at+.04), [43.654,43.654,51.913,38.891][(i//4)%4],.095)
for at in [3,6,9,10,11,12,12.75,13.5]:
    round_hit(at,.17 if at in [3,6,9,12] else .10)

# Studio-ident motif: a clean ascending original phrase resolves over the name.
for at,f,gain in [(14.65,261.626,.10),(15.10,349.228,.13),(15.55,415.305,.14),
                  (16.0,523.251,.15),(16.45,622.254,.09),(16.9,523.251,.16)]:
    bell(at,f,gain)
soft_bass(16.9,43.654,.17,length=.8)
note(17.35,349.228,length=2.5,gain=.16)
note(17.35,415.305,length=2.5,gain=.08,pan=-.3)
note(17.35,523.251,length=2.5,gain=.07,pan=.3)

tt=np.arange(N)/SR
fade=np.minimum(1,tt/.035)*np.minimum(1,(20-tt)/.48)
peak=np.max(np.abs(music+logo))
scale=.82/max(peak,.82)
for name,samples in [('music',music),('logo-chime',logo),('mix',music+logo)]:
    pcm=np.clip(samples*fade[:,None]*scale,-.98,.98)
    with wave.open(str(root/f'clean-{name}.wav'),'wb') as out:
        out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR)
        out.writeframes((pcm*32767).astype('<i2').tobytes())
freq=np.fft.rfftfreq(N,1/SR)
energy=np.abs(np.fft.rfft((music+logo).mean(axis=1)))**2
fraction=float(energy[freq>9000].sum()/energy.sum())
print(f'20-second original clean tonal score. Energy above 9 kHz: {fraction:.9%}')
