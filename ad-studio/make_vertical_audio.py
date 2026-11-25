import math
import struct
import wave
import subprocess
import os

SR = 44100
DURATION = 30.0
N = int(SR * DURATION)
out_dir = r'c:\Users\Blessing Orodi\Desktop\tuftly2\ad-studio\public\media'
os.makedirs(out_dir, exist_ok=True)


def export_mp3(buf, filename):
    fade_in = int(0.35 * SR)
    fade_out = int(1.4 * SR)
    for i in range(N):
        if i < fade_in:
            buf[i] *= i / fade_in
        elif i > N - fade_out:
            buf[i] *= (N - i) / fade_out
        buf[i] = math.tanh(buf[i] * 1.18) * 0.44

    wav_path = os.path.join(out_dir, filename.replace('.mp3', '.wav'))
    mp3_path = os.path.join(out_dir, filename)
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
        ['ffmpeg', '-y', '-i', wav_path, '-af', 'lowpass=f=7800,acompressor=threshold=-18dB:ratio=2.5', '-b:a', '192k', mp3_path],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    os.remove(wav_path)
    print('Generated:', mp3_path, os.path.getsize(mp3_path), 'bytes')


# =====================================================================
# TRACK 1: bg-status-luxe.mp3 (116 BPM Warm Editorial Afro-Lounge)
# =====================================================================
def build_luxe():
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
    seed = 98765

    def noise():
        nonlocal seed
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
            env = min(1.0, t / 0.03) * math.exp(-t * 0.95)
            v = sum(math.sin(2 * math.pi * f * t) * 0.032 for f in ch)
            v += math.sin(2 * math.pi * bs * t) * 0.095 * math.exp(-t * 1.3)
            if s0 + i < N:
                buf[s0 + i] += v * env

        for step_idx, off in enumerate([0.0, 0.75, 1.5, 2.0, 2.75, 3.5]):
            at = t0 + off * beat
            if at >= DURATION - 0.5:
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
        if tb > DURATION - 1.1:
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
            amp = 0.025 if so == 0.5 else 0.013
            for i in range(int(0.05 * SR)):
                t = i / SR
                if ss0 + i < N:
                    buf[ss0 + i] += noise() * amp * math.exp(-t * 55.0)
        if b % 2 == 1:
            rs0 = int(tb * SR)
            for i in range(int(0.04 * SR)):
                t = i / SR
                if rs0 + i < N:
                    buf[rs0 + i] += math.sin(2 * math.pi * 920 * t) * 0.05 * math.exp(-t * 95.0)

    for tt in [3.5, 8.5, 11.3, 14.0, 17.0, 20.0, 25.2]:
        ws0 = int(max(0.0, tt - 0.18) * SR)
        wsn = int(0.34 * SR)
        for i in range(wsn):
            t = i / SR
            env = math.sin(math.pi * (t / 0.34)) ** 2
            chime = math.sin(2 * math.pi * (587.33 + 300 * (t / 0.34)) * t) * 0.026
            if ws0 + i < N:
                buf[ws0 + i] += (chime + noise() * 0.024) * env

    export_mp3(buf, 'bg-status-luxe.mp3')


# =====================================================================
# TRACK 2: bg-status-pop.mp3 (122 BPM Upbeat Bouncy Boutique Pop Groove)
# =====================================================================
def build_pop():
    buf = [0.0] * N
    bpm = 122.0
    beat = 60.0 / bpm
    # Bright uplifting Abmaj7 -> Fm9 -> Dbmaj7 -> Eb9 progression
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
        nonlocal seed
        seed = (1103515245 * seed + 12345) & 0x7FFFFFFF
        return (seed / 0x7FFFFFFF) * 2.0 - 1.0

    for bar in range(int(DURATION / bar_len) + 1):
        t0 = bar * bar_len
        ch = chords[bar % 4]
        bs = basses[bar % 4]
        # Rhythmic house/pop chord stabs on 0, 1.5, 2.5, 3.5
        for st_off in [0.0, 1.5, 2.5, 3.5]:
            ct = t0 + st_off * beat
            if ct >= DURATION - 0.8:
                continue
            cs0 = int(ct * SR)
            for i in range(int(0.32 * SR)):
                t = i / SR
                env = min(1.0, t / 0.008) * math.exp(-t * 7.5)
                v = sum(math.sin(2 * math.pi * f * t) * 0.036 for f in ch)
                if cs0 + i < N:
                    buf[cs0 + i] += v * env

        # Bouncy syncopated bassline on 0, 0.75, 1.5, 2.5, 3.25
        for bo in [0.0, 0.75, 1.5, 2.5, 3.25]:
            bt = t0 + bo * beat
            if bt >= DURATION - 0.8:
                continue
            bs0 = int(bt * SR)
            for i in range(int(0.24 * SR)):
                t = i / SR
                env = min(1.0, t / 0.006) * math.exp(-t * 9.0)
                v = (math.sin(2 * math.pi * bs * t) + 0.35 * math.sin(2 * math.pi * bs * 2 * t)) * 0.09
                if bs0 + i < N:
                    buf[bs0 + i] += v * env

        # Sparkling high synth bell hook
        for step_idx, off in enumerate([0.5, 1.0, 2.0, 3.0, 3.5]):
            at = t0 + off * beat
            if at >= DURATION - 0.8:
                continue
            f = ch[(step_idx + bar * 2) % len(ch)] * 2.0
            as0 = int(at * SR)
            for i in range(int(0.2 * SR)):
                t = i / SR
                env = math.exp(-t * 15.0)
                if as0 + i < N:
                    buf[as0 + i] += math.sin(2 * math.pi * f * t) * 0.03 * env

    # Four-on-the-floor punchy soft kick + crisp clap/hat
    for b in range(int(DURATION / beat)):
        tb = b * beat
        if tb > DURATION - 0.9:
            break
        ks0 = int(tb * SR)
        for i in range(int(0.12 * SR)):
            t = i / SR
            freq = 126.0 * math.exp(-t * 32.0) + 48.0
            if ks0 + i < N:
                buf[ks0 + i] += math.sin(2 * math.pi * freq * t) * 0.165 * math.exp(-t * 24.0)
        # Offbeat crisp hi-hat
        hs0 = int((tb + 0.5 * beat) * SR)
        for i in range(int(0.045 * SR)):
            t = i / SR
            if hs0 + i < N:
                buf[hs0 + i] += noise() * 0.032 * math.exp(-t * 65.0)
        # Snappy soft clap on 2 & 4
        if b % 2 == 1:
            cs0 = int(tb * SR)
            for i in range(int(0.065 * SR)):
                t = i / SR
                if cs0 + i < N:
                    buf[cs0 + i] += (noise() * 0.042 + math.sin(2 * math.pi * 1100 * t) * 0.025) * math.exp(-t * 48.0)

    for tt in [3.3, 8.2, 11.0, 13.8, 16.8, 19.8, 25.0]:
        ws0 = int(max(0.0, tt - 0.15) * SR)
        wsn = int(0.3 * SR)
        for i in range(wsn):
            t = i / SR
            env = math.sin(math.pi * (t / 0.3)) ** 2
            pop = math.sin(2 * math.pi * (622.25 + 380 * (t / 0.3)) * t) * 0.03
            if ws0 + i < N:
                buf[ws0 + i] += (pop + noise() * 0.026) * env

    export_mp3(buf, 'bg-status-pop.mp3')


build_luxe()
build_pop()
