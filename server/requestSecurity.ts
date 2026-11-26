import type { ServerResponse } from 'node:http';

const BLOCKED_EXACT_OR_PREFIX_PATHS = [
  '/.env',
  '/.git',
  '/.github',
  '/.npmrc',
  '/.playwright-cli',
  '/.aistudio',
  '/.vscode',
  '/.ds_store',
  '/server',
  '/api/',
  '/node_modules',
  '/package.json',
  '/package-lock.json',
  '/bun.lock',
  '/bun.lockb',
  '/tsconfig.json',
  '/metadata.json',
  '/vite.config.ts',
  '/vercel.json',
  '/walkthrough.md',
];

const SENSITIVE_EXTENSION_PATTERN =
  /\.(env|bak|sql|sqlite|db|log|pem|key|crt|p12|pfx|yml|yaml|toml|lock)(\.[a-z0-9]+)?$/i;
const EMAIL_IN_TEXT_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const MAX_JSON_DEPTH = 4;

export function isBlockedSensitivePath(
  rawUrlPath: string,
  options?: { allowDevViteModules?: boolean }
): boolean {
  const pathOnly = (rawUrlPath.split('?')[0] ?? '').trim();
  if (pathOnly.includes('%00') || pathOnly.includes('\0')) {
    return true;
  }

  let decoded = pathOnly;
  for (let i = 0; i < 3; i += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) {
        break;
      }
      decoded = next;
    } catch {
      return true;
    }
  }

  if (decoded.includes('\0')) {
    return true;
  }

  const normalized = decoded.replace(/\\/g, '/').trim().toLowerCase();
  if (
    normalized.includes('/../') ||
    normalized.includes('/..;') ||
    normalized.endsWith('/..') ||
    normalized.startsWith('../')
  ) {
    return true;
  }

  // Never treat legitimate API routes (/api/health, /api/contact, /api/contact/challenge) as static leaks
  if (
    normalized === '/api/health' ||
    normalized === '/api/contact' ||
    normalized === '/api/contact/challenge'
  ) {
    return false;
  }

  // In local Vite dev mode, allow only Vite's optimized client dependency bundle paths
  if (
    options?.allowDevViteModules &&
    (normalized.startsWith('/node_modules/.vite/') ||
      normalized.startsWith('/node_modules/vite/dist/client/'))
  ) {
    return false;
  }

  if (SENSITIVE_EXTENSION_PATTERN.test(normalized)) {
    return true;
  }

  for (const blocked of BLOCKED_EXACT_OR_PREFIX_PATHS) {
    if (
      normalized === blocked ||
      normalized.startsWith(`${blocked}/`) ||
      normalized.startsWith(`${blocked}.`)
    ) {
      return true;
    }
  }

  return false;
}

export function redactSensitiveLogText(
  text: string,
  secrets: Array<string | undefined> = []
): string {
  let sanitized = text;
  for (const secret of secrets) {
    const trimmed = secret?.trim();
    if (trimmed && trimmed.length >= 3) {
      sanitized = sanitized.split(trimmed).join('[SECRET_REDACTED]');
    }
  }
  return sanitized.replace(EMAIL_IN_TEXT_PATTERN, '[EMAIL_REDACTED]');
}

function sanitizeNestedValue(value: unknown, depth: number): unknown {
  if (depth > MAX_JSON_DEPTH) {
    return undefined;
  }
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeNestedValue(item, depth + 1));
  }
  if (typeof value === 'object') {
    const safeObj: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        continue;
      }
      safeObj[k] = sanitizeNestedValue(v, depth + 1);
    }
    return safeObj;
  }
  return undefined;
}

export function sanitizeJsonBodyObject(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const safeCopy: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    safeCopy[key] = sanitizeNestedValue(value, 1);
  }
  return safeCopy;
}

export function isOriginAllowed(
  originHeader: string | undefined,
  hostHeader: string | undefined,
  forwardedHostHeader: string | undefined,
  options?: {
    refererHeader?: string;
    secFetchSiteHeader?: string;
    requireOriginOnPost?: boolean;
  }
): boolean {
  const secFetchSite = options?.secFetchSiteHeader?.trim().toLowerCase();
  if (secFetchSite === 'cross-site') {
    return false;
  }

  const forwardedHost = forwardedHostHeader?.split(',')[0]?.trim().toLowerCase();
  const host = (forwardedHost || hostHeader?.trim() || '').toLowerCase();
  if (!host) {
    return false;
  }

  if (originHeader) {
    try {
      const parsedOrigin = new URL(originHeader);
      if (parsedOrigin.protocol !== 'http:' && parsedOrigin.protocol !== 'https:') {
        return false;
      }
      return parsedOrigin.host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  if (options?.refererHeader) {
    try {
      const parsedReferer = new URL(options.refererHeader);
      if (parsedReferer.protocol !== 'http:' && parsedReferer.protocol !== 'https:') {
        return false;
      }
      return parsedReferer.host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  if (options?.requireOriginOnPost) {
    return false;
  }

  return true;
}

export function applyApiSecurityHeaders(res: ServerResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
}
