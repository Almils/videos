"""Synthesises the sound-effects bed (whooshes, pops, thuds, dings) in sync
with src/timeline.ts. Re-run after re-timing scenes:  python3 scripts/sfx.py"""
import re
import wave
from pathlib import Path

import numpy as np

SR = 48000
FPS = 60
ROOT = Path(__file__).resolve().parent.parent

# ── read scene durations from the timeline ──
src = (ROOT / 'src/timeline.ts').read_text()
scenes = re.findall(r"\{id: '(\w+)', seconds: ([\d.]+)", src)
start, t = {}, 0
for sid, secs in scenes:
    start[sid] = t
    t += round(float(secs) * FPS)
TOTAL = t
out = np.zeros(int(TOTAL / FPS * SR) + SR, dtype=np.float64)
rng = np.random.default_rng(7)


def at(frame):
    return int(frame / FPS * SR)


def add(sig, frame, gain=1.0):
    i = at(frame)
    j = min(len(out), i + len(sig))
    if j > i:
        out[i:j] += sig[: j - i] * gain


def env(n, a=0.005, r=0.2):
    tt = np.arange(n) / SR
    e = np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / r)
    return e


def lowpass(x, k):
    # one-pole low-pass with time-varying coefficient array k (0..1)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += k[i] * (x[i] - acc)
        y[i] = acc
    return y


def whoosh(dur=0.6, bright=0.25):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    p = np.linspace(0, 1, n)
    shape = np.sin(np.pi * p) ** 2
    k = 0.01 + bright * shape
    y = lowpass(x, k) * shape
    return y / (np.abs(y).max() + 1e-9)


def pop(freq=520, dur=0.12):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = freq * (1 + 1.4 * np.exp(-tt * 40))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.035)
    return y


def thud(dur=0.5):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = 90 * np.exp(-tt * 6) + 40
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.16)
    click = rng.standard_normal(n) * env(n, 0.0005, 0.01) * 0.6
    return body + click


def ding(freq=1320, dur=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * freq * m * tt) * (0.6 / m) for m in (1, 2.01, 3.03)) * env(n, 0.002, 0.25)
    return y


def tick(dur=0.03):
    n = int(dur * SR)
    return rng.standard_normal(n) * env(n, 0.0003, 0.004)


def splat(dur=0.5):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    k = np.linspace(0.3, 0.02, n)
    return lowpass(x, k) * env(n, 0.003, 0.12) * 2.5


S = start
W = whoosh(0.7)
# logo + hello
add(pop(380, 0.25), 6, 0.6)
add(whoosh(0.9, 0.12), 0, 0.25)
add(pop(620), S['hello'] + 4, 0.6)
add(pop(900, 0.08), S['hello'] + 26, 0.25)
add(whoosh(0.4, 0.3), S['welcome'] + 16, 0.25)
for i in range(5):
    add(pop(700 + i * 90, 0.07), S['welcome'] + 40 + i * 5, 0.15)
# sweeps
for sid in ('status', 'dwallet', 'zerotrust', 'speed', 'build'):
    add(W, S[sid] - 21, 0.45)
add(whoosh(0.5), S['drained'] - 15, 0.45)
# status pills
for k, fr in enumerate((70, 100, 146)):
    add(pop(480 + k * 120), S['status'] + fr, 0.55)
add(pop(900, 0.08), S['status'] + 20, 0.2)
# drained hits
for i in range(3):
    add(thud(), S['drained'] + 34 + i * 26, 0.9)
    add(tick(0.05), S['drained'] + 38 + i * 26, 0.5)
# ink squirt
add(splat(), S['flip'] - 20, 0.8)
add(whoosh(0.35, 0.4), S['flip'] + 82, 0.35)
add(ding(1760, 0.6), S['flip'] + 172, 0.18)
# dwallet chains
for i in range(4):
    add(pop(600 + i * 110), S['dwallet'] + 56 + i * 14, 0.4)
add(pop(420, 0.2), S['dwallet'] + 16, 0.45)
# zero trust
add(tick(), S['zerotrust'] + 40, 0.6)
for i in range(12):
    add(pop(1100 + i * 30, 0.05), S['zerotrust'] + 60 + i * 5, 0.18)
add(ding(1320, 1.2), S['zerotrust'] + 164, 0.35)
# speed
for k, fr in enumerate((16, 46, 76)):
    add(pop(400 + k * 80, 0.18), S['speed'] + fr, 0.55)
add(whoosh(1.2, 0.5), S['speed'] + 10, 0.2)
# build pills + typing ticks
for fr in range(20, 165, 4):
    add(tick(0.02), S['build'] + fr, 0.12)
for k, fr in enumerate((150, 164, 178)):
    add(pop(500 + k * 100), S['build'] + fr, 0.5)
# slam
for k, fr in enumerate((2, 64, 126)):
    add(thud(0.8), S['slam'] + fr, 1.0)
    add(whoosh(0.3, 0.6), S['slam'] + fr - 10, 0.3)
add(ding(1567, 1.2), S['slam'] + 128, 0.3)
add(ding(2093, 1.2), S['slam'] + 132, 0.2)
# end
add(pop(330, 0.3), S['end'] + 6, 0.6)
add(whoosh(1.0, 0.15), S['end'], 0.3)
add(ding(1046, 2.0), S['end'] + 14, 0.25)

out = out[: at(TOTAL)]
out = np.tanh(out * 0.9) * 0.8
pcm = (np.stack([out, out], axis=1) * 32767).astype('<i2')
dst = ROOT / 'public/sfx.wav'
dst.parent.mkdir(exist_ok=True)
with wave.open(str(dst), 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', dst, f'{TOTAL / FPS:.2f}s')
