import test from 'node:test';
import assert from 'node:assert/strict';
import {
  HRD_ELITION_PROGRESS,
  OFFICIAL_LINKS,
  ORGANIZATION_REFERENCE,
  PROFILE_IDENTITY,
  VERIFIED_URLS,
  WRITING_WORKS,
} from '../data/profileData';
import { buildShareCitation, filterWorks, validateContactForm } from './portfolio';

test('OFFICIAL_LINKS includes exact verified URLs from user profile and channels', () => {
  const ig = OFFICIAL_LINKS.find((item) => item.id === 'instagram');
  const kk = OFFICIAL_LINKS.find((item) => item.id === 'karyakarsa');
  const wa = OFFICIAL_LINKS.find((item) => item.id === 'whatsapp');
  const wp = OFFICIAL_LINKS.find((item) => item.id === 'wattpad');

  assert.ok(ig);
  assert.equal(ig.url, VERIFIED_URLS.instagramPersonal);
  assert.equal(ig.handle, '@iniipalll_');

  assert.ok(kk);
  assert.equal(kk.url, 'https://karyakarsa.com/ashborne');
  assert.equal(kk.handle, '@ashborne');

  assert.ok(wa);
  assert.equal(wa.url, 'https://whatsapp.com/channel/0029Vb7QRFUFMqrVXPjxoC32');
  assert.equal(wa.handle, 'Puisi, Novel(e-book)');

  assert.ok(wp);
  assert.ok(wp.url.includes('wattpad.com/story/405454419-throne-of-ashes-tahkta-abu'));
  assert.equal(
    ORGANIZATION_REFERENCE.instagramUrl,
    'https://www.instagram.com/himaprosiuinsa?cnvx=MXVpbGhtcmUybmt5Mg=='
  );
  assert.equal(
    HRD_ELITION_PROGRESS.driveFolderUrl,
    'https://drive.google.com/drive/folders/1VfXHtXQw8nvk6vSkcRgyIZtvTMsVmgr0'
  );
  assert.equal(HRD_ELITION_PROGRESS.items.length, 5);
  assert.ok(
    HRD_ELITION_PROGRESS.items.some((i) => i.primaryUrl === 'https://forms.gle/QDvEjQmLQHnqDp8S7')
  );
  assert.ok(
    HRD_ELITION_PROGRESS.items.some((i) => i.primaryUrl === 'https://forms.gle/R6BXieknnxzi7oSV6')
  );
});

test('filterWorks filters verified Wattpad works and WhatsApp channel cleanly', () => {
  const all = filterWorks(WRITING_WORKS, 'Semua', '');
  assert.equal(all.length, 4);

  const fiction = filterWorks(WRITING_WORKS, 'Fiksi & Serial', 'Gereja Mesin');
  assert.equal(fiction.length, 1);
  assert.equal(fiction[0].id, 'throne-of-ashes-tahkta-abu');

  const secondNovel = filterWorks(WRITING_WORKS, 'Fiksi & Serial', 'Bara');
  assert.equal(secondNovel.length, 1);
  assert.equal(secondNovel[0].id, 'keindahan-yang-tak-utuh');

  const poetry = filterWorks(WRITING_WORKS, 'Puisi', '');
  assert.equal(poetry.length, 1);
  assert.equal(poetry[0].id, 'fragmen-sayap-di-ambang-pancarona');

  const channel = filterWorks(WRITING_WORKS, 'Saluran & E-book', 'Puisi, Novel(e-book)');
  assert.equal(channel.length, 1);
  assert.equal(channel[0].id, 'saluran-puisi-novel-ebook');

  const empty = filterWorks(WRITING_WORKS, 'Puisi', 'tidak-ada-judul-ini');
  assert.equal(empty.length, 0);
});

test('buildShareCitation formats verified author and work citation', () => {
  const citation = buildShareCitation(WRITING_WORKS[0], PROFILE_IDENTITY.fullName);
  assert.ok(citation.includes('Naufal Athallah Rosiyandi'));
  assert.ok(citation.includes('THRONE OF ASHES (Tahkta Abu)'));
  assert.ok(citation.includes('15 Jun 2026'));
});

test('validateContactForm enforces required fields and email format', () => {
  const invalidResult = validateContactForm({
    name: 'N',
    email: 'bukan-email',
    topic: '',
    message: 'Pendek',
  });
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.topic);
  assert.ok(invalidResult.errors.message);

  const validResult = validateContactForm({
    name: 'Raka Pratama',
    email: 'raka@uinsa.ac.id',
    topic: 'Kolaborasi Penulisan',
    message: 'Halo Naufal, ingin berdiskusi tentang proyek penulisan bulan depan.',
  });
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});
