/* ==========================================================================
   SITE.JS — komponen bersama semua halaman MBV
   - Konfigurasi kontak perusahaan (ubah di satu tempat: SITE)
   - Ikon SVG (dipanggil lewat <i data-icon="nama"></i> atau icon("nama"))
   - Header, menu mobile, footer, tombol WhatsApp (disuntik otomatis)
   - Perilaku umum: accordion, tabs, reveal on scroll, marquee logo klien
   Cara pakai di halaman: <body data-page="home"> ... <div id="site-header"></div>
   ... <div id="site-footer"></div> lalu muat assets/js/site.js
   ========================================================================== */

const SITE = {
  company: "PT Meta Bright Vision",
  brand: "MBV Training & Consulting",
  tagline: "Excellence in Practical Learning",
  phone: "(021) 899 02406",
  phoneHref: "+622189902406",
  mobile: ["+62 852 1000 0389", "+62 821 1038 4458"],
  wa: "6285210000389",
  email: "admin@mbv.co.id",
  web: "www.mbv.co.id",
  address: "Cikarang Technopark Building, Jl. Inti I Blok C1 No. 7, Lippo Cikarang, Bekasi 17550, Jawa Barat",
  addressShort: "Cikarang Technopark, Lippo Cikarang, Bekasi",
  hours: "Senin – Jumat, 08.00 – 17.00 WIB",
  founded: 2011,
  // TODO: isi tautan media sosial resmi MBV. Ikon yang tautannya kosong tidak ditampilkan.
  social: { linkedin: "", instagram: "", youtube: "" },
};

/* ---------- Ikon (Lucide-style, stroke 2) ---------- */
const ICONS = {
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
  bank: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7"/><path d="m12 2 9 5H3z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
  trendingUp: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  spark: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
  handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  video: '<path d="m22 8-6 4 6 4V8z"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
  wifi: '<path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M2 8.82a15 15 0 0 1 20 0M12 20h.01"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
  trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  clipboard: '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sprout: '<path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
  grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>',
  youtube: '<path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
};
const FILLED = {
  whatsapp: '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/>',
  quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .01-1 1.03V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2.02-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
};
function icon(name, attrs = "") {
  if (FILLED[name]) return `<svg class="i fill" viewBox="0 0 24 24" aria-hidden="true" ${attrs}>${FILLED[name]}</svg>`;
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${attrs}>${ICONS[name] || ""}</svg>`;
}

/* ---------- Helper umum ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rupiah = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const waLink = (msg = "Halo MBV, saya ingin berkonsultasi mengenai program pelatihan.") => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;
const params = new URLSearchParams(location.search);
function toast(msg) {
  let t = $(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.innerHTML = `${icon("checkCircle")}<span>${esc(msg)}</span>`;
  t.classList.add("is-show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("is-show"), 2400);
}

/* ---------- Navigasi ---------- */
const NAV = [
  { label: "Home", href: "index.html", page: "home" },
  { label: "Company", page: "about", children: [
    { label: "About Us", href: "tentang.html", icon: "building" },
    { label: "Our Team", href: "tim.html", icon: "users" },
    { label: "Facility", href: "fasilitas.html", icon: "monitor" },
    { label: "Contact", href: "kontak.html", icon: "phone" },
  ]},
  { label: "Corporate Training", href: "corporate-training.html", page: "corporate" },
  { label: "Consulting & Advisory", href: "konsultasi.html", page: "consulting" },
  { label: "Public Training", href: "public-training.html", page: "public" },
  { label: "Article", href: "artikel.html", page: "article" },
  { label: "FAQ", href: "faq.html", page: "faq" },
];

function renderHeader() {
  const el = $("#site-header");
  if (!el) return;
  const current = document.body.dataset.page || "";
  const desktop = NAV.map((n) => {
    if (n.children) return `
      <li class="nav-item">
        <button class="nav-link ${n.page === current ? "is-current" : ""}" aria-haspopup="true" aria-expanded="false">${n.label} ${icon("chevronDown")}</button>
        <ul class="dropdown">${n.children.map((c) => `
          <li><a href="${c.href}"><span class="di">${icon(c.icon)}</span><b>${c.label}</b></a></li>`).join("")}
        </ul>
      </li>`;
    return `<li class="nav-item"><a class="nav-link ${n.page === current ? "is-current" : ""}" href="${n.href}">${n.label}</a></li>`;
  }).join("");

  const mobile = NAV.map((n) => n.children
    ? `<div class="drawer-group"><h6>${n.label}</h6>${n.children.map((c) => `<a href="${c.href}">${c.label} ${icon("chevronRight")}</a>`).join("")}</div>`
    : `<div class="drawer-group"><a href="${n.href}">${n.label} ${icon("chevronRight")}</a></div>`).join("");

  el.outerHTML = `
  <header class="site-header" id="siteHeader">
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="MBV Training & Consulting, Home"><img src="assets/img/logo-mbv.png" alt="MBV Training & Consulting" width="94" height="46"></a>
      <nav aria-label="Navigasi utama"><ul class="nav-menu">${desktop}</ul></nav>
      <div style="display:flex;gap:10px;align-items:center">
        ${langSwitch()}
        <a class="btn btn-primary nav-cta" href="kontak.html#form">Hubungi Kami ${icon("arrowRight")}</a>
        <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-controls="drawer" aria-expanded="false">${icon("menu")}</button>
      </div>
    </div>
  </header>
  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer-backdrop" data-close></div>
    <aside class="drawer-panel" role="dialog" aria-label="Menu">
      <div class="drawer-head"><img src="assets/img/logo-mbv.png" alt="MBV"><button class="nav-toggle" data-close aria-label="Tutup menu">${icon("x")}</button></div>
      ${mobile}
      <div class="drawer-foot">
        <a class="btn btn-primary btn-block" href="kontak.html#form">Hubungi Kami</a>
        <a class="btn btn-outline btn-block" href="${waLink()}" target="_blank" rel="noopener">${icon("whatsapp")} Chat WhatsApp</a>
      </div>
    </aside>
  </div>`;
}

function langSwitch() {
  const cur = typeof MBV_LANG !== "undefined" ? MBV_LANG : "id";
  return `<div class="lang-switch" role="group" aria-label="Language">${["id", "en"].map((l) =>
    `<button type="button" data-lang="${l}" class="${cur === l ? "is-active" : ""}" aria-pressed="${cur === l}" lang="${l}">${l.toUpperCase()}</button>`).join("")}</div>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-lang]");
  if (b && typeof setLang === "function" && b.dataset.lang !== MBV_LANG) setLang(b.dataset.lang);
});

