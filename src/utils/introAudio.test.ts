import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGrandDoorIntroPcmSamples,
  encodeStereoWavBuffer,
  INTRO_DURATION_MS,
  INTRO_FADE_MS,
  playNetflixIntroSound,
  shouldBypassIntro,
  TUDUM_NOTE_LAYERS,
  unlockSharedAudioContextSync,
} from './introAudio';

test('buildGrandDoorIntroPcmSamples generates valid stereo WAV with door impact, sweep, and orchestral reveal', () => {
  const sampleRate = 22050;
  const { left, right } = buildGrandDoorIntroPcmSamples(sampleRate, INTRO_DURATION_MS / 1000);

  assert.equal(left.length, right.length);
  assert.ok(left.length > sampleRate * 4);

  const measureRms = (startSec: number, endSec: number) => {
    const startIdx = Math.floor(startSec * sampleRate);
    const endIdx = Math.min(left.length, Math.floor(endSec * sampleRate));
    let sumSq = 0;
    for (let i = startIdx; i < endIdx; i += 1) {
      assert.ok(Number.isFinite(left[i]) && Number.isFinite(right[i]));
      sumSq += left[i] * left[i] + right[i] * right[i];
    }
    return Math.sqrt(sumSq / Math.max(1, (endIdx - startIdx) * 2));
  };

  const latchRms = measureRms(0.01, 0.35);
  const doorOpenRms = measureRms(0.35, 1.0);
  const revealRms = measureRms(1.1, 2.8);
  const tailEndRms = measureRms(4.5, 4.78);

  assert.ok(latchRms > 0.05, `Expected strong initial door unlatch/slam RMS, got ${latchRms}`);
  assert.ok(doorOpenRms > 0.02, `Expected portal sweep RMS, got ${doorOpenRms}`);
  assert.ok(revealRms > 0.08, `Expected monumental brass reveal RMS, got ${revealRms}`);
  assert.ok(tailEndRms < revealRms * 0.4, 'Expected smooth fade out at end of intro');

  const wavBuffer = encodeStereoWavBuffer(left, right, sampleRate);
  const headerView = new DataView(wavBuffer);
  assert.equal(String.fromCharCode(headerView.getUint8(0), headerView.getUint8(1), headerView.getUint8(2), headerView.getUint8(3)), 'RIFF');
  assert.equal(String.fromCharCode(headerView.getUint8(8), headerView.getUint8(9), headerView.getUint8(10), headerView.getUint8(11)), 'WAVE');
  assert.equal(wavBuffer.byteLength, 44 + left.length * 4);
});

test('TUDUM_NOTE_LAYERS defines portal impact and brass reveal layers cleanly', () => {
  const latchNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec < 0.2);
  const revealNotes = TUDUM_NOTE_LAYERS.filter((layer) => layer.startOffsetSec >= 1.0);
  const leftPanNotes = TUDUM_NOTE_LAYERS.filter((layer) => (layer.pan ?? 0) < 0);
  const rightPanNotes = TUDUM_NOTE_LAYERS.filter((layer) => (layer.pan ?? 0) > 0);

  assert.ok(latchNotes.length >= 3);
  assert.ok(revealNotes.length >= 8);
  assert.ok(leftPanNotes.length >= 2 && rightPanNotes.length >= 2);
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
