export const INTRO_DURATION_MS = 5000;
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
  // STAGE 1 — "TA": Deep chest-thump + orchestral timpani strike + brass edge
  {
    id: 'ta-sub-impact',
    startOffsetSec: 0,
    durationSec: 0.24,
    startFreqHz: 138,
    endFreqHz: 48,
    peakGain: 0.52,
    waveType: 'sine',
    filterStartHz: 380,
    filterEndHz: 110,
    attackSec: 0.008,
  },
  {
    id: 'ta-timpani-body',
    startOffsetSec: 0,
    durationSec: 0.2,
    startFreqHz: 210,
    endFreqHz: 82.41,
    peakGain: 0.28,
    waveType: 'triangle',
    filterStartHz: 640,
    filterEndHz: 180,
    attackSec: 0.006,
  },
  {
    id: 'ta-brass-edge',
    startOffsetSec: 0,
    durationSec: 0.16,
    startFreqHz: 329.63,
    endFreqHz: 164.81,
    peakGain: 0.16,
    waveType: 'sawtooth',
    filterStartHz: 1650,
    filterEndHz: 340,
    attackSec: 0.005,
  },

  // STAGE 2 — "DUM": Visceral bass foundation + wide stereo orchestral brass choir
  {
    id: 'dum-sub-bass',
    startOffsetSec: 0.34,
    durationSec: 3.4,
    startFreqHz: 55.0,
    endFreqHz: 54.5,
    peakGain: 0.6,
    waveType: 'sine',
    filterStartHz: 220,
    filterEndHz: 95,
    attackSec: 0.02,
  },
  {
    id: 'dum-warm-octave',
    startOffsetSec: 0.34,
    durationSec: 3.25,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.3,
    waveType: 'triangle',
    filterStartHz: 420,
    filterPeakHz: 960,
    filterBloomSec: 0.16,
    filterEndHz: 220,
    attackSec: 0.024,
  },
  {
    id: 'dum-brass-unison-left',
    startOffsetSec: 0.34,
    durationSec: 3.15,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.17,
    waveType: 'sawtooth',
    filterStartHz: 380,
    filterPeakHz: 1750,
    filterBloomSec: 0.22,
    filterEndHz: 320,
    detuneCents: -11,
    attackSec: 0.03,
    pan: -0.45,
  },
  {
    id: 'dum-brass-unison-right',
    startOffsetSec: 0.34,
    durationSec: 3.15,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.17,
    waveType: 'sawtooth',
    filterStartHz: 380,
    filterPeakHz: 1750,
    filterBloomSec: 0.22,
    filterEndHz: 320,
    detuneCents: 11,
    attackSec: 0.03,
    pan: 0.45,
  },
  {
    id: 'dum-velvet-fifth-left',
    startOffsetSec: 0.35,
    durationSec: 3.05,
    startFreqHz: 164.81,
    endFreqHz: 164.81,
    peakGain: 0.2,
    waveType: 'sawtooth',
    filterStartHz: 460,
    filterPeakHz: 1950,
    filterBloomSec: 0.25,
    filterEndHz: 360,
    detuneCents: -7,
    attackSec: 0.04,
    pan: -0.35,
  },
  {
    id: 'dum-velvet-fifth-right',
    startOffsetSec: 0.35,
    durationSec: 3.05,
    startFreqHz: 164.81,
    endFreqHz: 164.81,
    peakGain: 0.2,
    waveType: 'sawtooth',
    filterStartHz: 460,
    filterPeakHz: 1950,
    filterBloomSec: 0.25,
    filterEndHz: 360,
    detuneCents: 7,
    attackSec: 0.04,
    pan: 0.35,
  },
  {
    id: 'dum-orchestral-maj3-left',
    startOffsetSec: 0.36,
    durationSec: 2.95,
    startFreqHz: 277.18,
    endFreqHz: 277.18,
    peakGain: 0.15,
    waveType: 'sawtooth',
    filterStartHz: 520,
    filterPeakHz: 2200,
    filterBloomSec: 0.28,
    filterEndHz: 440,
    detuneCents: -8,
    attackSec: 0.05,
    pan: -0.5,
  },
  {
    id: 'dum-orchestral-maj3-right',
    startOffsetSec: 0.36,
    durationSec: 2.95,
    startFreqHz: 277.18,
    endFreqHz: 277.18,
    peakGain: 0.15,
    waveType: 'sawtooth',
    filterStartHz: 520,
    filterPeakHz: 2200,
    filterBloomSec: 0.28,
    filterEndHz: 440,
    detuneCents: 8,
    attackSec: 0.05,
    pan: 0.5,
  },
  {
    id: 'dum-harmonic-bloom',
    startOffsetSec: 0.37,
    durationSec: 2.9,
    startFreqHz: 329.63,
    endFreqHz: 329.63,
    peakGain: 0.13,
    waveType: 'triangle',
    filterStartHz: 680,
    filterPeakHz: 2400,
    filterBloomSec: 0.3,
    filterEndHz: 520,
    detuneCents: 5,
    attackSec: 0.06,
  },
  {
    id: 'dum-presence-octave',
    startOffsetSec: 0.38,
    durationSec: 2.8,
    startFreqHz: 440.0,
    endFreqHz: 440.0,
    peakGain: 0.11,
    waveType: 'triangle',
    filterStartHz: 750,
    filterPeakHz: 2600,
    filterBloomSec: 0.34,
    filterEndHz: 580,
    detuneCents: -4,
    attackSec: 0.09,
  },
  {
    id: 'dum-cinema-choir-shimmer',
    startOffsetSec: 0.44,
    durationSec: 3.1,
    startFreqHz: 659.25,
    endFreqHz: 659.25,
    peakGain: 0.068,
    waveType: 'sine',
    filterStartHz: 1100,
    filterPeakHz: 2900,
    filterBloomSec: 0.45,
    filterEndHz: 780,
    detuneCents: 6,
    attackSec: 0.24,
  },
] as const;

