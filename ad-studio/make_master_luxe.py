import math
import struct
import wave
import subprocess
import os
import shutil

SR = 44100
DURATION = 45.5
N = int(SR * DURATION)

out_dir = r'c:\Users\Blessing Orodi\Desktop\tuftly2\ad-studio\public\media'
os.makedirs(out_dir, exist_ok=True)

vo_src = r'C:\Users\Blessing Orodi\Downloads\ElevenLabs_2026-11-25T12_22_53_Adrian - British Commercial Narrator_pvc_s50_sim75_v4.mp3'
vo_dst = os.path.join(out_dir, 'vo-adrian-take1.mp3')
shutil.copyfile(vo_src, vo_dst)

# Synthesize 45.5s warm Afro-lounge groove synced to exact Adrian cut points
buf = [0.0] * N
bpm = 116.0
beat = 60.0 / bpm
chords = [
    [174.61, 220.00, 261.63, 329.63, 392.00],
    [146.83, 220.00, 261.63, 329.63, 349.23],
    [116.54, 174.61, 220.00, 261.63, 293.66],
    [130.81, 196.00, 233.08, 293.66, 329.63],
]
basses = [87.31, 73.42, 58.27, 65.41]
bar_len = beat * 4
seed = 24680

def noise():
    global seed
    seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
    return (seed / 0x7FFFFFFF) * 2.0 - 1.0

for bar in range(int(DURATION / bar_len) + 1):
    t0 = bar * bar_len
    ch = chords[bar % 4]
    bs = basses[bar % 4]
    s0 = int(t0 * SR)
    sn = int(min(bar_len, max(0.0, DURATION - t0)) * SR)
    for i in range(sn):
        t = i / SR
        env = min(1.0, t / 0.03) * math.exp(-t * 0.92)
        v = sum(math.sin(2 * math.pi * f * t) * 0.034 for f in ch)
        v += math.sin(2 * math.pi * bs * t) * 0.098 * math.exp(-t * 1.3)
        if s0 + i < N:
            buf[s0 + i] += v * env

    for step_idx, off in enumerate([0.0, 0.75, 1.5, 2.0, 2.75, 3.5]):
        at = t0 + off * beat
        if at >= DURATION - 0.6:
            continue
        f = ch[(step_idx + bar) % len(ch)] * 2.0
        as0 = int(at * SR)
        for i in range(int(0.28 * SR)):
            t = i / SR
            env = min(1.0, t / 0.005) * math.exp(-t * 12.0)
            tone = math.sin(2 * math.pi * f * t) + 0.25 * math.sin(2 * math.pi * f * 3 * t) * math.exp(-t * 22)
            if as0 + i < N:
                buf[as0 + i] += tone * 0.038 * env

for b in range(int(DURATION / beat)):
    tb = b * beat
    if tb > DURATION - 1.4:
        break
    for ko in ([0.0] if b % 2 == 0 else [0.5]):
        kt = tb + ko * beat
        ks0 = int(kt * SR)
        for i in range(int(0.13 * SR)):
            t = i / SR
            freq = 118.0 * math.exp(-t * 28.0) + 46.0
            if ks0 + i < N:
                buf[ks0 + i] += math.sin(2 * math.pi * freq * t) * 0.16 * math.exp(-t * 22.0)
    for so in [0.0, 0.5]:
        ss0 = int((tb + so * beat) * SR)
        amp = 0.024 if so == 0.5 else 0.012
        for i in range(int(0.05 * SR)):
            t = i / SR
            if ss0 + i < N:
                buf[ss0 + i] += noise() * amp * math.exp(-t * 55.0)
    if b % 2 == 1:
        rs0 = int(tb * SR)
        for i in range(int(0.04 * SR)):
            t = i / SR
            if rs0 + i < N:
                buf[rs0 + i] += math.sin(2 * math.pi * 920 * t) * 0.048 * math.exp(-t * 95.0)

# Exact scene transition chimes aligned to Adrian's voiceover cuts
CUTS = [6.0, 14.7, 18.6, 22.35, 26.45, 30.15, 36.4]
for tt in CUTS:
    ws0 = int(max(0.0, tt - 0.18) * SR)
    wsn = int(0.34 * SR)
    for i in range(wsn):
        t = i / SR
        env = math.sin(math.pi * (t / 0.34)) ** 2
        chime = math.sin(2 * math.pi * (587.33 + 300 * (t / 0.34)) * t) * 0.028
        if ws0 + i < N:
            buf[ws0 + i] += (chime + noise() * 0.022) * env

# Warm closing shimmer chord at 42.6s ("Tuftly — craft you can feel")
ls0 = int(42.6 * SR)
for i in range(int(2.8 * SR)):
    t = i / SR
    env = min(1.0, t / 0.08) * math.exp(-t * 1.05)
    bell = (
        math.sin(2 * math.pi * 349.23 * t) * 0.055
        + math.sin(2 * math.pi * 523.25 * t) * 0.045
        + math.sin(2 * math.pi * 659.25 * t) * 0.035
    )
    if ls0 + i < N:
        buf[ls0 + i] += bell * env

fade_in = int(0.3 * SR)
fade_out = int(1.1 * SR)
for i in range(N):
    if i < fade_in:
        buf[i] *= i / fade_in
    elif i > N - fade_out:
        buf[i] *= (N - i) / fade_out
    buf[i] = math.tanh(buf[i] * 1.2) * 0.5

bg_wav = os.path.join(out_dir, 'bg-45s.wav')
master_mp3 = os.path.join(out_dir, 'master-adrian-luxe.mp3')

with wave.open(bg_wav, 'w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    frames = bytearray()
    for s in buf:
        val = max(-32767, min(32767, int(s * 32767)))
        frames += struct.pack('<h', val)
    wf.writeframes(frames)

# Broadcast mix: start Adrian cleanly at 0.20s, sidechain-duck background music under voice, normalize to -14 LUFS
filter_graph = (
    "[0:a]lowpass=f=7600,volume=0.42,asplit=2[bg][bg_dummy];"
    "[1:a]adelay=200|200,apad=whole_dur=45.5,asplit=2[vo_sc][vo_main];"
    "[bg][vo_sc]sidechaincompress=threshold=0.025:ratio=4.5:attack=15:release=260[bg_ducked];"
    "[bg_ducked][vo_main]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.2:LRA=9[out];"
    "[bg_dummy]anullsink"
)

subprocess.run(
    [
        'ffmpeg', '-y',
        '-i', bg_wav,
        '-i', vo_dst,
        '-filter_complex', filter_graph,
        '-map', '[out]',
        '-t', '45.5',
        '-b:a', '256k',
        master_mp3,
    ],
    check=True,
)
os.remove(bg_wav)
print('Mastered:', master_mp3, os.path.getsize(master_mp3), 'bytes')
