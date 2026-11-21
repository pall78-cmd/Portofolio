import nodemailer from 'nodemailer';
import {
  escapeHtml,
  evaluateManualSpamFilter,
  sanitizeHeaderValue,
  type SanitizedContactInput,
} from '../src/utils/contactFilter.ts';
import { redactSensitiveLogText } from './requestSecurity.ts';

export interface SpamVerdict {
  isSpam: boolean;
  category: string;
  confidence: string;
  reason: string;
}

export interface ContactForwardResult {
  httpStatus: number;
  ok: boolean;
  status: 'delivered' | 'screened_pending_smtp' | 'blocked_spam' | 'error';
  emailDelivered: boolean;
  spamCheck: SpamVerdict;
  message: string;
}

const PLACEHOLDER_RECIPIENTS = new Set(['', 'nama@contoh.com', 'email-tujuan@contoh.com']);

function getSmtpConfiguration() {
  const recipient = sanitizeHeaderValue(process.env.CONTACT_RECIPIENT_EMAIL ?? '');
  const host = sanitizeHeaderValue(process.env.SMTP_HOST ?? '');
  const user = sanitizeHeaderValue(process.env.SMTP_USER ?? '');
  const pass = (process.env.SMTP_PASS ?? '').replace(/\s+/g, '');
  const port = Number(process.env.SMTP_PORT || '465');

  const isConfigured =
    Boolean(recipient) &&
    !PLACEHOLDER_RECIPIENTS.has(recipient.toLowerCase()) &&
    Boolean(host) &&
    Boolean(user) &&
    Boolean(pass) &&
    Number.isFinite(port) &&
    port > 0;

  return { isConfigured, recipient, host, user, pass, port };
}

async function sendForwardedEmail(
  input: SanitizedContactInput,
  verdict: SpamVerdict
): Promise<boolean> {
  const smtp = getSmtpConfiguration();
  if (!smtp.isConfigured) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const safeSubject = sanitizeHeaderValue(`[Portofolio] ${input.topic} — dari ${input.name}`);
  const plainBody = [
    'Pesan baru dari formulir kontak portofolio (lolos filter manual & anti-bot):',
    '',
    `Nama    : ${input.name}`,
    `Email   : ${input.email}`,
    `Topik   : ${input.topic}`,
    `Status  : Aman (${verdict.category}) — ${verdict.reason}`,
    '',
    'Pesan:',
    input.message,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: system-ui, sans-serif; color: #0f172a; line-height: 1.6;">
      <p style="font-size: 13px; color: #475569;">Pesan baru dari formulir kontak portofolio (lolos penyaring manual &amp; verifikasi anti-bot).</p>
      <table style="border-collapse: collapse; margin: 12px 0; font-size: 14px;">
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Nama</td><td>${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Email</td><td>${escapeHtml(input.email)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Topik</td><td>${escapeHtml(input.topic)}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0; font-weight: 600;">Penyaring</td><td>${escapeHtml(verdict.category)} — ${escapeHtml(verdict.reason)}</td></tr>
      </table>
      <div style="margin-top: 12px; padding: 12px; border: 1px solid #cbd5e1; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(input.message)}</div>
    </div>
  `.trim();

  await transporter.sendMail({
    from: `"Portofolio Naufal" <${smtp.user}>`,
    to: smtp.recipient,
    replyTo: input.email,
    subject: safeSubject,
    text: plainBody,
    html: htmlBody,
  });

  return true;
}

export async function screenAndForwardContact(
  input: SanitizedContactInput
): Promise<ContactForwardResult> {
  const filterResult = evaluateManualSpamFilter(input);
  const verdict: SpamVerdict = {
    isSpam: filterResult.flagged,
    category: filterResult.category,
    confidence: filterResult.score >= 85 ? 'tinggi' : 'sedang',
    reason: filterResult.reason,
  };

  if (verdict.isSpam) {
    return {
      httpStatus: 422,
      ok: false,
      status: 'blocked_spam',
      emailDelivered: false,
      spamCheck: verdict,
      message: 'Pesan ditahan oleh penyaring spam otomatis dan tidak diteruskan ke email.',
    };
  }

  try {
    const delivered = await sendForwardedEmail(input, verdict);
    if (delivered) {
      return {
        httpStatus: 200,
        ok: true,
        status: 'delivered',
        emailDelivered: true,
        spamCheck: verdict,
        message: 'Pesan lolos penyaring spam dan telah diteruskan ke kotak masuk pemilik.',
      };
    }

    return {
      httpStatus: 200,
      ok: true,
      status: 'screened_pending_smtp',
      emailDelivered: false,
      spamCheck: verdict,
      message:
        'Pesan lolos penyaring spam & verifikasi keamanan, namun penerusan ke email pemilik sedang tidak aktif saat ini.',
    };
  } catch (err) {
    const rawError = err instanceof Error ? err.message : String(err);
    console.warn(
      '[contactService] SMTP delivery failed:',
      redactSensitiveLogText(rawError, [
        process.env.CONTACT_RECIPIENT_EMAIL,
        process.env.SMTP_USER,
        process.env.SMTP_PASS,
      ])
    );
    return {
      httpStatus: 502,
      ok: false,
      status: 'error',
      emailDelivered: false,
      spamCheck: verdict,
      message:
        'Pesan lolos penyaring spam, namun server mengalami gangguan saat meneruskan email. Silakan coba lagi nanti atau hubungi lewat tautan resmi.',
    };
  }
}
