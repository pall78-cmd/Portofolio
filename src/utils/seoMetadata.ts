import {
  ORGANIZATION_REFERENCE,
  PROFILE_IDENTITY,
  type WritingWork,
} from '../data/profileData';

export const SITE_BASE_URL = 'https://naufalathallah-rosiyandi.vercel.app';

export type SectionId = 'profil' | 'karya' | 'perjalanan' | 'tautan' | 'kontak';

export const OBSERVED_SECTIONS: SectionId[] = [
  'profil',
  'karya',
  'perjalanan',
  'tautan',
  'kontak',
];

export function computeActiveSection(
  sectionTops: Array<{ id: SectionId; top: number }>,
  thresholdPx = 140
): SectionId {
  let active: SectionId = sectionTops[0]?.id ?? 'profil';
  for (const item of sectionTops) {
    if (item.top <= thresholdPx) {
      active = item.id;
    }
  }
  return active;
}

export interface ImageDimensionSpec {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface PageSeoMetadata {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  url: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
}

export const VERIFIED_IMAGE_DIMENSIONS: Record<string, ImageDimensionSpec> = {
  [PROFILE_IDENTITY.heroImage]: {
    url: `${SITE_BASE_URL}${PROFILE_IDENTITY.heroImage}`,
    width: 1795,
    height: 2452,
    alt: PROFILE_IDENTITY.heroImageAlt,
  },
  [ORGANIZATION_REFERENCE.hrdDivisionImage]: {
    url: `${SITE_BASE_URL}${ORGANIZATION_REFERENCE.hrdDivisionImage}`,
    width: 1056,
    height: 1876,
    alt: ORGANIZATION_REFERENCE.hrdDivisionImageAlt,
  },
  [PROFILE_IDENTITY.proseImage]: {
    url: `${SITE_BASE_URL}${PROFILE_IDENTITY.proseImage}`,
    width: 1200,
    height: 896,
    alt: PROFILE_IDENTITY.proseImageAlt,
  },
  [ORGANIZATION_REFERENCE.edsaBannerImage]: {
    url: `${SITE_BASE_URL}${ORGANIZATION_REFERENCE.edsaBannerImage}`,
    width: 1600,
    height: 400,
    alt: ORGANIZATION_REFERENCE.edsaBannerAlt,
  },
  '/src/assets/images/campus_library_archive_1795196265483.jpg': {
    url: `${SITE_BASE_URL}/src/assets/images/campus_library_archive_1795196265483.jpg`,
    width: 1200,
    height: 896,
    alt: 'Ilustrasi ruang baca dan arsip literatur.',
  },
};

const DEFAULT_IMAGE = VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.heroImage];

