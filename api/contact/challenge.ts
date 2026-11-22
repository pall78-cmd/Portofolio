import type { IncomingMessage, ServerResponse } from 'node:http';
import { issueMathChallenge } from '../../server/challengeService.ts';

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ ok: false, message: 'Metode tidak diizinkan.' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(issueMathChallenge()));
}
