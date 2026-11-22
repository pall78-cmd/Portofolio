import {
  canAutoPlayAudioInBrowser,
  getSharedAudioContext,
  unlockSharedAudioContextSync,
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
  filterStartHz?: number;
  filterEndHz?: number;
  pan?: number;
}

export const UI_SOUND_PRESETS: Record<UiSoundKind, readonly UiSoundTone[]> = {
  // 1. HOVER — Delicate paper-edge tick (airy, super short, feathery)
  hover: [
    {
      delaySec: 0,
      durationSec: 0.052,
      startFreqHz: 1318.51,
      endFreqHz: 1479.98,
      peakGain: 0.18,
      waveType: 'sine',
      filterStartHz: 2600,
      filterEndHz: 1400,
    },
  ],

  // 2. TAP — Crisp mechanical typewriter / wooden desk stamp (percussive knock, NO bell tail)
  tap: [
    {
      delaySec: 0,
      durationSec: 0.072,
      startFreqHz: 620.0,
      endFreqHz: 392.0,
      peakGain: 0.36,
      waveType: 'sawtooth',
      filterStartHz: 1650,
      filterEndHz: 460,
    },
  ],

  // 3. OPEN — Lush rising hardcover-book / velvet chord (3-note warm arpeggio + stereo spread)
  open: [
    {
      delaySec: 0,
      durationSec: 0.17,
      startFreqHz: 440.0,
      endFreqHz: 440.0,
      peakGain: 0.3,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.32,
      filterStartHz: 1800,
      filterEndHz: 900,
      pan: -0.28,
    },
    {
      delaySec: 0.055,
      durationSec: 0.22,
      startFreqHz: 554.37,
      endFreqHz: 554.37,
      peakGain: 0.3,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.28,
      filterStartHz: 2200,
      filterEndHz: 1050,
      pan: 0.28,
    },
    {
      delaySec: 0.11,
      durationSec: 0.32,
      startFreqHz: 659.25,
      endFreqHz: 659.25,
      peakGain: 0.34,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.3,
      filterStartHz: 2800,
      filterEndHz: 1200,
      pan: 0,
    },
  ],

  // 4. CLOSE — Gentle downward book-shut cadence (mellow low-warmth descent)
  close: [
    {
      delaySec: 0,
      durationSec: 0.11,
      startFreqHz: 659.25,
      endFreqHz: 587.33,
      peakGain: 0.28,
      waveType: 'sine',
      filterStartHz: 1350,
      filterEndHz: 680,
      pan: 0.2,
    },
    {
      delaySec: 0.055,
      durationSec: 0.19,
      startFreqHz: 440.0,
      endFreqHz: 392.0,
      peakGain: 0.3,
      waveType: 'triangle',
      filterStartHz: 980,
      filterEndHz: 420,
      pan: -0.2,
    },
  ],

  // 5. COPY — High twin crystal glass ping (sharp metallic sparkle, unmistakably different)
  copy: [
    {
      delaySec: 0,
      durationSec: 0.11,
      startFreqHz: 1046.5,
      endFreqHz: 1046.5,
      peakGain: 0.3,
      waveType: 'sine',
      harmonicRatio: 3,
      harmonicGainRatio: 0.36,
      filterStartHz: 4200,
      filterEndHz: 2400,
      pan: -0.22,
    },
    {
      delaySec: 0.055,
      durationSec: 0.26,
      startFreqHz: 1567.98,
      endFreqHz: 1567.98,
      peakGain: 0.35,
      waveType: 'sine',
      harmonicRatio: 3,
      harmonicGainRatio: 0.34,
      filterStartHz: 4400,
      filterEndHz: 2600,
      pan: 0.22,
    },
  ],

  // 6. SUCCESS — Triumphant 4-note rising marimba/brass fanfare
  success: [
    {
      delaySec: 0,
      durationSec: 0.15,
      startFreqHz: 523.25,
      endFreqHz: 523.25,
      peakGain: 0.3,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.28,
      filterStartHz: 2400,
      filterEndHz: 1100,
      pan: -0.3,
    },
    {
      delaySec: 0.065,
      durationSec: 0.18,
      startFreqHz: 659.25,
      endFreqHz: 659.25,
      peakGain: 0.32,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.3,
      filterStartHz: 2600,
      filterEndHz: 1200,
      pan: 0.3,
    },
    {
      delaySec: 0.13,
      durationSec: 0.2,
      startFreqHz: 783.99,
      endFreqHz: 783.99,
      peakGain: 0.34,
      waveType: 'triangle',
      harmonicRatio: 2,
      harmonicGainRatio: 0.32,
      filterStartHz: 3000,
      filterEndHz: 1400,
      pan: -0.15,
    },
    {
      delaySec: 0.2,
      durationSec: 0.38,
      startFreqHz: 1046.5,
      endFreqHz: 1046.5,
      peakGain: 0.36,
      waveType: 'sine',
      harmonicRatio: 2,
      harmonicGainRatio: 0.34,
      filterStartHz: 3600,
      filterEndHz: 1600,
      pan: 0.15,
    },
  ],
};