export const SECTION_SEO_METADATA: Record<SectionId, PageSeoMetadata> = {
  profil: {
    title: 'Naufal Athallah Rosiyandi · Profil & Karya',
    description:
      'Profil Naufal Athallah Rosiyandi (@iniipalll_), mahasiswa Sastra Inggris FAHUM UIN Sunan Ampel Surabaya (UINSA), pengurus Divisi HRD EDSA Executive 2026 Kabinet Atarascent, sekaligus penulis.',
    ogTitle: 'Naufal Athallah Rosiyandi · Sastra Inggris UINSA & Penulis',
    ogDescription:
      'Kumpulan cerita, aktivitas Divisi HRD EDSA Executive 2026 Kabinet Atarascent (ELITION), dan tautan resmi milik Naufal Athallah Rosiyandi.',
    twitterTitle: 'Naufal Athallah Rosiyandi · Profil & Karya',
    twitterDescription:
      'Mahasiswa Sastra Inggris UINSA, Pengurus Divisi HRD Kabinet Atarascent EDSA 2026, & penulis THRONE OF ASHES di Wattpad (@NaufalAthallah).',
    url: `${SITE_BASE_URL}/`,
    imageUrl: DEFAULT_IMAGE.url,
    imageWidth: DEFAULT_IMAGE.width,
    imageHeight: DEFAULT_IMAGE.height,
    imageAlt: DEFAULT_IMAGE.alt,
  },
  karya: {
    title: 'Karya Pilihan · Naufal Athallah Rosiyandi',
    description:
      'Daftar cerita bersambung, puisi, dan e-book Naufal Athallah Rosiyandi di Wattpad (@NaufalAthallah) dan Saluran WhatsApp Puisi, Novel(e-book).',
    ogTitle: 'Karya Tulis & Buku · Naufal Athallah Rosiyandi',
    ogDescription:
      'Baca cuplikan THRONE OF ASHES (Tahkta Abu), Keindahan yang tak utuh, Fragmen Sayap di Ambang Pancarona, dan e-book lainnya.',
    twitterTitle: 'Karya Pilihan · Naufal Athallah Rosiyandi',
    twitterDescription:
      'Cerita bersambung fantasi gelap, drama arsitektur, puisi sendu, hingga e-book oleh @NaufalAthallah.',
    url: `${SITE_BASE_URL}/#karya`,
    imageUrl: VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.proseImage].url,
    imageWidth: VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.proseImage].width,
    imageHeight: VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.proseImage].height,
    imageAlt: VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.proseImage].alt,
  },
  perjalanan: {
    title: 'EDSA Executive 2026 Kabinet Atarascent & ELITION · Naufal Athallah Rosiyandi',
    description:
      'Catatan kegiatan di Divisi HRD EDSA Executive 2026 Kabinet Atarascent HIMAPRO-SI FAHUM UINSA dan kabar program ELITION (English Literature Information).',
    ogTitle: 'Divisi HRD Kabinet Atarascent EDSA 2026 & ELITION · HIMAPRO-SI UINSA',
    ogDescription:
      'Lihat kegiatan ELITION Kabinet Atarascent: serap suara mahasiswa, voting komunitas SIFA, info Beasiswa Bakti BCA, Google Student Ambassador, dan Cak & Ning Surabaya.',
    twitterTitle: 'Kabinet Atarascent EDSA 2026 & ELITION · Naufal Athallah',
    twitterDescription:
      'Info beasiswa, volunteer ambassador, voting komunitas SIFA, dan foto tim Divisi HRD Kabinet Atarascent HIMAPRO-SI UINSA.',
    url: `${SITE_BASE_URL}/#perjalanan`,
    imageUrl: VERIFIED_IMAGE_DIMENSIONS[ORGANIZATION_REFERENCE.hrdDivisionImage].url,
    imageWidth: VERIFIED_IMAGE_DIMENSIONS[ORGANIZATION_REFERENCE.hrdDivisionImage].width,
    imageHeight: VERIFIED_IMAGE_DIMENSIONS[ORGANIZATION_REFERENCE.hrdDivisionImage].height,
    imageAlt: VERIFIED_IMAGE_DIMENSIONS[ORGANIZATION_REFERENCE.hrdDivisionImage].alt,
  },
  tautan: {
    title: 'Tautan Resmi · Naufal Athallah Rosiyandi',
    description:
      'Tautan langsung ke Wattpad (@NaufalAthallah), Instagram (@iniipalll_), Karyakarsa (@ashborne), dan Saluran WhatsApp.',
    ogTitle: 'Tautan Resmi · Naufal Athallah Rosiyandi',
    ogDescription:
      'Ikuti seluruh akun dan saluran tulisan milik Naufal Athallah Rosiyandi.',
    twitterTitle: 'Tautan Resmi Naufal Athallah Rosiyandi',
    twitterDescription:
      'Wattpad @NaufalAthallah · Instagram @iniipalll_ · Karyakarsa @ashborne · WhatsApp Puisi, Novel(e-book).',
    url: `${SITE_BASE_URL}/#tautan`,
    imageUrl:
      VERIFIED_IMAGE_DIMENSIONS['/src/assets/images/campus_library_archive_1795196265483.jpg'].url,
    imageWidth:
      VERIFIED_IMAGE_DIMENSIONS['/src/assets/images/campus_library_archive_1795196265483.jpg'].width,
    imageHeight:
      VERIFIED_IMAGE_DIMENSIONS['/src/assets/images/campus_library_archive_1795196265483.jpg'].height,
    imageAlt:
      VERIFIED_IMAGE_DIMENSIONS['/src/assets/images/campus_library_archive_1795196265483.jpg'].alt,
  },
  kontak: {
    title: 'Kirim Pesan & Kolaborasi · Naufal Athallah Rosiyandi',
    description:
      'Kirim pesan untuk ngobrol soal cerita, ajak nulis bareng (@ashborne), atau koordinasi kegiatan EDSA Executive 2026 UINSA.',
    ogTitle: 'Kirim Pesan · Naufal Athallah Rosiyandi',
    ogDescription:
      'Formulir pesan langsung untuk diskusi sastra, kerja sama tulisan, dan kegiatan mahasiswa.',
    twitterTitle: 'Hubungi Naufal Athallah Rosiyandi',
    twitterDescription:
      'Terbuka untuk ngobrol sastra, nulis bareng (@ashborne), dan kegiatan EDSA Executive 2026.',
    url: `${SITE_BASE_URL}/#kontak`,
    imageUrl: DEFAULT_IMAGE.url,
    imageWidth: DEFAULT_IMAGE.width,
    imageHeight: DEFAULT_IMAGE.height,
    imageAlt: DEFAULT_IMAGE.alt,
  },
};

