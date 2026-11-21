import test from 'node:test';
import assert from 'node:assert/strict';
import { issueMathChallenge, verifyMathChallenge } from './challengeService';

function extractExpectedSum(question: string): number {
  const match = question.match(/(\d+)\s*\+\s*(\d+)/);
  assert.ok(match, `Unexpected question format: ${question}`);
  return Number(match[1]) + Number(match[2]);
}

test('issueMathChallenge and verifyMathChallenge enforce human elapsed time, exact answer, and single-use anti-replay', () => {
  const t0 = 1_700_000_000_000;
  const challenge = issueMathChallenge(t0);
  const answer = extractExpectedSum(challenge.question);

  const tooFast = verifyMathChallenge(challenge.token, answer, { now: t0 + 100 });
  assert.equal(tooFast.ok, false);
  if (!tooFast.ok) {
    assert.equal(tooFast.reason, 'too_fast');
  }

  const wrong = verifyMathChallenge(challenge.token, answer + 1, { now: t0 + 2000 });
  assert.equal(wrong.ok, false);
  if (!wrong.ok) {
    assert.equal(wrong.reason, 'wrong_answer');
  }

  const valid = verifyMathChallenge(challenge.token, String(answer), { now: t0 + 2500 });
  assert.equal(valid.ok, true);

  const replay = verifyMathChallenge(challenge.token, answer, { now: t0 + 3000 });
  assert.equal(replay.ok, false);
  if (!replay.ok) {
    assert.equal(replay.reason, 'reused');
  }
});

test('verifyMathChallenge rejects tampered and expired tokens', () => {
  const t0 = 1_700_000_000_000;
  const challenge = issueMathChallenge(t0);
  const answer = extractExpectedSum(challenge.question);

  const tamperedToken = `${challenge.token.slice(0, -3)}xxx`;
  const tampered = verifyMathChallenge(tamperedToken, answer, { now: t0 + 2000 });
  assert.equal(tampered.ok, false);
  if (!tampered.ok) {
    assert.equal(tampered.reason, 'invalid');
  }

  const expired = verifyMathChallenge(challenge.token, answer, {
    now: t0 + 31 * 60 * 1000,
  });
  assert.equal(expired.ok, false);
  if (!expired.ok) {
    assert.equal(expired.reason, 'expired');
  }
});
