export type WorkCategory = 'Fiksi & Serial' | 'Puisi' | 'Saluran & E-book';

export interface WritingWork {
  id: string;
  index: string;
  title: string;
  category: WorkCategory;
  publishedDate: string;
  lengthLabel: string;
  platform: string;
  summary: string;
  excerpt: string[];
  externalUrl: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface ProfileHighlight {
  label: string;
  value: string;
  detail: string;
}

export interface OfficialLink {
  id: string;
  platform: string;
  handle: string;
  description: string;
  url: string;
  ctaLabel: string;
}

export interface JourneyMilestone {
  index: string;
  period: string;
  role: string;
  institution: string;
  description: string;
}

export const VERIFIED_URLS = {
  instagramPersonal: 'https://www.instagram.com/iniipalll_?evlk=NHRpcmp5MzBjcTZt',
  karyakarsa: 'https://karyakarsa.com/ashborne',
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb7QRFUFMqrVXPjxoC32',
  wattpadProfile: 'https://www.wattpad.com/user/NaufalAthallah',
  wattpadThroneOfAshes:
    'https://www.wattpad.com/story/405454419-throne-of-ashes-tahkta-abu?utm_source=android&utm_medium=link&utm_content=share_writing&wp_page=create&wp_uname=NaufalAthallah&fbclid=PAb21jcAVtZsZleHRuA2FlbQIxMQBwZG9mAnNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABpwFjSvStTJq838JSR7eMX9SltykMl6nTlNOonJseadFgJUUqf0gIIAnaAGFX_aem_rL2N2QaJSz-dgsMtsdYEuQ',
  wattpadKeindahan: 'https://www.wattpad.com/story/405622791-keindahan-yang-tak-utuh',
  wattpadFragmenSayap:
    'https://www.wattpad.com/story/405821242-fragmen-sayap-di-ambang-pancarona',
  himaprosiInstagram: 'https://www.instagram.com/himaprosiuinsa?cnvx=MXVpbGhtcmUybmt5Mg==',
} as const;

export const PROFILE_IDENTITY = {
  fullName: 'Naufal Athallah Rosiyandi',
  shortName: 'Naufal Athallah',
  subtitle: 'Mahasiswa Sastra Inggris UINSA • Pengurus EDSA Executive 2026 • Penulis',
  kicker: 'Sastra Inggris FAHUM UINSA · HIMAPRO-SI / EDSA Executive 2026',
  welcomeLead:
    'Selamat datang di halaman profil resmi Naufal Athallah Rosiyandi. Saat ini aktif menempuh pendidikan di Program Studi Sastra Inggris, Fakultas Adab dan Humaniora (FAHUM) UIN Sunan Ampel Surabaya (UINSA) serta terlibat dalam kepengurusan himpunan mahasiswa HIMAPRO-SI / EDSA Executive 2026.',
  editorialNote:
    'Penulis THRONE OF ASHES (Tahkta Abu), Keindahan yang tak utuh, dan Fragmen Sayap di Ambang Pancarona di Wattpad (@NaufalAthallah), pengelola saluran Puisi, Novel(e-book) di WhatsApp, serta kreator @ashborne di Karyakarsa.',
  heroImage: '/src/assets/images/hero_literary_portrait_1795196264825.jpg',
  heroImageAlt:
    'Ilustrasi editorial potret mahasiswa sastra di meja baca perpustakaan.',
  proseImage: '/src/assets/images/writing_desk_prose_1795196265899.jpg',
  proseImageAlt:
    'Ilustrasi buku catatan naskah terbuka bersama pena tinta dan tumpukan buku di meja kerja.',
};

export const PROFILE_HIGHLIGHTS: ProfileHighlight[] = [
  {
    label: 'Program Studi',
    value: 'Sastra Inggris',
    detail: 'FAHUM UIN Sunan Ampel Surabaya',
  },
  {
    label: 'Kepengurusan',
    value: 'EDSA Executive 2026',
    detail: 'HIMAPRO-SI UINSA (@himaprosiuinsa)',
  },
  {
    label: 'Karya di Wattpad',
    value: '3 Karya Terbit',
    detail: 'THRONE OF ASHES, Keindahan yang tak utuh, Fragmen Sayap',
  },
  {
    label: 'Saluran & Kanal',
    value: 'Puisi, Novel(e-book)',
    detail: 'Saluran WhatsApp, @ashborne & @iniipalll_',
  },
];

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: 'wattpad',
    platform: 'Wattpad (@NaufalAthallah)',
    handle: '@NaufalAthallah',
    description:
      'Serial THRONE OF ASHES (Tahkta Abu) — Dark Fantasy & Misteri (5 bagian, diperbarui 15 Juni 2026) beserta dua karya lainnya.',
    url: VERIFIED_URLS.wattpadThroneOfAshes,
    ctaLabel: 'Wattpad: THRONE OF ASHES',
  },
  {
    id: 'whatsapp',
    platform: 'Saluran WhatsApp',
    handle: 'Puisi, Novel(e-book)',
    description:
      'Saluran "Puisi, Novel(e-book)" tempat berbagi novel-novel digital (e-book) orisinal eksklusif karya Naufal Athallah.',
    url: VERIFIED_URLS.whatsappChannel,
    ctaLabel: 'Saluran WhatsApp: Puisi, Novel(e-book)',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@iniipalll_',
    description:
      'Akun Instagram pribadi resmi Naufal Athallah Rosiyandi (@iniipalll_).',
    url: VERIFIED_URLS.instagramPersonal,
    ctaLabel: 'Instagram (@iniipalll_)',
  },
  {
    id: 'karyakarsa',
    platform: 'Karyakarsa',
    handle: '@ashborne',
    description:
      'Laman resmi Naufal Athallah Rosiyandi (@ashborne) di platform Karyakarsa.',
    url: VERIFIED_URLS.karyakarsa,
    ctaLabel: 'Karyakarsa (@ashborne)',
  },
];