export function resolvePageMetadata(options: {
  activeWork: WritingWork | null;
  activeSection: SectionId;
}): PageSeoMetadata {
  const { activeWork, activeSection } = options;

  if (activeWork) {
    const workImage =
      (activeWork.imageUrl ? VERIFIED_IMAGE_DIMENSIONS[activeWork.imageUrl] : undefined) ??
      VERIFIED_IMAGE_DIMENSIONS[PROFILE_IDENTITY.proseImage];
    const workUrl = `${SITE_BASE_URL}/?karya=${encodeURIComponent(activeWork.id)}`;
    const conciseSummary =
      activeWork.summary.length > 155
        ? `${activeWork.summary.slice(0, 152).trimEnd()}...`
        : activeWork.summary;

    return {
      title: `${activeWork.title} · ${PROFILE_IDENTITY.fullName}`,
      description: `${activeWork.title} (${activeWork.category}, ${activeWork.publishedDate}) di ${activeWork.platform}. ${activeWork.summary}`,
      ogTitle: `${activeWork.title} · ${activeWork.platform}`,
      ogDescription: `${activeWork.summary} (${activeWork.lengthLabel})`,
      twitterTitle: `${activeWork.title} · ${PROFILE_IDENTITY.shortName}`,
      twitterDescription: conciseSummary,
      url: workUrl,
      imageUrl: workImage.url,
      imageWidth: workImage.width,
      imageHeight: workImage.height,
      imageAlt: activeWork.imageAlt ?? workImage.alt,
    };
  }

  return SECTION_SEO_METADATA[activeSection] ?? SECTION_SEO_METADATA.profil;
}

function setMetaContent(
  selector: string,
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string
): void {
  if (typeof document === 'undefined') {
    return;
  }
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attributeName, attributeValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyDocumentSeoMetadata(metadata: PageSeoMetadata): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.title = metadata.title;

  setMetaContent('meta[name="description"]', 'name', 'description', metadata.description);
  setMetaContent('meta[property="og:title"]', 'property', 'og:title', metadata.ogTitle);
  setMetaContent(
    'meta[property="og:description"]',
    'property',
    'og:description',
    metadata.ogDescription
  );
  setMetaContent('meta[property="og:url"]', 'property', 'og:url', metadata.url);
  setMetaContent('meta[property="og:image"]', 'property', 'og:image', metadata.imageUrl);
  setMetaContent(
    'meta[property="og:image:width"]',
    'property',
    'og:image:width',
    String(metadata.imageWidth)
  );
  setMetaContent(
    'meta[property="og:image:height"]',
    'property',
    'og:image:height',
    String(metadata.imageHeight)
  );
  setMetaContent('meta[property="og:image:alt"]', 'property', 'og:image:alt', metadata.imageAlt);

  setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.twitterTitle);
  setMetaContent(
    'meta[name="twitter:description"]',
    'name',
    'twitter:description',
    metadata.twitterDescription
  );
  setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', metadata.imageUrl);
  setMetaContent(
    'meta[name="twitter:image:alt"]',
    'name',
    'twitter:image:alt',
    metadata.imageAlt
  );
}
