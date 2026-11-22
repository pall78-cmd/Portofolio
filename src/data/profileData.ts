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
  subtitle: 'Mahasiswa Sastra Inggris UINSA • Pengurus EDSA Executive 2026 • Penulis',
  kicker: 'Sastra Inggris FAHUM UINSA · HIMAPRO-SI / EDSA Executive 2026',
  welcomeLead:
    'Selamat datang di halaman profil resmi Naufal Athallah Rosiyandi. Saat ini aktif menempuh pendidikan di Program Studi Sastra Inggris, Fakultas Adab dan Humaniora (FAHUM) UIN Sunan Ampel Surabaya (UINSA) serta terlibat dalam kepengurusan himpunan mahasiswa HIMAPRO-SI / EDSA Executive 2026.',
  editorialNote:
    'Penulis THRONE OF ASHES (Tahkta Abu), Keindahan yang tak utuh, dan Fragmen Sayap di Ambang Pancarona di Wattpad (@NaufalAthallah), pengelola saluran Puisi, Novel(e-book) di WhatsApp, serta kreator @ashborne di Karyakarsa.',
  heroImage: '/assets/aistudio/1000199122-jpg-1759824490026_bdc54ddd.jpg',
  heroImageAlt: 'Foto profil Naufal Athallah Rosiyandi di kawasan Halaman Kota.',
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
  hrdDivisionImage: '/assets/aistudio/1000383664_8e63566c.jpg',
  hrdDivisionImageAlt:
    'Foto bersama anggota Divisi HRD EDSA Executive 2026 HIMAPRO-SI UINSA mengenakan seragam himpunan.',
  hrdDivisionCaption: 'Divisi HRD (Human Resource Development) · EDSA Executive 2026 HIMAPRO-SI UINSA.',
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
    role: 'Pengurus EDSA Executive 2026 (Divisi HRD)',
    institution: 'HIMAPRO-SI · Fakultas Adab dan Humaniora UIN Sunan Ampel Surabaya',
    description:
      'Aktif di Divisi HRD (Human Resource Development) HIMAPRO-SI / EDSA UINSA (@himaprosiuinsa), menjalankan program ELITION (English Literature Information) untuk kurasi informasi beasiswa, program ambassador, duta wisata, serta serap aspirasi dan voting komunitas mahasiswa.',
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

export const HRD_ELITION_PROGRESS = {
  eyebrow: 'Progres Divisi HRD · Program Kerja ELITION',
  title: 'ELITION (English Literature Information)',
  summary:
    'Inisiatif Divisi HRD EDSA Executive 2026 dalam menghimpun aspirasi mahasiswa, menyelenggarakan voting komunitas, serta menyebarkan informasi terkurasi mengenai beasiswa, rekrutmen relawan, dan ajang prestasi mahasiswa.',
  driveFolderUrl: VERIFIED_URLS.elitionDriveFolder,
  spreadsheetUrl: VERIFIED_URLS.elitionSpreadsheet,
  items: [
    {
      id: 'elition-aspirasi-mahasiswa',
      index: '01',
      group: 'aspirasi',
      category: 'Serap Aspirasi Mahasiswa',
      title: 'Kuesioner Aspirasi Mahasiswa Sastra Inggris',
      scheduleOrSource: 'Google Forms · Arsip Spreadsheet ELITION',
      summary:
        'Kanal resmi penjaringan masukan, kebutuhan pengembangan diri, dan evaluasi layanan kemahasiswaan bagi mahasiswa Prodi Sastra Inggris UINSA.',
      primaryUrl: VERIFIED_URLS.elitionAspirasiForm,
      primaryLabel: 'Buka Formulir',
    },
    {
      id: 'elition-voting-sifa',
      index: '02',
      group: 'aspirasi',
      category: 'Vote Komunitas',
      title: 'Evaluasi & Voting Penggantian Komunitas SIFA',
      scheduleOrSource: 'Google Forms · Arsip Spreadsheet ELITION',
      summary:
        'Jajak pendapat dan pemungutan suara mahasiswa untuk mengevaluasi serta menentukan arah pembaruan komunitas SIFA di lingkungan prodi.',
      primaryUrl: VERIFIED_URLS.elitionSifaVoteForm,
      primaryLabel: 'Buka Voting',
    },
    {
      id: 'elition-bakti-bca',
      index: '03',
      group: 'publikasi',
      category: 'Informasi Beasiswa',
      title: 'Beasiswa Bakti BCA 2026',
      scheduleOrSource: '3 Agustus – 30 September 2026 · bca.id/beasiswabaktibca',
      summary:
        'Publikasi informasi jadwal pendaftaran dan tautan resmi Program Beasiswa Bakti BCA 2026 agar mudah diakses mahasiswa Sastra Inggris.',
      primaryUrl: VERIFIED_URLS.elitionBaktiBcaPoster,
      primaryLabel: 'Lihat Poster',
    },
    {
      id: 'elition-google-ambassador',
      index: '04',
      group: 'publikasi',
      category: 'Volunteer & Ambassador',
      title: 'Google Student Ambassador (#TeamGoogle2026)',
      scheduleOrSource: 'Poster Informasi & QR Code Rekrutmen',
      summary:
        'Kurasi dua materi publikasi rekrutmen Google Student Ambassador 2026 ("Kami mencari si paling AI") lengkap dengan poster QR pendaftaran.',
      primaryUrl: VERIFIED_URLS.elitionGooglePoster,
      primaryLabel: 'Poster Utama',
      secondaryUrl: VERIFIED_URLS.elitionGoogleQrPoster,
      secondaryLabel: 'Poster QR Code',
    },
    {
      id: 'elition-cak-ning-surabaya',
      index: '05',
      group: 'publikasi',
      category: 'Duta Wisata',
      title: 'Pemilihan Duta Wisata Cak & Ning Surabaya 2026',
      scheduleOrSource: '6 Juli – 12 September 2026 · Adhigana Manggala',
      summary:
        'Penyebaran informasi persyaratan, lini masa seleksi (Technical Meeting hingga Grand Final 10 Oktober 2026), dan pendaftaran Cak & Ning Surabaya.',
      primaryUrl: VERIFIED_URLS.elitionCakNingPoster,
      primaryLabel: 'Lihat Poster',
    },
  ] satisfies ElitionDeliverable[],
};