export const WRITING_WORKS: WritingWork[] = [
  {
    id: 'throne-of-ashes-tahkta-abu',
    index: '01',
    title: 'THRONE OF ASHES (Tahkta Abu)',
    category: 'Fiksi & Serial',
    publishedDate: '15 Jun 2026',
    lengthLabel: '5 Bagian · Ongoing',
    platform: 'Wattpad (@NaufalAthallah)',
    summary:
      'Di Masa Uap serta Besi, para Dewa sudah lama mati ataupun begitulah yang dikhotbahkan oleh Gereja Mesin. Dunia bergerak dengan roda gigi, logika dingin, dan diawasi Inkuisitor.',
    excerpt: [
      'Di Masa Uap serta Besi, para Dewa sudah lama mati ataupun begitulah yang dikhotbahkan oleh Gereja Mesin. Dunia saat ini bergerak dengan roda gigi, diatur oleh logika dingin, serta diawasi oleh Inkuisitor yang membakar seluruh perihal berbau mistis.',
      'Di dunia di mana pengetahuan merupakan toksin, ketidaktahuan merupakan satu-satunya pelindung, serta kegilaan merupakan satu-satunya tangga mengarah takhta.',
      'Kategori & Tag di Wattpad: Dark Fantasy, Fantasy, Paranormal, Occult & Afterlife (#action #fantasi #misteri).',
    ],
    externalUrl: VERIFIED_URLS.wattpadThroneOfAshes,
    imageUrl: '/src/assets/images/writing_desk_prose_1795196265899.jpg',
    imageAlt: 'Ilustrasi meja tulis dan naskah cerita.',
  },
  {
    id: 'keindahan-yang-tak-utuh',
    index: '02',
    title: 'Keindahan yang tak utuh',
    category: 'Fiksi & Serial',
    publishedDate: '2 Jan 2026',
    lengthLabel: '6 Bagian · Ongoing',
    platform: 'Wattpad (@NaufalAthallah)',
    summary:
      'Bara terobsesi menutup retakan. Keara terobsesi mengisinya dengan emas. Kisah arsitek pemuja presisi dan kurator seni yang percaya sejarah benda terletak pada cacatnya.',
    excerpt: [
      'Bara terobsesi menutup retakan. Keara terobsesi mengisinya dengan emas.',
      'Bara Adiwangsa adalah arsitek yang memuja presisi. Baginya, hidup harus seperti menara kaca: simetris, berkilau, dan tanpa cela. Sebaliknya, Keara, istrinya, adalah kurator seni yang percaya bahwa sejarah sebuah benda justru terletak pada cacatnya.',
      'Pernikahan mereka berjalan di atas kompromi yang rapuh, hingga Elena masa lalu Bara yang mewakili standar kesempurnaan kembali dengan tawaran proyek impian.',
    ],
    externalUrl: VERIFIED_URLS.wattpadKeindahan,
    imageUrl: '/src/assets/images/campus_library_archive_1795196265483.jpg',
    imageAlt: 'Ilustrasi ruang baca dan arsip literatur.',
  },
  {
    id: 'fragmen-sayap-di-ambang-pancarona',
    index: '03',
    title: 'Fragmen Sayap di Ambang Pancarona',
    category: 'Puisi',
    publishedDate: '28 Des 2025',
    lengthLabel: '1 Bagian · Puisi',
    platform: 'Wattpad (@NaufalAthallah)',
    summary: 'Puisi orisinal karya Naufal Athallah yang diterbitkan di Wattpad (#melankolis).',
    excerpt: [
      'Puisi orisinal karya Naufal Athallah.',
      'Diterbitkan di Wattpad (@NaufalAthallah) pada 28 Desember 2025 dengan tagar #melankolis.',
    ],
    externalUrl: VERIFIED_URLS.wattpadFragmenSayap,
  },
  {
    id: 'saluran-puisi-novel-ebook',
    index: '04',
    title: 'Puisi, Novel(e-book) — Saluran Resmi',
    category: 'Saluran & E-book',
    publishedDate: 'Aktif',
    lengthLabel: '43 Pengikut · WhatsApp Channel',
    platform: 'Saluran WhatsApp',
    summary:
      'Sudut kecil tempat ide-ide bermuara: membagikan novel-novel digital (e-book) orisinal eksklusif karya Naufal Athallah.',
    excerpt: [
      'Selamat datang di sudut kecil tempat ide-ideku bermuara. Di sini, aku membagikan novel-novel digital yang kutulis dengan hati.',
      'Karya Orisinal: Novel-novel digital (E-book) eksklusif karya Naufal Athallah.',
      'Saluran ini bukan sekadar katalog, tapi rumah bagi cerita-ceritaku. Terima kasih sudah menjadi bagian dari perjalanan literasiku. Support your local independent writer.',
    ],
    externalUrl: VERIFIED_URLS.whatsappChannel,
  },
];

