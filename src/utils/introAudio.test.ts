import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  shouldBypassIntro,
  TUDUM_NOTE_LAYERS,
} from './introAudio';

test('TUDUM_NOTE_LAYERS defines both Ta and Dum hits with valid frequencies and envelopes', () => {
  const taNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec === 0);
  const dumNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec >= 0.2);

  assert.ok(taNotes.length >= 2, 'Expected first percussive Ta impact layers');
  assert.ok(dumNotes.length >= 3, 'Expected second resonant Dum chord layers');

  for (const layer of TUDUM_NOTE_LAYERS) {
    assert.ok(layer.startFreqHz > 0 && layer.endFreqHz > 0);
    assert.ok(layer.durationSec > 0);
    assert.ok(layer.peakGain > 0 && layer.peakGain <= 1);
  }
});

test('shouldBypassIntro respects autostart, deep links, and reduced motion preferences', () => {
  assert.equal(shouldBypassIntro('', false), false);
  assert.equal(shouldBypassIntro('?autostart=1', false), true);
  assert.equal(shouldBypassIntro('?karya=throne-of-ashes-tahkta-abu', false), true);
  assert.equal(shouldBypassIntro('', true), true);
});

test('intro durations leave sufficient window for fade transition', () => {
  assert.ok(INTRO_DURATION_MS > INTRO_FADE_MS * 3);
});
