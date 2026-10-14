"""Original FENIX /13 score. No samples, AI music, or third-party recordings.

120 BPM / F minor / 20 seconds. Stem sources are mathematical oscillators and
seeded noise. Run `python3 assets/build_score_v2.py`, then master the mix with
the FFmpeg command in README.md. NumPy is the only generator dependency.
"""
from pathlib import Path
import wave
import numpy as np

RATE = 48000
DURATION = 20
N = RATE * DURATION
ROOT = Path(__file__).resolve().parent
rng = np.random.default_rng(13013)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)


def place(bus, samples, at, gain=1., pan=0.):
    start = round(at * RATE)
    if start < 0:
        samples = samples[-start:]
        start = 0
    length = min(len(samples), N - start)
    if length <= 0:
        return
    if samples.ndim == 1:
        stereo = np.column_stack((samples * np.sqrt((1 - pan) / 2),
                                  samples * np.sqrt((1 + pan) / 2)))
    else:
        stereo = samples
    bus[start:start + length] += stereo[:length] * gain


def kick(at, gain=1.):
    t = np.arange(int(.7 * RATE)) / RATE
    phase = 2 * np.pi * (43.65 * t + 115 * .028 * (1 - np.exp(-t / .028)))
    body = np.sin(phase) * np.exp(-t / .14) * (1 - np.exp(-t / .001))
    click = rng.normal(size=len(t)) * np.exp(-t / .006) * .07
    place(music, np.tanh((body + click) * 1.35), at, gain * .74)


def bass(at, frequency, gain=.26, length=.39):
    t = np.arange(int(length * RATE)) / RATE
    env = (1 - np.exp(-t / .007)) * np.exp(-t / .23)
    env *= np.minimum(1, (length - t) / .025)
    oscillator = np.sin(2 * np.pi * frequency * t)
    oscillator += .23 * np.sin(2 * np.pi * 2 * frequency * t)
    oscillator += .10 * np.sin(2 * np.pi * 3 * frequency * t)
    place(music, np.tanh(oscillator * 1.5) * env, at, gain)


def hat(at, gain=.06, pan=0., length=.085):
    t = np.arange(int(length * RATE)) / RATE
    noise = rng.normal(size=len(t))
    bright = noise - np.concatenate(([0], noise[:-1]))
    place(music, bright * np.exp(-t / .018), at, gain, pan)


def snare(at, gain=.14):
    t = np.arange(int(.22 * RATE)) / RATE
    noise = rng.normal(size=len(t))
    airy = noise - np.concatenate(([0], noise[:-1])) * .8
    body = np.sin(2 * np.pi * 180 * t) * np.exp(-t / .028)
    place(music, airy * np.exp(-t / .043) * .3 + body * .4, at, gain)


def pluck(at, frequency, gain=.07, pan=0.):
    t = np.arange(int(.9 * RATE)) / RATE
    env = (1 - np.exp(-t / .002)) * np.exp(-t / .14)
    phase = 2 * np.pi * frequency * t
    tone = np.sin(phase + 1.9 * np.exp(-t / .055) * np.sin(phase * 2))
    sample = tone * env
    place(music, sample, at, gain, pan)
    place(music, sample, at + .375, gain * .27, -pan)
    place(music, sample, at + .75, gain * .12, pan)


def impact(at, gain=.6):
    t = np.arange(int(1.8 * RATE)) / RATE
    phase = 2 * np.pi * (32.7 * t + 36 * .08 * (1 - np.exp(-t / .08)))
    rumble = np.sin(phase) * np.exp(-t / .3)
    grit = rng.normal(size=len(t))
    grit = np.convolve(grit, np.ones(18) / 18, mode='same')
    sound = (rumble + .34 * grit) * (1 - np.exp(-t / .002))
    sound += .1 * np.sin(2 * np.pi * 87.3 * t) * np.exp(-t / .7)
    place(sfx, sound, at, gain)


def sweep(at, length=.6, gain=.11):
    t = np.arange(int(length * RATE)) / RATE
    noise = rng.normal(size=len(t))
    smooth = np.convolve(noise, np.ones(5) / 5, mode='same')
    env = np.sin(np.pi * t / length) ** 2
    sound = smooth * env
    left = sound * (.6 + .4 * np.cos(np.pi * t / length))
    right = sound * (.6 - .4 * np.cos(np.pi * t / length))
    place(sfx, np.column_stack((left, right)), at, gain)


