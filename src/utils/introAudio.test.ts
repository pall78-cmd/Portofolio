import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  playNetflixIntroSound,
  shouldBypassIntro,
  TUDUM_NOTE_LAYERS,
  unlockSharedAudioContextSync,
} from './introAudio';

test('TUDUM_NOTE_LAYERS defines both Ta and Dum hits with valid frequencies and envelopes', () => {
  const taNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec === 0);
  const dumNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec >= 0.2);
  const leftPanNotes = TUDUM_NOTE_LAYERS.filter((layer) => (layer.pan ?? 0) < 0);
  const rightPanNotes = TUDUM_NOTE_LAYERS.filter((layer) => (layer.pan ?? 0) > 0);
  const bloomNotes = TUDUM_NOTE_LAYERS.filter((layer) => Boolean(layer.filterPeakHz));

  assert.ok(taNotes.length >= 3, 'Expected multi-layered percussive Ta impact');
  assert.ok(dumNotes.length >= 8, 'Expected wide orchestral Dum brass & choir stack');
  assert.ok(leftPanNotes.length >= 2 && rightPanNotes.length >= 2, 'Expected balanced stereo spread');
  assert.ok(bloomNotes.length >= 5, 'Expected dynamic lowpass brass bloom layers');

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

test('intro audio unlock and abort guards behave safely outside browser DOM', async () => {
  assert.equal(unlockSharedAudioContextSync(), false);
  const aborted = await playNetflixIntroSound({
    muted: false,
    fromUserGesture: true,
    shouldAbort: () => true,
  });
  assert.equal(aborted.played, false);
});