const HOVER_COOLDOWN_MS = 85;
let lastHoverPlayedAt = 0;

interface PersistentUiBus {
  ctx: AudioContext;
  input: GainNode;
}

let cachedBus: PersistentUiBus | null = null;

function getUiMasterBus(ctx: AudioContext): GainNode {
  if (cachedBus && cachedBus.ctx === ctx && ctx.state !== 'closed') {
    return cachedBus.input;
  }

  const input = ctx.createGain();
  input.gain.value = 1.0;

  const warmthFilter = ctx.createBiquadFilter();
  warmthFilter.type = 'lowpass';
  warmthFilter.frequency.value = 4800;
  warmthFilter.Q.value = 0.65;

  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -8;
  limiter.knee.value = 14;
  limiter.ratio.value = 3.5;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.12;

  const masterGain = ctx.createGain();
  masterGain.gain.value = 1.32;

  input.connect(warmthFilter);
  warmthFilter.connect(limiter);
  limiter.connect(masterGain);
  masterGain.connect(ctx.destination);

  cachedBus = { ctx, input };
  return input;
}

function triggerTactileTransient(
  ctx: AudioContext,
  destination: AudioNode,
  startAt: number,
  peakGain: number,
  startFreqHz: number,
  endFreqHz: number,
  durationSec: number,
  qValue = 1.4
): void {
  const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
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
  filter.frequency.setValueAtTime(startFreqHz, startAt);
  if (endFreqHz !== startFreqHz) {
    filter.frequency.exponentialRampToValueAtTime(Math.max(120, endFreqHz), startAt + durationSec);
  }
  filter.Q.setValueAtTime(qValue, startAt);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peakGain, startAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  src.start(startAt);
}

function isAudioContextRunning(ctx: AudioContext): boolean {
  return ctx.state === 'running';
}

