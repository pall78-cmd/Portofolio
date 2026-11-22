import {
  ORGANIZATION_REFERENCE,
  PROFILE_IDENTITY,
  WRITING_WORKS,
  type WritingWork,
} from '../data/profileData';

export const SITE_BASE_URL = 'https://naufalathallah-rosiyandi.vercel.app';

const INDONESIAN_MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  aug: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nov: 10,
  des: 11,
  dec: 11,
};

const RFC_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const RFC_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function parseIndonesianWorkDate(
  label: string,
  fallbackIso = '2026-11-21'
): Date {
  const match = label.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const day = Number.parseInt(match[1], 10);
    const monthKey = match[2].slice(0, 3).toLowerCase();
    const year = Number.parseInt(match[3], 10);
    const monthIndex = INDONESIAN_MONTH_MAP[monthKey];
    if (monthIndex !== undefined && day >= 1 && day <= 31) {
      return new Date(Date.UTC(year, monthIndex, day, 0, 0, 0));
    }
  }
  return new Date(`${fallbackIso}T00:00:00Z`);
}

export function formatRfc822Wib(date: Date): string {
  const dayName = RFC_DAYS[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = RFC_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${dayName}, ${day} ${month} ${year} 07:00:00 +0700`;
}

export function buildRssFeedXml(
  works: WritingWork[] = WRITING_WORKS,
  options?: { baseUrl?: string; lastBuildIso?: string }
): string {
  const baseUrl = (options?.baseUrl ?? SITE_BASE_URL).replace(/\/+$/, '');
  const lastBuildDate = formatRfc822Wib(
    new Date(`${options?.lastBuildIso ?? '2026-11-21'}T00:00:00Z`)
  );

  const itemsXml = works
    .map((work) => {
      const pubDate = formatRfc822Wib(
        parseIndonesianWorkDate(work.publishedDate, options?.lastBuildIso ?? '2026-11-21')
      );
      const itemUrl = `${baseUrl}/?karya=${encodeURIComponent(work.id)}`;
      const description = `${work.summary} (${work.platform} · ${work.lengthLabel}). Tautan asli: ${work.externalUrl}`;

      return [
        '    <item>',
        `      <title>${escapeXml(work.title)}</title>`,
        `      <link>${escapeXml(itemUrl)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <category>${escapeXml(work.category)}</category>`,
        `      <description>${escapeXml(description)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${PROFILE_IDENTITY.fullName} · Karya Tulis & Pembaruan`)}</title>`,
    `    <link>${escapeXml(`${baseUrl}/`)}</link>`,
    `    <atom:link href="${escapeXml(`${baseUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    `    <description>${escapeXml(PROFILE_IDENTITY.editorialNote)}</description>`,
    '    <language>id</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    itemsXml,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export function buildSitemapXml(
  works: WritingWork[] = WRITING_WORKS,
  options?: { baseUrl?: string; lastmod?: string }
): string {
  const baseUrl = (options?.baseUrl ?? SITE_BASE_URL).replace(/\/+$/, '');
  const lastmod = options?.lastmod ?? '2026-11-21';

  const imageEntries: Array<{ loc: string; title: string }> = [
    {
      loc: `${baseUrl}${PROFILE_IDENTITY.heroImage}`,
      title: PROFILE_IDENTITY.heroImageAlt,
    },
    {
      loc: `${baseUrl}${PROFILE_IDENTITY.proseImage}`,
      title: PROFILE_IDENTITY.proseImageAlt,
    },
    {
      loc: `${baseUrl}${ORGANIZATION_REFERENCE.hrdDivisionImage}`,
      title: ORGANIZATION_REFERENCE.hrdDivisionImageAlt,
    },
    {
      loc: `${baseUrl}${ORGANIZATION_REFERENCE.edsaBannerImage}`,
      title: ORGANIZATION_REFERENCE.edsaBannerAlt,
    },
  ];

  for (const work of works) {
    if (work.imageUrl && !imageEntries.some((entry) => entry.loc === `${baseUrl}${work.imageUrl}`)) {
      imageEntries.push({
        loc: `${baseUrl}${work.imageUrl}`,
        title: `${work.title} · ${work.imageAlt ?? work.summary}`,
      });
    }
  }

  const imageXml = imageEntries
    .map(
      (img) =>
        [
          '    <image:image>',
          `      <image:loc>${escapeXml(img.loc)}</image:loc>`,
          `      <image:title>${escapeXml(img.title)}</image:title>`,
          '    </image:image>',
        ].join('\n')
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    '  <url>',
    `    <loc>${escapeXml(`${baseUrl}/`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    imageXml,
    '  </url>',
    '  <url>',
    `    <loc>${escapeXml(`${baseUrl}/rss.xml`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.6</priority>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}