function renderFooter() {
  const el = $("#site-footer");
  if (!el) return;
  const socials = Object.entries(SITE.social).filter(([, url]) => url)
    .map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}">${icon(k)}</a>`).join("");
  el.outerHTML = `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <img src="assets/img/logo-mbv-white.png" alt="MBV Training & Consulting" width="107" height="52">
        <p>Delivering Expert Education and Consulting Solutions for Banking, Finance, and Industrial Excellence.</p>
        ${socials ? `<div class="socials">${socials}</div>` : ""}
      </div>
      <div>
        <h5>Quick Links</h5>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="tentang.html">About Us</a></li>
          <li><a href="tim.html">Our Team</a></li>
          <li><a href="fasilitas.html">Facility</a></li>
          <li><a href="artikel.html">Articles</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="kontak.html">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h5>Our Program</h5>
        <ul class="footer-links">
          <li><a href="corporate-training.html">Corporate Training</a></li>
          <li><a href="konsultasi.html">Consulting & Advisory</a></li>
          <li><a href="public-training.html">Public Training</a></li>
          <li><a href="cek-pesanan.html">Cek Pesanan</a></li>
        </ul>
      </div>
      <div>
        <h5>Contact Us</h5>
        <ul class="footer-contact">
          <li>${icon("mapPin")}<span>${SITE.address}</span></li>
          <li>${icon("phone")}<span><a href="tel:${SITE.phoneHref}">${SITE.phone}</a><br>${SITE.mobile.join("<br>")}</span></li>
          <li>${icon("mail")}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>&copy; Copyright ${new Date().getFullYear()} <strong>mbv.co.id</strong> · ${SITE.company}. All Rights Reserved.</span>
        <span class="footer-legal"><span>NIB 1235000332126</span><span>${SITE.web}</span></span>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat WhatsApp MBV">${icon("whatsapp")}</a>`;
}

function initHeader() {
  const header = $("#siteHeader");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // Dropdown via klik/keyboard (hover sudah ditangani CSS)
  $$(".nav-item > button.nav-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement; const open = !item.classList.contains("is-open");
      $$(".nav-item.is-open").forEach((i) => { i.classList.remove("is-open"); i.firstElementChild.setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".nav-item")) $$(".nav-item.is-open").forEach((i) => i.classList.remove("is-open")); });

  const drawer = $("#drawer"), toggle = $("#navToggle");
  const setDrawer = (open) => {
    drawer.classList.toggle("is-open", open); drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("no-scroll", open);
  };
  toggle.addEventListener("click", () => setDrawer(true));
  $$("[data-close]", drawer).forEach((b) => b.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });
}

