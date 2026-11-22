import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import healthHandler from '../api/health';
import challengeHandler from '../api/contact/challenge';
import contactHandler from '../api/contact';

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
}) {
  const emitter = new EventEmitter() as IncomingMessage & { body?: unknown };
  emitter.method = options.method;
  emitter.headers = options.headers ?? {};
  if (options.body !== undefined) {
    emitter.body = options.body;
  }
  return emitter;
}

test('Vercel health and challenge handlers return valid JSON and security headers', () => {
  const healthMock = createMockRes();
  healthHandler(createMockReq({ method: 'GET' }), healthMock.res);
  assert.equal(healthMock.getStatus(), 200);
  assert.equal(healthMock.getJson().ok, true);

  const challengeMock = createMockRes();
  challengeHandler(createMockReq({ method: 'GET' }), challengeMock.res);
  assert.equal(challengeMock.getStatus(), 200);
  assert.equal(challengeMock.getHeaders()['cache-control'], 'no-store');
  const data = challengeMock.getJson();
  assert.equal(typeof data.token, 'string');
  assert.match(String(data.question), /^Berapa hasil \d+ \+ \d+\?$/);
});

test('Vercel contact handler rejects non-POST, cross-origin, wrong content-type, and invalid challenge', async () => {
  const methodMock = createMockRes();
  await contactHandler(createMockReq({ method: 'GET' }), methodMock.res);
  assert.equal(methodMock.getStatus(), 405);

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
    }),
    originMock.res
  );
  assert.equal(originMock.getStatus(), 403);

  const typeMock = createMockRes();
  await contactHandler(
    createMockReq({
      method: 'POST',
      headers: {
        host: 'naufalathallah-rosiyandi.vercel.app',
        'content-type': 'text/plain',
      },
      body: 'hi',
    }),
    typeMock.res
  );
  assert.equal(typeMock.getStatus(), 415);

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
    }),
    challengeFailMock.res
  );
  assert.equal(challengeFailMock.getStatus(), 422);
});
