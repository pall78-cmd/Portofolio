import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBlockedSensitivePath,
  isOriginAllowed,
  redactSensitiveLogText,
  sanitizeJsonBodyObject,
} from './requestSecurity';

test('isBlockedSensitivePath blocks dotfiles, traversal, null bytes, and server source paths while allowing app paths', () => {
  assert.equal(isBlockedSensitivePath('/.env'), true);
  assert.equal(isBlockedSensitivePath('/.env.example'), true);
  assert.equal(isBlockedSensitivePath('/%252eenv'), true);
  assert.equal(isBlockedSensitivePath('/.git/config'), true);
  assert.equal(isBlockedSensitivePath('/server.ts'), true);
  assert.equal(isBlockedSensitivePath('/server/contactService.ts'), true);
  assert.equal(isBlockedSensitivePath('/package.json'), true);
  assert.equal(isBlockedSensitivePath('/backup.sql'), true);
  assert.equal(isBlockedSensitivePath('/debug.log'), true);
  assert.equal(isBlockedSensitivePath('/../../etc/passwd'), true);
  assert.equal(isBlockedSensitivePath('/%2e%2e/etc/passwd'), true);
  assert.equal(isBlockedSensitivePath('/%252e%252e/etc/passwd'), true);
  assert.equal(isBlockedSensitivePath('/index.html%00.png'), true);

  assert.equal(isBlockedSensitivePath('/'), false);
  assert.equal(isBlockedSensitivePath('/api/contact'), false);
  assert.equal(isBlockedSensitivePath('/src/main.tsx'), false);
});

test('redactSensitiveLogText masks email addresses and explicit secret values', () => {
  const raw = 'SMTP error for owner@gmail.com using secretPass123 on smtp.gmail.com';
  const redacted = redactSensitiveLogText(raw, ['owner@gmail.com', 'secretPass123']);
  assert.equal(redacted.includes('owner@gmail.com'), false);
  assert.equal(redacted.includes('secretPass123'), false);
  assert.match(redacted, /\[SECRET_REDACTED\]/);

  const emailOnly = redactSensitiveLogText('Bounce from private.user@gmail.com');
  assert.equal(emailOnly.includes('private.user@gmail.com'), false);
  assert.match(emailOnly, /\[EMAIL_REDACTED\]/);
});

test('sanitizeJsonBodyObject strips prototype pollution keys', () => {
  const malicious = JSON.parse('{"name":"Naufal","__proto__":{"polluted":true},"constructor":"bad"}');
  const cleaned = sanitizeJsonBodyObject(malicious);
  assert.ok(cleaned);
  assert.equal(cleaned.name, 'Naufal');
  assert.equal(Object.prototype.hasOwnProperty.call(cleaned, '__proto__'), false);
  assert.equal(Object.prototype.hasOwnProperty.call(cleaned, 'constructor'), false);
});

test('isOriginAllowed matches host and forwarded host strictly', () => {
  assert.equal(isOriginAllowed(undefined, 'localhost:3000', undefined), true);
  assert.equal(isOriginAllowed('http://localhost:3000', 'localhost:3000', undefined), true);
  assert.equal(
    isOriginAllowed('https://my-app.run.app', '127.0.0.1:3000', 'my-app.run.app'),
    true
  );
  assert.equal(isOriginAllowed('https://evil.example', 'localhost:3000', undefined), false);
  assert.equal(isOriginAllowed('not-a-url', 'localhost:3000', undefined), false);
});
