import math
import struct
import wave
import subprocess
import os
import shutil

SR = 44100
DURATION = 41.8
N = int(SR * DURATION)

out_dir = r'c:\Users\Blessing Orodi\Desktop\tuftly2\ad-studio\public\media'
os.makedirs(out_dir, exist_ok=True)

vo_src = r'C:\Users\Blessing Orodi\Downloads\ElevenLabs_2026-11-25T12_31_45_Adalina - Professional & Friendly_pvc_s50_sim75_v4.mp3'
vo_dst = os.path.join(out_dir, 'vo-adalina-take1.mp3')
shutil.copyfile(vo_src, vo_dst)

buf = [0.0] * N
bpm = 122.0
beat = 60.0 / bpm
chords = [
    [207.65, 261.63, 311.13, 392.00],
    [174.61, 207.65, 261.63, 311.13, 392.00],
    [138.59, 207.65, 261.63, 311.13],
    [155.56, 196.00, 233.08, 293.66, 349.23],
]
basses = [103.83, 87.31, 69.30, 77.78]
bar_len = beat * 4
seed = 54321

def noise():
    global seed
    seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
    return (seed / 0x7FFFFFFF) * 2.0 - 1.0

for bar in range(int(DURATION / bar_len) + 1):
    t0 = bar * bar_len
    ch = chords[bar % 4]
    bs = basses[bar % 4]
    for st_off in [0.0, 1.5, 2.5, 3.5]:
        ct = t0 + st_off * beat
        if ct >= DURATION - 1.0:
            continue
        cs0 = int(ct * SR)
        for i in range(int(0.32 * SR)):
            t = i / SR
            env = min(1.0, t / 0.008) * math.exp(-t * 7.5)
            v = sum(math.sin(2 * math.pi * f * t) * 0.036 for f in ch)
            if cs0 + i < N:
                buf[cs0 + i] += v * env

    for bo in [0.0, 0.75, 1.5, 2.5, 3.25]:
        bt = t0 + bo * beat
        if bt >= DURATION - 1.0:
            continue
        bs0 = int(bt * SR)
        for i in range(int(0.24 * SR)):
            t = i / SR
            env = min(1.0, t / 0.006) * math.exp(-t * 9.0)
            v = (math.sin(2 * math.pi * bs * t) + 0.35 * math.sin(2 * math.pi * bs * 2 * t)) * 0.09
            if bs0 + i < N:
                buf[bs0 + i] += v * env

    for step_idx, off in enumerate([0.5, 1.0, 2.0, 3.0, 3.5]):
        at = t0 + off * beat
        if at >= DURATION - 1.0:
            continue
        f = ch[(step_idx + bar * 2) % len(ch)] * 2.0
        as0 = int(at * SR)
        for i in range(int(0.2 * SR)):
            t = i / SR
            env = math.exp(-t * 15.0)
            if as0 + i < N:
                buf[as0 + i] += math.sin(2 * math.pi * f * t) * 0.03 * env

for b in range(int(DURATION / beat)):
    tb = b * beat
    if tb > DURATION - 1.1:
        break
    ks0 = int(tb * SR)
    for i in range(int(0.12 * SR)):
        t = i / SR
        freq = 126.0 * math.exp(-t * 32.0) + 48.0
        if ks0 + i < N:
            buf[ks0 + i] += math.sin(2 * math.pi * freq * t) * 0.165 * math.exp(-t * 24.0)
    hs0 = int((tb + 0.5 * beat) * SR)
    for i in range(int(0.045 * SR)):
        t = i / SR
        if hs0 + i < N:
            buf[hs0 + i] += noise() * 0.032 * math.exp(-t * 65.0)
    if b % 2 == 1:
        cs0 = int(tb * SR)
        for i in range(int(0.065 * SR)):
            t = i / SR
            if cs0 + i < N:
                buf[cs0 + i] += (noise() * 0.042 + math.sin(2 * math.pi * 1100 * t) * 0.025) * math.exp(-t * 48.0)

# Exact scene transition pops synced to Adalina's cuts
for tt in [2.15, 4.28, 11.15, 14.98, 18.06, 21.96, 26.15, 32.62]:
    ws0 = int(max(0.0, tt - 0.14) * SR)
    wsn = int(0.28 * SR)
    for i in range(wsn):
        t = i / SR
        env = math.sin(math.pi * (t / 0.28)) ** 2
        pop = math.sin(2 * math.pi * (622.25 + 380 * (t / 0.28)) * t) * 0.032
        if ws0 + i < N:
            buf[ws0 + i] += (pop + noise() * 0.024) * env

# Closing warm chord bloom at 39.2s ("Tuftly — craft you can feel")
ls0 = int(39.2 * SR)
for i in range(int(2.5 * SR)):
    t = i / SR
    env = min(1.0, t / 0.06) * math.exp(-t * 1.1)
    bell = (
        math.sin(2 * math.pi * 415.30 * t) * 0.055
        + math.sin(2 * math.pi * 523.25 * t) * 0.045
        + math.sin(2 * math.pi * 622.25 * t) * 0.035
    )
    if ls0 + i < N:
        buf[ls0 + i] += bell * env

fade_in = int(0.25 * SR)
fade_out = int(1.0 * SR)
for i in range(N):
    if i < fade_in:
        buf[i] *= i / fade_in
    elif i > N - fade_out:
        buf[i] *= (N - i) / fade_out
    buf[i] = math.tanh(buf[i] * 1.2) * 0.5

bg_wav = os.path.join(out_dir, 'bg-pop-42s.wav')
master_mp3 = os.path.join(out_dir, 'master-adalina-pop.mp3')

with wave.open(bg_wav, 'w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    frames = bytearray()
    for s in buf:
        val = max(-32767, min(32767, int(s * 32767)))
        frames += struct.pack('<h', val)
    wf.writeframes(frames)

filter_graph = (
    "[0:a]lowpass=f=7800,volume=0.40,asplit=2[bg][bg_dummy];"
    "[1:a]adelay=180|180,apad=whole_dur=41.8,asplit=2[vo_sc][vo_main];"
    "[bg][vo_sc]sidechaincompress=threshold=0.025:ratio=4.8:attack=12:release=240[bg_ducked];"
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
        '-t', '41.8',
        '-b:a', '256k',
        master_mp3,
    ],
    check=True,
)
os.remove(bg_wav)
print('Mastered:', master_mp3, os.path.getsize(master_mp3), 'bytes')
