import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildYouTubeEmbedUrl,
  computeExcerptEnvelope,
  EMPTY_MAGNOLIA_EXCERPT,
  extractYouTubeVideoId,
} from './excerptMusic';

test('extractYouTubeVideoId parses YouTube Music watch URL and direct IDs accurately', () => {
  assert.equal(
    extractYouTubeVideoId('https://music.youtube.com/watch?v=pCmID52lk6Y&si=Jk5Nc77bR3PXn_ry'),
    'pCmID52lk6Y'
  );
  assert.equal(
    extractYouTubeVideoId('https://youtu.be/u95YOPIeOD4?si=abc'),
    'u95YOPIeOD4'
  );
  assert.equal(extractYouTubeVideoId('pCmID52lk6Y'), 'pCmID52lk6Y');
  assert.equal(extractYouTubeVideoId('invalid'), null);
});

test('EMPTY_MAGNOLIA_EXCERPT matches exact 1.2s delay and 6-line lyric window', () => {
  assert.equal(EMPTY_MAGNOLIA_EXCERPT.videoId, 'pCmID52lk6Y');
  assert.equal(EMPTY_MAGNOLIA_EXCERPT.postIntroDelayMs, 1200);
  assert.equal(EMPTY_MAGNOLIA_EXCERPT.lyricLines.length, 6);
  // Begins right before [01:55.83] and ends well before [02:35.06] ("Now I got nothing on my mind")
  assert.ok(EMPTY_MAGNOLIA_EXCERPT.startSec >= 115 && EMPTY_MAGNOLIA_EXCERPT.startSec < 116);
  assert.ok(EMPTY_MAGNOLIA_EXCERPT.endSec > 148 && EMPTY_MAGNOLIA_EXCERPT.endSec < 154);
});

test('computeExcerptEnvelope ramps smoothly up during fade-in, sustains, and fades down to stop', () => {
  const { startSec, fadeInSec, fadeOutSec, endSec, peakVolume, minStartVolume } =
    EMPTY_MAGNOLIA_EXCERPT;

  const atStart = computeExcerptEnvelope(startSec);
  assert.equal(atStart.phase, 'fade-in');
  assert.equal(atStart.volume, minStartVolume);
  assert.equal(atStart.shouldStop, false);

  const midFadeIn = computeExcerptEnvelope(startSec + fadeInSec * 0.5);
  assert.equal(midFadeIn.phase, 'fade-in');
  assert.ok(midFadeIn.volume > minStartVolume && midFadeIn.volume < peakVolume);

  const inSustain = computeExcerptEnvelope(startSec + fadeInSec + 5);
  assert.equal(inSustain.phase, 'sustain');
  assert.equal(inSustain.volume, peakVolume);
  assert.equal(inSustain.shouldStop, false);

  const fadeOutStart = endSec - fadeOutSec;
  const midFadeOut = computeExcerptEnvelope(fadeOutStart + fadeOutSec * 0.5);
  assert.equal(midFadeOut.phase, 'fade-out');
  assert.ok(midFadeOut.volume > 0 && midFadeOut.volume < peakVolume);

  const nearEnd = computeExcerptEnvelope(endSec - 0.05);
  assert.equal(nearEnd.phase, 'fade-out');
  assert.ok(nearEnd.volume <= 5);

  const atEnd = computeExcerptEnvelope(endSec);
  assert.equal(atEnd.phase, 'ended');
  assert.equal(atEnd.volume, 0);
  assert.equal(atEnd.shouldStop, true);

  const beyondEnd = computeExcerptEnvelope(155.1);
  assert.equal(beyondEnd.shouldStop, true);
  assert.equal(beyondEnd.volume, 0);
});

test('buildYouTubeEmbedUrl sets enablejsapi, playsinline, start cue, and origin', () => {
  const url = buildYouTubeEmbedUrl({
    videoId: 'pCmID52lk6Y',
    origin: 'http://localhost:3000',
    startSec: EMPTY_MAGNOLIA_EXCERPT.startSec,
  });
  const parsed = new URL(url);
  assert.equal(parsed.origin, 'https://www.youtube.com');
  assert.equal(parsed.pathname, '/embed/pCmID52lk6Y');
  assert.equal(parsed.searchParams.get('enablejsapi'), '1');
  assert.equal(parsed.searchParams.get('playsinline'), '1');
  assert.equal(parsed.searchParams.get('start'), '115');
  assert.equal(parsed.searchParams.get('origin'), 'http://localhost:3000');
});
