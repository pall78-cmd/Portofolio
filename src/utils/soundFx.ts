import { canAutoPlayAudioInBrowser, getSharedAudioContext } from './introAudio';

export type UiSoundKind = 'hover' | 'tap' | 'open' | 'close' | 'copy' | 'success';

export interface UiSoundTone {
  delaySec: number;
  durationSec: number;
  startFreqHz: number;
  endFreqHz: number;
  peakGain: number;
  waveType: OscillatorType;
}

export const UI_SOUND_PRESETS: Record<UiSoundKind, readonly UiSoundTone[]> = {
  hover: [
    {
      delaySec: 0,
      durationSec: 0.036,
      startFreqHz: 680,
      endFreqHz: 820,
      peakGain: 0.025,
      waveType: 'sine',
    },
  ],
  tap: [
    {
      delaySec: 0,
      durationSec: 0.045,
      startFreqHz: 540,
      endFreqHz: 290,
      peakGain: 0.045,
      waveType: 'triangle',
    },
  ],
  open: [
    {
      delaySec: 0,
      durationSec: 0.14,
      startFreqHz: 330,
      endFreqHz: 330,
      peakGain: 0.055,
      waveType: 'sine',
    },
    {
      delaySec: 0.055,
      durationSec: 0.22,
      startFreqHz: 495,
      endFreqHz: 495,
      peakGain: 0.05,
      waveType: 'triangle',
    },
  ],
  close: [
    {
      delaySec: 0,
      durationSec: 0.12,
      startFreqHz: 392,
      endFreqHz: 247,
      peakGain: 0.045,
      waveType: 'sine',
    },
  ],
  copy: [
    {
      delaySec: 0,
      durationSec: 0.1,
      startFreqHz: 587.33,
      endFreqHz: 587.33,
      peakGain: 0.05,
      waveType: 'sine',
    },
    {
      delaySec: 0.06,
      durationSec: 0.18,
      startFreqHz: 880,
      endFreqHz: 880,
      peakGain: 0.045,
      waveType: 'sine',
    },
  ],
  success: [
    {
      delaySec: 0,
      durationSec: 0.18,
      startFreqHz: 261.63,
      endFreqHz: 261.63,
      peakGain: 0.055,
      waveType: 'triangle',
    },
    {
      delaySec: 0.07,
      durationSec: 0.22,
      startFreqHz: 329.63,
      endFreqHz: 329.63,
      peakGain: 0.05,
      waveType: 'triangle',
    },
    {
      delaySec: 0.14,
      durationSec: 0.34,
      startFreqHz: 392.0,
      endFreqHz: 392.0,
      peakGain: 0.055,
      waveType: 'sine',
    },
  ],
};

const HOVER_COOLDOWN_MS = 55;
let lastHoverPlayedAt = 0;

export async function playUiSound(kind: UiSoundKind, enabled = true): Promise<boolean> {
  if (!enabled || typeof window === 'undefined') {
    return false;
  }

  if (kind === 'hover') {
    if (!canAutoPlayAudioInBrowser()) {
      return false;
    }
    const nowMs = Date.now();
    if (nowMs - lastHoverPlayedAt < HOVER_COOLDOWN_MS) {
      return false;
    }
    lastHoverPlayedAt = nowMs;
  }

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return false;
  }

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch {
    return false;
  }

  if (ctx.state !== 'running') {
    return false;
  }

  const now = ctx.currentTime + 0.005;
  const tones = UI_SOUND_PRESETS[kind];

  for (const tone of tones) {
    const startAt = now + tone.delaySec;
    const stopAt = startAt + tone.durationSec;

    const osc = ctx.createOscillator();
    osc.type = tone.waveType;
    osc.frequency.setValueAtTime(tone.startFreqHz, startAt);
    if (tone.endFreqHz !== tone.startFreqHz) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, tone.endFreqHz), stopAt);
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, startAt);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(tone.peakGain, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startAt);
    osc.stop(stopAt + 0.02);
  }

  return true;
}