function scheduleUiSoundNodes(ctx: AudioContext, kind: UiSoundKind): boolean {
  if (!isAudioContextRunning(ctx)) {
    return false;
  }

  const bus = getUiMasterBus(ctx);
  const now = ctx.currentTime + 0.001;
  const tones = UI_SOUND_PRESETS[kind];

  if (kind === 'hover') {
    triggerTactileTransient(ctx, bus, now, 0.06, 2900, 2200, 0.009, 1.8);
  } else if (kind === 'tap') {
    triggerTactileTransient(ctx, bus, now, 0.24, 1150, 580, 0.018, 1.15);
  } else if (kind === 'open') {
    triggerTactileTransient(ctx, bus, now, 0.14, 1100, 2600, 0.05, 0.9);
  } else if (kind === 'close') {
    triggerTactileTransient(ctx, bus, now, 0.16, 820, 380, 0.028, 1.0);
  } else if (kind === 'copy') {
    triggerTactileTransient(ctx, bus, now, 0.11, 3800, 3800, 0.012, 2.2);
  } else if (kind === 'success') {
    triggerTactileTransient(ctx, bus, now, 0.12, 1600, 2400, 0.024, 1.2);
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
    filter.Q.setValueAtTime(0.7, startAt);
    filter.frequency.setValueAtTime(tone.filterStartHz ?? 3400, startAt);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(180, tone.filterEndHz ?? 1400),
      stopAt
    );

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.linearRampToValueAtTime(tone.peakGain, startAt + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    osc.connect(filter);
    filter.connect(gain);

    if (tone.pan && typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(tone.pan, startAt);
      gain.connect(panner);
      panner.connect(bus);
    } else {
      gain.connect(bus);
    }

    osc.start(startAt);
    osc.stop(stopAt + 0.015);

    if (tone.harmonicRatio && tone.harmonicGainRatio) {
      const overtone = ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(tone.startFreqHz * tone.harmonicRatio, startAt);

      const overtoneGain = ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.0001, startAt);
      overtoneGain.gain.linearRampToValueAtTime(
        tone.peakGain * tone.harmonicGainRatio,
        startAt + 0.003
      );
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startAt + tone.durationSec * 0.65);

      overtone.connect(overtoneGain);
      overtoneGain.connect(bus);
      overtone.start(startAt);
      overtone.stop(stopAt + 0.015);
    }
  }

  return true;
}

/**
 * Schedules UI sound effects synchronously when the AudioContext is running,
 * and never queues oscillators onto a suspended AudioContext (avoiding late/batched playback).
 */
export function playUiSoundSync(kind: UiSoundKind, enabled = true): boolean {
  if (!enabled || typeof window === 'undefined') {
    return false;
  }

  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state === 'closed') {
    return false;
  }

  if (kind === 'hover') {
    if (!isAudioContextRunning(ctx)) {
      if (!canAutoPlayAudioInBrowser()) {
        return false;
      }
      unlockSharedAudioContextSync();
      if (!isAudioContextRunning(ctx)) {
        return false;
      }
    }

    const nowMs = Date.now();
    if (nowMs - lastHoverPlayedAt < HOVER_COOLDOWN_MS) {
      return false;
    }
    lastHoverPlayedAt = nowMs;
    return scheduleUiSoundNodes(ctx, kind);
  }

  if (isAudioContextRunning(ctx)) {
    return scheduleUiSoundNodes(ctx, kind);
  }

  // Context is currently suspended on a gesture event: unlock and schedule ONLY
  // if resume finishes promptly (< 350ms), discarding stale taps instead of delaying.
  const requestedAt = Date.now();
  unlockSharedAudioContextSync();
  if (isAudioContextRunning(ctx)) {
    return scheduleUiSoundNodes(ctx, kind);
  }

  void ctx
    .resume()
    .then(() => {
      if (isAudioContextRunning(ctx) && Date.now() - requestedAt <= 350) {
        scheduleUiSoundNodes(ctx, kind);
      }
    })
    .catch(() => {});

  return false;
}

export async function playUiSound(kind: UiSoundKind, enabled = true): Promise<boolean> {
  if (!enabled || typeof window === 'undefined') {
    return false;
  }

  const ctx = getSharedAudioContext();
  if (!ctx || ctx.state === 'closed') {
    return false;
  }

  if (isAudioContextRunning(ctx) || kind === 'hover') {
    return playUiSoundSync(kind, enabled);
  }

  const requestedAt = Date.now();
  unlockSharedAudioContextSync();
  if (isAudioContextRunning(ctx)) {
    return scheduleUiSoundNodes(ctx, kind);
  }

  try {
    await Promise.race([
      ctx.resume(),
      new Promise<void>((resolve) => setTimeout(resolve, 320)),
    ]);
  } catch {
    return false;
  }

  if (isAudioContextRunning(ctx) && Date.now() - requestedAt <= 350) {
    return scheduleUiSoundNodes(ctx, kind);
  }
  return false;
}
