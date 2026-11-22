import type { IncomingMessage, ServerResponse } from 'node:http';
import { verifyMathChallenge } from '../server/challengeService.ts';
import { screenAndForwardContact } from '../server/contactService.ts';
import { isOriginAllowed, sanitizeJsonBodyObject } from '../server/requestSecurity.ts';
import { validateServerContactPayload } from '../src/utils/contactFilter.ts';

const MAX_BODY_BYTES = 16 * 1024;

type VercelRequest = IncomingMessage & {
  body?: unknown;
};

function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getHeader(req: IncomingMessage, name: string): string | undefined {
  const raw = req.headers[name.toLowerCase()];
  if (Array.isArray(raw)) {
    return raw[0];
  }
  return raw;
}

async function readJsonBody(req: VercelRequest): Promise<{ ok: true; data: unknown } | { ok: false; status: 400 | 413 }> {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      if (Buffer.byteLength(req.body, 'utf8') > MAX_BODY_BYTES) {
        return { ok: false, status: 413 };
      }
      try {
        return { ok: true, data: JSON.parse(req.body) };
      } catch {
        return { ok: false, status: 400 };
      }
    }
    return { ok: true, data: req.body };
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    req.on('data', (chunk: Buffer) => {
      if (settled) return;
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        settled = true;
        resolve({ ok: false, status: 413 });
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      const rawText = Buffer.concat(chunks).toString('utf8');
      try {
        resolve({ ok: true, data: JSON.parse(rawText) });
      } catch {
        resolve({ ok: false, status: 400 });
      }
    });

    req.on('error', () => {
      if (settled) return;
      settled = true;
      resolve({ ok: false, status: 400 });
    });
  });
}

export default async function handler(req: VercelRequest, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: 'Metode tidak diizinkan.',
    });
    return;
  }

  if (
    !isOriginAllowed(
      getHeader(req, 'origin'),
      getHeader(req, 'host'),
      getHeader(req, 'x-forwarded-host')
    )
  ) {
    sendJson(res, 403, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: 'Permintaan lintas asal tidak diizinkan.',
    });
    return;
  }

  const contentType = (getHeader(req, 'content-type') ?? '').toLowerCase();
  if (!contentType.includes('application/json')) {
    sendJson(res, 415, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: 'Format Content-Type harus application/json.',
    });
    return;
  }

  const parsed = await readJsonBody(req);
  if (!parsed.ok) {
    sendJson(res, parsed.status, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: parsed.status === 413 ? 'Ukuran permintaan terlalu besar.' : 'Format JSON tidak valid.',
    });
    return;
  }

  const safeBody = sanitizeJsonBodyObject(parsed.data);
  if (!safeBody) {
    sendJson(res, 400, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: 'Format data permintaan tidak valid.',
    });
    return;
  }

  const validation = validateServerContactPayload(safeBody);
  if (!validation.ok) {
    sendJson(res, 400, {
      ok: false,
      status: 'error',
      emailDelivered: false,
      message: validation.error,
      fieldErrors: validation.fieldErrors ?? {},
    });
    return;
  }

  const challengeCheck = verifyMathChallenge(safeBody.challengeToken, safeBody.challengeAnswer);
  if (!challengeCheck.ok) {
    sendJson(res, 422, {
      ok: false,
      status: 'challenge_failed',
      emailDelivered: false,
      fieldErrors: { challengeAnswer: challengeCheck.message },
      message: challengeCheck.message,
    });
    return;
  }

  const result = await screenAndForwardContact(validation.data);
  sendJson(res, result.httpStatus, {
    ok: result.ok,
    status: result.status,
    emailDelivered: result.emailDelivered,
    spamCheck: result.spamCheck,
    message: result.message,
  });
}
