import numpy as np
from scipy.io.wavfile import write

SR = 44100
DUR = 15.0
t = np.linspace(0, DUR, int(SR*DUR), False)

# Base drone + 120 BPM pulse (0.5s)
bpm = 120
beat_interval = 60/bpm

# Chapters in seconds: 0, 2, 4, 6, 7, 8.5, 10.5, 12, 13.5
chapters = [0, 2.0, 4.0, 6.0, 7.0, 8.5, 10.5, 12, 13.5]

audio = np.zeros_like(t) * 0.0

# Sub drone
audio += 0.08 * np.sin(2*np.pi*55*t) * np.exp(-t*0.15)

def add_hit(time, freq=180, decay=0.18, vol=0.9):
    global audio
    idx = int(time*SR)
    n = int(decay*SR)
    env = np.exp(-np.linspace(0, 5, n))
    hit_t = np.linspace(0, decay, n)
    # Kick + click
    kick = np.sin(2*np.pi*(freq - 80*hit_t/decay)*hit_t) * env
    click = 0.4 * np.sin(2*np.pi*1200*hit_t) * np.exp(-hit_t*50)
    seg = (kick + click) * vol
    end = min(idx+n, len(audio))
    audio[idx:end] += seg[:end-idx]

def add_hat(time, vol=0.25):
    idx = int(time*SR)
    n = int(0.08*SR)
    noise = np.random.randn(n) * np.exp(-np.linspace(0, 30, n))
    audio[idx:idx+n] += noise * vol

# Big hits on chapters
for ct in chapters:
    add_hit(ct, freq=160, decay=0.22, vol=0.95)
    add_hat(ct+0.07, vol=0.18)

# 120 BPM hats between
for b in np.arange(0, DUR, beat_interval):
    if min(abs(b - c) for c in chapters) > 0.1: # don't double hats on chapter hits
        add_hat(b, vol=0.12)

# Whoosh for particle burst -> sphere -> type
for pt in [7.3, 7.9, 8.5]:
    idx = int(pt*SR); n=int(0.4*SR)
    sweep = np.sin(2*np.pi*(300 + 700*np.linspace(0,1,n))*np.linspace(0,0.4,n)) * np.linspace(0,1,n)*np.exp(-np.linspace(0,4,n))
    audio[idx:idx+n] += sweep*0.22

# Normalize and save
audio = audio / np.max(np.abs(audio)) * 0.89
write("public/beat.wav", SR, (audio * 32767).astype(np.int16))
print("✓ public/beat.wav generated - 15s, beat-synced to all 9 transitions")
