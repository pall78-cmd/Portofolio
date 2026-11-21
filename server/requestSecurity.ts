const BLOCKED_EXACT_OR_PREFIX_PATHS = [
  '/.env',
  '/.git',
  '/.npmrc',
  '/.playwright-cli',
  '/.aistudio',
  '/server',
  '/package.json',
  '/package-lock.json',
  '/tsconfig.json',
  '/metadata.json',
  '/vite.config.ts',
];

const SENSITIVE_EXTENSION_PATTERN = /\.(env|bak|sql|sqlite|log|pem|key)(\.[a-z0-9]+)?$/i;
const EMAIL_IN_TEXT_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

export function isBlockedSensitivePath(rawUrlPath: string): boolean {
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

export function sanitizeJsonBodyObject(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  const safeCopy: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    safeCopy[key] = value;
  }
  return safeCopy;
}

export function isOriginAllowed(
  originHeader: string | undefined,
  hostHeader: string | undefined,
  forwardedHostHeader: string | undefined
): boolean {
  if (!originHeader) {
    return true;
  }

  const forwardedHost = forwardedHostHeader?.split(',')[0]?.trim();
  const host = forwardedHost || hostHeader?.trim();
  if (!host) {
    return false;
  }

  try {
    const parsedOrigin = new URL(originHeader);
    return parsedOrigin.host === host;
  } catch {
    return false;
  }
}
