import test from 'node:test';
import assert from 'node:assert/strict';
import {
  playUiSound,
  playUiSoundSync,
  UI_SOUND_PRESETS,
  type UiSoundKind,
} from './soundFx';

test('UI_SOUND_PRESETS defines gentle bounded tones for all interactive UX events', () => {
  const kinds: UiSoundKind[] = ['hover', 'tap', 'open', 'close', 'copy', 'success'];

  for (const kind of kinds) {
    const tones = UI_SOUND_PRESETS[kind];
    assert.ok(tones.length >= 1, `Expected at least 1 tone for preset: ${kind}`);
    for (const tone of tones) {
      assert.ok(tone.delaySec >= 0);
      assert.ok(tone.durationSec > 0 && tone.durationSec <= 0.5);
      assert.ok(
        tone.startFreqHz >= 380 && tone.endFreqHz >= 380,
        'UI sound frequencies should sit cleanly in audible speaker range'
      );
      assert.ok(tone.peakGain > 0 && tone.peakGain <= 0.45, 'UI sound gain must stay crisp and safe');
    }
  }

  assert.ok(
    UI_SOUND_PRESETS.hover[0].peakGain >= 0.15 && UI_SOUND_PRESETS.hover[0].peakGain <= 0.3,
    'Hover sound effect must be clearly audible on laptop and phone speakers'
  );

  // Verify each preset has a genuinely distinct sonic signature
  assert.equal(UI_SOUND_PRESETS.tap[0].waveType, 'sawtooth');
  assert.ok(
    UI_SOUND_PRESETS.tap[0].endFreqHz < UI_SOUND_PRESETS.tap[0].startFreqHz,
    'Tap should descend crisply like a mechanical click'
  );
  assert.ok(UI_SOUND_PRESETS.open.length >= 3, 'Open should bloom across a multi-note chord');
  assert.ok(
    UI_SOUND_PRESETS.open[UI_SOUND_PRESETS.open.length - 1].startFreqHz >
      UI_SOUND_PRESETS.open[0].startFreqHz,
    'Open chord should rise'
  );
  assert.ok(
    UI_SOUND_PRESETS.close[UI_SOUND_PRESETS.close.length - 1].endFreqHz <
      UI_SOUND_PRESETS.close[0].startFreqHz,
    'Close cadence should descend softly'
  );
  assert.ok(
    UI_SOUND_PRESETS.copy[0].startFreqHz >= 1000 && UI_SOUND_PRESETS.copy.length === 2,
    'Copy should use high twin crystal glass pings'
  );
  assert.ok(UI_SOUND_PRESETS.success.length >= 4, 'Success should play a full 4-note fanfare');
});

test('playUiSound and playUiSoundSync safely skip playback when disabled or outside browser DOM', async () => {
  assert.equal(playUiSoundSync('tap', false), false);
  assert.equal(playUiSoundSync('hover', true), false);
  assert.equal(await playUiSound('hover', false), false);
  assert.equal(await playUiSound('hover', true), false);
});

function createMockAudioEnv(initialState: AudioContextState, resumeSucceeds: boolean) {
  let oscStartedCount = 0;
  const noop = () => {};
  const mockParam = () => ({
    value: 0,
    setValueAtTime: noop,
    linearRampToValueAtTime: noop,
    exponentialRampToValueAtTime: noop,
  });
  const mockNode = () => ({
    connect: noop,
    gain: mockParam(),
    frequency: mockParam(),
    Q: mockParam(),
    detune: mockParam(),
    pan: mockParam(),
    threshold: mockParam(),
    knee: mockParam(),
    ratio: mockParam(),
    attack: mockParam(),
    release: mockParam(),
    type: 'sine',
    buffer: null,
    start: () => {},
    stop: noop,
  });

  const ctx = {
    state: initialState,
    sampleRate: 48000,
    currentTime: 1.25,
    destination: {},
    resume: async () => {
      if (resumeSucceeds) {
        ctx.state = 'running';
      }
    },
    createGain: () => mockNode(),
    createBiquadFilter: () => mockNode(),
    createDynamicsCompressor: () => mockNode(),
    createStereoPanner: () => mockNode(),
    createBuffer: (_ch: number, len: number) => ({
      getChannelData: () => new Float32Array(len),
    }),
    createBufferSource: () => mockNode(),
    createOscillator: () => {
      const node = mockNode();
      node.start = () => {
        oscStartedCount += 1;
      };
      return node;
    },
  };

  return {
    ctx,
    getOscStartedCount: () => oscStartedCount,
  };
}

test('playUiSoundSync never queues oscillators when AudioContext stays suspended, and plays synchronously once running', async () => {
  const prevWindow = (globalThis as { window?: unknown }).window;

  try {
    const env = createMockAudioEnv('suspended', false);
    (globalThis as { window?: unknown }).window = {
      AudioContext: function MockAudioContext() {
        return env.ctx;
      },
    };

    // Suspended context that fails to resume must NOT queue oscillators
    assert.equal(playUiSoundSync('tap', true), false);
    assert.equal(playUiSoundSync('hover', true), false);
    await new Promise((r) => setTimeout(r, 15));
    assert.equal(
      env.getOscStartedCount(),
      0,
      'Oscillators must never be scheduled onto a suspended AudioContext'
    );

    // Once running, tap schedules synchronously in the same tick
    env.ctx.state = 'running';
    assert.equal(playUiSoundSync('tap', true), true);
    assert.ok(env.getOscStartedCount() > 0, 'Running AudioContext should schedule synchronously');
  } finally {
    if (prevWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window?: unknown }).window = prevWindow;
    }
  }
});

