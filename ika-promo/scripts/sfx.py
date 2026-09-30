"""Synthesises the sound-effects bed (whooshes, pops, thuds, dings) in sync
with src/timeline.ts. Re-run after re-timing scenes:  python3 scripts/sfx.py"""
import re
import wave
from pathlib import Path

import numpy as np

SR = 48000
FPS = 60
ROOT = Path(__file__).resolve().parent.parent

# ── scene starts and word cues from the aligned voice-over (src/vo.json) ──
import json
VO = json.loads((ROOT / 'src/vo.json').read_text())
PRE = VO['preroll']
start = {'logo': 0, **{k: round((PRE + v) * FPS) for k, v in VO['scenes'].items()}}
CUE = {k: round((PRE + v) * FPS) for k, v in VO['cues'].items()}
TOTAL = round((PRE + VO['cues']['voEnd'] + VO['tail']) * FPS)
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
add(pop(900, 0.08), S['hello'] + 8, 0.25)
add(pop(760, 0.1), CUE['japanese'] - 3, 0.3)
add(pop(980, 0.1), CUE['squid'] - 3, 0.35)
add(whoosh(0.4, 0.3), CUE['ikaWelcome'] - 10, 0.25)
for i in range(5):
    add(pop(700 + i * 90, 0.07), CUE['ikaWelcome'] + 8 + i * 4, 0.15)
# sweeps (centred on the cut)
for sid in ('status', 'dwallet', 'zerotrust', 'speed', 'build'):
    add(W, S[sid] - 21, 0.45)
add(whoosh(0.5), S['drained'] - 15, 0.45)
# status pills on the words
for k, c in enumerate(('wrap', 'bridge', 'andPray')):
    add(pop(480 + k * 120), CUE[c] - 3, 0.55)
# drained: card slams + the word itself
for c, off in (('later', 4), ('bridges', 2), ('still', 2)):
    add(thud(), CUE[c] + off, 0.85)
    add(tick(0.05), CUE[c] + off + 4, 0.45)
add(thud(0.6), CUE['drained'], 0.6)
# ink squirt
add(splat(), S['flip'] - 20, 0.8)
add(pop(520), CUE['ikaFlip'] - 3, 0.45)
add(tick(0.06), CUE['flips'], 0.5)
add(whoosh(0.35, 0.4), CUE['move2'], 0.35)
add(whoosh(0.7, 0.2), CUE['signature'] - 4, 0.25)
add(ding(1760, 0.6), CUE['signature'] + 34, 0.18)
# dwallet chains
add(pop(420, 0.2), CUE['smart'] - 3, 0.45)
for i, c in enumerate(('bitcoin', 'ethereum', 'solana', 'anyChain')):
    add(pop(600 + i * 110), CUE[c] - 3, 0.4)
# zero trust
add(pop(560), CUE['you'] - 3, 0.4)
for i in range(12):
    add(pop(1100 + i * 30, 0.05), CUE['network'] - 8 + i * 3, 0.16)
add(whoosh(0.4, 0.3), CUE['alone'] - 4, 0.3)
add(ding(1320, 1.2), CUE['alone'] + 18, 0.35)
add(tick(), CUE['notEven'] - 2, 0.6)
# speed
for k, c in enumerate(('sub', 'ten', 'hundreds')):
    add(pop(400 + k * 80, 0.18), CUE[c] - 3, 0.55)
add(whoosh(1.2, 0.5), S['speed'] + 10, 0.2)
# build: typing + pills
for fr in range(20, 165, 4):
    add(tick(0.02), S['build'] + fr, 0.1)
for k, c in enumerate(('native', 'ai', 'oneProgram')):
    add(pop(500 + k * 100), CUE[c] - 3, 0.5)
# slam
for c in ('no1', 'no2', 'just'):
    add(thud(0.8), CUE[c], 1.0)
    add(whoosh(0.3, 0.6), CUE[c] - 12, 0.3)
add(ding(1567, 1.2), CUE['ink'], 0.3)
add(ding(2093, 1.2), CUE['ink'] + 4, 0.2)
# end
add(pop(330, 0.3), CUE['ikaEnd'] - 4, 0.6)
add(whoosh(1.0, 0.15), S['end'], 0.3)
add(ding(1046, 2.0), CUE['ikaEnd'] + 6, 0.25)

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
