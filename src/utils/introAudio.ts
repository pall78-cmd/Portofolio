export const INTRO_DURATION_MS = 4800;
export const INTRO_FADE_MS = 650;

export interface TudumToneSpec {
  id: string;
  startOffsetSec: number;
  durationSec: number;
  startFreqHz: number;
  endFreqHz: number;
  peakGain: number;
  waveType: OscillatorType;
  filterStartHz: number;
  filterPeakHz?: number;
  filterBloomSec?: number;
  filterEndHz: number;
  detuneCents?: number;
  attackSec?: number;
  pan?: number;
}

export const TUDUM_NOTE_LAYERS: readonly TudumToneSpec[] = [
  // STAGE 1: Heavy Portal Unlatch + Deep Sub-Bass Door Thud
  {
    id: 'ta-sub-impact',
    startOffsetSec: 0,
    durationSec: 0.34,
    startFreqHz: 112,
    endFreqHz: 38,
    peakGain: 0.56,
    waveType: 'sine',
    filterStartHz: 320,
    filterEndHz: 95,
    attackSec: 0.008,
  },
  {
    id: 'ta-timpani-body',
    startOffsetSec: 0.01,
    durationSec: 0.32,
    startFreqHz: 185,
    endFreqHz: 65.41,
    peakGain: 0.3,
    waveType: 'triangle',
    filterStartHz: 580,
    filterEndHz: 150,
    attackSec: 0.006,
  },
  {
    id: 'ta-brass-edge',
    startOffsetSec: 0.02,
    durationSec: 0.28,
    startFreqHz: 293.66,
    endFreqHz: 146.83,
    peakGain: 0.16,
    waveType: 'sawtooth',
    filterStartHz: 1400,
    filterEndHz: 280,
    attackSec: 0.005,
  },

  // STAGE 2 & 3: Majestic Brass Swell + Sub Foundation as the Portal Opens
  {
    id: 'dum-sub-bass',
    startOffsetSec: 1.05,
    durationSec: 3.3,
    startFreqHz: 55.0,
    endFreqHz: 54.6,
    peakGain: 0.6,
    waveType: 'sine',
    filterStartHz: 220,
    filterEndHz: 95,
    attackSec: 0.04,
  },
  {
    id: 'dum-warm-octave',
    startOffsetSec: 1.05,
    durationSec: 3.2,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.3,
    waveType: 'triangle',
    filterStartHz: 420,
    filterPeakHz: 960,
    filterBloomSec: 0.25,
    filterEndHz: 220,
    attackSec: 0.05,
  },
  {
    id: 'dum-brass-unison-left',
    startOffsetSec: 1.06,
    durationSec: 3.1,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.18,
    waveType: 'sawtooth',
    filterStartHz: 380,
    filterPeakHz: 1750,
    filterBloomSec: 0.28,
    filterEndHz: 320,
    detuneCents: -10,
    attackSec: 0.06,
    pan: -0.45,
  },
  {
    id: 'dum-brass-unison-right',
    startOffsetSec: 1.06,
    durationSec: 3.1,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.18,
    waveType: 'sawtooth',
    filterStartHz: 380,
    filterPeakHz: 1750,
    filterBloomSec: 0.28,
    filterEndHz: 320,
    detuneCents: 10,
    attackSec: 0.06,
    pan: 0.45,
  },
  {
    id: 'dum-velvet-fifth-left',
    startOffsetSec: 1.08,
    durationSec: 3.0,
    startFreqHz: 164.81,
    endFreqHz: 164.81,
    peakGain: 0.2,
    waveType: 'sawtooth',
    filterStartHz: 460,
    filterPeakHz: 1950,
    filterBloomSec: 0.32,
    filterEndHz: 360,
    detuneCents: -7,
    attackSec: 0.07,
    pan: -0.35,
  },
  {
    id: 'dum-velvet-fifth-right',
    startOffsetSec: 1.08,
    durationSec: 3.0,
    startFreqHz: 164.81,
    endFreqHz: 164.81,
    peakGain: 0.2,
    waveType: 'sawtooth',
    filterStartHz: 460,
    filterPeakHz: 1950,
    filterBloomSec: 0.32,
    filterEndHz: 360,
    detuneCents: 7,
    attackSec: 0.07,
    pan: 0.35,
  },
  {
    id: 'dum-orchestral-maj3-left',
    startOffsetSec: 1.1,
    durationSec: 2.95,
    startFreqHz: 277.18,
    endFreqHz: 277.18,
    peakGain: 0.15,
    waveType: 'sawtooth',
    filterStartHz: 520,
    filterPeakHz: 2200,
    filterBloomSec: 0.34,
    filterEndHz: 440,
    detuneCents: -8,
    attackSec: 0.08,
    pan: -0.5,
  },
  {
    id: 'dum-orchestral-maj3-right',
    startOffsetSec: 1.1,
    durationSec: 2.95,
    startFreqHz: 277.18,
    endFreqHz: 277.18,
    peakGain: 0.15,
    waveType: 'sawtooth',
    filterStartHz: 520,
    filterPeakHz: 2200,
    filterBloomSec: 0.34,
    filterEndHz: 440,
    detuneCents: 8,
    attackSec: 0.08,
    pan: 0.5,
  },
  {
    id: 'dum-harmonic-bloom',
    startOffsetSec: 1.12,
    durationSec: 2.9,
    startFreqHz: 329.63,
    endFreqHz: 329.63,
    peakGain: 0.14,
    waveType: 'triangle',
    filterStartHz: 680,
    filterPeakHz: 2400,
    filterBloomSec: 0.35,
    filterEndHz: 520,
    detuneCents: 5,
    attackSec: 0.09,
  },
  {
    id: 'dum-presence-octave',
    startOffsetSec: 1.15,
    durationSec: 2.8,
    startFreqHz: 440.0,
    endFreqHz: 440.0,
    peakGain: 0.12,
    waveType: 'triangle',
    filterStartHz: 750,
    filterPeakHz: 2600,
    filterBloomSec: 0.38,
    filterEndHz: 580,
    detuneCents: -4,
    attackSec: 0.12,
  },
  {
    id: 'dum-cinema-choir-shimmer',
    startOffsetSec: 1.24,
    durationSec: 3.1,
    startFreqHz: 659.25,
    endFreqHz: 659.25,
    peakGain: 0.075,
    waveType: 'sine',
    filterStartHz: 1100,
    filterPeakHz: 2900,
    filterBloomSec: 0.48,
    filterEndHz: 780,
    detuneCents: 6,
    attackSec: 0.26,
  },
] as const;

