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

export interface ElitionDeliverable {
  id: string;
  index: string;
  group: 'aspirasi' | 'publikasi';
  category: string;
  title: string;
  scheduleOrSource: string;
  summary: string;
  primaryUrl: string;
  primaryLabel: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
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
  elitionDriveFolder: 'https://drive.google.com/drive/folders/1VfXHtXQw8nvk6vSkcRgyIZtvTMsVmgr0',
  elitionSpreadsheet: 'https://drive.google.com/file/d/1zzVREvUTaDO52cecB7HfLFQqr2zT2GAs/view',
  elitionAspirasiForm: 'https://forms.gle/QDvEjQmLQHnqDp8S7',
  elitionSifaVoteForm: 'https://forms.gle/R6BXieknnxzi7oSV6',
  elitionBaktiBcaPoster: 'https://drive.google.com/file/d/1RHFhtfUCYPPPAZmJE5uHgTQwQuJyC4Fr/view',
  elitionGooglePoster: 'https://drive.google.com/file/d/1b8Ceo79l7j0D3xBPi85hGyPTrVxH-B4l/view',
  elitionGoogleQrPoster: 'https://drive.google.com/file/d/1A2w1qkoOcprNg7aOfYVenryNxNTYSULl/view',
  elitionCakNingPoster: 'https://drive.google.com/file/d/1J7AJMf4dQbz_ofFWpe-CGHuU2mVrbP3l/view',
} as const;

export const PROFILE_IDENTITY = {
  fullName: 'Naufal Athallah Rosiyandi',
  shortName: 'Naufal Athallah',
  subtitle:
    'Mahasiswa Sastra Inggris UINSA · Pengurus Divisi HRD EDSA 2026 (Kabinet Atarascent) · Penulis',
  kicker: 'Sastra Inggris FAHUM UINSA · Kabinet Atarascent',
  welcomeLead:
    'Kuliah di Sastra Inggris FAHUM UIN Sunan Ampel Surabaya, keseharian Naufal diisi dengan ruang kelas, kegiatan himpunan, dan menulis cerita. Di kampus, ia ikut menggerakkan Divisi HRD EDSA Executive 2026 (Kabinet Atarascent).',
  editorialNote:
    'Di waktu luang, ia menulis cerita bersambung dan puisi di Wattpad (@NaufalAthallah), termasuk THRONE OF ASHES (Tahkta Abu) dan Keindahan yang tak utuh. Tulisan lainnya juga dibagikan lewat saluran WhatsApp Puisi, Novel(e-book) dan Karyakarsa @ashborne.',
  heroImage: '/assets/aistudio/1000199122-jpg-1759824490026_bdc54ddd.jpg',
  heroImageAlt: 'Potret Naufal Athallah Rosiyandi di kawasan Halaman Kota Surabaya.',
  proseImage: '/src/assets/images/writing_desk_prose_1795196265899.jpg',
  proseImageAlt:
    'Meja tulis dengan buku catatan terbuka, pena tinta, dan tumpukan buku.',
};

export const PROFILE_HIGHLIGHTS: ProfileHighlight[] = [
  {
    label: 'Jurusan',
    value: 'Sastra Inggris',
    detail: 'FAHUM · UIN Sunan Ampel Surabaya',
  },
  {
    label: 'Himpunan',
    value: 'EDSA Executive 2026',
    detail: 'Divisi HRD · Kabinet Atarascent (HIMAPRO-SI)',
  },
  {
    label: 'Karya di Wattpad',
    value: '3 Karya Terbit',
    detail: 'THRONE OF ASHES, Keindahan yang tak utuh, Fragmen Sayap',
  },
  {
    label: 'Saluran & Laman',
    value: 'Puisi, Novel(e-book)',
    detail: 'Saluran WhatsApp, Karyakarsa (@ashborne) & Instagram',
  },
];

