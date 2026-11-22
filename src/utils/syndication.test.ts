import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { WRITING_WORKS } from '../data/profileData';
import {
  buildRssFeedXml,
  buildSitemapXml,
  escapeXml,
  parseIndonesianWorkDate,
} from './syndication';

test('escapeXml safely escapes XML entities including query parameter ampersands', () => {
  assert.equal(escapeXml('A & B <test> "1" \'2\''), 'A &amp; B &lt;test&gt; &quot;1&quot; &apos;2&apos;');
});

test('parseIndonesianWorkDate parses Indonesian month abbreviations accurately', () => {
  const dec = parseIndonesianWorkDate('28 Des 2025');
  assert.equal(dec.toISOString(), '2025-12-28T00:00:00.000Z');

  const jun = parseIndonesianWorkDate('15 Jun 2026');
  assert.equal(jun.toISOString(), '2026-06-15T00:00:00.000Z');
});

test('buildRssFeedXml includes all writing works with valid XML escaping and matches public/rss.xml', () => {
  const xml = buildRssFeedXml(WRITING_WORKS, { lastBuildIso: '2026-11-21' });
  assert.match(xml, /<rss version="2\.0"/);
  assert.match(xml, /THRONE OF ASHES \(Tahkta Abu\)/);
  assert.match(xml, /Keindahan yang tak utuh/);
  assert.match(xml, /Fragmen Sayap di Ambang Pancarona/);
  assert.match(xml, /Puisi, Novel\(e-book\) — Saluran Resmi/);
  assert.equal(xml.includes('&utm_medium'), false);
  assert.equal(xml.includes('&amp;utm_medium'), true);

  const publicRss = fs.readFileSync(path.resolve(process.cwd(), 'public/rss.xml'), 'utf8');
  assert.equal(publicRss, xml);
});

test('buildSitemapXml generates valid same-origin sitemap with images and matches public/sitemap.xml', () => {
  const xml = buildSitemapXml(WRITING_WORKS, { lastmod: '2026-11-21' });
  assert.match(xml, /<loc>https:\/\/naufalathallah-rosiyandi\.vercel\.app\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/naufalathallah-rosiyandi\.vercel\.app\/rss\.xml<\/loc>/);
  assert.match(xml, /1000199122-jpg-1759824490026_bdc54ddd\.jpg/);
  assert.match(xml, /1000383664_8e63566c\.jpg/);

  const publicSitemap = fs.readFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');
  assert.equal(publicSitemap, xml);
});