# Low warm pad: evolving oscillator chords, slow stereo detuning.
t = np.arange(N) / RATE
pad = np.zeros((N, 2))
for base, weight in [(174.61, 1), (207.65, .62), (261.63, .42), (349.23, .24)]:
    for ch, detune in [(0, -.003), (1, .003)]:
        pad[:, ch] += np.sin(2 * np.pi * base * (1 + detune) * t) * weight
pad *= .022 * (1 - np.exp(-t / 2))[:, None]
pad *= (.62 + .38 * np.sin(np.pi * np.clip(t / 20, 0, 1)))[:, None]
music += pad

# Sparse ember clicks in the hook, and transitions with real silence/space.
impact(.24, .26)
for at in [.14, .39, .75, 1.02, 1.42, 1.88, 2.39]:
    hat(at, .011, pan=np.sin(at * 4) * .7, length=.045)
for at in [2.64, 5.64, 8.66, 11.64, 14.48]:
    sweep(at, .62, .20)
for at in [3., 6., 9., 12., 15.]:
    impact(at, .38 if at != 15 else .82)

# A syncopated low-end groove; arrivals are all on the half-second grid.
for at in np.arange(3, 14.8, .5):
    kick(float(at), .53 if int((at - 3) * 2) % 4 else .78)
    root_note = [43.65, 43.65, 51.91, 38.89][int((at - 3) / 2) % 4]
    bass(float(at + .125), root_note, .20)
    if at >= 9:
        bass(float(at + .375), root_note * 2, .065, .13)
for i, at in enumerate(np.arange(3.25, 15, .25)):
    hat(float(at), .042 if i % 2 else .055, (-1 if i % 2 else 1) * .28)
for at in np.arange(3.5, 15, 1.):
    snare(float(at), .23)
notes = [349.23, 415.30, 523.25, 622.25, 523.25, 415.30]
for i, at in enumerate(np.arange(6, 15, .5)):
    pluck(float(at + .125), notes[i % len(notes)], .088, .38 * np.sin(i))

# Accelerating electronic riser into the brand arrival.
length = 2.45
rt = np.arange(int(length * RATE)) / RATE
phase = 2 * np.pi * (100 * rt + 160 * rt ** 2)
carrier = np.sin(phase) + .4 * np.sin(phase * 2.003)
riser_noise = rng.normal(size=len(rt)) * .15
riser = (carrier * .25 + riser_noise) * (rt / length) ** 2
riser *= np.minimum(1, (length - rt) / .09)
place(sfx, riser, 12.55, .20, -.12)

# Tail: a warm, wide resolving chord; logo should be allowed to breathe.
for at, freq, gain in [(15.03, 174.61, .15), (15.04, 207.65, .10),
                       (15.07, 261.63, .09), (15.1, 349.23, .08),
                       (16.5, 523.25, .045), (17.5, 415.30, .04)]:
    tt = np.arange(int(4.5 * RATE)) / RATE
    tone = (np.sin(2 * np.pi * freq * tt) + .18 * np.sin(2 * np.pi * freq * 2 * tt))
    tone *= (1 - np.exp(-tt / .02)) * np.exp(-tt / 1.4)
    place(music, tone, at, gain, .28 * np.sin(freq))

# Short, quiet stereo reflections; sub bass stays dry.
ref = music.copy()
for delay, gain in [(.1875, .09), (.375, .05), (.5625, .025)]:
    d = round(delay * RATE)
    music[d:] += ref[:-d, ::-1] * gain
mix = music + sfx
fade = np.minimum(1, t / .06) * np.minimum(1, (DURATION - t) / .55)
peak = np.max(np.abs(mix))
scale = .89 / max(peak, 1.)


def write(name, samples):
    data = np.clip(samples * fade[:, None] * scale, -.999, .999)
    with wave.open(str(ROOT / name), 'wb') as out:
        out.setnchannels(2)
        out.setsampwidth(2)
        out.setframerate(RATE)
        out.writeframes((data * 32767).astype('<i2').tobytes())


write('fenix13_v2_music.wav', music)
write('fenix13_v2_sfx.wav', sfx)
write('fenix13_v2_mix.wav', mix)
print(f'Original score written: {DURATION}s, {RATE} Hz stereo; seed 13013.')