export const OFFICIAL_LINKS: OfficialLink[] = [
  {
    id: 'wattpad',
    platform: 'Wattpad (@NaufalAthallah)',
    handle: '@NaufalAthallah',
    description:
      'Kumpulan cerita bersambung seperti THRONE OF ASHES (Tahkta Abu), Keindahan yang tak utuh, dan puisi di Wattpad.',
    url: VERIFIED_URLS.wattpadThroneOfAshes,
    ctaLabel: 'Wattpad: THRONE OF ASHES',
  },
  {
    id: 'whatsapp',
    platform: 'Saluran WhatsApp',
    handle: 'Puisi, Novel(e-book)',
    description:
      'Tempat berbagi novel digital (e-book) dan puisi terbaru langsung lewat saluran WhatsApp.',
    url: VERIFIED_URLS.whatsappChannel,
    ctaLabel: 'Saluran WhatsApp: Puisi, Novel(e-book)',
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    handle: '@iniipalll_',
    description:
      'Keseharian, kegiatan kampus, dan kabar terbaru dari Naufal Athallah (@iniipalll_).',
    url: VERIFIED_URLS.instagramPersonal,
    ctaLabel: 'Instagram (@iniipalll_)',
  },
  {
    id: 'karyakarsa',
    platform: 'Karyakarsa',
    handle: '@ashborne',
    description:
      'Laman Karyakarsa @ashborne untuk membaca dan memberi dukungan buat karya tulisan Naufal.',
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
      'Tagar di Wattpad: Dark Fantasy, Fantasy, Paranormal, Occult & Afterlife (#action #fantasi #misteri).',
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
      'Pernikahan mereka berjalan di atas kompromi yang rapuh, hingga Elena, sosok dari masa lalu Bara yang mewakili standar kesempurnaan, kembali membawa tawaran proyek impian.',
    ],
    externalUrl: VERIFIED_URLS.wattpadKeindahan,
    imageUrl: '/src/assets/images/campus_library_archive_1795196265483.jpg',
    imageAlt: 'Ilustrasi ruang baca dan rak buku perpustakaan.',
  },
  {
    id: 'fragmen-sayap-di-ambang-pancarona',
    index: '03',
    title: 'Fragmen Sayap di Ambang Pancarona',
    category: 'Puisi',
    publishedDate: '28 Des 2025',
    lengthLabel: '1 Bagian · Puisi',
    platform: 'Wattpad (@NaufalAthallah)',
    summary:
      'Puisi bernuansa sendu karya Naufal Athallah yang terbit di Wattpad (@NaufalAthallah).',
    excerpt: [
      'Sajak bernuansa sendu karya Naufal Athallah.',
      'Terbit di Wattpad (@NaufalAthallah) pada 28 Desember 2025 dengan tagar #melankolis.',
    ],
    externalUrl: VERIFIED_URLS.wattpadFragmenSayap,
  },
  {
    id: 'saluran-puisi-novel-ebook',
    index: '04',
    title: 'Puisi, Novel(e-book) (Saluran WhatsApp)',
    category: 'Saluran & E-book',
    publishedDate: 'Aktif',
    lengthLabel: '43 Pengikut · WhatsApp Channel',
    platform: 'Saluran WhatsApp',
    summary:
      'Sudut kecil tempat ide-ide bermuara. Saluran WhatsApp tempat Naufal berbagi novel digital (e-book) dan puisi.',
    excerpt: [
      'Selamat datang di sudut kecil tempat ide-ideku bermuara. Di sini, aku membagikan novel-novel digital yang kutulis dengan hati.',
      'Karya Orisinal: Novel-novel digital (e-book) eksklusif karya Naufal Athallah.',
      'Saluran ini bukan sekadar katalog, melainkan rumah bagi cerita-ceritaku. Terima kasih sudah menjadi bagian dari perjalanan literasiku. Support your local independent writer.',
    ],
    externalUrl: VERIFIED_URLS.whatsappChannel,
  },
];

export const ORGANIZATION_REFERENCE = {
  name: 'HIMAPRO-SI / EDSA UINSA',
  fullTitle:
    'Himpunan Mahasiswa Program Studi Sastra Inggris, Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya',
  instagramHandle: '@himaprosiuinsa',
  instagramUrl: VERIFIED_URLS.himaprosiInstagram,
  edsaBannerImage: '/assets/aistudio/EDSA_header_google_form_1600x400_9e5f9952.png',
  edsaBannerAlt:
    'Header resmi English Department Student Association (EDSA) Faculty of Arts and Humanities UIN Sunan Ampel Surabaya.',
  hrdDivisionImage: '/assets/aistudio/1000383664_8e63566c.jpg',
  hrdDivisionImageAlt:
    'Foto bersama anggota Divisi HRD EDSA Executive 2026 Kabinet Atarascent HIMAPRO-SI UINSA mengenakan seragam himpunan.',
  hrdDivisionCaption:
    'Divisi HRD (Human Resource Development) · EDSA Executive 2026 Kabinet Atarascent.',
  summary:
    'HIMAPRO-SI atau EDSA UINSA adalah himpunan mahasiswa Sastra Inggris di Fakultas Adab dan Humaniora (FAHUM) UIN Sunan Ampel Surabaya.',
  ecosystems: [
    {
      name: 'English Literary Club (ELITE)',
      detail:
        'Komunitas mahasiswa Sastra Inggris FAHUM UINSA buat bedah buku, ngobrolin karya sastra berbahasa Inggris, sampai latihan nulis kreatif bareng.',
    },
    {
      name: 'NEUSCO (National English Undergraduate Students Conference)',
      detail:
        'Konferensi mahasiswa tahunan Prodi Sastra Inggris FAHUM UINSA untuk berbagi hasil riset seputar bahasa, sastra, dan budaya.',
    },
  ],
};

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    index: '01',
    period: '2026',
    role: 'Pengurus Divisi HRD EDSA Executive 2026 · Kabinet Atarascent',
    institution: 'HIMAPRO-SI · Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya',
    description:
      'Ikut menggerakkan Divisi HRD (Human Resource Development) HIMAPRO-SI / EDSA UINSA (@himaprosiuinsa), termasuk menjalankan program ELITION untuk menampung suara mahasiswa serta berbagi info beasiswa, program duta, dan lomba.',
  },
  {
    index: '02',
    period: 'Aktif',
    role: 'Mahasiswa Sastra Inggris',
    institution: 'Fakultas Adab dan Humaniora (FAHUM) · UIN Sunan Ampel Surabaya',
    description:
      'Kuliah di Jurusan Sastra Inggris, Fakultas Adab dan Humaniora (FAHUM) UIN Sunan Ampel Surabaya.',
  },
  {
    index: '03',
    period: 'Sejak 2022',
    role: 'Penulis (@NaufalAthallah / @ashborne)',
    institution: 'Wattpad, Saluran WhatsApp Puisi, Novel(e-book) & Karyakarsa',
    description:
      'Menulis cerita dan puisi di Wattpad sejak Mei 2022 dengan tiga karya yang sudah terbit, sambil aktif mengisi saluran WhatsApp Puisi, Novel(e-book) dan laman Karyakarsa @ashborne.',
  },
];

