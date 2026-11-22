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
      assert.ok(tone.startFreqHz >= 80 && tone.endFreqHz >= 80);
      assert.ok(tone.peakGain > 0 && tone.peakGain <= 0.1, 'UI sound gain must stay gentle');
    }
  }

  assert.ok(
    UI_SOUND_PRESETS.hover[0].peakGain <= 0.04,
    'Hover sound effect must remain ultra-subtle'
  );
});

test('playUiSound safely skips playback when sound is disabled or outside browser DOM', async () => {
  assert.equal(await playUiSound('hover', false), false);
  assert.equal(await playUiSound('hover', true), false);
});

