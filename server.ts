import 'dotenv/config';
import crypto from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { validateServerContactPayload } from './src/utils/contactFilter.ts';
import { issueMathChallenge, verifyMathChallenge } from './server/challengeService.ts';
import { screenAndForwardContact } from './server/contactService.ts';
import {
  isBlockedSensitivePath,
  isOriginAllowed,
  redactSensitiveLogText,
  sanitizeJsonBodyObject,
} from './server/requestSecurity.ts';

const PORT = Number(process.env.PORT || 3000);
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 6;
const CHALLENGE_RATE_LIMIT_MAX = 30;
const GLOBAL_API_RATE_LIMIT_MAX = 60;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

interface RateEntry {
  count: number;
  resetAt: number;
}

const contactBuckets = new Map<string, RateEntry>();
const challengeBuckets = new Map<string, RateEntry>();
const globalApiBuckets = new Map<string, RateEntry>();
const recentMessageHashes = new Map<string, number>();

function checkRateLimit(
  buckets: Map<string, RateEntry>,
  ipKey: string,
  maxRequests: number
): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (buckets.size > 500) {
    for (const [key, entry] of buckets.entries()) {
      if (entry.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }

  const current = buckets.get(ipKey);
  if (!current || current.resetAt <= now) {
    buckets.set(ipKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfterSec: 0 };
  }

  if (current.count >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { limited: true, retryAfterSec };
  }

  current.count += 1;
  return { limited: false, retryAfterSec: 0 };
}

function isDuplicateSubmission(ipKey: string, email: string, message: string): boolean {
  const now = Date.now();
  if (recentMessageHashes.size > 500) {
    for (const [hash, expiresAt] of recentMessageHashes.entries()) {
      if (expiresAt <= now) {
        recentMessageHashes.delete(hash);
      }
    }
  }

  const fingerprint = crypto
    .createHash('sha256')
    .update(`${ipKey}|${email.toLowerCase()}|${message.trim().toLowerCase()}`)
    .digest('hex');

  const existingExpiry = recentMessageHashes.get(fingerprint);
  if (existingExpiry && existingExpiry > now) {
    return true;
  }

  recentMessageHashes.set(fingerprint, now + DUPLICATE_WINDOW_MS);
  return false;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', true);

  app.use((req, res, next) => {
    if (isBlockedSensitivePath(req.originalUrl)) {
      res.status(403).type('text/plain').send('Forbidden');
      return;
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
    );
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    if (req.secure || req.get('x-forwarded-proto') === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    const csp =
      process.env.NODE_ENV === 'production'
        ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
        : "base-uri 'self'; object-src 'none'; form-action 'self'";
    res.setHeader('Content-Security-Policy', csp);

    next();
  });

  app.use('/api', (req, res, next) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rate = checkRateLimit(globalApiBuckets, clientIp, GLOBAL_API_RATE_LIMIT_MAX);
    if (rate.limited) {
      res.setHeader('Retry-After', String(rate.retryAfterSec));
      res.status(429).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Terlalu banyak permintaan API. Silakan tunggu beberapa saat.',
      });
      return;
    }
    next();
  });

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/contact/challenge', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rate = checkRateLimit(challengeBuckets, clientIp, CHALLENGE_RATE_LIMIT_MAX);
    if (rate.limited) {
      res.setHeader('Retry-After', String(rate.retryAfterSec));
      res.status(429).json({
        ok: false,
        message: 'Terlalu banyak permintaan soal verifikasi. Coba lagi sebentar.',
      });
      return;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.json(issueMathChallenge());
  });

  app.post('/api/contact', async (req, res) => {
    if (!isOriginAllowed(req.get('origin'), req.get('host'), req.get('x-forwarded-host'))) {
      res.status(403).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Permintaan lintas asal tidak diizinkan.',
      });
      return;
    }

    if (!req.is('application/json')) {
      res.status(415).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Format Content-Type harus application/json.',
      });
      return;
    }

    const safeBody = sanitizeJsonBodyObject(req.body);
    if (!safeBody) {
      res.status(400).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Format data permintaan tidak valid.',
      });
      return;
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rate = checkRateLimit(contactBuckets, clientIp, CONTACT_RATE_LIMIT_MAX);
    if (rate.limited) {
      res.setHeader('Retry-After', String(rate.retryAfterSec));
      res.status(429).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Terlalu banyak percobaan pengiriman pesan. Coba lagi dalam beberapa menit.',
      });
      return;
    }

    const validation = validateServerContactPayload(safeBody);
    if (!validation.ok) {
      res.status(400).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: validation.error,
        fieldErrors: validation.fieldErrors ?? {},
      });
      return;
    }

    const challengeCheck = verifyMathChallenge(
      safeBody.challengeToken,
      safeBody.challengeAnswer
    );
    if (!challengeCheck.ok) {
      res.status(422).json({
        ok: false,
        status: 'challenge_failed',
        emailDelivered: false,
        fieldErrors: { challengeAnswer: challengeCheck.message },
        message: challengeCheck.message,
      });
      return;
    }

    if (isDuplicateSubmission(clientIp, validation.data.email, validation.data.message)) {
      res.status(429).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Pesan yang sama baru saja dikirim. Tunggu beberapa menit sebelum mengirim ulang.',
      });
      return;
    }

    const result = await screenAndForwardContact(validation.data);
    res.status(result.httpStatus).json({
      ok: result.ok,
      status: result.status,
      emailDelivered: result.emailDelivered,
      spamCheck: result.spamCheck,
      message: result.message,
    });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({
      ok: false,
      status: 'error',
      message: 'Endpoint API tidak ditemukan.',
    });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { dotfiles: 'deny' }));
    app.use((req, res, next) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        next();
        return;
      }
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output tidak ditemukan.');
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
        ? err.status
        : 500;
    const isTooLarge = status === 413;
    const isBadJson = status === 400;
    res.status(isTooLarge ? 413 : isBadJson ? 400 : 500).json({
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: isTooLarge
        ? 'Ukuran permintaan terlalu besar.'
        : isBadJson
          ? 'Format JSON tidak valid.'
          : 'Terjadi gangguan pada server.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(
    'Failed to start server:',
    redactSensitiveLogText(msg, [
      process.env.CONTACT_RECIPIENT_EMAIL,
      process.env.SMTP_USER,
      process.env.SMTP_PASS,
    ])
  );
  process.exit(1);
});
