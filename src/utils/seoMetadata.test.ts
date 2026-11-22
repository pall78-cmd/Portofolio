import test from 'node:test';
import assert from 'node:assert/strict';
import { WRITING_WORKS } from '../data/profileData';
import {
  computeActiveSection,
  resolvePageMetadata,
  SECTION_SEO_METADATA,
  VERIFIED_IMAGE_DIMENSIONS,
  type SectionId,
} from './seoMetadata';

test('SECTION_SEO_METADATA provides unique descriptions and verified image dimensions per section', () => {
  const sections: SectionId[] = ['profil', 'karya', 'perjalanan', 'tautan', 'kontak'];
  const ogDescriptions = new Set<string>();
  const twitterDescriptions = new Set<string>();

  for (const section of sections) {
    const meta = SECTION_SEO_METADATA[section];
    assert.equal('width' in meta, false, 'Meta should use imageWidth/imageHeight');
    assert.ok(meta.imageWidth > 0 && meta.imageHeight > 0);
    assert.ok(meta.imageUrl.startsWith('https://naufalathallah-rosiyandi.vercel.app/'));
    assert.ok(meta.imageAlt.length > 10);
    assert.notEqual(meta.description, meta.ogDescription);
    assert.notEqual(meta.ogDescription, meta.twitterDescription);
    ogDescriptions.add(meta.ogDescription);
    twitterDescriptions.add(meta.twitterDescription);
  }

  assert.equal(ogDescriptions.size, sections.length);
  assert.equal(twitterDescriptions.size, sections.length);
});

test('resolvePageMetadata builds unique OpenGraph/Twitter metadata and dimensions for each work', () => {
  const work = WRITING_WORKS[0];
  const meta = resolvePageMetadata({ activeWork: work, activeSection: 'karya' });

  assert.equal(
    meta.url,
    'https://naufalathallah-rosiyandi.vercel.app/?karya=throne-of-ashes-tahkta-abu'
  );
  assert.ok(meta.title.includes('THRONE OF ASHES'));
  assert.ok(meta.ogDescription.includes('5 Bagian'));
  assert.equal(meta.imageWidth, 1200);
  assert.equal(meta.imageHeight, 896);
  assert.equal(
    meta.imageUrl,
    'https://naufalathallah-rosiyandi.vercel.app/src/assets/images/writing_desk_prose_1795196265899.jpg'
  );
});

test('VERIFIED_IMAGE_DIMENSIONS tracks all primary profile, HRD, and literary images accurately', () => {
  const portrait =
    VERIFIED_IMAGE_DIMENSIONS['/assets/aistudio/1000199122-jpg-1759824490026_bdc54ddd.jpg'];
  const hrd = VERIFIED_IMAGE_DIMENSIONS['/assets/aistudio/1000383664_8e63566c.jpg'];
  assert.equal(portrait.width, 1795);
  assert.equal(portrait.height, 2452);
  assert.equal(hrd.width, 1056);
  assert.equal(hrd.height, 1876);
});

test('computeActiveSection selects tall scrolled-to section accurately below header threshold', () => {
  const active = computeActiveSection([
    { id: 'profil', top: -2144 },
    { id: 'karya', top: -1180 },
    { id: 'perjalanan', top: 64 },
    { id: 'tautan', top: 1420 },
    { id: 'kontak', top: 2150 },
  ]);
  assert.equal(active, 'perjalanan');
});
