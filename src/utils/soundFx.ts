import {
  canAutoPlayAudioInBrowser,
  getCinemaHallImpulse,
  getSharedAudioContext,
} from './introAudio';

export type UiSoundKind = 'hover' | 'tap' | 'open' | 'close' | 'copy' | 'success';

export interface UiSoundTone {
  delaySec: number;
  durationSec: number;
  startFreqHz: number;
  endFreqHz: number;
  peakGain: number;
  waveType: OscillatorType;
  harmonicRatio?: number;
  harmonicGainRatio?: number;
}

export const UI_SOUND_PRESETS: Record<UiSoundKind, readonly UiSoundTone[]> = {
  hover: [
    {
      delaySec: 0,
      durationSec: 0.068,
      startFreqHz: 880.0,
      endFreqHz: 880.0,
      peakGain: 0.22,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.35,
    },
  ],
  tap: [
    {
      delaySec: 0,
      durationSec: 0.095,
      startFreqHz: 587.33,
      endFreqHz: 587.33,
      peakGain: 0.34,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.42,
    },
  ],
  open: [
    {
      delaySec: 0,
      durationSec: 0.16,
      startFreqHz: 523.25,
      endFreqHz: 523.25,
      peakGain: 0.32,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.38,
    },
    {
      delaySec: 0.055,
      durationSec: 0.28,
      startFreqHz: 783.99,
      endFreqHz: 783.99,
      peakGain: 0.34,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.3,
    },
  ],
  close: [
    {
      delaySec: 0,
      durationSec: 0.11,
      startFreqHz: 659.25,
      endFreqHz: 659.25,
      peakGain: 0.28,
      waveType: 'triangle',
      harmonicRatio: 1.5,
      harmonicGainRatio: 0.25,
    },
    {
      delaySec: 0.045,
      durationSec: 0.18,
      startFreqHz: 440.0,
      endFreqHz: 440.0,
      peakGain: 0.26,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.22,
    },
  ],
  copy: [
    {
      delaySec: 0,
      durationSec: 0.14,
      startFreqHz: 783.99,
      endFreqHz: 783.99,
      peakGain: 0.3,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.32,
    },
    {
      delaySec: 0.06,
      durationSec: 0.26,
      startFreqHz: 1046.5,
      endFreqHz: 1046.5,
      peakGain: 0.34,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.28,
    },
  ],
  success: [
    {
      delaySec: 0,
      durationSec: 0.2,
      startFreqHz: 440.0,
      endFreqHz: 440.0,
      peakGain: 0.3,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.3,
    },
    {
      delaySec: 0.075,
      durationSec: 0.24,
      startFreqHz: 554.37,
      endFreqHz: 554.37,
      peakGain: 0.32,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.28,
    },
    {
      delaySec: 0.15,
      durationSec: 0.38,
      startFreqHz: 659.25,
      endFreqHz: 659.25,
      peakGain: 0.34,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.35,
    },
  ],
};

const HOVER_COOLDOWN_MS = 70;
let lastHoverPlayedAt = 0;

function triggerTactileTransient(
  ctx: AudioContext,
  destination: AudioNode,
  startAt: number,
  peakGain: number,
  centerFreqHz: number
): void {
  const length = Math.max(1, Math.floor(ctx.sampleRate * 0.018));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const env = Math.pow(1 - i / length, 2.2);
    channel[i] = (Math.random() * 2 - 1) * env;
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(centerFreqHz, startAt);
  filter.Q.setValueAtTime(1.5, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peakGain, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.018);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  src.start(startAt);
}

export async function playUiSound(kind: UiSoundKind, enabled = true): Promise<boolean> {
  if (!enabled || typeof window === 'undefined') {
    return false;
  }

  const ctx = getSharedAudioContext();
  if (!ctx) {
    return false;
  }

  if (kind === 'hover') {
    if (ctx.state !== 'running' && !canAutoPlayAudioInBrowser()) {
      return false;
    }
    const nowMs = Date.now();
    if (nowMs - lastHoverPlayedAt < HOVER_COOLDOWN_MS) {
      return false;
    }
    lastHoverPlayedAt = nowMs;
  }

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }

  if (ctx.state !== 'running') {
    return false;
  }

  const now = ctx.currentTime + 0.003;
  const tones = UI_SOUND_PRESETS[kind];

  const busCompressor = ctx.createDynamicsCompressor();
  busCompressor.threshold.setValueAtTime(-10, now);
  busCompressor.knee.setValueAtTime(12, now);
  busCompressor.ratio.setValueAtTime(4, now);
  busCompressor.attack.setValueAtTime(0.002, now);
  busCompressor.release.setValueAtTime(0.16, now);

  const dryGain = ctx.createGain();
  dryGain.gain.setValueAtTime(0.95, now);

  const wetGain = ctx.createGain();
  wetGain.gain.setValueAtTime(kind === 'hover' ? 0.14 : 0.24, now);

  const convolver = ctx.createConvolver();
  convolver.buffer = getCinemaHallImpulse(ctx);

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(1.35, now);

  busCompressor.connect(dryGain);
  busCompressor.connect(convolver);
  convolver.connect(wetGain);
  dryGain.connect(masterGain);
  wetGain.connect(masterGain);
  masterGain.connect(ctx.destination);

  if (kind === 'hover') {
    triggerTactileTransient(ctx, busCompressor, now, 0.12, 2200);
  } else if (kind === 'tap') {
    triggerTactileTransient(ctx, busCompressor, now, 0.16, 1850);
  } else if (kind === 'open' || kind === 'close') {
    triggerTactileTransient(ctx, busCompressor, now, 0.12, 1600);
  }

  for (const tone of tones) {
    const startAt = now + tone.delaySec;
    const stopAt = startAt + tone.durationSec;

    const osc = ctx.createOscillator();
    osc.type = tone.waveType;
    osc.frequency.setValueAtTime(tone.startFreqHz, startAt);
    if (tone.endFreqHz !== tone.startFreqHz) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(80, tone.endFreqHz), stopAt);
    }

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3400, startAt);
    filter.frequency.exponentialRampToValueAtTime(1400, stopAt);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(tone.peakGain, startAt + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(busCompressor);

    osc.start(startAt);
    osc.stop(stopAt + 0.02);

    if (tone.harmonicRatio && tone.harmonicGainRatio) {
      const overtone = ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(tone.startFreqHz * tone.harmonicRatio, startAt);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.0001, startAt);
      overtoneGain.gain.linearRampToValueAtTime(
        tone.peakGain * tone.harmonicGainRatio,
        startAt + 0.004
      );
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.durationSec * 0.65);

      overtone.connect(overtoneGain);
      overtoneGain.connect(busCompressor);
      overtone.start(startAt);
      overtone.stop(stopAt + 0.02);
    }
  }

  return true;
}
