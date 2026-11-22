import test from 'node:test';
import assert from 'node:assert/strict';
import { playUiSound, UI_SOUND_PRESETS, type UiSoundKind } from './soundFx';

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
});

test('playUiSound safely skips playback when sound is disabled or outside browser DOM', async () => {
  assert.equal(await playUiSound('hover', false), false);
  assert.equal(await playUiSound('hover', true), false);
});

