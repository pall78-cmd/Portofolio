import type { IncomingMessage, ServerResponse } from 'node:http';
import { issueMathChallenge } from '../../server/challengeService.ts';
import {
  checkChallengeRateLimit,
  checkGlobalApiRateLimit,
  resolveClientIpKey,
} from '../../server/rateLimitService.ts';
import { applyApiSecurityHeaders } from '../../server/requestSecurity.ts';

function getHeader(req: IncomingMessage, name: string): string | undefined {
  const raw = req.headers[name.toLowerCase()];
  return Array.isArray(raw) ? raw[0] : raw;
}

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  applyApiSecurityHeaders(res);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, message: 'Metode tidak diizinkan.' }));
    return;
  }

  if (getHeader(req, 'sec-fetch-site')?.trim().toLowerCase() === 'cross-site') {
    res.statusCode = 403;
    res.end(JSON.stringify({ ok: false, message: 'Permintaan lintas asal tidak diizinkan.' }));
    return;
  }

  const clientIp = resolveClientIpKey(req.headers, req.socket?.remoteAddress);
  const globalRate = checkGlobalApiRateLimit(clientIp);
  if (globalRate.limited) {
    res.statusCode = 429;
    res.setHeader('Retry-After', String(globalRate.retryAfterSec));
    res.end(
      JSON.stringify({ ok: false, message: 'Terlalu banyak permintaan API. Coba lagi sebentar.' })
    );
    return;
  }

  const challengeRate = checkChallengeRateLimit(clientIp);
  if (challengeRate.limited) {
    res.statusCode = 429;
    res.setHeader('Retry-After', String(challengeRate.retryAfterSec));
    res.end(
      JSON.stringify({
        ok: false,
        message: 'Terlalu banyak permintaan soal verifikasi. Coba lagi sebentar.',
      })
    );
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify(issueMathChallenge()));
}