export const HRD_ELITION_PROGRESS = {
  eyebrow: 'Kegiatan Divisi HRD',
  title: 'ELITION (English Literature Information)',
  summary:
    'Program dari Divisi HRD EDSA Executive 2026 (Kabinet Atarascent) untuk menampung suara mahasiswa Sastra Inggris sekaligus berbagi info penting, mulai dari kuesioner prodi, voting komunitas, sampai kabar beasiswa dan lomba.',
  driveFolderUrl: VERIFIED_URLS.elitionDriveFolder,
  spreadsheetUrl: VERIFIED_URLS.elitionSpreadsheet,
  items: [
    {
      id: 'elition-aspirasi-mahasiswa',
      index: '01',
      group: 'aspirasi',
      category: 'Aspirasi Mahasiswa',
      title: 'Kuesioner Aspirasi Mahasiswa Sastra Inggris',
      scheduleOrSource: 'Google Forms · Rekap Spreadsheet ELITION',
      summary:
        'Wadah terbuka buat teman-teman Sastra Inggris UINSA menyampaikan masukan, ide acara, dan kebutuhan mahasiswa.',
      primaryUrl: VERIFIED_URLS.elitionAspirasiForm,
      primaryLabel: 'Buka Formulir',
    },
    {
      id: 'elition-voting-sifa',
      index: '02',
      group: 'aspirasi',
      category: 'Vote Komunitas',
      title: 'Evaluasi & Voting Penggantian Komunitas SIFA',
      scheduleOrSource: 'Google Forms · Rekap Spreadsheet ELITION',
      summary:
        'Voting terbuka mahasiswa untuk mengevaluasi sekaligus menentukan kelanjutan komunitas SIFA di prodi.',
      primaryUrl: VERIFIED_URLS.elitionSifaVoteForm,
      primaryLabel: 'Buka Voting',
    },
    {
      id: 'elition-bakti-bca',
      index: '03',
      group: 'publikasi',
      category: 'Info Beasiswa',
      title: 'Beasiswa Bakti BCA 2026',
      scheduleOrSource: '3 Agustus - 30 September 2026 · bca.id/beasiswabaktibca',
      summary:
        'Info jadwal daftar dan tautan resmi Program Beasiswa Bakti BCA 2026 buat mahasiswa Sastra Inggris.',
      primaryUrl: VERIFIED_URLS.elitionBaktiBcaPoster,
      primaryLabel: 'Lihat Poster',
    },
    {
      id: 'elition-google-ambassador',
      index: '04',
      group: 'publikasi',
      category: 'Volunteer & Duta',
      title: 'Google Student Ambassador (#TeamGoogle2026)',
      scheduleOrSource: 'Poster Info & Kode QR Pendaftaran',
      summary:
        'Poster info pendaftaran Google Student Ambassador 2026 ("Kami mencari si paling AI") lengkap dengan kode QR.',
      primaryUrl: VERIFIED_URLS.elitionGooglePoster,
      primaryLabel: 'Poster Utama',
      secondaryUrl: VERIFIED_URLS.elitionGoogleQrPoster,
      secondaryLabel: 'Poster Kode QR',
    },
    {
      id: 'elition-cak-ning-surabaya',
      index: '05',
      group: 'publikasi',
      category: 'Duta Wisata',
      title: 'Pemilihan Duta Wisata Cak & Ning Surabaya 2026',
      scheduleOrSource: '6 Juli - 12 September 2026 · Adhigana Manggala',
      summary:
        'Info syarat, jadwal seleksi dari Technical Meeting sampai Grand Final 10 Oktober 2026, dan cara daftar Cak & Ning Surabaya.',
      primaryUrl: VERIFIED_URLS.elitionCakNingPoster,
      primaryLabel: 'Lihat Poster',
    },
  ] satisfies ElitionDeliverable[],
};
