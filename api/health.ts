import type { IncomingMessage, ServerResponse } from 'node:http';
import { applyApiSecurityHeaders } from '../server/requestSecurity.ts';

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  applyApiSecurityHeaders(res);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ ok: true }));
}
