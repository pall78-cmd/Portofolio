import crypto from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_THROTTLE_WINDOW_MS = 15 * 60 * 1000;
const MAX_EMAIL_PER_WINDOW = 3;
const MAX_TRACKED_KEYS = 2000;

interface RateEntry {
  count: number;
  resetAt: number;
}

const contactBuckets = new Map<string, RateEntry>();
const challengeBuckets = new Map<string, RateEntry>();
const globalApiBuckets = new Map<string, RateEntry>();
const emailQuotaBuckets = new Map<string, RateEntry>();
const recentMessageHashes = new Map<string, number>();

export const RATE_LIMITS = {
  CONTACT_MAX: 5,
  CHALLENGE_MAX: 20,
  GLOBAL_API_MAX: 50,
} as const;

function readHeader(headers: IncomingHttpHeaders, name: string): string | undefined {
  const val = headers[name.toLowerCase()];
  if (Array.isArray(val)) {
    return val[0];
  }
  return val;
}

/**
 * Resolves the client IP key using platform-verified forwarding headers first
 * (Vercel / single reverse proxy hop) to resist X-Forwarded-For spoofing.
 */
export function resolveClientIpKey(
  headers: IncomingHttpHeaders,
  remoteAddress?: string | null
): string {
  const vercelForwarded = readHeader(headers, 'x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercelForwarded) {
    return vercelForwarded;
  }

  const realIp = readHeader(headers, 'x-real-ip')?.trim();
  if (realIp) {
    return realIp;
  }

  const forwardedChain = readHeader(headers, 'x-forwarded-for')
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (forwardedChain && forwardedChain.length > 0) {
    // Rightmost entry before proxy is appended by the edge/reverse proxy
    return forwardedChain[forwardedChain.length - 1];
  }

  return remoteAddress?.trim() || 'unknown';
}

function pruneExpiredBuckets(buckets: Map<string, RateEntry>, now: number): void {
  if (buckets.size <= 500) {
    return;
  }
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
  while (buckets.size > MAX_TRACKED_KEYS) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey === undefined) {
      break;
    }
    buckets.delete(oldestKey);
  }
}

export function checkRateLimitBucket(
  buckets: Map<string, RateEntry>,
  key: string,
  maxRequests: number,
  windowMs = RATE_LIMIT_WINDOW_MS,
  now = Date.now()
): { limited: boolean; retryAfterSec: number } {
  pruneExpiredBuckets(buckets, now);

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfterSec: 0 };
  }

  if (current.count >= maxRequests) {
    const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return { limited: true, retryAfterSec };
  }

  current.count += 1;
  return { limited: false, retryAfterSec: 0 };
}

export function checkGlobalApiRateLimit(ipKey: string, now = Date.now()) {
  return checkRateLimitBucket(globalApiBuckets, ipKey, RATE_LIMITS.GLOBAL_API_MAX, RATE_LIMIT_WINDOW_MS, now);
}

export function checkChallengeRateLimit(ipKey: string, now = Date.now()) {
  return checkRateLimitBucket(challengeBuckets, ipKey, RATE_LIMITS.CHALLENGE_MAX, RATE_LIMIT_WINDOW_MS, now);
}

export function checkContactRateLimit(ipKey: string, now = Date.now()) {
  return checkRateLimitBucket(contactBuckets, ipKey, RATE_LIMITS.CONTACT_MAX, RATE_LIMIT_WINDOW_MS, now);
}

export function checkSenderEmailQuota(senderEmail: string, now = Date.now()) {
  const emailHash = crypto
    .createHash('sha256')
    .update(senderEmail.trim().toLowerCase())
    .digest('hex');
  return checkRateLimitBucket(
    emailQuotaBuckets,
    emailHash,
    MAX_EMAIL_PER_WINDOW,
    EMAIL_THROTTLE_WINDOW_MS,
    now
  );
}

export function isDuplicateContactSubmission(
  ipKey: string,
  email: string,
  message: string,
  now = Date.now()
): boolean {
  if (recentMessageHashes.size > 500) {
    for (const [hash, expiresAt] of recentMessageHashes.entries()) {
      if (expiresAt <= now) {
        recentMessageHashes.delete(hash);
      }
    }
    while (recentMessageHashes.size > MAX_TRACKED_KEYS) {
      const oldestKey = recentMessageHashes.keys().next().value;
      if (oldestKey === undefined) {
        break;
      }
      recentMessageHashes.delete(oldestKey);
    }
  }

  const fingerprint = crypto
    .createHash('sha256')
    .update(`${ipKey}|${email.trim().toLowerCase()}|${message.trim().toLowerCase()}`)
    .digest('hex');

  const existingExpiry = recentMessageHashes.get(fingerprint);
  if (existingExpiry && existingExpiry > now) {
    return true;
  }

  recentMessageHashes.set(fingerprint, now + DUPLICATE_WINDOW_MS);
  return false;
}
