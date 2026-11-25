import math
import struct
import wave
import subprocess
import os

SR = 44100
DURATION = 32.0
N = int(SR * DURATION)
BPM = 114.0
BEAT = 60.0 / BPM

buf = [0.0] * N

def add_sample(idx, val):
    if 0 <= idx < N:
        buf[idx] += val

# Warm luxury Neo-Soul / Afro-lounge chord progression (Fmaj9 -> Dm9 -> Bbmaj9 -> C13)
CHORDS = [
    [174.61, 220.00, 261.63, 329.63, 392.00],  # Fmaj9
    [146.83, 220.00, 261.63, 329.63, 349.23],  # Dm9
    [116.54, 174.61, 220.00, 261.63, 293.66],  # Bbmaj9
    [130.81, 196.00, 233.08, 293.66, 329.63],  # C9
]
BASS_NOTES = [87.31, 73.42, 58.27, 65.41]

# 1. Warm Rhodes pad + lively pluck chords every 4 beats
bar_len = BEAT * 4
num_bars = int(DURATION / bar_len) + 1
for bar in range(num_bars):
    t0 = bar * bar_len
    chord = CHORDS[bar % len(CHORDS)]
    bass = BASS_NOTES[bar % len(BASS_NOTES)]
    # Soft warm electric-piano chord bloom
    dur = min(bar_len, DURATION - t0)
    s0 = int(t0 * SR)
    sn = int(dur * SR)
    for i in range(sn):
        t = i / SR
        env = min(1.0, t / 0.04) * math.exp(-t * 0.95)
        val = 0.0
        for f in chord:
            val += math.sin(2 * math.pi * f * t) * 0.032
            val += math.sin(2 * math.pi * f * 2 * t) * 0.008 * math.exp(-t * 3.5)
        # Warm sub-bass pulse
        b_env = min(1.0, t / 0.02) * math.exp(-t * 1.4)
        val += math.sin(2 * math.pi * bass * t) * 0.095 * b_env
        add_sample(s0 + i, val * env)

    # Lively syncopated marimba / kalimba arpeggio sparkles (high energy boutique vibe)
    arp_offsets = [0.0, 0.75, 1.5, 2.0, 2.75, 3.5]
    for step_idx, off in enumerate(arp_offsets):
        at = t0 + off * BEAT
        if at >= DURATION - 0.5:
            continue
        f = chord[(step_idx + bar) % len(chord)] * 2.0
        as0 = int(at * SR)
        asn = int(0.32 * SR)
        for i in range(asn):
            t = i / SR
            env = min(1.0, t / 0.006) * math.exp(-t * 11.0)
            tone = math.sin(2 * math.pi * f * t) + 0.25 * math.sin(2 * math.pi * f * 3 * t) * math.exp(-t * 20)
            add_sample(as0 + i, tone * 0.036 * env)

# 2. Snappy soft kick & crisp wooden rim/shaker groove
total_beats = int(DURATION / BEAT)
seed = 1234567
def rand_noise():
    global seed
    seed = (1103515245 * seed + 12345) & 0x7fffffff
    return (seed / 0x7fffffff) * 2.0 - 1.0

for b in range(total_beats):
    t_beat = b * BEAT
    if t_beat > DURATION - 1.2:
        break
    # Soft punchy kick on beats 1, 2.5, 3 (Afro-lounge groove)
    for k_off in ([0.0] if b % 2 == 0 else [0.5]):
        kt = t_beat + k_off * BEAT
        if kt > DURATION - 1.5:
            continue
        ks0 = int(kt * SR)
        ksn = int(0.14 * SR)
        for i in range(ksn):
            t = i / SR
            freq = 115.0 * math.exp(-t * 28.0) + 46.0
            env = math.exp(-t * 22.0)
            add_sample(ks0 + i, math.sin(2 * math.pi * freq * t) * 0.16 * env)

    # Soft shaker on eighth notes
    for s_off in [0.0, 0.5]:
        st = t_beat + s_off * BEAT
        if st > DURATION - 1.2:
            continue
        ss0 = int(st * SR)
        ssn = int(0.055 * SR)
        amp = 0.026 if s_off == 0.5 else 0.014
        for i in range(ssn):
            t = i / SR
            env = min(1.0, t / 0.005) * math.exp(-t * 55.0)
            add_sample(ss0 + i, rand_noise() * amp * env)

    # Crisp rim click on backbeats (beats 2 and 4)
    if b % 2 == 1:
        rs0 = int(t_beat * SR)
        rsn = int(0.045 * SR)
        for i in range(rsn):
            t = i / SR
            env = math.exp(-t * 95.0)
            click = (math.sin(2 * math.pi * 880 * t) + 0.5 * math.sin(2 * math.pi * 1720 * t)) * 0.055
            add_sample(rs0 + i, click * env)

# 3. Subtle silky whoosh/chime accents on exact scene transitions
TRANSITIONS = [3.5, 9.0, 12.15, 15.0, 18.15, 21.3, 27.0]
for tt in TRANSITIONS:
    ws0 = int(max(0.0, tt - 0.22) * SR)
    wsn = int(0.38 * SR)
    for i in range(wsn):
        t = i / SR
        env = math.sin(math.pi * (t / 0.38)) ** 2
        # Soft sparkle chime + gentle filtered air whoosh
        chime = math.sin(2 * math.pi * (523.25 + 320 * (t / 0.38)) * t) * 0.025
        air = rand_noise() * 0.028 * (0.4 + 0.6 * math.sin(2 * math.pi * 6 * t))
        add_sample(ws0 + i, (chime + air) * env)

# 4. Warm closing shimmer bell at 27.2s for the Tuftly logo reveal
ls0 = int(27.2 * SR)
lsn = int(4.4 * SR)
for i in range(lsn):
    t = i / SR
    env = min(1.0, t / 0.08) * math.exp(-t * 0.9)
    bell = (
        math.sin(2 * math.pi * 349.23 * t) * 0.05
        + math.sin(2 * math.pi * 523.25 * t) * 0.04
        + math.sin(2 * math.pi * 659.25 * t) * 0.03
        + math.sin(2 * math.pi * 1046.5 * t) * 0.018 * math.exp(-t * 1.8)
    )
    add_sample(ls0 + i, bell * env)

# Soft fade in & fade out + gentle master headroom (-11dB so ElevenLabs VO sits effortlessly on top)
fade_in = int(0.4 * SR)
fade_out = int(1.6 * SR)
for i in range(N):
    if i < fade_in:
        buf[i] *= i / fade_in
    elif i > N - fade_out:
        buf[i] *= (N - i) / fade_out
    # Soft tanh limiter & comfortable commercial bed level
    buf[i] = math.tanh(buf[i] * 1.15) * 0.42

out_dir = r'c:\Users\Blessing Orodi\Desktop\tuftly2\ad-studio\public\media'
os.makedirs(out_dir, exist_ok=True)
wav_path = os.path.join(out_dir, 'bg-groove.wav')
mp3_path = os.path.join(out_dir, 'bg-groove.mp3')

with wave.open(wav_path, 'w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    frames = bytearray()
    for s in buf:
        val = max(-32767, min(32767, int(s * 32767)))
        frames += struct.pack('<h', val)
    wf.writeframes(frames)

subprocess.run(
    ['ffmpeg', '-y', '-i', wav_path, '-af', 'lowpass=f=7500,acompressor=threshold=-18dB:ratio=2.5', '-b:a', '192k', mp3_path],
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
os.remove(wav_path)
print('Generated:', mp3_path, os.path.getsize(mp3_path), 'bytes')