export function shouldBypassIntro(search: string, _prefersReducedMotion: boolean): boolean {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  return params.get('autostart') === '1';
}

export type IntroAudioOutcome = 'played' | 'muted' | 'unsupported' | 'autoplay-blocked';

let sharedAudioContext: AudioContext | null = null;
let cachedImpulseBuffer: AudioBuffer | null = null;
let cachedWarmthCurve: Float32Array<ArrayBuffer> | null = null;
let hardwareUnlocked = false;
let cachedIntroWavUrl: string | null = null;

function isAudioContextRunning(ctx: AudioContext): boolean {
  return ctx.state === 'running';
}

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }
  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    sharedAudioContext = new AudioCtx();
    cachedImpulseBuffer = null;
    hardwareUnlocked = false;
  }
  return sharedAudioContext;
}

export function canAutoPlayAudioInBrowser(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const nav = navigator as Navigator & {
    userActivation?: { hasBeenActive: boolean; isActive: boolean };
  };
  if (nav.userActivation) {
    return nav.userActivation.hasBeenActive || nav.userActivation.isActive;
  }
  return false;
}

function pulseSilentHardwareBuffer(ctx: AudioContext): void {
  if (hardwareUnlocked) {
    return;
  }
  try {
    const silentBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = silentBuffer;
    source.connect(ctx.destination);
    source.start(0);
    hardwareUnlocked = true;
  } catch {
    // Ignore if AudioContext rejects node playback before activation
  }
}

