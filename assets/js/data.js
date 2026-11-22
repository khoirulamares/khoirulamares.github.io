/* ==========================================================================
   DATA PUBLIC TRAINING · MBV Training & Consulting
   Seluruh kelas Public Training diambil dari rancangan kelas Lesatra
   (judul, deskripsi, materi, jadwal, harga, testimoni). Semua halaman
   Public Training membaca dari file ini.
   ========================================================================== */

/* Harga promo untuk semua kelas (harga coret memakai `price` tiap kelas).
   Isi 0 jika ingin memakai harga `sale` masing masing kelas. */
const PROMO_PRICE = 99000;

const CATEGORIES = [
  {
    "id": "ai",
    "name": "AI Productivity",
    "desc": "ChatGPT, Claude & Gemini untuk kerja",
    "icon": "spark",
    "t1": "#13214E",
    "t2": "#3A4F96"
  },
  {
    "id": "automation",
    "name": "AI Automation & Agent",
    "desc": "n8n, bot, RAG & workflow otomatis",
    "icon": "zap",
    "t1": "#1C1650",
    "t2": "#4B3BB0"
  },
  {
    "id": "data",
    "name": "Data Analytics & BI",
    "desc": "Excel, SQL, Python & dashboard",
    "icon": "chart",
    "t1": "#0F4C6B",
    "t2": "#13214E"
  },
  {
    "id": "engineering",
    "name": "Data Engineering",
    "desc": "ETL, pipeline & data warehouse",
    "icon": "database",
    "t1": "#0B1638",
    "t2": "#1F3170"
  },
  {
    "id": "business",
    "name": "Bisnis, Marketing & HR",
    "desc": "Analitik untuk fungsi bisnis",
    "icon": "briefcase",
    "t1": "#EF6E25",
    "t2": "#B8410A"
  },
  {
    "id": "web",
    "name": "Web & Vibe Coding",
    "desc": "Bangun web dengan bantuan AI",
    "icon": "code",
    "t1": "#0E1A40",
    "t2": "#0F6B6B"
  }
];

/* Benefit yang didapat setiap peserta */
const BENEFITS = [
  ["video", "Live class interaktif via Zoom"],
  ["clipboard", "Studi kasus & praktik langsung"],
  ["download", "Rekaman & modul kelas"],
  ["users", "Grup WhatsApp kelas untuk koordinasi & diskusi"],
  ["award", "E-Certificate"],
];

/* Ketentuan kelas */
const COMMON_NOTES = [
  "Setelah pembayaran, Anda mendapat link grup WhatsApp kelas. Semua koordinasi seperti link Zoom, materi, rekaman, dan pengumuman dibagikan di grup tersebut.",
  "Rekaman dan modul kelas dibagikan di grup WhatsApp maksimal 1×24 jam setelah sesi selesai.",
  "E-Certificate diterbitkan setelah peserta hadir minimal 80% sesi dan mengisi formulir feedback.",
  "Tempat Anda diamankan setelah pembayaran terverifikasi. Kuota kelas terbatas agar interaksi tetap optimal.",
  "Dapat dijadwalkan ulang (reschedule) ke batch berikutnya maksimal 3 hari sebelum kelas dimulai.",
];

const COMMON_FAQ = [
  { q: "Apakah kelas ini cocok untuk pemula?", a: "Level setiap kelas tercantum di halaman ini. Materi disusun bertahap dari dasar hingga praktik, dan Anda bisa bertanya langsung saat sesi live maupun di grup WhatsApp kelas." },
  { q: "Bagaimana jika saya berhalangan hadir saat live class?", a: "Semua sesi direkam dan rekamannya dibagikan di grup WhatsApp kelas. Untuk E-Certificate, kehadiran minimal 80% tetap diperlukan." },
  { q: "Apakah bisa mendaftar untuk tim atau perusahaan?", a: "Bisa. Pilih \"Tim / Kolektif\" di halaman pendaftaran. Ada potongan otomatis 5% untuk 3 sampai 4 peserta dan 10% untuk 5 peserta atau lebih. Tersedia juga pembayaran tempo (invoice) untuk perusahaan/instansi." },
  { q: "Metode pembayaran apa saja yang tersedia?", a: "QRIS, Virtual Account (BCA, Mandiri, BNI, BRI, BSI, Permata), e-wallet (GoPay, OVO, DANA, ShopeePay), serta pembayaran tempo untuk perusahaan." },
  { q: "Bagaimana kebijakan refund?", a: "Refund 100% dapat diajukan maksimal 7 hari sebelum kelas dimulai, atau jika kelas dibatalkan oleh MBV. Setelah itu, Anda tetap bisa reschedule ke batch berikutnya." },
];

const _EN = typeof MBV_LANG !== "undefined" && MBV_LANG === "en";
const _D = _EN ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const _M = _EN ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const _MS = _EN ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/* Rentang tanggal tanpa tanda pisah: "5 & 6 Des 2026", "16 s.d. 24 Jan 2027" */
function dateRange(d, M) {
  const f = d[0], l = d[d.length - 1];
  const one = (x, withYear) => `${x.getUTCDate()} ${M[x.getUTCMonth()]}${withYear ? " " + x.getUTCFullYear() : ""}`;
  if (d.length === 1) return one(f, true);
  const sameMonth = f.getUTCMonth() === l.getUTCMonth() && f.getUTCFullYear() === l.getUTCFullYear();
  const join = d.length === 2 ? " & " : _EN ? " to " : " s.d. ";
  return sameMonth ? `${f.getUTCDate()}${join}${one(l, true)}` : `${one(f, f.getUTCFullYear() !== l.getUTCFullYear())}${join}${one(l, true)}`;
}

/* Link grup WhatsApp tiap kelas (diisi tim MBV), contoh:
   AIP: "https://chat.whatsapp.com/AbCdEf123456"
   Selama masih kosong, tombol "Gabung grup WhatsApp" mengarah ke WhatsApp admin
   dengan pesan berisi nomor pesanan peserta. */
const WA_GROUPS = {
  AIP: "", APA: "", CLB: "", WAA: "", AAO: "", SDO: "", RAG: "", N8N: "",
  DAL: "", ADB: "", SQP: "", DEC: "", PBI: "", KPF: "", CHA: "", ABT: "",
  SEN: "", DED: "", DSC: "", DMA: "", AMA: "", AHR: "", WVC: "",
};

function makeCourse(o) {
  const d = o.dates.map((s) => new Date(s + "T12:00:00Z"));
  const cat = CATEGORIES.find((c) => c.id === o.category);
  const [t1, t2] = o.time;
  return {
    ...o,
    cat: o.category,
    category: cat,
    glyph: o.icon || cat.icon,
    sale: PROMO_PRICE || o.sale,
    format: "online",
    location: "Live Online via Zoom",
    days: d.length,
    timeLabel: `${t1} ${_EN ? "to" : "s.d."} ${t2}`,
    durationLabel: `${d.length} ${_EN ? (d.length > 1 ? "sessions" : "session") : "sesi"} · ${t1} ${_EN ? "to" : "s.d."} ${t2} WIB`,
    dateShort: dateRange(d, _MS),
    dateLong: dateRange(d, _M),
    startISO: `${o.dates[0]}T${t1.replace(".", ":")}:00+07:00`,
    endISO: `${o.dates[0]}T${t2.replace(".", ":")}:00+07:00`,
    schedule: o.sessions.map((s, i) => ({ ...s, day: _D[d[i].getUTCDay()], dd: d[i].getUTCDate(), mm: _MS[d[i].getUTCMonth()] })),
    benefits: BENEFITS,
    waGroup: o.waGroup || WA_GROUPS[o.code] || "",
  };
}

