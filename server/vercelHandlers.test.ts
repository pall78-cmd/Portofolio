import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import healthHandler from '../api/health';
import challengeHandler from '../api/contact/challenge';
import contactHandler from '../api/contact';
import { issueMathChallenge } from './challengeService';
import { checkSenderEmailQuota, resolveClientIpKey } from './rateLimitService';

function createMockRes() {
  const headers: Record<string, string> = {};
  let body = '';
  const res = {
    statusCode: 200,
    setHeader(key: string, value: string) {
      headers[key.toLowerCase()] = value;
    },
    end(chunk?: string) {
      if (chunk) body += chunk;
    },
  };
  return {
    res: res as unknown as ServerResponse,
    getStatus: () => res.statusCode,
    getHeaders: () => headers,
    getJson: () => JSON.parse(body) as Record<string, unknown>,
  };
}

function createMockReq(options: {
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  remoteAddress?: string;
}) {
  const emitter = new EventEmitter() as IncomingMessage & { body?: unknown };
  emitter.method = options.method;
  emitter.headers = options.headers ?? {};
  Object.defineProperty(emitter, 'socket', {
    value: { remoteAddress: options.remoteAddress ?? '198.51.100.10' },
  });
  if (options.body !== undefined) {
    emitter.body = options.body;
  }
  return emitter;
}

test('Vercel health and challenge handlers return valid JSON, security headers, and block cross-site scrape', () => {
  const healthMock = createMockRes();
  healthHandler(createMockReq({ method: 'GET' }), healthMock.res);
  assert.equal(healthMock.getStatus(), 200);
  assert.equal(healthMock.getJson().ok, true);
  assert.equal(healthMock.getHeaders()['x-frame-options'], 'DENY');
  assert.equal(healthMock.getHeaders()['cross-origin-resource-policy'], 'same-origin');

  const crossSiteChallenge = createMockRes();
  challengeHandler(
    createMockReq({ method: 'GET', headers: { 'sec-fetch-site': 'cross-site' } }),
    crossSiteChallenge.res
  );
  assert.equal(crossSiteChallenge.getStatus(), 403);

  const challengeMock = createMockRes();
  challengeHandler(createMockReq({ method: 'GET' }), challengeMock.res);
  assert.equal(challengeMock.getStatus(), 200);
  assert.equal(challengeMock.getHeaders()['cache-control'], 'no-store, max-age=0');
  assert.equal(challengeMock.getHeaders()['x-content-type-options'], 'nosniff');
  const data = challengeMock.getJson();
  assert.equal(typeof data.token, 'string');
  assert.match(String(data.question), /^Berapa hasil \d+ \+ \d+\?$/);
});

test('Vercel contact handler rejects non-POST, missing/cross origin, wrong content-type, oversized pre-parsed body, and invalid challenge', async () => {
  const methodMock = createMockRes();
  await contactHandler(createMockReq({ method: 'GET' }), methodMock.res);
  assert.equal(methodMock.getStatus(), 405);

  const missingOriginMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'application/json',
      },
      body: {},
      remoteAddress: '198.51.100.11',
    }),
    missingOriginMock.res
  );
  assert.equal(missingOriginMock.getStatus(), 403);

  const originMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        origin: 'https://evil.example',
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'application/json',
      },
      body: {},
      remoteAddress: '198.51.100.12',
    }),
    originMock.res
  );
  assert.equal(originMock.getStatus(), 403);

  const typeMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        origin: 'https://naufalathallah-rosiyandi.vercel.app',
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'text/plain',
      },
      body: 'hi',
      remoteAddress: '198.51.100.13',
    }),
    typeMock.res
  );
  assert.equal(typeMock.getStatus(), 415);

  const oversizedMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        origin: 'https://naufalathallah-rosiyandi.vercel.app',
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'application/json',
      },
      body: { name: 'A', message: 'X'.repeat(20_000) },
      remoteAddress: '198.51.100.14',
    }),
    oversizedMock.res
  );
  assert.equal(oversizedMock.getStatus(), 413);

  const challengeFailMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        origin: 'https://naufalathallah-rosiyandi.vercel.app',
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'application/json',
      },
      body: {
        name: 'Nadia Putri',
        email: 'nadia@uinsa.ac.id',
        topic: 'Diskusi Sastra & Penulisan',
        message: 'Halo Naufal, saya ingin berdiskusi tentang karya terbaru.',
        website: '',
        challengeToken: 'tampered.token',
        challengeAnswer: '10',
      },
      remoteAddress: '198.51.100.15',
    }),
    challengeFailMock.res
  );
  assert.equal(challengeFailMock.getStatus(), 422);
});

test('Vercel contact handler enforces IP rate limiting and sender email quota across rotating IPs', async () => {
  const spoofedKey = resolveClientIpKey(
    { 'x-vercel-forwarded-for': '203.0.113.99', 'x-forwarded-for': '1.2.3.4, 203.0.113.99' },
    '10.0.0.1'
  );
  assert.equal(spoofedKey, '203.0.113.99');

  const floodIp = '198.51.100.250';
  for (let i = 0; i < 6; i += 1) {
    const challenge = issueMathChallenge(Date.now() - 5000);
    const sumMatch = challenge.question.match(/(\d+)\s*\+\s*(\d+)/);
    const ans = Number(sumMatch![1]) + Number(sumMatch![2]);
    const mock = createMockRes();
    await contactHandler(
      createMockReq({
        method: 'POST',
        headers: {
          origin: 'https://naufalathallah-rosiyandi.vercel.app',
          host: 'naufalathallah-rosiyandi.vercel.app',
          'content-type': 'application/json',
          'x-vercel-forwarded-for': floodIp,
        },
        body: {
          name: 'Tester Flood',
          email: `flood-${i}@uinsa.ac.id`,
          topic: 'Diskusi Sastra & Penulisan',
          message: `Pesan unik nomor ${i} untuk pengujian pembatasan laju server.`,
          website: '',
          challengeToken: challenge.token,
          challengeAnswer: String(ans),
        },
      }),
      mock.res
    );
    if (i < 5) {
      assert.notEqual(mock.getStatus(), 429);
    } else {
      assert.equal(mock.getStatus(), 429);
      assert.ok(Number(mock.getHeaders()['retry-after']) >= 1);
    }
  }

  for (let i = 0; i < 3; i += 1) {
    assert.equal(checkSenderEmailQuota('quota.target@example.org').limited, false);
  }
  assert.equal(checkSenderEmailQuota('quota.target@example.org').limited, true);
});