export function unlockSharedAudioContextSync(): boolean {
  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state === 'closed') {
    return false;
  }

  if (ctx.state === 'suspended') {
    try {
      void ctx.resume().then(() => {
        if (isAudioContextRunning(ctx)) {
          pulseSilentHardwareBuffer(ctx);
        }
      });
    } catch {
      return false;
    }
  }

  if (isAudioContextRunning(ctx) || canAutoPlayAudioInBrowser()) {
    pulseSilentHardwareBuffer(ctx);
  }

  return isAudioContextRunning(ctx);
}

export async function unlockSharedAudioContext(): Promise<boolean> {
  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state === 'closed') {
    return false;
  }
  unlockSharedAudioContextSync();
  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (isAudioContextRunning(ctx)) {
      pulseSilentHardwareBuffer(ctx);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Deterministic stereo PCM synthesis for the Grand Portal Door Opening + Orchestral Reveal:
 * - 0.00s - 0.36s: Heavy bronze portal unlatch & deep stone chamber sub-bass impact
 * - 0.28s - 1.75s: Sweeping stereo air pressure & sliding portal resonance as doors part
 * - 1.05s - 4.65s: Monumental wide-stereo A-major brass choir & shimmering hall bloom
 */
export function buildGrandDoorIntroPcmSamples(
  sampleRate = 44100,
  durationSec = INTRO_DURATION_MS / 1000
): { left: Float32Array; right: Float32Array; sampleRate: number } {
  const totalSamples = Math.max(1, Math.floor(sampleRate * durationSec));
  const dryLeft = new Float32Array(totalSamples);
  const dryRight = new Float32Array(totalSamples);

  // Simple fast seeded PRNG so noise textures are crisp and deterministic
  let seed = 0x51a9c23d;
  const nextRand = (): number => {
    seed = (seed * 1664525 + 1013904223) | 0;
    return ((seed >>> 0) / 0xffffffff) * 2 - 1;
  };

  let lpWindL = 0;
  let lpWindR = 0;
  let lpGroan = 0;
  let subPhase = 0;
  let doorResPhase = 0;

  // Brass choir phase accumulators
  const choirFreqs = [
    { hz: 55.0, pan: 0, amp: 0.38, kind: 'sub' as const },
    { hz: 110.0, pan: -0.22, amp: 0.22, kind: 'brass' as const },
    { hz: 110.65, pan: 0.22, amp: 0.22, kind: 'brass' as const },
    { hz: 164.81, pan: -0.38, amp: 0.16, kind: 'brass' as const },
    { hz: 165.45, pan: 0.38, amp: 0.16, kind: 'brass' as const },
    { hz: 220.0, pan: -0.18, amp: 0.15, kind: 'brass' as const },
    { hz: 277.18, pan: 0.32, amp: 0.13, kind: 'brass' as const },
    { hz: 329.63, pan: -0.32, amp: 0.11, kind: 'brass' as const },
    { hz: 440.0, pan: 0.14, amp: 0.085, kind: 'shimmer' as const },
    { hz: 659.25, pan: -0.14, amp: 0.055, kind: 'shimmer' as const },
  ];
  const choirPhases = new Float64Array(choirFreqs.length);
  const twoPi = Math.PI * 2;

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    let l = 0;
    let r = 0;

    // 1. Metallic Heavy Portal Latch + Chamber Stone Slam (0.00s - 0.55s)
    if (t < 0.55) {
      // Metallic latch strike right at 0.015s
      if (t >= 0.01 && t < 0.14) {
        const lt = t - 0.01;
        const latchEnv = Math.exp(-lt * 34);
        const latchTone =
          Math.sin(twoPi * 680 * lt) * 0.55 +
          Math.sin(twoPi * 1090 * lt) * 0.35 +
          nextRand() * 0.3;
        l += latchTone * latchEnv * 0.36;
        r += latchTone * latchEnv * 0.36;
      }

      // Deep chest-thump portal door slam (0.03s -> 0.52s)
      if (t >= 0.025) {
        const it = t - 0.025;
        const slamFreq = 40 + 78 * Math.exp(-it * 16);
        subPhase += (twoPi * slamFreq) / sampleRate;
        const slamEnv = Math.min(1, it / 0.008) * Math.exp(-it * 6.8);
        const slamSig = Math.sin(subPhase) * 0.85 + Math.sin(subPhase * 2) * 0.22;
        l += slamSig * slamEnv * 0.72;
        r += slamSig * slamEnv * 0.72;
      }
    }

    // 2. Majestic Sliding Portal Doors & Sweeping Air Pressure (0.24s - 1.85s)
    if (t >= 0.24 && t < 1.9) {
      const dt = t - 0.24;
      const progress = Math.min(1, dt / 1.6);
      const airEnv = Math.sin(Math.PI * Math.pow(progress, 0.78));
      const coeff = 0.018 + 0.075 * Math.sin(Math.PI * progress);
      lpWindL = lpWindL * (1 - coeff) + nextRand() * coeff;
      lpWindR = lpWindR * (1 - coeff) + nextRand() * coeff;

      // Wide stereo air swell parting outward
      l += lpWindL * airEnv * 1.45;
      r += lpWindR * airEnv * 1.45;

      // Deep sliding stone/bronze resonance climbing smoothly
      const groanFreq = 58 + 42 * progress;
      doorResPhase += (twoPi * groanFreq) / sampleRate;
      const rawGroan =
        Math.sin(doorResPhase) * 0.65 +
        Math.sin(doorResPhase * 2) * 0.25 +
        Math.sin(doorResPhase * 3) * 0.14;
      lpGroan = lpGroan * 0.94 + rawGroan * 0.06;
      l += lpGroan * airEnv * 0.42;
      r += lpGroan * airEnv * 0.42;
    }

    // 3. Monumental Wide-Stereo Brass & Choir Reveal (1.02s - 4.75s)
    if (t >= 1.02) {
      const rt = t - 1.02;
      const attack = Math.min(1, rt / 0.26);
      const decay = Math.exp(-Math.max(0, rt - 0.35) * 0.88);
      const swellEnv = attack * decay;
      // Filter brightness blooms quickly on impact, then warms gently
      const warmthFactor = 0.35 + 0.65 * Math.exp(-Math.max(0, rt - 0.2) * 1.3);

      for (let v = 0; v < choirFreqs.length; v += 1) {
        const voice = choirFreqs[v];
        choirPhases[v] += (twoPi * voice.hz) / sampleRate;
        const p = choirPhases[v];

        let sample = Math.sin(p);
        if (voice.kind === 'brass') {
          sample =
            Math.sin(p) * 0.62 +
            Math.sin(p * 2) * (0.28 * warmthFactor) +
            Math.sin(p * 3) * (0.14 * warmthFactor) +
            Math.sin(p * 4) * (0.07 * warmthFactor);
        } else if (voice.kind === 'shimmer') {
          sample = Math.sin(p) * 0.8 + Math.sin(p * 2) * 0.18;
        }

        const panAngle = (voice.pan + 1) * (Math.PI / 4);
        const gainL = Math.cos(panAngle);
        const gainR = Math.sin(panAngle);
        const vGain = voice.amp * swellEnv;
        l += sample * vGain * gainL;
        r += sample * vGain * gainR;
      }
    }

    dryLeft[i] = l;
    dryRight[i] = r;
  }

  // 4. Stereo Cathedral Reverb Delay + Warm Analog Tape Saturation + Clean Fade Out
  const left = new Float32Array(totalSamples);
  const right = new Float32Array(totalSamples);
  const tap1 = Math.floor(0.037 * sampleRate);
  const tap2 = Math.floor(0.067 * sampleRate);
  const tap3 = Math.floor(0.113 * sampleRate);
  const fadeOutSamples = Math.floor(0.45 * sampleRate);

  for (let i = 0; i < totalSamples; i += 1) {
    const revL =
      (i >= tap1 ? dryRight[i - tap1] * 0.28 : 0) +
      (i >= tap2 ? left[i - tap2] * 0.32 : 0) +
      (i >= tap3 ? right[i - tap3] * 0.22 : 0);
    const revR =
      (i >= tap1 ? dryLeft[i - tap1] * 0.28 : 0) +
      (i >= tap2 ? right[i - tap2] * 0.32 : 0) +
      (i >= tap3 ? left[i - tap3] * 0.22 : 0);

    let outL = Math.tanh((dryLeft[i] + revL * 0.55) * 1.18) * 0.92;
    let outR = Math.tanh((dryRight[i] + revR * 0.55) * 1.18) * 0.92;

    if (i > totalSamples - fadeOutSamples) {
      const fadeProgress = (totalSamples - i) / fadeOutSamples;
      outL *= fadeProgress;
      outR *= fadeProgress;
    }

    left[i] = outL;
    right[i] = outR;
  }

  return { left, right, sampleRate };
}