const COURSES = [
 {
  "id": "ai-productivity",
  "code": "AIP",
  "batch": "Batch 5",
  "title": "AI Productivity untuk Profesional",
  "subtitle": "Kerja lebih cepat & cerdas dengan ChatGPT, Claude, dan Gemini, dari prompt dasar sampai workflow otomatis.",
  "category": "ai",
  "level": "Pemula hingga Menengah",
  "badge": "Terlaris",
  "participants": 1284,
  "interested": 96,
  "rating": 4.9,
  "reviews": 412,
  "quota": 60,
  "seatsTaken": 47,
  "icon": "spark",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2026-12-05",
   "2026-12-06"
  ],
  "outcomes": [
   {
    "t": "Menulis prompt yang konsisten & berkualitas",
    "d": "Kuasai framework prompt PERAN, KONTEKS, TUGAS, FORMAT agar output AI siap pakai untuk pekerjaan nyata."
   },
   {
    "t": "Memangkas waktu laporan, email, dan notulen hingga 70%",
    "d": "Praktik langsung membuat draf laporan, ringkasan rapat, dan korespondensi profesional dalam hitungan menit."
   },
   {
    "t": "Menganalisis dokumen & data tanpa rumus rumit",
    "d": "Unggah PDF, spreadsheet, atau transkrip, lalu minta AI merangkum dan menemukan insight penting."
   },
   {
    "t": "Memakai AI secara aman & etis di kantor",
    "d": "Pahami batasan, risiko kebocoran data, dan kebijakan penggunaan AI yang sehat untuk organisasi."
   }
  ],
  "sessions": [
   {
    "t": "Fondasi Prompting & Produktivitas Harian",
    "items": [
     "Peta tools AI: ChatGPT vs Claude vs Gemini",
     "Framework prompt PERAN, KONTEKS, TUGAS, FORMAT",
     "Workshop: email, laporan & notulen otomatis",
     "Teknik iterasi & quality control output AI"
    ]
   },
   {
    "t": "Analisis, Otomasi & Asisten AI Pribadi",
    "items": [
     "Analisis dokumen PDF & spreadsheet dengan AI",
     "Membuat presentasi dalam 15 menit",
     "Membangun asisten AI untuk pekerjaan Anda",
     "Etika & keamanan data di kantor"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT, Claude, dan Google (Gemini), versi gratis sudah cukup",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [
   {
    "q": "Langsung kepakai di kantor! Notulen rapat yang biasanya 1 jam sekarang 10 menit beres. Penjelasannya runtut dan contoh kasusnya relevan banget.",
    "n": "Anindya Putri",
    "r": "HR Business Partner",
    "i": "AP",
    "c": "p"
   },
   {
    "q": "Framework promptnya simpel tapi powerful. Saya sudah bikin asisten AI untuk tim sales dan semua jadi lebih cepat bikin proposal.",
    "n": "Bagus Wicaksono",
    "r": "Sales Manager",
    "i": "BW",
    "c": "t"
   },
   {
    "q": "Sesi tanya jawabnya hidup. Grup WhatsApp setelah kelas juga sangat membantu saat praktik sendiri.",
    "n": "Ratih Maharani",
    "r": "Staf Keuangan",
    "i": "RM",
    "c": "o"
   }
  ],
  "faq": [
   {
    "q": "Apakah perlu berlangganan ChatGPT Plus atau Claude Pro?",
    "a": "Tidak wajib. Semua praktik bisa dilakukan dengan versi gratis."
   }
  ],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "asisten-ai-pribadi",
  "code": "APA",
  "batch": "Perdana",
  "title": "Asisten AI Pribadi: Custom GPT, Gemini Gems, Claude Projects & Skills",
  "subtitle": "Bangun asisten AI yang paham SOP, gaya bahasa, dan konteks pekerjaan Anda, sekali setup, dipakai setiap hari.",
  "category": "ai",
  "level": "Pemula hingga Menengah",
  "badge": "Baru",
  "participants": 0,
  "interested": 88,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 26,
  "icon": "spark",
  "price": 399000,
  "sale": 279000,
  "dates": [
   "2026-12-08",
   "2026-12-09"
  ],
  "outcomes": [
   {
    "t": "Merancang asisten AI sesuai peran kerja",
    "d": "Tentukan tugas, instruksi, dan batasan agar asisten konsisten membantu pekerjaan Anda."
   },
   {
    "t": "Membuat Custom GPT, Gemini Gems & Claude Projects",
    "d": "Praktik langsung di tiga platform dan pahami kelebihan masing-masing."
   },
   {
    "t": "Mengisi knowledge base dengan dokumen kerja",
    "d": "Unggah SOP, template, dan referensi agar jawaban AI relevan dengan konteks kantor Anda."
   },
   {
    "t": "Memakai Claude Skills untuk tugas berulang",
    "d": "Bungkus alur kerja rutin menjadi skill yang bisa dipanggil kapan saja."
   }
  ],
  "sessions": [
   {
    "t": "Desain Asisten & Custom GPT",
    "items": [
     "Anatomi asisten AI yang efektif",
     "Menulis instruksi sistem yang solid",
     "Build: Custom GPT untuk tugas harian Anda",
     "Knowledge base & uji kualitas jawaban"
    ]
   },
   {
    "t": "Gemini Gems, Claude Projects & Skills",
    "items": [
     "Membuat Gemini Gems untuk tim",
     "Claude Projects dengan dokumen kerja",
     "Claude Skills untuk alur kerja berulang",
     "Tata kelola & keamanan data"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT, Claude, dan Google (Gemini), versi gratis sudah cukup",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "claude-bisnis",
  "code": "CLB",
  "batch": "Batch 4",
  "title": "Claude untuk Bisnis & Produktivitas Kerja",
  "subtitle": "Manfaatkan Claude untuk menulis, menganalisis, dan menyusun dokumen bisnis yang siap kirim.",
  "category": "ai",
  "level": "Pemula hingga Menengah",
  "badge": "Terlaris",
  "participants": 620,
  "interested": 74,
  "rating": 4.9,
  "reviews": 188,
  "quota": 50,
  "seatsTaken": 39,
  "icon": "spark",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2026-12-19",
   "2026-12-20"
  ],
  "outcomes": [
   {
    "t": "Menguasai fitur inti Claude untuk kerja",
    "d": "Projects, Artifacts, analisis file, dan riset, dipakai untuk kasus bisnis nyata."
   },
   {
    "t": "Menyusun dokumen bisnis berkualitas",
    "d": "Proposal, laporan, SOP, dan email profesional dengan struktur yang rapi."
   },
   {
    "t": "Menganalisis data & dokumen panjang",
    "d": "Ringkas kontrak, laporan keuangan, dan hasil survei dalam hitungan menit."
   },
   {
    "t": "Membangun alur kerja tim berbasis Claude",
    "d": "Standarisasi cara tim memakai AI agar hasilnya konsisten."
   }
  ],
  "sessions": [
   {
    "t": "Claude untuk Menulis & Dokumen Bisnis",
    "items": [
     "Mengenal Claude: model, fitur & batasan",
     "Prompting untuk dokumen bisnis",
     "Artifacts: deck, laporan & dokumen siap kirim",
     "Projects untuk konteks pekerjaan"
    ]
   },
   {
    "t": "Analisis & Alur Kerja Tim",
    "items": [
     "Analisis PDF, spreadsheet & data",
     "Riset & ringkasan dokumen panjang",
     "Template alur kerja tim",
     "Studi kasus & presentasi hasil"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT, Claude, dan Google (Gemini), versi gratis sudah cukup",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "workflow-ai-agent",
  "code": "WAA",
  "batch": "Perdana",
  "title": "Workflow AI Agent: Slide Deck & Dashboard dengan Claude Cowork & ChatGPT Work",
  "subtitle": "Delegasikan pekerjaan multi-langkah ke AI agent, dari data mentah menjadi deck dan dashboard siap presentasi.",
  "category": "ai",
  "level": "Pemula hingga Menengah",
  "badge": "Baru",
  "participants": 0,
  "interested": 102,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 21,
  "icon": "spark",
  "price": 499000,
  "sale": 349000,
  "dates": [
   "2027-01-09",
   "2027-01-10"
  ],
  "outcomes": [
   {
    "t": "Memahami cara kerja AI agent",
    "d": "Bedakan chatbot biasa dengan agent yang bisa merencanakan dan mengeksekusi tugas."
   },
   {
    "t": "Membuat slide deck otomatis dari data",
    "d": "Dari spreadsheet atau dokumen menjadi deck yang rapi dan konsisten."
   },
   {
    "t": "Membangun dashboard dengan bantuan agent",
    "d": "Minta agent mengolah data dan menyusun dashboard interaktif."
   },
   {
    "t": "Mendesain workflow agent yang andal",
    "d": "Instruksi, checkpoint, dan quality control agar hasil agent bisa dipercaya."
   }
  ],
  "sessions": [
   {
    "t": "AI Agent & Slide Deck Otomatis",
    "items": [
     "Konsep AI agent & use case kantor",
     "Claude Cowork vs ChatGPT Work",
     "Workflow: data → outline → slide deck",
     "Review & revisi hasil agent"
    ]
   },
   {
    "t": "Dashboard & Workflow Andal",
    "items": [
     "Workflow: data mentah → dashboard",
     "Instruksi multi-langkah yang solid",
     "Checkpoint & quality control",
     "Studi kasus laporan bulanan"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT, Claude, dan Google (Gemini), versi gratis sudah cukup",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "13.00",
   "16.00"
  ]
 },
 {
  "id": "ai-automation-office",
  "code": "AAO",
  "batch": "Batch 2",
  "title": "AI Automation for Office: Kerja Seharian Jadi 10 Menit",
  "subtitle": "Otomatiskan pekerjaan kantor yang berulang seperti rekap data, email, dan laporan dengan AI dan tools no-code.",
  "category": "automation",
  "level": "Pemula hingga Menengah",
  "badge": "Sedang Diminati",
  "participants": 310,
  "interested": 91,
  "rating": 4.9,
  "reviews": 96,
  "quota": 50,
  "seatsTaken": 41,
  "icon": "zap",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2026-12-19",
   "2026-12-20"
  ],
  "outcomes": [
   {
    "t": "Memetakan pekerjaan yang bisa diotomasi",
    "d": "Identifikasi tugas berulang yang paling banyak menyita waktu."
   },
   {
    "t": "Mengotomasi rekap data & laporan",
    "d": "Gabungkan data dari form, email, dan spreadsheet secara otomatis."
   },
   {
    "t": "Membuat email & dokumen otomatis",
    "d": "Template + AI untuk surat, notifikasi, dan laporan rutin."
   },
   {
    "t": "Menjalankan otomasi tanpa coding",
    "d": "Gunakan Apps Script dengan bantuan AI dan tools no-code."
   }
  ],
  "sessions": [
   {
    "t": "Peta Otomasi & Rekap Data",
    "items": [
     "Audit pekerjaan berulang",
     "Google Sheets + AI untuk rekap otomatis",
     "Form → Sheets → laporan",
     "Apps Script dibuatkan AI"
    ]
   },
   {
    "t": "Email, Dokumen & Jadwal Otomatis",
    "items": [
     "Mail merge & email otomatis",
     "Generate dokumen dari template",
     "Trigger & penjadwalan",
     "Studi kasus: laporan mingguan otomatis"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Google (Google Sheets & Drive)",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "13.00",
   "16.00"
  ]
 },
 {
  "id": "sistem-data-otomatis",
  "code": "SDO",
  "batch": "Perdana",
  "title": "Bangun Sistem Data Otomatis: Python, Google Sheets & Telegram Bot dengan AI",
  "subtitle": "Rakit sistem yang mengambil data, mengolahnya, dan mengirim laporan otomatis ke Telegram, dibantu AI.",
  "category": "automation",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 77,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 19,
  "icon": "bot",
  "price": 499000,
  "sale": 349000,
  "dates": [
   "2027-01-09",
   "2027-01-10"
  ],
  "outcomes": [
   {
    "t": "Menulis skrip Python dengan bantuan AI",
    "d": "Tidak perlu jago coding, AI membantu menulis dan memperbaiki kode."
   },
   {
    "t": "Menghubungkan Python dengan Google Sheets",
    "d": "Baca, tulis, dan olah data spreadsheet secara otomatis."
   },
   {
    "t": "Membuat Telegram Bot untuk laporan",
    "d": "Kirim ringkasan dan notifikasi data langsung ke Telegram."
   },
   {
    "t": "Menjadwalkan sistem berjalan sendiri",
    "d": "Sistem berjalan otomatis setiap hari tanpa perlu dibuka."
   }
  ],
  "sessions": [
   {
    "t": "Python + Google Sheets dengan AI",
    "items": [
     "Setup Google Colab & API Sheets",
     "Prompting AI untuk menulis kode Python",
     "Ambil, bersihkan & olah data",
     "Tulis hasil kembali ke Sheets"
    ]
   },
   {
    "t": "Telegram Bot & Penjadwalan",
    "items": [
     "Membuat bot via BotFather",
     "Kirim laporan & grafik ke Telegram",
     "Ringkasan otomatis dengan AI",
     "Menjadwalkan sistem berjalan rutin"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Google (Google Sheets & Drive)",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "rag-chatbot",
  "code": "RAG",
  "batch": "Perdana",
  "title": "Chat with Your Data: RAG Chatbot untuk Ringkasan & Insight Data Bisnis",
  "subtitle": "Bangun chatbot yang menjawab pertanyaan dari dokumen dan data perusahaan Anda, akurat dan bisa ditelusuri.",
  "category": "automation",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 69,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 14,
  "icon": "message",
  "price": 549000,
  "sale": 379000,
  "dates": [
   "2027-01-30",
   "2027-01-31"
  ],
  "outcomes": [
   {
    "t": "Memahami konsep RAG secara praktis",
    "d": "Embedding, vector store, dan retrieval dijelaskan dengan bahasa sederhana."
   },
   {
    "t": "Menyiapkan dokumen & data bisnis",
    "d": "Chunking dan pembersihan dokumen agar jawaban chatbot akurat."
   },
   {
    "t": "Membangun chatbot tanya-jawab data",
    "d": "Chatbot yang merangkum laporan dan menjawab pertanyaan bisnis."
   },
   {
    "t": "Mengevaluasi kualitas jawaban",
    "d": "Uji akurasi, kutip sumber, dan kurangi halusinasi."
   }
  ],
  "sessions": [
   {
    "t": "Konsep RAG & Persiapan Data",
    "items": [
     "Kapan butuh RAG vs prompt biasa",
     "Embedding & vector database",
     "Menyiapkan PDF, spreadsheet & laporan",
     "Build: pipeline RAG pertama"
    ]
   },
   {
    "t": "Chatbot Insight & Evaluasi",
    "items": [
     "Prompt untuk ringkasan & insight",
     "Antarmuka chatbot sederhana",
     "Kutip sumber & kurangi halusinasi",
     "Studi kasus: chatbot laporan penjualan"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Google (Google Sheets & Drive)",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "n8n-ai-agent",
  "code": "N8N",
  "batch": "Perdana",
  "title": "n8n dan AI Integration untuk Smart Workflow & AI Agent",
  "subtitle": "Rancang workflow otomatis dan AI agent dengan n8n, menghubungkan email, spreadsheet, chat, dan AI.",
  "category": "automation",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 84,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 17,
  "icon": "zap",
  "price": 499000,
  "sale": 349000,
  "dates": [
   "2027-02-06",
   "2027-02-07"
  ],
  "outcomes": [
   {
    "t": "Menguasai dasar n8n",
    "d": "Node, trigger, dan credential untuk membangun workflow dari nol."
   },
   {
    "t": "Mengintegrasikan AI ke workflow",
    "d": "Klasifikasi, ringkasan, dan balasan otomatis dengan LLM."
   },
   {
    "t": "Membangun AI agent dengan tools",
    "d": "Agent yang bisa mencari data, mengisi sheet, dan mengirim pesan."
   },
   {
    "t": "Menjalankan workflow dengan andal",
    "d": "Error handling, logging, dan praktik terbaik produksi."
   }
  ],
  "sessions": [
   {
    "t": "Fondasi n8n & Workflow Otomatis",
    "items": [
     "Setup n8n (cloud / self-host)",
     "Trigger, node & data mapping",
     "Integrasi Gmail, Sheets & Telegram",
     "Build: workflow lead otomatis"
    ]
   },
   {
    "t": "AI Integration & AI Agent",
    "items": [
     "Node AI: klasifikasi & ringkasan",
     "AI agent dengan tools & memory",
     "Error handling & monitoring",
     "Studi kasus: customer service agent"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Google (Google Sheets & Drive)",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "data-analytics",
  "code": "DAL",
  "batch": "Batch 2",
  "title": "Data Analytics: Excel, SQL & Looker Studio",
  "subtitle": "Olah data mentah menjadi dashboard interaktif dan insight bisnis yang siap dipresentasikan.",
  "category": "data",
  "level": "Pemula",
  "badge": "Sedang Diminati",
  "participants": 240,
  "interested": 134,
  "rating": 4.9,
  "reviews": 71,
  "quota": 40,
  "seatsTaken": 22,
  "icon": "chart",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2026-12-08",
   "2026-12-09",
   "2026-12-10"
  ],
  "outcomes": [
   {
    "t": "Membersihkan & menyiapkan data dengan cepat",
    "d": "Power Query, lookup, pivot, dan validasi data di Excel/Google Sheets."
   },
   {
    "t": "Menulis query SQL untuk pertanyaan bisnis",
    "d": "SELECT, JOIN, dan GROUP BY dengan praktik langsung memakai dataset nyata."
   },
   {
    "t": "Membangun dashboard di Looker Studio",
    "d": "KPI, filter, dan visual yang mudah dipahami pimpinan."
   },
   {
    "t": "Menyampaikan insight dengan data storytelling",
    "d": "Susun temuan data menjadi rekomendasi yang meyakinkan."
   }
  ],
  "sessions": [
   {
    "t": "Data Preparation dengan Spreadsheet",
    "items": [
     "Alur kerja data analyst",
     "Data cleaning & Power Query",
     "Pivot table & analisis eksploratif"
    ]
   },
   {
    "t": "SQL untuk Analisis Bisnis",
    "items": [
     "Query dasar hingga JOIN antar tabel",
     "Agregasi & metrik bisnis",
     "Studi kasus: analisis penjualan"
    ]
   },
   {
    "t": "Dashboard & Data Storytelling",
    "items": [
     "Membangun dashboard Looker Studio",
     "Data storytelling & rekomendasi",
     "Presentasi proyek akhir"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [
   {
    "q": "Cara penjelasan SQL-nya bikin yang awam pun paham. Langsung bisa bikin query untuk laporan kantor.",
    "n": "Laras Wulandari",
    "r": "Admin Operasional",
    "i": "LW",
    "c": "o"
   },
   {
    "q": "Dashboard yang dicontohkan persis kebutuhan kantor saya. Sekarang laporan mingguan jauh lebih cepat.",
    "n": "Hendra Saputra",
    "r": "Supervisor Gudang",
    "i": "HS",
    "c": "t"
   },
   {
    "q": "Step-by-step dan banyak contoh kasus riil. Cocok untuk yang mau switch career ke data.",
    "n": "Citra Lestari",
    "r": "Fresh Graduate",
    "i": "CL",
    "c": "p"
   }
  ],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "ai-data-analyst-bootcamp",
  "code": "ADB",
  "batch": "Perdana",
  "title": "AI Data Analyst Bootcamp: Dari Data Mentah ke Keputusan Bisnis",
  "subtitle": "Bootcamp intensif 4 sesi: kuasai alur kerja data analyst modern yang dipercepat dengan AI.",
  "category": "data",
  "level": "Pemula hingga Menengah",
  "badge": "Bootcamp",
  "participants": 0,
  "interested": 142,
  "rating": 4.9,
  "reviews": 0,
  "quota": 40,
  "seatsTaken": 24,
  "icon": "chart",
  "price": 1290000,
  "sale": 849000,
  "dates": [
   "2027-01-16",
   "2027-01-17",
   "2027-01-23",
   "2027-01-24"
  ],
  "outcomes": [
   {
    "t": "Menguasai alur kerja data analyst end-to-end",
    "d": "Dari pertanyaan bisnis, pengolahan data, analisis, hingga rekomendasi."
   },
   {
    "t": "Mempercepat analisis dengan AI",
    "d": "Gunakan AI untuk cleaning, query, analisis, dan visualisasi."
   },
   {
    "t": "Membangun dashboard & laporan insight",
    "d": "Dashboard interaktif dan laporan yang siap dipresentasikan."
   },
   {
    "t": "Menyelesaikan proyek portofolio",
    "d": "Satu proyek analisis lengkap untuk CV dan LinkedIn."
   }
  ],
  "sessions": [
   {
    "t": "Berpikir Seperti Data Analyst",
    "items": [
     "Framework pertanyaan bisnis",
     "Mengenal jenis data & metrik",
     "AI sebagai asisten analisis",
     "Data cleaning dengan AI"
    ]
   },
   {
    "t": "Analisis dengan Spreadsheet & SQL + AI",
    "items": [
     "Pivot & analisis eksploratif",
     "SQL dibantu AI",
     "Validasi hasil analisis",
     "Studi kasus penjualan"
    ]
   },
   {
    "t": "Visualisasi & Dashboard",
    "items": [
     "Memilih grafik yang tepat",
     "Dashboard di Looker Studio",
     "KPI & filter interaktif",
     "Review dashboard"
    ]
   },
   {
    "t": "Insight, Storytelling & Proyek Akhir",
    "items": [
     "Menyusun insight & rekomendasi",
     "Data storytelling untuk pimpinan",
     "Presentasi proyek akhir",
     "Feedback & langkah karier"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [
   {
    "q": "Apa bedanya bootcamp dengan kelas biasa?",
    "a": "Bootcamp berlangsung 4 sesi dengan proyek akhir yang direview, sehingga cocok untuk membangun portofolio."
   }
  ],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "sql-python",
  "code": "SQP",
  "batch": "Perdana",
  "title": "SQL & Python untuk Data Analisis",
  "subtitle": "Dua skill wajib data analyst dalam satu kelas: query database dan analisis data dengan Python.",
  "category": "data",
  "level": "Pemula",
  "badge": "",
  "participants": 0,
  "interested": 97,
  "rating": 4.9,
  "reviews": 0,
  "quota": 40,
  "seatsTaken": 16,
  "icon": "code",
  "price": 549000,
  "sale": 379000,
  "dates": [
   "2027-02-09",
   "2027-02-10",
   "2027-02-11"
  ],
  "outcomes": [
   {
    "t": "Menulis query SQL dengan percaya diri",
    "d": "Filter, JOIN, agregasi, dan subquery untuk pertanyaan bisnis."
   },
   {
    "t": "Menganalisis data dengan Python (pandas)",
    "d": "Membaca, membersihkan, dan merangkum data dengan pandas."
   },
   {
    "t": "Membuat visualisasi dengan Python",
    "d": "Grafik yang jelas dengan matplotlib/seaborn."
   },
   {
    "t": "Menggabungkan SQL & Python dalam satu alur",
    "d": "Ambil data dari database, analisis, lalu laporkan."
   }
  ],
  "sessions": [
   {
    "t": "SQL untuk Analisis",
    "items": [
     "SELECT, WHERE, ORDER BY",
     "JOIN antar tabel",
     "GROUP BY & agregasi",
     "Subquery & CTE dasar"
    ]
   },
   {
    "t": "Python & pandas",
    "items": [
     "Google Colab & dasar Python",
     "DataFrame: baca & bersihkan data",
     "Groupby, merge & pivot",
     "AI untuk membantu menulis kode"
    ]
   },
   {
    "t": "Visualisasi & Studi Kasus",
    "items": [
     "Visualisasi dengan matplotlib/seaborn",
     "SQL + Python dalam satu alur",
     "Studi kasus: analisis pelanggan",
     "Presentasi hasil"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "excel-claude",
  "code": "DEC",
  "batch": "Perdana",
  "title": "Data Analysis & Dashboard Excel dengan Claude",
  "subtitle": "Analisis data dan bangun dashboard Excel lebih cepat, rumus, pivot, dan insight dibantu Claude.",
  "category": "data",
  "level": "Pemula",
  "badge": "Baru",
  "participants": 0,
  "interested": 118,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 29,
  "icon": "chart",
  "price": 399000,
  "sale": 279000,
  "dates": [
   "2027-01-05",
   "2027-01-06"
  ],
  "outcomes": [
   {
    "t": "Membuat rumus Excel kompleks dengan AI",
    "d": "XLOOKUP, IF bertingkat, dan rumus dinamis dibuatkan dan dijelaskan Claude."
   },
   {
    "t": "Membersihkan & merapikan data",
    "d": "Power Query dan teknik cleaning yang dipandu AI."
   },
   {
    "t": "Membangun dashboard Excel interaktif",
    "d": "Pivot chart, slicer, dan layout dashboard yang profesional."
   },
   {
    "t": "Menghasilkan insight dari data",
    "d": "Minta Claude membaca pola dan menyusun ringkasan temuan."
   }
  ],
  "sessions": [
   {
    "t": "Analisis Data Excel bersama Claude",
    "items": [
     "Workflow Excel + Claude",
     "Rumus kompleks dengan bantuan AI",
     "Data cleaning & Power Query",
     "Pivot table untuk analisis"
    ]
   },
   {
    "t": "Dashboard & Insight",
    "items": [
     "Desain dashboard Excel",
     "Pivot chart & slicer",
     "Insight & ringkasan otomatis",
     "Studi kasus laporan penjualan"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "power-bi",
  "code": "PBI",
  "batch": "Perdana",
  "title": "Membangun Data Dashboard dengan Power BI",
  "subtitle": "Dari data mentah ke dashboard Power BI yang interaktif, rapi, dan siap dipakai manajemen.",
  "category": "data",
  "level": "Pemula",
  "badge": "",
  "participants": 0,
  "interested": 105,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 20,
  "icon": "chart",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2027-02-20",
   "2027-02-21"
  ],
  "outcomes": [
   {
    "t": "Mengimpor & mentransformasi data",
    "d": "Power Query untuk menyiapkan data dari berbagai sumber."
   },
   {
    "t": "Membangun data model yang benar",
    "d": "Relasi tabel dan struktur star schema sederhana."
   },
   {
    "t": "Menulis DAX dasar",
    "d": "Measure untuk KPI seperti penjualan, growth, dan target."
   },
   {
    "t": "Mendesain dashboard yang informatif",
    "d": "Layout, visual, dan interaksi yang mudah dipahami."
   }
  ],
  "sessions": [
   {
    "t": "Data Preparation & Modeling",
    "items": [
     "Mengenal Power BI Desktop",
     "Power Query: transformasi data",
     "Relasi tabel & star schema",
     "DAX dasar untuk KPI"
    ]
   },
   {
    "t": "Visualisasi & Dashboard",
    "items": [
     "Memilih visual yang tepat",
     "Slicer, drill-down & interaksi",
     "Desain layout dashboard",
     "Publish & berbagi laporan"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Power BI Desktop (gratis, khusus Windows)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "kpi-forecasting",
  "code": "KPF",
  "batch": "Perdana",
  "title": "KPI yang Bisa Memprediksi: Dashboard & Forecasting ML Sederhana",
  "subtitle": "Ubah dashboard yang hanya melihat ke belakang menjadi alat untuk memprediksi tren dan target.",
  "category": "data",
  "level": "Menengah",
  "badge": "",
  "participants": 0,
  "interested": 63,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 12,
  "icon": "chart",
  "price": 499000,
  "sale": 349000,
  "dates": [
   "2027-02-02",
   "2027-02-03"
  ],
  "outcomes": [
   {
    "t": "Merancang KPI leading & lagging",
    "d": "Pilih indikator yang benar-benar bisa memprediksi hasil."
   },
   {
    "t": "Membuat forecasting sederhana",
    "d": "Moving average, regresi, dan model time series dasar."
   },
   {
    "t": "Menampilkan prediksi di dashboard",
    "d": "Gabungkan data aktual dan proyeksi dalam satu tampilan."
   },
   {
    "t": "Menjelaskan prediksi ke manajemen",
    "d": "Komunikasikan ketidakpastian dan asumsi dengan jelas."
   }
  ],
  "sessions": [
   {
    "t": "Desain KPI & Dasar Forecasting",
    "items": [
     "KPI leading vs lagging",
     "Pola tren & musiman",
     "Forecast dengan spreadsheet",
     "Evaluasi akurasi prediksi"
    ]
   },
   {
    "t": "ML Sederhana & Dashboard Prediktif",
    "items": [
     "Regresi & time series dengan AI",
     "Dashboard aktual vs proyeksi",
     "Skenario & what-if analysis",
     "Studi kasus target penjualan"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "cohort-analysis",
  "code": "CHA",
  "batch": "Perdana",
  "title": "Cohort Analysis: Ukur Retensi Pelanggan",
  "subtitle": "Pahami berapa lama pelanggan bertahan dan kapan mereka pergi, dalam satu sesi praktik.",
  "category": "data",
  "level": "Menengah",
  "badge": "",
  "participants": 0,
  "interested": 58,
  "rating": 4.9,
  "reviews": 0,
  "quota": 40,
  "seatsTaken": 15,
  "icon": "chart",
  "price": 249000,
  "sale": 179000,
  "dates": [
   "2026-12-17"
  ],
  "outcomes": [
   {
    "t": "Memahami konsep cohort & retensi",
    "d": "Kenapa rata-rata saja menyesatkan dan bagaimana cohort membantu."
   },
   {
    "t": "Membangun tabel cohort",
    "d": "Dari data transaksi menjadi tabel retensi bulanan."
   },
   {
    "t": "Membaca pola churn",
    "d": "Temukan titik kritis pelanggan berhenti membeli."
   },
   {
    "t": "Menyusun rekomendasi retensi",
    "d": "Ubah temuan cohort menjadi aksi bisnis."
   }
  ],
  "sessions": [
   {
    "t": "Cohort Analysis dari Nol",
    "items": [
     "Konsep cohort, retensi & churn",
     "Menyiapkan data transaksi",
     "Membangun tabel & heatmap cohort",
     "Insight & rekomendasi retensi"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "ab-testing",
  "code": "ABT",
  "batch": "Perdana",
  "title": "A/B Testing dalam Bisnis: Validasi Fitur dan Kampanye",
  "subtitle": "Ambil keputusan berdasarkan bukti, rancang, jalankan, dan baca hasil A/B test dengan benar.",
  "category": "data",
  "level": "Menengah",
  "badge": "",
  "participants": 0,
  "interested": 54,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 11,
  "icon": "target",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2027-02-16",
   "2027-02-17"
  ],
  "outcomes": [
   {
    "t": "Merancang eksperimen yang valid",
    "d": "Hipotesis, metrik, dan pembagian kelompok yang benar."
   },
   {
    "t": "Menghitung ukuran sampel",
    "d": "Berapa lama dan berapa banyak data yang dibutuhkan."
   },
   {
    "t": "Membaca hasil secara statistik",
    "d": "Signifikansi, confidence interval, dan jebakan umum."
   },
   {
    "t": "Mengambil keputusan dari hasil test",
    "d": "Kapan rollout, kapan ulangi, kapan hentikan."
   }
  ],
  "sessions": [
   {
    "t": "Desain Eksperimen",
    "items": [
     "Hipotesis & metrik utama",
     "Randomisasi & kelompok kontrol",
     "Menghitung ukuran sampel",
     "Studi kasus: landing page"
    ]
   },
   {
    "t": "Analisis & Keputusan",
    "items": [
     "Uji signifikansi dengan spreadsheet",
     "Confidence interval",
     "Jebakan: peeking & bias",
     "Studi kasus: kampanye email"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "analisis-sentimen",
  "code": "SEN",
  "batch": "Perdana",
  "title": "Analisis Sentimen dengan AI: Ulasan Marketplace & Media Sosial",
  "subtitle": "Olah ribuan ulasan dan komentar menjadi insight tentang apa yang disukai dan dikeluhkan pelanggan.",
  "category": "data",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 72,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 13,
  "icon": "message",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2027-02-13",
   "2027-02-14"
  ],
  "outcomes": [
   {
    "t": "Mengumpulkan data ulasan & komentar",
    "d": "Siapkan data dari marketplace dan media sosial secara etis."
   },
   {
    "t": "Mengklasifikasi sentimen dengan AI",
    "d": "Positif, negatif, dan netral, lengkap dengan topik keluhan utama."
   },
   {
    "t": "Menemukan tema & pola keluhan",
    "d": "Kelompokkan masukan pelanggan menjadi isu yang bisa ditindaklanjuti."
   },
   {
    "t": "Menyajikan insight dalam dashboard",
    "d": "Ringkasan sentimen yang mudah dibaca tim produk & marketing."
   }
  ],
  "sessions": [
   {
    "t": "Data Ulasan & Klasifikasi Sentimen",
    "items": [
     "Sumber data & etika pengambilan data",
     "Cleaning teks bahasa Indonesia",
     "Klasifikasi sentimen dengan LLM",
     "Validasi akurasi hasil"
    ]
   },
   {
    "t": "Topik, Insight & Dashboard",
    "items": [
     "Ekstraksi topik & keluhan utama",
     "Analisis per produk / periode",
     "Dashboard sentimen",
     "Studi kasus brand lokal"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Microsoft Excel 2016+ atau Google Sheets",
   "Akun Google (untuk Looker Studio / Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "data-engineering-dasar",
  "code": "DED",
  "batch": "Perdana",
  "title": "Data Engineering Dasar: Pipeline ETL & Data Warehouse",
  "subtitle": "Pahami cara data mengalir dari sumber ke data warehouse, dan bangun pipeline ETL pertama Anda.",
  "category": "engineering",
  "level": "Menengah",
  "badge": "",
  "participants": 0,
  "interested": 66,
  "rating": 4.9,
  "reviews": 0,
  "quota": 40,
  "seatsTaken": 10,
  "icon": "database",
  "price": 599000,
  "sale": 399000,
  "dates": [
   "2027-01-26",
   "2027-01-27",
   "2027-01-28"
  ],
  "outcomes": [
   {
    "t": "Memahami arsitektur data modern",
    "d": "Sumber data, pipeline, warehouse, dan BI dalam satu gambaran."
   },
   {
    "t": "Membangun pipeline ETL dengan Python",
    "d": "Extract, transform, load dari API/file ke database."
   },
   {
    "t": "Merancang data warehouse sederhana",
    "d": "Star schema, fact & dimension table."
   },
   {
    "t": "Menjadwalkan & memonitor pipeline",
    "d": "Otomatisasi pipeline agar data selalu up to date."
   }
  ],
  "sessions": [
   {
    "t": "Arsitektur Data & Konsep ETL",
    "items": [
     "Peran data engineer",
     "Batch vs streaming",
     "ETL vs ELT",
     "Mengenal BigQuery"
    ]
   },
   {
    "t": "Membangun Pipeline ETL",
    "items": [
     "Extract dari API & file",
     "Transform dengan pandas",
     "Load ke BigQuery",
     "Validasi kualitas data"
    ]
   },
   {
    "t": "Data Warehouse & Penjadwalan",
    "items": [
     "Star schema: fact & dimension",
     "Modeling data penjualan",
     "Penjadwalan pipeline",
     "Studi kasus end-to-end"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Google (Colab & BigQuery Sandbox)",
   "Python 3.10+ (opsional, bisa memakai Colab)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "data-storytelling",
  "code": "DSC",
  "batch": "Perdana",
  "title": "Data Storytelling for Corporate: Slide Lebih Sedikit, Pesan Lebih Jelas",
  "subtitle": "Sampaikan data dengan cerita yang membuat pimpinan cepat paham dan langsung mengambil keputusan.",
  "category": "business",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 81,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 25,
  "icon": "layers",
  "price": 399000,
  "sale": 279000,
  "dates": [
   "2026-12-15",
   "2026-12-16"
  ],
  "outcomes": [
   {
    "t": "Menyusun alur cerita dari data",
    "d": "Struktur pesan: konteks, temuan, implikasi, rekomendasi."
   },
   {
    "t": "Memilih visual yang tepat",
    "d": "Grafik yang menyampaikan pesan, bukan sekadar menampilkan angka."
   },
   {
    "t": "Membuat slide yang ringkas dan tajam",
    "d": "Prinsip satu slide satu pesan untuk presentasi korporat."
   },
   {
    "t": "Mempresentasikan dengan percaya diri",
    "d": "Menjawab pertanyaan dan mengarahkan diskusi ke keputusan."
   }
  ],
  "sessions": [
   {
    "t": "Cerita di Balik Data",
    "items": [
     "Kenapa presentasi data sering gagal",
     "Menentukan pesan utama",
     "Struktur cerita untuk pimpinan",
     "Workshop: dari laporan ke cerita"
    ]
   },
   {
    "t": "Visual & Slide yang Tajam",
    "items": [
     "Memilih & merapikan grafik",
     "Satu slide, satu pesan",
     "Membuat deck dengan bantuan AI",
     "Praktik presentasi & feedback"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Microsoft Excel atau Google Sheets",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "digital-marketing",
  "code": "DMA",
  "batch": "Batch 3",
  "title": "Digital Marketing & Ads Mastery",
  "subtitle": "Rancang funnel, konten, dan iklan Meta & TikTok yang menghasilkan penjualan, bukan sekadar likes.",
  "category": "business",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 846,
  "interested": 71,
  "rating": 4.9,
  "reviews": 268,
  "quota": 50,
  "seatsTaken": 31,
  "icon": "megaphone",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2026-12-12",
   "2026-12-13"
  ],
  "outcomes": [
   {
    "t": "Menyusun strategi funnel dari awareness sampai closing",
    "d": "Tentukan konten dan iklan yang tepat untuk setiap tahap."
   },
   {
    "t": "Membuat konten & kreatif iklan yang menjual",
    "d": "Formula hook, copywriting AIDA, dan template kreatif."
   },
   {
    "t": "Menjalankan iklan Meta & TikTok dengan benar",
    "d": "Setup akun, pixel, struktur kampanye, targeting, dan budget."
   },
   {
    "t": "Membaca metrik & mengoptimasi biaya iklan",
    "d": "CPM, CTR, CPC, CPA, dan ROAS, serta kapan harus scale up atau stop."
   }
  ],
  "sessions": [
   {
    "t": "Strategi, Funnel & Konten yang Menjual",
    "items": [
     "Riset audiens & positioning",
     "Funnel TOFU, MOFU, BOFU",
     "Copywriting & hook 3 detik",
     "Content plan 30 hari dengan AI"
    ]
   },
   {
    "t": "Eksekusi Iklan Meta & TikTok",
    "items": [
     "Business Manager, Pixel & Events",
     "Struktur kampanye & budgeting",
     "Membaca metrik & A/B testing",
     "Optimasi & scaling"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Microsoft Excel atau Google Sheets",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [
   {
    "q": "Setelah kelas, CPA iklan toko online saya turun hampir setengahnya. Materi optimasinya daging semua!",
    "n": "Fajar Ramadhan",
    "r": "Owner Brand Fashion",
    "i": "FR",
    "c": "o"
   },
   {
    "q": "Akhirnya paham kenapa iklan saya dulu boros. Penjelasan funnel dan cara baca metriknya gampang dimengerti.",
    "n": "Sekar Ayuningtyas",
    "r": "Social Media Specialist",
    "i": "SA",
    "c": "t"
   },
   {
    "q": "Template content plan dan media plan-nya langsung saya pakai untuk klien agensi. Worth it banget.",
    "n": "Yoga Prasetyo",
    "r": "Digital Agency Founder",
    "i": "YP",
    "c": "p"
   }
  ],
  "faq": [],
  "time": [
   "09.00",
   "12.00"
  ]
 },
 {
  "id": "ai-marketing-analytics",
  "code": "AMA",
  "batch": "Perdana",
  "title": "AI Marketing Analytics: Iklan Lebih Hemat, Konversi Lebih Tinggi",
  "subtitle": "Gunakan data dan AI untuk menemukan iklan yang benar-benar menghasilkan, dan berhenti membakar budget.",
  "category": "business",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 79,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 18,
  "icon": "chart",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2027-01-12",
   "2027-01-13"
  ],
  "outcomes": [
   {
    "t": "Membaca metrik marketing yang penting",
    "d": "CAC, ROAS, LTV, dan conversion rate dalam satu kerangka."
   },
   {
    "t": "Menganalisis performa iklan dengan AI",
    "d": "Temukan kreatif, audiens, dan channel paling efisien."
   },
   {
    "t": "Membangun dashboard marketing",
    "d": "Satukan data Meta, Google, dan penjualan."
   },
   {
    "t": "Mengoptimasi budget berbasis data",
    "d": "Alokasikan ulang budget ke kampanye yang paling menguntungkan."
   }
  ],
  "sessions": [
   {
    "t": "Metrik & Analisis Iklan dengan AI",
    "items": [
     "Kerangka metrik funnel marketing",
     "Export data Meta & Google Ads",
     "Analisis kreatif & audiens dengan AI",
     "Menemukan kebocoran budget"
    ]
   },
   {
    "t": "Dashboard & Optimasi Budget",
    "items": [
     "Dashboard marketing terpadu",
     "Atribusi sederhana",
     "Simulasi alokasi budget",
     "Studi kasus e-commerce"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Microsoft Excel atau Google Sheets",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "ai-hr-people-analytics",
  "code": "AHR",
  "batch": "Perdana",
  "title": "AI for HR & People Analytics",
  "subtitle": "Manfaatkan AI dan data untuk rekrutmen, engagement, dan retensi karyawan yang lebih tepat sasaran.",
  "category": "business",
  "level": "Pemula hingga Menengah",
  "badge": "",
  "participants": 0,
  "interested": 68,
  "rating": 4.9,
  "reviews": 0,
  "quota": 50,
  "seatsTaken": 16,
  "icon": "users",
  "price": 449000,
  "sale": 299000,
  "dates": [
   "2027-01-19",
   "2027-01-20"
  ],
  "outcomes": [
   {
    "t": "Mempercepat pekerjaan HR dengan AI",
    "d": "Job description, screening CV, dan komunikasi karyawan."
   },
   {
    "t": "Mengukur metrik people analytics",
    "d": "Turnover, engagement, time-to-hire, dan produktivitas."
   },
   {
    "t": "Membangun dashboard HR",
    "d": "Pantau kondisi SDM dalam satu tampilan."
   },
   {
    "t": "Memakai AI secara etis di HR",
    "d": "Hindari bias dan jaga kerahasiaan data karyawan."
   }
  ],
  "sessions": [
   {
    "t": "AI untuk Pekerjaan HR",
    "items": [
     "Job description & iklan lowongan",
     "Screening CV dengan AI",
     "Survei & analisis engagement",
     "Etika & privasi data karyawan"
    ]
   },
   {
    "t": "People Analytics & Dashboard",
    "items": [
     "Metrik HR yang penting",
     "Analisis turnover & retensi",
     "Dashboard HR",
     "Studi kasus perusahaan menengah"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun ChatGPT atau Claude (versi gratis cukup)",
   "Microsoft Excel atau Google Sheets",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "19.00",
   "21.30"
  ]
 },
 {
  "id": "web-portofolio-vibe-coding",
  "code": "WVC",
  "batch": "Perdana",
  "title": "Web Portofolio dalam 2 Jam dengan Vibe Coding",
  "subtitle": "Tanpa latar belakang coding, bangun dan online-kan web portofolio pribadi Anda dengan bantuan AI.",
  "category": "web",
  "level": "Pemula",
  "badge": "Hampir Penuh",
  "participants": 410,
  "interested": 156,
  "rating": 4.9,
  "reviews": 133,
  "quota": 60,
  "seatsTaken": 54,
  "icon": "code",
  "price": 199000,
  "sale": 129000,
  "dates": [
   "2026-12-05"
  ],
  "outcomes": [
   {
    "t": "Memahami konsep vibe coding",
    "d": "Membangun web dengan mendeskripsikan keinginan ke AI."
   },
   {
    "t": "Membuat web portofolio pribadi",
    "d": "Halaman profil, proyek, dan kontak yang tampil profesional."
   },
   {
    "t": "Mengubah tampilan sesuai selera",
    "d": "Warna, font, dan layout diatur lewat percakapan dengan AI."
   },
   {
    "t": "Mempublikasikan web secara gratis",
    "d": "Online-kan web dengan GitHub Pages / hosting gratis."
   }
  ],
  "sessions": [
   {
    "t": "Bangun & Online-kan Web Portofolio",
    "items": [
     "Apa itu vibe coding",
     "Prompt untuk membuat web",
     "Kustomisasi tampilan & konten",
     "Publish ke internet secara gratis"
    ]
   }
  ],
  "tools": [
   "Laptop/PC (Windows atau macOS), tidak disarankan memakai HP",
   "Koneksi internet stabil minimal 10 Mbps",
   "Akun Claude atau ChatGPT",
   "Akun GitHub (gratis)",
   "Aplikasi Zoom versi terbaru"
  ],
  "testimonials": [],
  "faq": [],
  "time": [
   "13.00",
   "15.00"
  ]
 }
].map(makeCourse);

/* Metode pembayaran. fee: { flat, pct } */
const PAYMENT_METHODS = [
  { group: "Rekomendasi", items: [
    { id: "qris", name: "QRIS", label: "QRIS", color: "#121a4a", fee: { pct: 0.7 }, type: "qris", tag: "Semua e-wallet & m-banking" },
  ]},
  { group: "Virtual Account", items: [
    { id: "bca", name: "BCA Virtual Account", label: "BCA", color: "#0060AF", fee: { flat: 4000 }, type: "va", prefix: "39358" },
    { id: "mandiri", name: "Mandiri Virtual Account", label: "Mandiri", color: "#003D79", fee: { flat: 4000 }, type: "va", prefix: "89608" },
    { id: "bni", name: "BNI Virtual Account", label: "BNI", color: "#F15A23", fee: { flat: 4000 }, type: "va", prefix: "8808" },
    { id: "bri", name: "BRI Virtual Account", label: "BRI", color: "#00529C", fee: { flat: 4000 }, type: "va", prefix: "26215" },
    { id: "bsi", name: "BSI Virtual Account", label: "BSI", color: "#00A39D", fee: { flat: 4000 }, type: "va", prefix: "9009" },
    { id: "permata", name: "Permata Virtual Account", label: "Permata", color: "#1E8A3B", fee: { flat: 4000 }, type: "va", prefix: "8625" },
  ]},
  { group: "E-Wallet", items: [
    { id: "gopay", name: "GoPay", label: "GoPay", color: "#00AA13", fee: { pct: 2 }, type: "ewallet" },
    { id: "ovo", name: "OVO", label: "OVO", color: "#4C3494", fee: { pct: 1.5 }, type: "ewallet" },
    { id: "dana", name: "DANA", label: "DANA", color: "#118EEA", fee: { pct: 1.5 }, type: "ewallet" },
    { id: "shopeepay", name: "ShopeePay", label: "SPay", color: "#EE4D2D", fee: { pct: 2 }, type: "ewallet" },
  ]},
  { group: "Perusahaan / Instansi", items: [
    { id: "invoice", name: "Pembayaran Tempo (Invoice)", label: "B2B", color: "#293790", fee: { flat: 0 }, type: "invoice", tag: "NET 14 untuk PT/CV/Instansi" },
  ]},
];

/* Kode voucher */
const VOUCHERS = {
  MBV10: { type: "pct", value: 10, max: 50000, label: "Diskon 10% (maks. Rp50rb)" },
  HEMAT25: { type: "flat", value: 25000, label: "Potongan Rp25.000" },
  ALUMNI15: { type: "pct", value: 15, max: 75000, label: "Diskon alumni 15% (maks. Rp75rb)" },
};

/* Potongan pendaftaran kolektif (otomatis) */
const GROUP_DISCOUNTS = [
  { min: 5, pct: 10 },
  { min: 3, pct: 5 },
];
const MAX_PARTICIPANTS = 20;
