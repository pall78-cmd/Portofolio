# Security Summary

**Reviewed Files**: 19
**Issues Resolved**: 6

### Issues Resolved
| Area | File | Line | What Was Happening | Impact | Status | How It Was Fixed |
|---|---|---|---|---|---|---|
| Missing Serverless Rate Limiting & Quota | `api/contact.ts`, `api/contact/challenge.ts` | 108, 29 | Production serverless endpoints on Vercel lacked request throttling, per-sender email quotas, duplicate message blocking, and serialized pre-parsed body size limits. | High | Fixed | Wired shared `server/rateLimitService.ts` checks (`checkGlobalApiRateLimit`, `checkContactRateLimit`, `checkSenderEmailQuota`, `isDuplicateContactSubmission`), enforced `checkChallengeRateLimit`, and added byte-length checking on pre-parsed `req.body` in `api/contact.ts:51`. |
| Bypassable Origin & Cross-Site Request Guard | `server/requestSecurity.ts`, `api/contact.ts`, `server.ts` | 142, 121, 108 | `POST /api/contact` allowed requests that omitted the `Origin` header entirely and did not check `Sec-Fetch-Site: cross-site` on contact and challenge endpoints. | High | Fixed | Updated `isOriginAllowed` to reject `Sec-Fetch-Site: cross-site`, fall back strictly to same-host `Referer`, and enforce `requireOriginOnPost: true` on both `api/contact.ts:121` and `server.ts:108` plus cross-site blocking on `/api/contact/challenge`. |
| Proxy IP Spoofing & Trust Boundary | `server.ts`, `server/rateLimitService.ts` | 30, 39 | Express `app.set('trust proxy', true)` trusted arbitrary client-supplied left-most `X-Forwarded-For` entries, allowing automated clients to rotate headers to bypass IP rate limits. | Medium | Fixed | Restricted Express to `app.set('trust proxy', 1)` and implemented `resolveClientIpKey` prioritizing edge-verified `x-vercel-forwarded-for`, `x-real-ip`, and rightmost `x-forwarded-for` hops alongside sender-email throttling across rotating IPs. |
| Challenge Nonce Replay After Store Overflow | `server/challengeService.ts` | 58 | When spent challenge nonces exceeded 2,000 entries, `usedChallenges.clear()` wiped the entire replay map, allowing recently solved tokens to be replayed within their 30-minute validity window. | Medium | Fixed | Replaced `.clear()` with bounded FIFO oldest-entry eviction (`MAX_USED_NONCES = 2000`) and raised `MIN_HUMAN_ELAPSED_MS` to 1,500 ms so active recent nonces remain protected against replay. |
| Permissive Email Regex & Header/Quota Risks | `src/utils/contactFilter.ts`, `src/utils/portfolio.ts` | 90, 85 | Broad email regexes could admit commas, quotes, or semicolons into the Nodemailer `replyTo` field or permit deeply nested `__proto__` keys during object sanitization. | Medium | Fixed | Tightened email validation to strict RFC-safe unquoted characters (`strictEmailPattern`), stripped control chars, bounded JSON recursion (`MAX_JSON_DEPTH = 4`) in `sanitizeJsonBodyObject`, and synchronized client and server validation. |
| Missing Edge Clickjacking & Resource Isolation Headers | `vercel.json`, `server.ts`, `api/*.ts` | 9, 38, 194 | Production responses omitted `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `Cross-Origin-Resource-Policy: same-origin`, and `/api/*` `Cache-Control: no-store`. | Medium | Fixed | Added full production CSP (`frame-ancestors 'none'`), HSTS, `X-Frame-Options: DENY`, `Cross-Origin-Resource-Policy: same-origin`, and `no-store` API caching across `vercel.json`, `server.ts`, and `applyApiSecurityHeaders`. |

### Safeguards Verified
| Area | File | How It's Protected |
|---|---|---|
| Owner Email & SMTP Credentials | `server/contactService.ts`, `.env.example` | `CONTACT_RECIPIENT_EMAIL`, `SMTP_USER`, and `SMTP_PASS` are read exclusively from server-side `process.env`, never bundled into Vite/browser assets, and scrubbed by `redactSensitiveLogText` before any console warning. |
| Dependency Supply Chain | `package.json`, `bun.lock` | `bun audit` verified 0 known security vulnerabilities across all 262 installed packages. |
| Client DOM & Link Safety | `src/components/LinksContactSection.tsx`, `src/components/ReaderModal.tsx` | Zero raw HTML sinks (`dangerouslySetInnerHTML`, `innerHTML`, `eval`) across `src/`; all external anchors use `rel="noopener noreferrer"` (or `rel="me noopener noreferrer"`). |
| Email Body & Header Encoding | `server/contactService.ts`, `src/utils/contactFilter.ts` | `sanitizeHeaderValue` strips CR/LF and control characters from subject/headers, while `escapeHtml` encodes all sender fields rendered into notification email HTML. |
| Hidden Source & Config Protection | `server/requestSecurity.ts`, `server.ts` | `isBlockedSensitivePath` rejects decoded path traversal, null bytes, dotfiles (`.env`, `.git`), lockfiles (`bun.lock`), server files (`server/*`, `server.ts`), and config files (`vercel.json`) with HTTP 403. |
| Contact Form Anti-Spam & Challenge | `server/challengeService.ts`, `src/utils/contactFilter.ts` | Single-use HMAC-SHA256 math challenge with timing-safe signature verification, hidden honeypot trap, and deterministic payload filtering for HTML/script tags, SQL/template injection patterns, and risky links. |

---

## PoC Verification

### 1. Originless Automated POST & Cross-Site Request Blocking

#### Summary
| Field | Value |
|---|---|
| Issue Type | Cross-Site Request & Unverified Automated POST |
| Impact | High |
| Affected File | `api/contact.ts:121`, `server.ts:108`, `server/requestSecurity.ts:142` |
| Test Scenario | Direct `POST /api/contact` with omitted `Origin`/`Referer` headers or `Sec-Fetch-Site: cross-site` |

#### How It Was Fixed
`isOriginAllowed` now inspects `Sec-Fetch-Site` first (rejecting `cross-site`), checks exact host matching against `Origin` or fallback `Referer`, and enforces `requireOriginOnPost: true` on `POST /api/contact`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Caller sends `POST /api/contact` without `Origin`/`Referer` (e.g., scripted bot) or from an external site with `Sec-Fetch-Site: cross-site` | Request enters `handler` in `api/contact.ts:97` or Express route in `server.ts:108` |
| 2 | `isOriginAllowed(..., { refererHeader, secFetchSiteHeader, requireOriginOnPost: true })` evaluates `server/requestSecurity.ts:152-189` | Returns `false` immediately |
| 3 | Endpoint responds with HTTP `403` and aborts before reading JSON or running mail forwarding | **Handled Safely** |

#### Conclusion
**Fix Verified** - Neither external websites nor originless POST bots can trigger contact validation or outbound SMTP delivery.

---

### 2. Header-Spoofed IP Flooding & Inbox Bombing

#### Summary
| Field | Value |
|---|---|
| Issue Type | Rate Limit Bypass via Rotating `X-Forwarded-For` |
| Impact | High |
| Affected File | `server/rateLimitService.ts:39`, `api/contact.ts:153`, `server.ts:135` |
| Test Scenario | Repeated `POST /api/contact` attempts rotating fake left-most `X-Forwarded-For` IPs (`1.2.3.4, 203.0.113.99`) or targeting the recipient inbox via Vercel serverless |

#### How It Was Fixed
`resolveClientIpKey` extracts platform-verified `x-vercel-forwarded-for`, `x-real-ip`, or rightmost proxy hops, Express limits proxy trust to 1 hop, and both IP rate limiting (`5 / 10 min`) and per-sender-email quotas (`3 / 15 min`) plus duplicate message fingerprints (`10 min`) run on both Vercel and Express runtimes.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Attacker sends requests with forged `X-Forwarded-For: 1.2.3.4, 203.0.113.99` | `resolveClientIpKey` at `server/rateLimitService.ts:43-60` ignores left-most spoofed IP and keys on `203.0.113.99` |
| 2 | After 5 submissions in 10 minutes (or 3 for the same email across IPs), `checkContactRateLimit` / `checkSenderEmailQuota` trips | Returns `{ limited: true, retryAfterSec }` |
| 3 | Handler sets `Retry-After` and returns HTTP `429` before `screenAndForwardContact` | **Handled Safely** |

#### Conclusion
**Fix Verified** - Contact spam flooding cannot overwhelm the owner's email inbox even across Vercel serverless deployments or spoofed `X-Forwarded-For` headers.

---

### 3. Nonce Replay Beyond 2,000 Requests

#### Summary
| Field | Value |
|---|---|
| Issue Type | Single-Use Token Replay on Cache Rollover |
| Impact | Medium |
| Affected File | `server/challengeService.ts:58` |
| Test Scenario | Consuming 2,010 challenges and immediately replaying a previously solved `challengeToken` |

#### How It Was Fixed
`cleanupExpiredNonces` removes expired timestamps first and then trims only the oldest entries in insertion (FIFO) order down to `MAX_USED_NONCES`, never clearing active recent nonces.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | 2,010 valid challenges are redeemed (`usedChallenges.set(payload.id, payload.exp)`) | Store evicts only the oldest entries via FIFO at `server/challengeService.ts:58-64` |
| 2 | Attacker replays a recently solved `challengeToken` | `usedChallenges.has(payload.id)` at `server/challengeService.ts:162` remains `true` |
| 3 | `verifyMathChallenge` rejects with `{ ok: false, reason: 'reused' }` | **Handled Safely** |

#### Conclusion
**Fix Verified** - High traffic or intentional nonce churn cannot reset replay protection for active challenge tokens.

---

### 4. Quoted/Comma `replyTo` Header Injection Attempt

#### Summary
| Field | Value |
|---|---|
| Issue Type | Email Header Parameter Smuggling |
| Impact | Medium |
| Affected File | `src/utils/contactFilter.ts:90`, `src/utils/portfolio.ts:85` |
| Test Scenario | Submitting `"evil, victim"@example.com` or `a,b@example.com` in the sender `email` field |

#### How It Was Fixed
Both server and client validators reject quotes, commas, semicolons, backslashes, and consecutive dots using `strictEmailPattern` before reaching Nodemailer's `replyTo`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Malicious sender email `"evil, victim"@example.com` enters `validateServerContactPayload` | Caught at `src/utils/contactFilter.ts:90-100` |
| 2 | Fails strict regex check because quotes/spaces/commas are disallowed | Adds `fieldErrors.email` |
| 3 | Request returns HTTP `400` without touching Nodemailer | **Handled Safely** |

#### Conclusion
**Fix Verified** - Multi-recipient or header-smuggled email addresses are blocked before mail construction.