export function shouldBypassIntro(search: string, prefersReducedMotion: boolean): boolean {
  if (prefersReducedMotion) {
    return true;
  }
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  if (params.get('autostart') === '1') {
    return true;
  }
  if (params.get('karya')) {
    return true;
  }
  return false;
}

export type IntroAudioOutcome = 'played' | 'muted' | 'unsupported' | 'autoplay-blocked';

let sharedAudioContext: AudioContext | null = null;
let cachedImpulseBuffer: AudioBuffer | null = null;
let cachedWarmthCurve: Float32Array<ArrayBuffer> | null = null;
let hardwareUnlocked = false;

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
      // Richer early shimmer + smoother dark hall tail
      const damp = progress < 0.08 ? 0.56 : 0.74;
      lpState = lpState * damp + white * (1 - damp);
      channelData[i] = lpState * envelope;
    }

    // Distinct left/right early cathedral reflections for wide cinematic hall space
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
  const now = ctx.currentTime + 0.01;

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

  // Heavy theatrical timpani + brass transient impact on "Ta" and "Dum"
  scheduleMalletTransient(ctx, saturator, now, 0.42, 340);
  scheduleMalletTransient(ctx, saturator, now + 0.34, 0.52, 460);

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
        startAt + Math.min(0.16, layer.durationSec)
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

    const requestedAt = Date.now();
    unlockSharedAudioContextSync();

    if (!isAudioContextRunning(ctx)) {
      try {
        await Promise.race([
          ctx.resume(),
          new Promise<void>((resolve) => setTimeout(resolve, 420)),
        ]);
      } catch {
        return { played: false, reason: 'autoplay-blocked' };
      }
    }

    if (!isAudioContextRunning(ctx) || Date.now() - requestedAt > 450 || options?.shouldAbort?.()) {
      return { played: false, reason: 'autoplay-blocked' };
    }
  }

  pulseSilentHardwareBuffer(ctx);
  scheduleTudumNodes(ctx);
  return { played: true, reason: 'played' };
}
