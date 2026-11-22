/* ==========================================================================
   I18N.JS · dua bahasa (ID default, EN)
   - Dimuat di <head> setiap halaman, SEBELUM site.js / data.js / shop.js.
   - Teks Indonesia tetap ditulis langsung di HTML/JS. Saat mode EN aktif,
     teks yang cocok dengan kamus I18N_EN (assets/js/i18n-en.js) diganti otomatis,
     termasuk konten yang dibuat JavaScript (header, footer, checkout, dsb).
   - Teks yang tidak ada di kamus dibiarkan apa adanya. Ini disengaja untuk
     isi kelas Public Training (dibawakan dalam Bahasa Indonesia), nama orang,
     data legal, dan istilah teknis yang memang sudah berbahasa Inggris.
   - Pilihan bahasa disimpan di localStorage ("mbv_lang").
   Cara menambah terjemahan: tambahkan pasangan "teks Indonesia": "English"
   di assets/js/i18n-en.js. Untuk teks dengan angka/variabel, pakai I18N_PATTERNS.
   ========================================================================== */

const MBV_LANG = (() => {
  // 1) URL (?lang=) selalu menang, 2) pilihan tersimpan, 3) default Indonesia.
  // Akses localStorage dibungkus terpisah karena bisa diblokir browser.
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "id") {
    try { localStorage.setItem("mbv_lang", q); } catch {}
    return q;
  }
  try { return localStorage.getItem("mbv_lang") === "en" ? "en" : "id"; } catch { return "id"; }
})();
document.documentElement.lang = MBV_LANG;
if (MBV_LANG === "en") document.documentElement.classList.add("i18n-pending");

/* Ganti bahasa. Bahasa juga ditulis di URL (?lang=) supaya tetap berfungsi
   walau localStorage diblokir (mis. preview VS Code atau file dibuka langsung). */
function setLang(lang) {
  try { localStorage.setItem("mbv_lang", lang); } catch {}
  document.querySelectorAll("[data-lang]").forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
  // Simpan posisi scroll agar halaman tidak melompat setelah dimuat ulang
  try { sessionStorage.setItem("mbv_scroll", JSON.stringify({ path: location.pathname, y: window.scrollY })); } catch {}
  const u = new URL(location.href);
  u.searchParams.set("lang", lang);
  u.hash = ""; // buang #anchor (mis. #program) supaya tidak melompat ke section itu
  location.replace(u.toString());
}

/* Kembalikan posisi scroll setelah ganti bahasa */
(function restoreScroll() {
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem("mbv_scroll") || "null"); sessionStorage.removeItem("mbv_scroll"); } catch {}
  if (!saved || saved.path !== location.pathname) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const go = () => window.scrollTo({ top: saved.y, left: 0, behavior: "instant" });
  document.addEventListener("DOMContentLoaded", () => setTimeout(go, 0));
  window.addEventListener("load", go);
})();

/* Tambahkan ?lang=en ke URL internal saat mode EN aktif */
function withLang(url) {
  if (MBV_LANG !== "en" || !url) return url;
  if (/^(#|mailto:|tel:|javascript:|https?:\/\/(?!127\.0\.0\.1|localhost))/i.test(url)) return url;
  try {
    const u = new URL(url, location.href);
    if (u.origin !== location.origin && location.protocol !== "file:") return url;
    if (!/\.html?$/i.test(u.pathname)) return url;
    u.searchParams.set("lang", "en");
    return u.toString();
  } catch { return url; }
}
// Semua klik link internal membawa bahasa yang sedang aktif
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href]");
  if (!a || a.target === "_blank") return;
  const href = a.getAttribute("href");
  const next = withLang(href);
  if (next !== href) a.setAttribute("href", next);
}, true);

/* Terjemahan satu string (dipakai juga langsung dari JS: t("...")) */
const _norm = (s) => s.replace(/\s+/g, " ").trim();
function t(s) {
  if (MBV_LANG !== "en" || typeof s !== "string") return s;
  const key = _norm(s);
  if (!key) return s;
  const dict = window.I18N_EN || {};
  const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
  if (Object.prototype.hasOwnProperty.call(dict, key)) return lead + dict[key] + trail;
  for (const [re, rep] of (window.I18N_PATTERNS || [])) {
    if (re.test(key)) return lead + key.replace(re, rep) + trail;
  }
  // Teks gabungan dengan pemisah " · " diterjemahkan per bagian
  if (key.includes(" · ")) {
    const parts = key.split(" · "); const tr = parts.map((p) => t(p));
    if (tr.some((p, i) => p !== parts[i])) return lead + tr.join(" · ") + trail;
  }
  return s;
}

(function () {
  if (MBV_LANG !== "en") return;
  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH", "CODE"]);
  const ATTRS = ["placeholder", "aria-label", "title", "alt", "content"];
  const RICH = "p, li, h1, h2, h3, h4, h5, h6, blockquote, small, label, span, b, strong, td, th, div.inner, a, button, figcaption, option, dt, dd";

  function translateRich(el) {
    // Elemen berisi teks + tag inline (mis. <b>) dicocokkan per innerHTML
    const dict = window.I18N_EN || {};
    const html = _norm(el.innerHTML);
    if (html && Object.prototype.hasOwnProperty.call(dict, html)) { el.innerHTML = dict[html]; return true; }
    return false;
  }
  function translateNode(root) {
    if (root.nodeType === 3) {
      const v = root.nodeValue; const nv = t(v);
      if (nv !== v) root.nodeValue = nv;
      return;
    }
    if (root.nodeType !== 1 || SKIP.has(root.nodeName.toUpperCase())) return;
    if (root.matches && root.matches("[data-i18n-skip], [data-i18n-skip] *")) return;
    ATTRS.forEach((a) => {
      if (!root.hasAttribute(a)) return;
      if (a === "content" && root.nodeName !== "META") return;
      const v = root.getAttribute(a); const nv = t(v);
      if (nv !== v) root.setAttribute(a, nv);
    });
    if (root.matches && root.matches(RICH) && root.children.length && translateRich(root)) return;
    for (const c of [...root.childNodes]) translateNode(c);
  }

  let observer;
  document.addEventListener("DOMContentLoaded", () => {
    document.title = t(document.title);
    translateNode(document.head);
    translateNode(document.body);
    observer = new MutationObserver((muts) => {
      observer.disconnect();
      for (const m of muts) {
        if (m.type === "characterData") translateNode(m.target);
        else m.addedNodes.forEach(translateNode);
      }
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Tampilkan halaman setelah semua script DOMContentLoaded lain selesai merender
    setTimeout(() => {
      document.title = t(document.title);
      document.documentElement.classList.remove("i18n-pending");
    }, 0);
  });
  // Pengaman: jangan pernah biarkan halaman tersembunyi
  setTimeout(() => document.documentElement.classList.remove("i18n-pending"), 1500);
})();
