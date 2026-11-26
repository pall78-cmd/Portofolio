import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { validateServerContactPayload } from './src/utils/contactFilter.ts';
import { issueMathChallenge, verifyMathChallenge } from './server/challengeService.ts';
import { screenAndForwardContact } from './server/contactService.ts';
import {
  checkChallengeRateLimit,
  checkContactRateLimit,
  checkGlobalApiRateLimit,
  checkSenderEmailQuota,
  isDuplicateContactSubmission,
  resolveClientIpKey,
} from './server/rateLimitService.ts';
import {
  applyApiSecurityHeaders,
  isBlockedSensitivePath,
  isOriginAllowed,
  redactSensitiveLogText,
  sanitizeJsonBodyObject,
} from './server/requestSecurity.ts';

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    if (
      isBlockedSensitivePath(req.originalUrl, {
        allowDevViteModules: process.env.NODE_ENV !== 'production',
      })
    ) {
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
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    if (req.secure || req.get('x-forwarded-proto') === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    const allowedFrameAncestors =
      "frame-ancestors 'self' https://aistudio.google.com https://*.google.com https://*.googleusercontent.com";

    const csp =
      process.env.NODE_ENV === 'production'
        ? `default-src 'self'; script-src 'self' https://www.youtube.com https://s.ytimg.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com; connect-src 'self' https://www.youtube.com https://*.googlevideo.com; object-src 'none'; base-uri 'self'; form-action 'self'; ${allowedFrameAncestors}`
        : `base-uri 'self'; object-src 'none'; form-action 'self'; ${allowedFrameAncestors}`;
    res.setHeader('Content-Security-Policy', csp);

    next();
  });

  app.use('/api', (req, res, next) => {
    applyApiSecurityHeaders(res);
    const clientIp = resolveClientIpKey(req.headers, req.socket.remoteAddress);
    const rate = checkGlobalApiRateLimit(clientIp);
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
    if (req.get('sec-fetch-site')?.trim().toLowerCase() === 'cross-site') {
      res.status(403).json({
        ok: false,
        message: 'Permintaan lintas asal tidak diizinkan.',
      });
      return;
    }

    const clientIp = resolveClientIpKey(req.headers, req.socket.remoteAddress);
    const rate = checkChallengeRateLimit(clientIp);
    if (rate.limited) {
      res.setHeader('Retry-After', String(rate.retryAfterSec));
      res.status(429).json({
        ok: false,
        message: 'Terlalu banyak permintaan soal verifikasi. Coba lagi sebentar.',
      });
      return;
    }

    res.json(issueMathChallenge());
  });

  app.post('/api/contact', async (req, res) => {
    if (
      !isOriginAllowed(req.get('origin'), req.get('host'), req.get('x-forwarded-host'), {
        refererHeader: req.get('referer'),
        secFetchSiteHeader: req.get('sec-fetch-site'),
        requireOriginOnPost: true,
      })
    ) {
      res.status(403).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Permintaan lintas asal atau tanpa asal yang sah tidak diizinkan.',
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

    const clientIp = resolveClientIpKey(req.headers, req.socket.remoteAddress);
    const rate = checkContactRateLimit(clientIp);
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

    const emailQuota = checkSenderEmailQuota(validation.data.email);
    if (emailQuota.limited) {
      res.setHeader('Retry-After', String(emailQuota.retryAfterSec));
      res.status(429).json({
        ok: false,
        status: 'error',
        emailDelivered: false,
        message: 'Batas pengiriman dari alamat email tersebut tercapai. Coba lagi nanti.',
      });
      return;
    }

    if (isDuplicateContactSubmission(clientIp, validation.data.email, validation.data.message)) {
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
