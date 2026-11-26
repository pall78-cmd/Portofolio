export const CONTACT_LIMITS = {
  MAX_NAME: 120,
  MAX_EMAIL: 160,
  MAX_TOPIC: 120,
  MAX_MESSAGE: 2000,
} as const;

export const ALLOWED_CONTACT_TOPICS = [
  'Diskusi Sastra & Penulisan',
  'Kolaborasi Karya (@ashborne)',
  'Agenda EDSA Executive 2026',
  'Undangan & Acara Kampus',
] as const;

export interface SanitizedContactInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  website: string;
}

export interface DeterministicSpamResult {
  flagged: boolean;
  score: number;
  category: string;
  reason: string;
  signals: string[];
}

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.info',
  '10minutemail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getnada.com',
  'fakeinbox.com',
]);

export function sanitizeHeaderValue(value: string): string {
  return value
    .replace(/[\r\n\u0000-\u001f\u007f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function validateServerContactPayload(raw: unknown):
  | { ok: true; data: SanitizedContactInput }
  | { ok: false; error: string; fieldErrors?: Record<string, string> } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: 'Format data permintaan tidak valid.' };
  }

  const record = raw as Record<string, unknown>;
  const rawName = typeof record.name === 'string' ? record.name : '';
  const rawEmail = typeof record.email === 'string' ? record.email : '';
  const rawTopic = typeof record.topic === 'string' ? record.topic : '';
  const rawMessage = typeof record.message === 'string' ? record.message : '';
  const rawWebsite = typeof record.website === 'string' ? record.website : '';

  const name = sanitizeHeaderValue(rawName);
  const email = sanitizeHeaderValue(rawEmail).toLowerCase();
  const topic = sanitizeHeaderValue(rawTopic);
  const message = rawMessage.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim();
  const website = rawWebsite.trim();

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2) {
    fieldErrors.name = 'Nama lengkap minimal terdiri dari 2 karakter.';
  } else if (name.length > CONTACT_LIMITS.MAX_NAME) {
    fieldErrors.name = `Nama maksimal ${CONTACT_LIMITS.MAX_NAME} karakter.`;
  }

  const strictEmailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (!email) {
    fieldErrors.email = 'Alamat email wajib diisi.';
  } else if (
    email.length > CONTACT_LIMITS.MAX_EMAIL ||
    email.includes('..') ||
    !strictEmailPattern.test(email)
  ) {
    fieldErrors.email = 'Format alamat email tidak valid.';
  }

  if (!topic) {
    fieldErrors.topic = 'Pilih topik pesan terlebih dahulu.';
  } else if (
    topic.length > CONTACT_LIMITS.MAX_TOPIC ||
    !(ALLOWED_CONTACT_TOPICS as readonly string[]).includes(topic)
  ) {
    fieldErrors.topic = 'Topik pesan tidak valid.';
  }

  if (message.length < 10) {
    fieldErrors.message = 'Pesan minimal terdiri dari 10 karakter.';
  } else if (message.length > CONTACT_LIMITS.MAX_MESSAGE) {
    fieldErrors.message = `Pesan maksimal ${CONTACT_LIMITS.MAX_MESSAGE} karakter.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      error: 'Periksa kembali isian formulir Anda.',
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: { name, email, topic, message, website },
  };
}

const HIGH_RISK_SPAM_PATTERNS: Array<{ pattern: RegExp; category: string; reason: string }> = [
  {
    pattern: /\b(slot\s*gacor|judi\s*online|togel|maxwin|situs\s*slot|casino\s*bonus|rtp\s*live|scatter\s*hitam)\b/i,
    category: 'Promosi Ilegal / Perjudian',
    reason: 'Pesan terdeteksi mengandung kata kunci promosi perjudian daring.',
  },
  {
    pattern: /\b(pinjol\s*cepat|dana\s*kaget|airdrop\s*crypto|claim\s*free\s*usdt|double\s*your\s*bitcoin|crypto\s*giveaway)\b/i,
    category: 'Phishing / Penipuan Finansial',
    reason: 'Pesan terdeteksi mengandung pola penipuan finansial atau phishing.',
  },
  {
    pattern: /\b(buy\s*followers|jual\s*followers|seo\s*backlinks?\s*cheap|guest\s*post\s*service|viagra|cialis|porn|xxx)\b/i,
    category: 'Spam Komersial Otomatis',
    reason: 'Pesan terdeteksi mengandung promosi spam komersial massal.',
  },
];

const UNSAFE_PAYLOAD_PATTERN =
  /(<\s*(?:script|svg|img|iframe|object|embed|style|link|meta|base|form)\b|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|\bon(?:load|error|click|mouseover|focus|blur|submit)\s*=|<\s*a\s+href=|\[url=)/i;

const CYBER_EXPLOIT_PATTERN =
  /(\bunion\s+(?:all\s+)?select\b|'\s*or\s*'?\d+'?\s*=\s*'?\d+|\bdrop\s+table\b|\b(?:sleep|benchmark)\s*\(|\bwaitfor\s+delay\b|\bxp_cmdshell\b|\$\{[^}]*(?:jndi:|env:|java\.|process\.|require)[^}]*\}|\{\{[^}]*(?:constructor|__proto__|process|require)[^}]*\}\}|(?:\.\.[/\\]){2,}|\/etc\/passwd\b|\b(?:cmd\.exe|powershell(?:\.exe)?)\b)/i;

const SHORTENER_OR_IP_URL_PATTERN =
  /https?:\/\/(?:bit\.ly|tinyurl\.com|cutt\.ly|s\.id|rb\.gy|t\.co|xn--|\d{1,3}(?:\.\d{1,3}){3}|0x[0-9a-f]+)\b/i;

const MALWARE_DOWNLOAD_URL_PATTERN =
  /https?:\/\/\S+\.(?:exe|apk|scr|bat|ps1|vbs|msi|dmg|iso|jar)(?:[?#\s]|$)/i;

export function evaluateManualSpamFilter(
  input: SanitizedContactInput
): DeterministicSpamResult {
  if (input.website.length > 0) {
    return {
      flagged: true,
      score: 100,
      category: 'Bot / Pengisian Otomatis',
      reason: 'Pengisian otomatis terdeteksi pada kolom verifikasi tersembunyi.',
      signals: ['honeypot'],
    };
  }

  const combined = `${input.name}\n${input.message}`;

  if (UNSAFE_PAYLOAD_PATTERN.test(combined) || CYBER_EXPLOIT_PATTERN.test(combined)) {
    return {
      flagged: true,
      score: 100,
      category: 'Muatan Siber / Skrip Berbahaya Ditolak',
      reason: 'Pesan terdeteksi mengandung pola skrip, injeksi perintah/SQL, atau kode berbahaya.',
      signals: ['cyber_payload'],
    };
  }

  if (MALWARE_DOWNLOAD_URL_PATTERN.test(combined)) {
    return {
      flagged: true,
      score: 100,
      category: 'Tautan Berkas Berbahaya Ditolak',
      reason: 'Tautan menuju berkas eksekusi/instalasi (.exe, .apk, dll.) diblokir demi keamanan.',
      signals: ['malware_url'],
    };
  }

  for (const rule of HIGH_RISK_SPAM_PATTERNS) {
    if (rule.pattern.test(combined)) {
      return {
        flagged: true,
        score: 100,
        category: rule.category,
        reason: rule.reason,
        signals: ['high_risk_keyword'],
      };
    }
  }

  const emailDomain = input.email.split('@')[1]?.toLowerCase() ?? '';
  if (DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
    return {
      flagged: true,
      score: 85,
      category: 'Email Sementara / Sekali Pakai',
      reason: 'Gunakan alamat email aktif yang sah, bukan domain email sementara.',
      signals: ['disposable_email'],
    };
  }

  if (/(.)\1{14,}/.test(input.message)) {
    return {
      flagged: true,
      score: 80,
      category: 'Teks Berulang / Sampah',
      reason: 'Pesan didominasi pengulangan karakter yang tidak wajar.',
      signals: ['repeated_chars'],
    };
  }

  const signals: string[] = [];
  let score = 0;
  let primaryCategory = 'Korespondensi Terverifikasi';
  let primaryReason = 'Pesan lolos seluruh pemeriksaan manual anti-spam dan keamanan.';

  const urlMatches = combined.match(/https?:\/\/\S+/gi) ?? [];
  if (urlMatches.length >= 2) {
    score += 75;
    signals.push('multiple_urls');
    primaryCategory = 'Tautan Massal (Link Spam)';
    primaryReason = 'Pesan kontak dibatasi maksimal 1 tautan untuk mencegah spam promosi.';
  } else if (urlMatches.length === 1 && SHORTENER_OR_IP_URL_PATTERN.test(combined)) {
    score += 70;
    signals.push('suspicious_url');
    primaryCategory = 'Tautan Mencurigakan';
    primaryReason = 'Tautan pemendek URL atau alamat IP langsung tidak diizinkan demi keamanan.';
  }

  const letters = input.message.replace(/[^a-zA-Z]/g, '');
  if (letters.length >= 30) {
    const uppercaseCount = letters.replace(/[^A-Z]/g, '').length;
    if (uppercaseCount / letters.length > 0.78) {
      score += 45;
      signals.push('excessive_caps');
      if (score >= 70) {
        primaryCategory = 'Pola Promosi Agresif';
        primaryReason = 'Pesan mengandung kombinasi tautan dan huruf kapital berlebihan.';
      }
    }
  }

  const flagged = score >= 70;
  return {
    flagged,
    score,
    category: flagged ? primaryCategory : 'Korespondensi Terverifikasi',
    reason: flagged
      ? primaryReason
      : 'Pesan lolos pemeriksaan aturan manual anti-spam & keamanan.',
    signals,
  };
}

export function runDeterministicSpamPrecheck(
  input: SanitizedContactInput
): DeterministicSpamResult {
  return evaluateManualSpamFilter(input);
}
