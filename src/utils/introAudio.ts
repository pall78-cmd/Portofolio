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
  filterEndHz: number;
  detuneCents?: number;
}

export const TUDUM_NOTE_LAYERS: readonly TudumToneSpec[] = [
  {
    id: 'ta-thump-body',
    startOffsetSec: 0,
    durationSec: 0.21,
    startFreqHz: 112,
    endFreqHz: 55,
    peakGain: 0.44,
    waveType: 'sine',
    filterStartHz: 340,
    filterEndHz: 140,
  },
  {
    id: 'ta-thump-warmth',
    startOffsetSec: 0,
    durationSec: 0.17,
    startFreqHz: 165,
    endFreqHz: 82.41,
    peakGain: 0.22,
    waveType: 'triangle',
    filterStartHz: 420,
    filterEndHz: 150,
  },
  {
    id: 'dum-sub-bass',
    startOffsetSec: 0.3,
    durationSec: 3.1,
    startFreqHz: 55.0,
    endFreqHz: 54.6,
    peakGain: 0.56,
    waveType: 'sine',
    filterStartHz: 200,
    filterEndHz: 110,
  },
  {
    id: 'dum-warm-octave',
    startOffsetSec: 0.3,
    durationSec: 2.95,
    startFreqHz: 110.0,
    endFreqHz: 110.0,
    peakGain: 0.32,
    waveType: 'sine',
    filterStartHz: 460,
    filterEndHz: 160,
    detuneCents: -4,
  },
  {
    id: 'dum-velvet-fifth',
    startOffsetSec: 0.31,
    durationSec: 2.8,
    startFreqHz: 164.81,
    endFreqHz: 164.81,
    peakGain: 0.22,
    waveType: 'triangle',
    filterStartHz: 620,
    filterEndHz: 210,
    detuneCents: 5,
  },
  {
    id: 'dum-orchestral-maj3',
    startOffsetSec: 0.32,
    durationSec: 2.65,
    startFreqHz: 277.18,
    endFreqHz: 277.18,
    peakGain: 0.105,
    waveType: 'sine',
    filterStartHz: 780,
    filterEndHz: 260,
    detuneCents: -6,
  },
  {
    id: 'dum-harmonic-bloom',
    startOffsetSec: 0.33,
    durationSec: 2.5,
    startFreqHz: 329.63,
    endFreqHz: 329.63,
    peakGain: 0.085,
    waveType: 'sine',
    filterStartHz: 840,
    filterEndHz: 290,
    detuneCents: 6,
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

export async function unlockSharedAudioContext(): Promise<boolean> {
  const ctx = getSharedAudioContext();
  if (!ctx) {
    return false;
  }
  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx.state === 'running';
  } catch {
    return false;
  }
}

export function getCinemaHallImpulse(ctx: AudioContext): AudioBuffer {
  if (cachedImpulseBuffer && cachedImpulseBuffer.sampleRate === ctx.sampleRate) {
    return cachedImpulseBuffer;
  }
  const durationSec = 1.85;
  const length = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch += 1) {
    const channelData = buffer.getChannelData(ch);
    let lpState = 0;
    for (let i = 0; i < length; i += 1) {
      const progress = i / length;
      const envelope = Math.pow(1 - progress, 2.8);
      const white = Math.random() * 2 - 1;
      // Smooth lowpass-damped hall tail so reverb stays dark and velvet-warm
      lpState = lpState * 0.72 + white * 0.28;
      channelData[i] = lpState * envelope;
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
    curve[i] = Math.tanh(x * 1.35);
  }
  cachedWarmthCurve = curve;
  return curve;
}

function scheduleMalletTransient(
  ctx: AudioContext,
  destination: AudioNode,
  startAt: number,
  gainPeak: number
): void {
  const length = Math.max(1, Math.floor(ctx.sampleRate * 0.04));
  const noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const env = Math.pow(1 - i / length, 2.4);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(240, startAt);
  bandpass.Q.setValueAtTime(1.1, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.038);

  src.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(destination);

  src.start(startAt);
}

export async function playNetflixIntroSound(options?: {
  muted?: boolean;
  fromUserGesture?: boolean;
}): Promise<{ played: boolean; reason: IntroAudioOutcome }> {
  if (options?.muted) {
    return { played: false, reason: 'muted' };
  }

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return { played: false, reason: 'unsupported' };
  }

  if (ctx.state === 'suspended') {
    if (!options?.fromUserGesture && !canAutoPlayAudioInBrowser()) {
      return { played: false, reason: 'autoplay-blocked' };
    }
    try {
      await ctx.resume();
    } catch {
      return { played: false, reason: 'autoplay-blocked' };
    }
  }

  if (ctx.state !== 'running') {
    return { played: false, reason: 'autoplay-blocked' };
  }

  const now = ctx.currentTime + 0.015;

  const saturator = ctx.createWaveShaper();
  saturator.curve = getSoftWarmthCurve();
  saturator.oversample = '2x';

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-16, now);
  compressor.knee.setValueAtTime(20, now);
  compressor.ratio.setValueAtTime(3.5, now);
  compressor.attack.setValueAtTime(0.006, now);
  compressor.release.setValueAtTime(0.28, now);

  const dryGain = ctx.createGain();
  dryGain.gain.setValueAtTime(0.86, now);

  const wetGain = ctx.createGain();
  wetGain.gain.setValueAtTime(0.44, now);

  const convolver = ctx.createConvolver();
  convolver.buffer = getCinemaHallImpulse(ctx);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1.0, now);

  saturator.connect(compressor);
  compressor.connect(dryGain);
  compressor.connect(convolver);
  convolver.connect(wetGain);
  dryGain.connect(masterGain);
  wetGain.connect(masterGain);
  masterGain.connect(ctx.destination);

  // Warm leather/taiko mallet transients on "Ta" and "Dum"
  scheduleMalletTransient(ctx, saturator, now, 0.34);
  scheduleMalletTransient(ctx, saturator, now + 0.3, 0.42);

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
        startAt + Math.min(0.14, layer.durationSec)
      );
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(0.85, startAt);
    filter.frequency.setValueAtTime(layer.filterStartHz, startAt);
    filter.frequency.exponentialRampToValueAtTime(Math.max(70, layer.filterEndHz), stopAt);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(layer.peakGain, startAt + 0.022);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(saturator);

    osc.start(startAt);
    osc.stop(stopAt + 0.04);
  }

  return { played: true, reason: 'played' };
}
