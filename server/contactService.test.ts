import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSmtpConfiguration } from './contactService';

test('resolveSmtpConfiguration falls back to SMTP_USER and smtp.gmail.com when Gmail credentials are provided', () => {
  const unconfigured = resolveSmtpConfiguration({});
  assert.equal(unconfigured.isConfigured, false);

  const minimalGmail = resolveSmtpConfiguration({
    SMTP_USER: 'penulis@gmail.com',
    SMTP_PASS: 'abcd efgh ijkl mnop',
  });
  assert.equal(minimalGmail.isConfigured, true);
  assert.equal(minimalGmail.recipient, 'penulis@gmail.com');
  assert.equal(minimalGmail.host, 'smtp.gmail.com');
  assert.equal(minimalGmail.pass, 'abcdefghijklmnop');
  assert.equal(minimalGmail.port, 465);

  const explicitRecipient = resolveSmtpConfiguration({
    CONTACT_RECIPIENT_EMAIL: 'inbox@example.com',
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: '587',
    SMTP_USER: 'mailer@example.com',
    SMTP_PASS: 'secret1234',
  });
  assert.equal(explicitRecipient.isConfigured, true);
  assert.equal(explicitRecipient.recipient, 'inbox@example.com');
  assert.equal(explicitRecipient.host, 'smtp.example.com');
  assert.equal(explicitRecipient.port, 587);
});