export function encodeStereoWavBuffer(
  left: Float32Array,
  right: Float32Array,
  sampleRate = 44100
): ArrayBuffer {
  const numFrames = Math.min(left.length, right.length);
  const numChannels = 2;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM format chunk size
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numFrames; i += 1) {
    const lClamped = Math.max(-1, Math.min(1, left[i]));
    const rClamped = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, lClamped < 0 ? lClamped * 0x8000 : lClamped * 0x7fff, true);
    view.setInt16(offset + 2, rClamped < 0 ? rClamped * 0x8000 : rClamped * 0x7fff, true);
    offset += 4;
  }

  return buffer;
}

export function createGrandDoorIntroWavUrl(): string | null {
  if (typeof window === 'undefined' || typeof URL === 'undefined' || typeof Blob === 'undefined') {
    return null;
  }
  if (cachedIntroWavUrl) {
    return cachedIntroWavUrl;
  }
  const { left, right, sampleRate } = buildGrandDoorIntroPcmSamples(44100, INTRO_DURATION_MS / 1000);
  const wavBuffer = encodeStereoWavBuffer(left, right, sampleRate);
  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  cachedIntroWavUrl = URL.createObjectURL(blob);
  return cachedIntroWavUrl;
}

export function getCinemaHallImpulse(ctx: AudioContext): AudioBuffer {
  if (cachedImpulseBuffer && cachedImpulseBuffer.sampleRate === ctx.sampleRate) {
    return cachedImpulseBuffer;
  }
  const durationSec = 2.45;
  const length = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch += 1) {
    const channelData = buffer.getChannelData(ch);
    let lpState = 0;
    for (let i = 0; i < length; i += 1) {
      const progress = i / length;
      const envelope = Math.pow(1 - progress, 2.35);
      const white = Math.random() * 2 - 1;
      const damp = progress < 0.08 ? 0.56 : 0.74;
      lpState = lpState * damp + white * (1 - damp);
      channelData[i] = lpState * envelope;
    }

    const reflectionOffsetsMs = ch === 0 ? [18, 43, 79] : [27, 56, 94];
    for (const ms of reflectionOffsetsMs) {
      const idx = Math.floor((ms / 1000) * ctx.sampleRate);
      if (idx < length) {
        channelData[idx] += 0.34;
      }
    }
  }

  cachedImpulseBuffer = buffer;
  return buffer;
}