export const ORGANIZATION_REFERENCE = {
  name: 'HIMAPRO-SI / EDSA UINSA',
  fullTitle:
    'Himpunan Mahasiswa Program Studi Sastra Inggris — Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya',
  instagramHandle: '@himaprosiuinsa',
  instagramUrl: VERIFIED_URLS.himaprosiInstagram,
  summary:
    'Merujuk laman resmi UIN Sunan Ampel Surabaya (uinsa.ac.id), Program Studi Sastra Inggris berada di bawah Fakultas Adab dan Humaniora (FAHUM) UINSA dengan himpunan mahasiswa tingkat prodi HIMAPRO-SI (@himaprosiuinsa).',
  ecosystems: [
    {
      name: 'English Literary Club (ELITE)',
      detail:
        'Komunitas mahasiswa Sastra Inggris FAHUM UINSA untuk kajian karya sastra berbahasa Inggris, bedah buku, dan penulisan kreatif.',
    },
    {
      name: 'NEUSCO (National English Undergraduate Students Conference)',
      detail:
        'Konferensi ilmiah tahunan Prodi Sastra Inggris FAHUM UINSA bagi mahasiswa untuk mempresentasikan riset bahasa, sastra, dan budaya.',
    },
  ],
};

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    index: '01',
    period: '2026',
    role: 'Pengurus EDSA Executive 2026',
    institution: 'HIMAPRO-SI · Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya',
    description:
      'Aktif dalam kepengurusan himpunan mahasiswa Program Studi Sastra Inggris UINSA (@himaprosiuinsa).',
  },
  {
    index: '02',
    period: 'Aktif',
    role: 'Mahasiswa Program Studi Sastra Inggris',
    institution: 'Fakultas Adab dan Humaniora (FAHUM) · UIN Sunan Ampel Surabaya',
    description:
      'Menempuh pendidikan sarjana pada Program Studi Sastra Inggris, Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya.',
  },
  {
    index: '03',
    period: 'Sejak 2022',
    role: 'Penulis (@NaufalAthallah / @ashborne)',
    institution: 'Wattpad, Saluran WhatsApp Puisi, Novel(e-book) & Karyakarsa',
    description:
      'Aktif menulis fiksi dan puisi di Wattpad (bergabung sejak 17 Mei 2022) dengan 3 karya terbit, mengelola saluran WhatsApp Puisi, Novel(e-book), dan laman Karyakarsa @ashborne.',
  },
];
