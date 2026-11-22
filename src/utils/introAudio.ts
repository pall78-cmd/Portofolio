export const INTRO_DURATION_MS = 3600;
export const INTRO_FADE_MS = 450;

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
}

export const TUDUM_NOTE_LAYERS: readonly TudumToneSpec[] = [
  {
    id: 'ta-thump-body',
    startOffsetSec: 0,
    durationSec: 0.24,
    startFreqHz: 118,
    endFreqHz: 62,
    peakGain: 0.42,
    waveType: 'triangle',
    filterStartHz: 680,
    filterEndHz: 190,
  },
  {
    id: 'ta-thump-sub',
    startOffsetSec: 0,
    durationSec: 0.22,
    startFreqHz: 76,
    endFreqHz: 48,
    peakGain: 0.34,
    waveType: 'sine',
    filterStartHz: 320,
    filterEndHz: 120,
  },
  {
    id: 'dum-sub-bass',
    startOffsetSec: 0.24,
    durationSec: 1.95,
    startFreqHz: 65.41,
    endFreqHz: 65.41,
    peakGain: 0.5,
    waveType: 'sine',
    filterStartHz: 260,
    filterEndHz: 120,
  },
  {
    id: 'dum-warm-octave',
    startOffsetSec: 0.24,
    durationSec: 1.85,
    startFreqHz: 130.81,
    endFreqHz: 130.81,
    peakGain: 0.28,
    waveType: 'triangle',
    filterStartHz: 960,
    filterEndHz: 230,
  },
  {
    id: 'dum-fifth-brass',
    startOffsetSec: 0.25,
    durationSec: 1.75,
    startFreqHz: 196.0,
    endFreqHz: 195.2,
    peakGain: 0.19,
    waveType: 'sawtooth',
    filterStartHz: 1250,
    filterEndHz: 260,
  },
  {
    id: 'dum-harmonic-shimmer',
    startOffsetSec: 0.28,
    durationSec: 1.65,
    startFreqHz: 392.0,
    endFreqHz: 392.0,
    peakGain: 0.08,
    waveType: 'sine',
    filterStartHz: 1800,
    filterEndHz: 480,
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

export async function playNetflixIntroSound(options?: {
  muted?: boolean;
  fromUserGesture?: boolean;
}): Promise<{ played: boolean; reason: IntroAudioOutcome }> {
  if (options?.muted) {
    return { played: false, reason: 'muted' };
  }

  if (!options?.fromUserGesture && !canAutoPlayAudioInBrowser()) {
    return { played: false, reason: 'autoplay-blocked' };
  }

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return { played: false, reason: 'unsupported' };
  }

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch {
    return { played: false, reason: 'autoplay-blocked' };
  }

  if (ctx.state !== 'running') {
    return { played: false, reason: 'autoplay-blocked' };
  }

  const now = ctx.currentTime + 0.02;

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-14, now);
  compressor.knee.setValueAtTime(18, now);
  compressor.ratio.setValueAtTime(4, now);
  compressor.attack.setValueAtTime(0.005, now);
  compressor.release.setValueAtTime(0.25, now);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.92, now);
  compressor.connect(masterGain);
  masterGain.connect(ctx.destination);

  for (const layer of TUDUM_NOTE_LAYERS) {
    const startAt = now + layer.startOffsetSec;
    const stopAt = startAt + layer.durationSec;

    const osc = ctx.createOscillator();
    osc.type = layer.waveType;
    osc.frequency.setValueAtTime(layer.startFreqHz, startAt);
    if (layer.endFreqHz !== layer.startFreqHz) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, layer.endFreqHz),
        startAt + Math.min(0.18, layer.durationSec)
      );
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(1.4, startAt);
    filter.frequency.setValueAtTime(layer.filterStartHz, startAt);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, layer.filterEndHz), stopAt);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(layer.peakGain, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(compressor);

    osc.start(startAt);
    osc.stop(stopAt + 0.03);
  }

  return { played: true, reason: 'played' };
}
