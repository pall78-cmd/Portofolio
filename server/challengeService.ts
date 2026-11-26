import crypto from 'node:crypto';

const CHALLENGE_TTL_MS = 30 * 60 * 1000;
const MIN_HUMAN_ELAPSED_MS = 1500;
const MAX_USED_NONCES = 2000;

function resolveSigningSecret(): string {
  const explicit = process.env.CONTACT_CHALLENGE_SECRET?.trim();
  if (explicit) {
    return explicit;
  }

  const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, '');
  if (smtpPass) {
    return crypto
      .createHmac('sha256', 'portfolio-contact-challenge-v1')
      .update(`${smtpPass}:${process.env.SMTP_USER ?? ''}:${process.env.CONTACT_RECIPIENT_EMAIL ?? ''}`)
      .digest('hex');
  }

  return crypto.randomBytes(32).toString('hex');
}

const SIGNING_SECRET = resolveSigningSecret();

const usedChallenges = new Map<string, number>();

interface ChallengePayload {
  id: string;
  a: number;
  b: number;
  iat: number;
  exp: number;
}

export interface IssuedChallenge {
  token: string;
  question: string;
}

function signPayload(encodedPayload: string): string {
  return crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(encodedPayload)
    .digest('base64url');
}

function cleanupExpiredNonces(now: number): void {
  if (usedChallenges.size <= 500) {
    return;
  }
  for (const [id, exp] of usedChallenges.entries()) {
    if (exp <= now) {
      usedChallenges.delete(id);
    }
  }
  // Evict only oldest nonces in FIFO order so active recent nonces remain protected against replay
  while (usedChallenges.size > MAX_USED_NONCES) {
    const oldestKey = usedChallenges.keys().next().value;
    if (oldestKey === undefined) {
      break;
    }
    usedChallenges.delete(oldestKey);
  }
}

export function issueMathChallenge(now = Date.now()): IssuedChallenge {
  const a = crypto.randomInt(2, 10);
  const b = crypto.randomInt(1, 10);
  const payload: ChallengePayload = {
    id: crypto.randomBytes(12).toString('hex'),
    a,
    b,
    iat: now,
    exp: now + CHALLENGE_TTL_MS,
  };

  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encoded);
  return {
    token: `${encoded}.${signature}`,
    question: `Berapa hasil ${a} + ${b}?`,
  };
}

export function verifyMathChallenge(
  token: unknown,
  answer: unknown,
  options?: { now?: number; minElapsedMs?: number }
): { ok: true } | { ok: false; message: string; reason: 'invalid' | 'expired' | 'too_fast' | 'reused' | 'wrong_answer' } {
  const now = options?.now ?? Date.now();
  const minElapsedMs = options?.minElapsedMs ?? MIN_HUMAN_ELAPSED_MS;

  if (typeof token !== 'string' || !token.includes('.')) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Token verifikasi tidak valid. Muat ulang soal verifikasi lalu coba lagi.',
    };
  }

  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Token verifikasi tidak lengkap. Muat ulang soal verifikasi lalu coba lagi.',
    };
  }

  const [encoded, providedSig] = parts;
  const expectedSig = signPayload(encoded);
  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Verifikasi keamanan gagal. Muat ulang soal verifikasi lalu coba lagi.',
    };
  }

  let payload: ChallengePayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as ChallengePayload;
  } catch {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Format verifikasi tidak valid.',
    };
  }

  if (
    !payload ||
    typeof payload.id !== 'string' ||
    typeof payload.a !== 'number' ||
    typeof payload.b !== 'number' ||
    typeof payload.iat !== 'number' ||
    typeof payload.exp !== 'number'
  ) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Data verifikasi tidak valid.',
    };
  }

  cleanupExpiredNonces(now);

  if (now > payload.exp) {
    return {
      ok: false,
      reason: 'expired',
      message: 'Soal verifikasi sudah kedaluwarsa. Klik ganti soal lalu kirim ulang.',
    };
  }

  if (usedChallenges.has(payload.id)) {
    return {
      ok: false,
      reason: 'reused',
      message: 'Soal verifikasi sudah digunakan. Gunakan soal baru untuk mengirim lagi.',
    };
  }

  if (now - payload.iat < minElapsedMs) {
    return {
      ok: false,
      reason: 'too_fast',
      message: 'Pengiriman terlalu cepat (terindikasi otomatis). Tunggu sebentar lalu coba lagi.',
    };
  }

  const numericAnswer =
    typeof answer === 'number'
      ? answer
      : typeof answer === 'string' && /^\s*\d{1,3}\s*$/.test(answer)
        ? Number.parseInt(answer.trim(), 10)
        : Number.NaN;

  if (!Number.isFinite(numericAnswer) || numericAnswer !== payload.a + payload.b) {
    return {
      ok: false,
      reason: 'wrong_answer',
      message: 'Jawaban verifikasi hitungan belum tepat. Periksa kembali angka yang dimasukkan.',
    };
  }

  usedChallenges.set(payload.id, payload.exp);
  return { ok: true };
}