function getSoftWarmthCurve(): Float32Array<ArrayBuffer> {
  if (cachedWarmthCurve) {
    return cachedWarmthCurve;
  }
  const samples = 256;
  const arrayBuffer = new ArrayBuffer(samples * Float32Array.BYTES_PER_ELEMENT);
  const curve = new Float32Array(arrayBuffer);
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / (samples - 1) - 1;
    curve[i] = Math.tanh(x * 1.55);
  }
  cachedWarmthCurve = curve;
  return curve;
}

function scheduleMalletTransient(
  ctx: AudioContext,
  destination: AudioNode,
  startAt: number,
  gainPeak: number,
  centerFreqHz: number
): void {
  const length = Math.max(1, Math.floor(ctx.sampleRate * 0.055));
  const noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const env = Math.pow(1 - i / length, 2.1);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(centerFreqHz, startAt);
  bandpass.Q.setValueAtTime(0.95, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.052);

  src.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(destination);

  src.start(startAt);
}

function scheduleTudumNodes(ctx: AudioContext): void {
  const now = ctx.currentTime + 0.04;

  const saturator = ctx.createWaveShaper();
  saturator.curve = getSoftWarmthCurve();
  saturator.oversample = '2x';

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-14, now);
  compressor.knee.setValueAtTime(18, now);
  compressor.ratio.setValueAtTime(4.0, now);
  compressor.attack.setValueAtTime(0.005, now);
  compressor.release.setValueAtTime(0.24, now);

  const dryGain = ctx.createGain();
  dryGain.gain.setValueAtTime(0.84, now);

  const wetGain = ctx.createGain();
  wetGain.gain.setValueAtTime(0.58, now);

  const convolver = ctx.createConvolver();
  convolver.buffer = getCinemaHallImpulse(ctx);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1.15, now);

  saturator.connect(compressor);
  compressor.connect(dryGain);
  compressor.connect(convolver);
  convolver.connect(wetGain);
  dryGain.connect(masterGain);
  wetGain.connect(masterGain);
  masterGain.connect(ctx.destination);

  scheduleMalletTransient(ctx, saturator, now, 0.44, 340);
  scheduleMalletTransient(ctx, saturator, now + 1.05, 0.52, 460);

  for (const layer of TUDUM_NOTE_LAYERS) {
    const startAt = now + layer.startOffsetSec;
    const stopAt = startAt + layer.durationSec;

    const osc = ctx.createOscillator();
    osc.type = layer.waveType;
    osc.frequency.setValueAtTime(layer.startFreqHz, startAt);
    if (layer.detuneCents) {
      osc.detune.setValueAtTime(layer.detuneCents, startAt);
    }
    if (layer.endFreqHz !== layer.startFreqHz) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, layer.endFreqHz),
        startAt + Math.min(0.18, layer.durationSec)
      );
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(1.05, startAt);
    filter.frequency.setValueAtTime(layer.filterStartHz, startAt);
    if (layer.filterPeakHz && layer.filterBloomSec) {
      filter.frequency.exponentialRampToValueAtTime(
        layer.filterPeakHz,
        startAt + layer.filterBloomSec
      );
    }
    filter.frequency.exponentialRampToValueAtTime(Math.max(70, layer.filterEndHz), stopAt);

    const attack = Math.min(layer.attackSec ?? 0.022, layer.durationSec * 0.35);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(layer.peakGain, startAt + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);

    if (layer.pan && typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(layer.pan, startAt);
      gain.connect(panner);
      panner.connect(saturator);
    } else {
      gain.connect(saturator);
    }

    osc.start(startAt);
    osc.stop(stopAt + 0.05);
  }
}

export async function playNetflixIntroSound(options?: {
  muted?: boolean;
  fromUserGesture?: boolean;
  shouldAbort?: () => boolean;
}): Promise<{ played: boolean; reason: IntroAudioOutcome }> {
  if (options?.muted || options?.shouldAbort?.()) {
    return { played: false, reason: 'muted' };
  }

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return { played: false, reason: 'unsupported' };
  }

  if (!isAudioContextRunning(ctx)) {
    if (!options?.fromUserGesture && !canAutoPlayAudioInBrowser()) {
      return { played: false, reason: 'autoplay-blocked' };
    }

    unlockSharedAudioContextSync();
    // Schedule immediately on gesture so browsers do not drop the initial attack while resuming
    try {
      void ctx.resume();
    } catch {
      return { played: false, reason: 'autoplay-blocked' };
    }
  }

  pulseSilentHardwareBuffer(ctx);
  scheduleTudumNodes(ctx);
  return { played: true, reason: 'played' };
}