/* ---------- Komponen konten ---------- */
function hydrateIcons(root = document) {
  $$("[data-icon]", root).forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
}

function initAccordions(root = document) {
  $$(".acc-q", root).forEach((q) => {
    if (q._bound) return; q._bound = true;
    q.addEventListener("click", () => {
      const item = q.closest(".acc-item"); const open = !item.classList.contains("is-open");
      if (item.parentElement.dataset.single !== undefined) $$(".acc-item", item.parentElement).forEach((i) => { i.classList.remove("is-open"); $(".acc-q", i).setAttribute("aria-expanded", "false"); });
      item.classList.toggle("is-open", open); q.setAttribute("aria-expanded", String(open));
    });
  });
}

function initTabs(root = document) {
  $$("[data-tabs]", root).forEach((wrap) => {
    const btns = $$("[data-tab]", wrap);
    btns.forEach((b) => b.addEventListener("click", () => {
      btns.forEach((x) => { x.classList.toggle("is-active", x === b); x.setAttribute("aria-selected", String(x === b)); });
      $$(".tab-panel", wrap).forEach((p) => p.classList.toggle("is-active", p.id === b.dataset.tab));
    }));
  });
}

function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}

/* Logo klien — dipakai di beberapa halaman */
const CLIENTS = [
  ["bri", "Bank Rakyat Indonesia"], ["bsi", "Bank Syariah Indonesia"], ["bjb", "Bank BJB"], ["bank-jateng", "Bank Jateng"],
  ["bank-jatim", "Bank Jatim"], ["bank-kalsel", "Bank Kalsel"], ["bank-sultra", "Bank Sultra"], ["ojk", "Otoritas Jasa Keuangan"],
  ["pegadaian", "PT Pegadaian"], ["bri-finance", "BRI Finance"], ["brins", "BRI Insurance"], ["askrindo", "Askrindo Syariah"],
  ["jamkrindo", "Jamkrindo"], ["bpjs-kesehatan", "BPJS Kesehatan"], ["lpdb-kumkm", "LPDB KUMKM"], ["lpmukp", "LPMUKP KKP"],
  ["panasonic", "Panasonic"], ["jababeka", "Jababeka"], ["trimitra", "PT Trimitra Chitrahasta"], ["kospin-jasa", "Kospin Jasa"], ["prakerja", "Kartu Prakerja"],
];
function initClientLogos() {
  $$("[data-clients='marquee']").forEach((el) => {
    const imgs = CLIENTS.map(([f, n]) => `<img src="assets/img/clients/${f}.png" alt="${n}" loading="lazy">`).join("");
    el.innerHTML = `<div class="marquee-track">${imgs}${imgs.replace(/alt="/g, 'aria-hidden="true" alt="')}</div>`;
  });
  $$("[data-clients='grid']").forEach((el) => {
    el.innerHTML = CLIENTS.map(([f, n]) => `<div title="${n}"><img src="assets/img/clients/${f}.png" alt="${n}" loading="lazy"></div>`).join("")
      + `<div class="more">Bank Bukopin, Bank Nagari, Bank Sulselbar, Indofarma, Daikin, LPPI, Asbanda, BNF Timor Leste & lainnya</div>`;
  });
}

/* Foto yang gagal dimuat (mis. offline) → tampilkan inisial */
function initImgFallback() {
  $$("img[data-fallback]").forEach((img) => {
    const swap = () => { const d = document.createElement("div"); d.className = "ph"; d.textContent = img.dataset.fallback; img.replaceWith(d); };
    if (img.complete && img.naturalWidth === 0) swap(); else img.addEventListener("error", swap);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  hydrateIcons();
  initHeader();
  initAccordions();
  initTabs();
  initClientLogos();
  initImgFallback();
  initReveal();
});

/* Hero: kolase foto sedikit miring mengikuti kursor (desktop saja) */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const visual = hero && hero.querySelector(".hero-visual");
  if (!visual || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    visual.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translate3d(${x * 10}px, ${y * 10}px, 0)`;
  });
  hero.addEventListener("mouseleave", () => { visual.style.transform = ""; });
});
