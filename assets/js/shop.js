/* ==========================================================================
   SHOP.JS · fitur Public Training MBV
   Katalog > Detail kelas > Checkout > Pembayaran > Sukses
   Pesanan disimpan di localStorage browser (simulasi). Saat diintegrasikan
   dengan backend / payment gateway, ganti objek Orders & fungsi markPaid.
   Butuh: site.js, data.js
   ========================================================================== */

const getCourse = (id) => COURSES.find((c) => c.id === id);
const getMethod = (id) => PAYMENT_METHODS.flatMap((g) => g.items).find((m) => m.id === id);
const upcoming = () => COURSES.filter((c) => new Date(c.startISO) > new Date()).sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
const seatsLeft = (c) => Math.max(0, c.quota - c.seatsTaken);
const savePct = (c) => Math.round((1 - c.sale / c.price) * 100);
const num = (n) => Number(n).toLocaleString("id-ID");

/* ---------- Penyimpanan pesanan ---------- */
const Orders = {
  key: "mbv_orders_v2",
  _mem: {},
  all() { try { return JSON.parse(localStorage.getItem(this.key) || "{}"); } catch { return this._mem; } },
  get(id) { return id ? this.all()[id] : null; },
  save(o) { const a = this.all(); a[o.id] = o; try { localStorage.setItem(this.key, JSON.stringify(a)); } catch { this._mem = a; } return o; },
};

/* ---------- Komponen visual ---------- */
function thumbHTML(c, { top = true } = {}) {
  return `
  <div class="thumb" style="--t1:${c.category.t1};--t2:${c.category.t2}">
    <span class="glyph">${icon(c.glyph)}</span>
    ${top ? `<div class="tt"><span class="badge badge-dark">${icon("video")} Live Zoom</span>${c.badge ? `<span class="badge badge-orange">${esc(c.badge)}</span>` : ""}</div>
    <div class="code">${c.code} · ${c.days} SESI</div>` : ""}
  </div>`;
}

function ratingHTML(c) {
  if (!c.participants) return `<li>${icon("users")} ${c.interested} orang tertarik</li>`;
  return `<li>${icon("star")} ${String(c.rating).replace(".", ",")} · ${num(c.participants)} alumni</li>`;
}

function courseCard(c) {
  const left = seatsLeft(c);
  const pct = Math.round((c.seatsTaken / c.quota) * 100);
  return `
  <a class="course-card" href="kelas.html?id=${c.id}">
    ${thumbHTML(c)}
    <div class="body">
      <div class="cat">${esc(c.category.name)}</div>
      <h3>${esc(c.title)}</h3>
      <ul class="meta">
        <li>${icon("calendar")} ${c.dateShort}</li>
        <li>${icon("clock")} ${c.timeLabel} WIB</li>
        ${ratingHTML(c)}
      </ul>
    </div>
    <div class="foot">
      <div class="price"><s>${rupiah(c.price)}</s><b>${rupiah(c.sale)}</b></div>
      <div class="seats">${left <= 10 ? `<b style="color:var(--orange-600)">Sisa ${left} kursi</b>` : `${left} kursi tersedia`}<div class="bar"><i style="width:${pct}%"></i></div></div>
    </div>
  </a>`;
}

function stepperHTML(active) {
  const steps = ["Pilih kelas", "Data & pembayaran", "Bayar", "Selesai"];
  return steps.map((s, i) => {
    const n = i + 1; const cls = n < active ? "done" : n === active ? "now" : "";
    return `<li class="${cls}"><span class="n">${n < active ? icon("check") : n}</span>${s}</li>`;
  }).join("");
}

/* ---------- Harga ---------- */
function calcPrice({ course, qty = 1, methodId, voucher }) {
  const original = course.price * qty;
  const subtotal = course.sale * qty;
  const g = GROUP_DISCOUNTS.find((d) => qty >= d.min);
  const groupPct = g ? g.pct : 0;
  const groupDisc = Math.round(subtotal * groupPct / 100);
  const afterGroup = subtotal - groupDisc;
  const v = voucher && VOUCHERS[voucher];
  const voucherDisc = v ? (v.type === "pct" ? Math.min(Math.round(afterGroup * v.value / 100), v.max || Infinity) : Math.min(v.value, afterGroup)) : 0;
  const base = afterGroup - voucherDisc;
  const m = methodId ? getMethod(methodId) : null;
  const fee = m ? Math.round((m.fee.flat || 0) + base * (m.fee.pct || 0) / 100) : 0;
  return { qty, original, subtotal, unit: course.sale, groupPct, groupDisc, voucher: v ? voucher : null, voucherDisc, fee, total: base + fee, saved: original - base };
}
const feeLabel = (m) => (m.fee.pct ? `Biaya ${String(m.fee.pct).replace(".", ",")}%` : m.fee.flat ? `Biaya ${rupiah(m.fee.flat)}` : "Tanpa biaya");

/* ---------- Kalender & QR ---------- */
function gcalLink(c) {
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = `Public Training MBV (${c.code}). ${c.dateLong}, ${c.timeLabel} WIB. Info: ${SITE.email}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(c.title)}&dates=${fmt(new Date(c.startISO))}/${fmt(new Date(c.endISO))}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(c.location)}`;
}
function qrSVG(seed) {
  // Ilustrasi QR. QR asli diterbitkan oleh payment gateway.
  const N = 29; let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
  const finder = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  let cells = "";
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (finder(x, y) || (x > 10 && x < 18 && y > 10 && y < 18)) continue;
    if (rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1.2" fill="#121a4a"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx=".8" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".6" fill="#e98138"/>`;
  return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" role="img" aria-label="Kode QR pembayaran"><g fill="#121a4a">${cells}</g>${f(0, 0)}${f(N - 7, 0)}${f(0, N - 7)}</svg>`;
}

/* ==========================================================================
   BERANDA · kelas terdekat
   ========================================================================== */
function renderUpcoming() {
  $$("[data-upcoming]").forEach((el) => {
    el.innerHTML = upcoming().slice(0, Number(el.dataset.upcoming) || 3).map(courseCard).join("");
  });
}

/* ==========================================================================
   KATALOG · public-training.html
   ========================================================================== */
function pageCatalog() {
  const state = { cat: params.get("kategori") || "all", q: params.get("q") || "", sort: "date" };
  const list = upcoming();
  const search = $("#ptSearch");
  search.value = state.q;

  const counts = (id) => list.filter((c) => id === "all" || c.cat === id).length;
  $("#filters").innerHTML = [{ id: "all", name: "Semua Kelas", icon: "layers" }, ...CATEGORIES].map((c) =>
    `<button class="chip" data-cat="${c.id}">${icon(c.icon)} ${c.name} <span class="count">${counts(c.id)}</span></button>`).join("");

  function render() {
    const q = state.q.trim().toLowerCase();
    let rows = list.filter((c) => (state.cat === "all" || c.cat === state.cat) &&
      (!q || `${c.title} ${c.subtitle} ${c.category.name} ${c.code}`.toLowerCase().includes(q)));
    if (state.sort === "popular") rows.sort((a, b) => (b.participants + b.interested) - (a.participants + a.interested));
    if (state.sort === "price-asc") rows.sort((a, b) => a.sale - b.sale || a.price - b.price);
    $$("#filters .chip").forEach((b) => b.classList.toggle("is-active", b.dataset.cat === state.cat));
    $("#resultCount").textContent = `${rows.length} kelas ditemukan`;
    $("#courseGrid").innerHTML = rows.length ? rows.map(courseCard).join("") : `
      <div class="empty" style="grid-column:1/-1">${icon("search")}<h4>Kelas tidak ditemukan</h4>
      <p class="muted">Coba kata kunci lain atau hubungi kami untuk jadwal kelas berikutnya.</p>
      <button class="btn btn-outline" id="resetFilter">Reset filter</button></div>`;
    const reset = $("#resetFilter");
    if (reset) reset.addEventListener("click", () => { state.cat = "all"; state.q = ""; search.value = ""; render(); });
    const u = new URL(location.href);
    u.searchParams.delete("kategori"); u.searchParams.delete("q");
    if (state.cat !== "all") u.searchParams.set("kategori", state.cat);
    if (state.q) u.searchParams.set("q", state.q);
    history.replaceState(null, "", u);
  }

  $("#filters").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { state.cat = b.dataset.cat; render(); } });
  $("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  search.addEventListener("input", () => { state.q = search.value; render(); });
  $("#ptSearchForm").addEventListener("submit", (e) => { e.preventDefault(); $("#katalog").scrollIntoView(); });
  $$("[data-q]").forEach((b) => b.addEventListener("click", () => { search.value = state.q = b.dataset.q; render(); $("#katalog").scrollIntoView(); }));
  render();
}

/* ==========================================================================
   DETAIL KELAS · kelas.html?id=
   ========================================================================== */
function pageDetail() {
  const c = getCourse(params.get("id"));
  const root = $("#detail");
  if (!c) {
    root.innerHTML = `<section class="section"><div class="container container-narrow"><div class="empty">${icon("search")}<h3>Kelas tidak ditemukan</h3><p class="muted">Tautan kelas tidak valid atau kelas sudah berakhir.</p><a class="btn btn-blue" href="public-training.html">Lihat jadwal kelas</a></div></div></section>`;
    return;
  }
  const left = seatsLeft(c);
  const faqs = [...c.faq, ...COMMON_FAQ];
  const related = upcoming().filter((x) => x.id !== c.id).sort((a, b) => (b.cat === c.cat) - (a.cat === c.cat)).slice(0, 3);
  const avatarColor = { p: "var(--blue)", t: "#0f6b6b", o: "var(--orange)" };

  root.innerHTML = `
  <section class="detail-hero">
    <div class="container">
      <ol class="crumbs"><li><a href="index.html">Home</a></li><li>${icon("chevronRight")}</li><li><a href="public-training.html">Public Training</a></li><li>${icon("chevronRight")}</li><li><a href="public-training.html?kategori=${c.cat}">${esc(c.category.name)}</a></li></ol>
      <div class="badges"><span class="badge badge-blue">${icon(c.category.icon)} ${esc(c.category.name)}</span><span class="badge badge-blue">${c.code} · ${esc(c.batch)}</span>${c.badge ? `<span class="badge badge-orange">${esc(c.badge)}</span>` : ""}</div>
      <h1>${esc(c.title)}</h1>
      <p class="lead">${esc(c.subtitle)}</p>
      <div class="facts">
        <span>${icon("calendar")} ${c.dateLong}</span>
        <span>${icon("clock")} ${c.timeLabel} WIB</span>
        <span>${icon("video")} ${c.location}</span>
        <span>${icon("layers")} ${esc(c.level)}</span>
        ${typeof MBV_LANG !== "undefined" && MBV_LANG === "en" ? `<span>${icon("globe")} Delivered in Bahasa Indonesia</span>` : ""}
        ${c.participants ? `<span>${icon("star")} ${String(c.rating).replace(".", ",")} (${num(c.reviews)} ulasan) · ${num(c.participants)} alumni</span>` : ""}
      </div>
    </div>
  </section>
  <nav class="detail-nav" aria-label="Bagian halaman"><div class="container">
    <a href="#ringkasan" class="is-active">Ringkasan</a><a href="#materi">Materi & Jadwal</a><a href="#fasilitas">Fasilitas</a>${c.testimonials.length ? `<a href="#testimoni">Testimoni</a>` : ""}<a href="#faq">FAQ</a>
  </div></nav>
  <div class="container detail-layout">
    <div>
      <section class="d-section" id="ringkasan">
        <h2>Yang akan Anda kuasai</h2>
        <div class="outcomes">${c.outcomes.map((o, i) => `<div class="outcome"><span class="n">${i + 1}</span><div><b>${esc(o.t)}</b><p>${esc(o.d)}</p></div></div>`).join("")}</div>
      </section>
      <section class="d-section" id="materi">
        <h2>Materi & jadwal</h2>
        <div class="agenda">${c.schedule.map((s, i) => `
          <div class="agenda-item">
            <div class="when"><small>${s.mm}</small><b>${s.dd}</b><small>${s.day.slice(0, 3)}</small></div>
            <div><h4>Sesi ${i + 1}: ${esc(s.t)}</h4><div class="t">${s.day}, ${c.timeLabel} WIB · Live Zoom</div>
            <ul class="dot-list small">${s.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          </div>`).join("")}</div>
      </section>
      <section class="d-section" id="fasilitas">
        <h2>Fasilitas peserta</h2>
        <div class="grid grid-2" style="gap:12px">${c.benefits.map(([ic, txt]) => `<div class="topic">${icon(ic)}<span>${txt}</span></div>`).join("")}</div>
        <h3 class="mt-32" style="font-size:1.125rem">Persiapan perangkat</h3>
        <ul class="check-list mt-16">${c.tools.map((t) => `<li>${icon("checkCircle")}<span>${esc(t)}</span></li>`).join("")}</ul>
        <h3 class="mt-32" style="font-size:1.125rem">Ketentuan kelas</h3>
        <ul class="dot-list small mt-16">${COMMON_NOTES.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
      </section>
      ${c.testimonials.length ? `
      <section class="d-section" id="testimoni">
        <h2>Kata alumni</h2>
        <div class="grid" style="gap:14px">${c.testimonials.map((t) => `
          <figure class="testi" style="margin:0;padding:24px">
            <blockquote style="margin-bottom:16px">“${esc(t.q)}”</blockquote>
            <figcaption class="who"><span class="avatar" style="background:${avatarColor[t.c] || "var(--blue)"};color:#fff">${esc(t.i)}</span><span><b>${esc(t.n)}</b><small>${esc(t.r)}</small></span></figcaption>
          </figure>`).join("")}</div>
      </section>` : ""}
      <section class="d-section" id="faq">
        <h2>Pertanyaan umum</h2>
        <div class="accordion" data-single>${faqs.map((f, i) => `
          <div class="acc-item ${i === 0 ? "is-open" : ""}"><button class="acc-q" aria-expanded="${i === 0}">${esc(f.q)}<span class="pm">${icon("plus")}</span></button>
          <div class="acc-a"><div><div class="inner">${esc(f.a)}</div></div></div></div>`).join("")}</div>
      </section>
    </div>
    <aside class="detail-aside">
      <div class="buy-card">
        ${thumbHTML(c, { top: false })}
        <div class="bc-body">
          <div class="price-big"><s>${rupiah(c.price)}</s><b>${rupiah(c.sale)}</b></div>
          <span class="badge badge-green save">Hemat ${savePct(c)}% · harga per peserta</span>
          <div class="xs muted mt-16">Kelas dimulai dalam</div>
          <div class="countdown" id="cd"></div>
          <ul class="bc-list">
            <li>${icon("calendar")}<span>${c.dateLong}<br><span class="muted">${c.durationLabel}</span></span></li>
            <li>${icon("video")}<span>${c.location}</span></li>
            <li>${icon("users")}<span>${left <= 10 ? `<b style="color:var(--orange-600)">Sisa ${left} kursi</b>` : `${left} dari ${c.quota} kursi tersedia`}</span></li>
            <li>${icon("award")}<span>E-Certificate</span></li>
          </ul>
          <a class="btn btn-primary btn-lg btn-block" href="checkout.html?kelas=${c.id}">Daftar Sekarang ${icon("arrowRight")}</a>
          <a class="btn btn-outline btn-block mt-8" href="checkout.html?kelas=${c.id}&mode=group">${icon("users")} Daftar untuk Tim · hemat s.d. 10%</a>
        </div>
        <div class="bc-foot">Kuota terbatas tiap batch agar sesi tetap interaktif. Butuh untuk seluruh tim? <a href="corporate-training.html" class="strong">Corporate Training</a></div>
      </div>
    </aside>
  </div>
  <section class="section bg-soft">
    <div class="container">
      <div class="section-head-row"><div class="section-head"><span class="eyebrow">Kelas Lainnya</span><h2 class="mb-0">Mungkin Anda juga tertarik</h2></div><a class="link-arrow" href="public-training.html">Lihat semua kelas ${icon("arrowRight")}</a></div>
      <div class="course-grid">${related.map(courseCard).join("")}</div>
    </div>
  </section>
  <div class="mobile-buy"><div class="price"><s>${rupiah(c.price)}</s><b>${rupiah(c.sale)}</b></div><a class="btn btn-primary" href="checkout.html?kelas=${c.id}">Daftar Sekarang</a></div>`;
  document.body.classList.add("has-mobile-buy");
  document.body.style.paddingBottom = "76px";

  const cd = $("#cd");
  const tick = () => {
    const ms = new Date(c.startISO) - Date.now();
    if (ms <= 0) { cd.innerHTML = `<div><b>Sedang</b><small>berlangsung</small></div>`; return; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    cd.innerHTML = [[d, "hari"], [h, "jam"], [m, "menit"]].map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><small>${l}</small></div>`).join("");
  };
  tick(); setInterval(tick, 30000);

  const links = $$(".detail-nav a");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-30% 0px -60% 0px" });
  $$(".d-section").forEach((s) => io.observe(s));
}

/* ==========================================================================
   CHECKOUT · checkout.html?kelas= | ?order=
   ========================================================================== */
function pageCheckout() {
  const existing = Orders.get(params.get("order"));
  const c = getCourse(existing ? existing.courseId : params.get("kelas"));
  const root = $("#checkout");
  $("#stepper").innerHTML = stepperHTML(2);
  if (!c) {
    root.innerHTML = `<div class="empty">${icon("search")}<h3>Pilih kelas terlebih dahulu</h3><p class="muted">Silakan pilih jadwal Public Training yang ingin Anda ikuti.</p><a class="btn btn-blue" href="public-training.html">Lihat jadwal kelas</a></div>`;
    return;
  }

  const state = {
    mode: existing ? existing.mode : params.get("mode") === "group" ? "group" : "self",
    includeSelf: existing ? existing.includeSelf : true,
    participants: existing ? existing.participants.map((p) => ({ ...p })) : [],
    billing: existing ? existing.billing.type : "personal",
    methodId: existing ? existing.method : null,
    voucher: existing ? existing.pricing.voucher : null,
  };
  if (state.mode === "group" && !state.participants.length) state.participants.push({ name: "", email: "", wa: "" });
  const qty = () => (state.mode === "self" ? 1 : state.participants.length + (state.includeSelf ? 1 : 0));
  const b = existing ? existing.buyer : {};
  const bill = existing ? existing.billing : {};

  root.innerHTML = `
  <form class="co-layout" id="coForm" novalidate>
    <div>
      <div class="co-card">
        <div class="co-head"><span class="num">1</span><div><h2>Tipe pendaftaran</h2><p>Daftar untuk diri sendiri atau sekaligus untuk tim.</p></div></div>
        <div class="seg" id="modeSeg">
          <button type="button" data-mode="self">${icon("user")} Daftar Sendiri</button>
          <button type="button" data-mode="group">${icon("users")} Tim / Kolektif</button>
        </div>
        <div class="notice info mt-16" id="groupInfo" hidden>${icon("gift")}<span><b>Potongan kolektif otomatis:</b> 5% untuk 3 sampai 4 peserta, 10% untuk 5 peserta atau lebih. Satu invoice untuk semua peserta.</span></div>
      </div>

      <div class="co-card">
        <div class="co-head"><span class="num">2</span><div><h2 id="buyerTitle">Data peserta</h2><p>Konfirmasi pendaftaran dan link grup WhatsApp kelas dikirim ke kontak ini.</p></div></div>
        <div class="form-grid">
          <div class="field full"><label for="bName">Nama lengkap <span class="req">*</span></label><input class="input" id="bName" autocomplete="name" placeholder="Sesuai yang akan tercetak di sertifikat" value="${esc(b.name)}"><span class="err">Nama wajib diisi.</span></div>
          <div class="field"><label for="bEmail">Email <span class="req">*</span></label><input class="input" id="bEmail" type="email" autocomplete="email" placeholder="nama@email.com" value="${esc(b.email)}"><span class="err">Email belum valid.</span></div>
          <div class="field"><label for="bWa">No. WhatsApp <span class="req">*</span></label><div class="input-group"><span class="prefix">+62</span><input class="input" id="bWa" inputmode="tel" autocomplete="tel" placeholder="812 3456 7890" value="${esc((b.wa || "").replace(/^62/, ""))}"></div><span class="err">Nomor WhatsApp belum valid.</span></div>
          <div class="field"><label for="bOrg">Instansi / perusahaan</label><input class="input" id="bOrg" autocomplete="organization" placeholder="Opsional" value="${esc(b.org)}"></div>
          <div class="field"><label for="bJob">Profesi</label>
            <select class="input" id="bJob">${["", "Karyawan swasta", "ASN / BUMN", "Pemilik usaha / UMKM", "Freelancer", "Mahasiswa / fresh graduate", "Lainnya"].map((o) => `<option value="${o}" ${b.job === o ? "selected" : ""}>${o || "Pilih profesi"}</option>`).join("")}</select></div>
        </div>
      </div>

      <div class="co-card" id="groupCard" hidden>
        <div class="co-head"><span class="num">${icon("plus")}</span><div><h2>Daftar peserta</h2><p>Isi nama dan email atau WhatsApp tiap peserta. Link grup WhatsApp kelas akan dikirim ke setiap peserta.</p></div></div>
        <label class="check mb-16"><input type="checkbox" id="includeSelf" ${state.includeSelf ? "checked" : ""}> <span>Saya (penanggung jawab) juga ikut sebagai peserta</span></label>
        <div class="participants" id="participants"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;flex-wrap:wrap;gap:12px">
          <button type="button" class="btn btn-outline btn-sm" id="addP">${icon("plus")} Tambah peserta</button>
          <span class="small muted" id="pCount"></span>
        </div>
        <div class="disc-chips" id="discChips"></div>
      </div>

      <div class="co-card">
        <div class="co-head"><span class="num">3</span><div><h2>Tujuan penagihan</h2><p>Invoice akan diterbitkan atas nama ini.</p></div></div>
        <div class="opt-grid two" id="billOpts">
          <label class="option"><input type="radio" name="bill" value="personal"><span class="radio"></span><span><b>Perorangan</b><small>Invoice atas nama peserta</small></span></label>
          <label class="option"><input type="radio" name="bill" value="company"><span class="radio"></span><span><b>Perusahaan / Instansi</b><small>Bisa dengan NPWP & faktur pajak</small></span></label>
        </div>
        <div class="form-grid mt-16" id="companyFields" hidden>
          <div class="field full"><label for="cName">Nama perusahaan / instansi <span class="req">*</span></label><input class="input" id="cName" placeholder="PT Contoh Sejahtera" value="${esc(bill.company)}"><span class="err">Nama perusahaan wajib diisi.</span></div>
          <div class="field"><label for="cNpwp">NPWP</label><input class="input" id="cNpwp" inputmode="numeric" placeholder="15 atau 16 digit (opsional)" value="${esc(bill.npwp)}"><span class="hint">Isi jika membutuhkan faktur pajak.</span></div>
          <div class="field"><label for="cEmail">Email finance</label><input class="input" id="cEmail" type="email" placeholder="finance@perusahaan.com" value="${esc(bill.financeEmail)}"></div>
          <div class="field full"><label for="cAddr">Alamat penagihan</label><input class="input" id="cAddr" placeholder="Opsional" value="${esc(bill.address)}"></div>
        </div>
      </div>

      <div class="co-card">
        <div class="co-head"><span class="num">4</span><div><h2>Metode pembayaran</h2><p>Konfirmasi otomatis untuk QRIS, Virtual Account, dan e-wallet.</p></div></div>
        <div id="payGroups">${PAYMENT_METHODS.map((g) => `
          <div class="pay-group"><h4>${g.group}</h4><div class="opt-grid ${g.items.length > 1 ? "two" : ""}">${g.items.map((m) => `
            <label class="option"><input type="radio" name="method" value="${m.id}"><span class="radio"></span>
              <span class="pay-logo" style="background:${m.color}">${m.label}</span>
              <span><b>${m.name}</b><small>${m.tag ? m.tag + " · " : ""}${feeLabel(m)}</small></span>
            </label>`).join("")}</div></div>`).join("")}
        </div>
        <div id="invoiceFields" hidden>
          <div class="notice warn mt-16">${icon("info")}<span>Pengajuan tempo direview 1×24 jam kerja. Kursi dikunci sementara selama proses review.</span></div>
          <label class="upload"><input type="file" id="poFile" accept=".pdf,.jpg,.jpeg,.png">${icon("upload")}<span><b class="strong">Unggah PO / SPK / surat pesanan</b><br><small class="muted" id="poName">PDF, JPG, atau PNG maks. 10 MB (opsional)</small></span></label>
        </div>
        <p class="small" id="methodErr" hidden style="color:var(--red);font-weight:600;margin:12px 0 0">Pilih salah satu metode pembayaran.</p>
      </div>

      <div class="co-card">
        <label class="check"><input type="checkbox" id="agree"> <span>Saya telah membaca dan menyetujui <a href="#syarat" id="termsLink">Syarat & Ketentuan</a> serta kebijakan refund Public Training MBV.</span></label>
        <p class="small" id="agreeErr" hidden style="color:var(--red);font-weight:600;margin:10px 0 0 32px">Centang persetujuan untuk melanjutkan.</p>
        <div class="small muted mt-16" id="syarat" hidden><ul class="dot-list">${COMMON_NOTES.map((n) => `<li>${esc(n)}</li>`).join("")}<li>${esc(COMMON_FAQ[4].a)}</li></ul></div>
      </div>
    </div>

    <aside class="co-summary">
      <div class="co-card">
        <div class="sum-class">
          ${thumbHTML(c, { top: false })}
          <div><span class="badge badge-blue">${c.code} · ${esc(c.batch)}</span>
          <h3>${esc(c.title)}</h3>
          <div class="xs">${c.dateShort} · ${c.timeLabel} WIB</div></div>
        </div>
        <div class="sum-rows" id="sumRows"></div>
        <div style="padding-top:18px">
          <label class="xs strong" for="vCode" style="display:block;margin-bottom:8px">Kode voucher</label>
          <div class="voucher"><input class="input" id="vCode" placeholder="Masukkan kode" value="${esc(state.voucher)}"><button type="button" class="btn btn-blue btn-sm" id="vApply" style="--bh:44px">Pakai</button></div>
          <div class="voucher-msg" id="vMsg"></div>
        </div>
        <div class="sum-total"><span class="strong">Total bayar</span><b id="sumTotal"></b></div>
        <div class="notice success" id="savedNote" style="font-size:13.5px;padding:12px 14px"></div>
        <button type="submit" class="btn btn-primary btn-lg btn-block mt-16" id="payBtn">${icon("lock")} <span id="payLabel">Bayar Sekarang</span></button>
        <div class="trust"><span>${icon("shield")} SSL Encrypted</span><span>${icon("checkCircle")} Konfirmasi otomatis</span><span>${icon("receipt")} Refund hingga 7 hari sebelum kelas</span></div>
      </div>
      <p class="small muted center mt-16">Butuh bantuan? <a target="_blank" rel="noopener" href="${waLink(`Halo MBV, saya butuh bantuan pendaftaran kelas ${c.code}.`)}">Chat tim MBV</a></p>
    </aside>
  </form>`;

  const syncOpts = (wrap, name, val) => $$(`input[name=${name}]`, wrap).forEach((i) => { i.checked = i.value === val; i.closest(".option").classList.toggle("is-checked", i.checked); });

  function renderParticipants() {
    const wrap = $("#participants");
    wrap.innerHTML = state.participants.length ? state.participants.map((p, i) => `
      <div class="participant" data-i="${i}">
        <span class="pn">${i + (state.includeSelf ? 2 : 1)}</span>
        <div class="pf">
          <input class="input" data-k="name" placeholder="Nama peserta" aria-label="Nama peserta ${i + 1}" value="${esc(p.name)}">
          <input class="input" data-k="email" type="email" placeholder="Email" aria-label="Email peserta ${i + 1}" value="${esc(p.email)}">
          <input class="input" data-k="wa" inputmode="tel" placeholder="WhatsApp" aria-label="WhatsApp peserta ${i + 1}" value="${esc(p.wa)}">
        </div>
        <button type="button" class="rm" aria-label="Hapus peserta ${i + 1}">${icon("trash")}</button>
      </div>`).join("") : `<div class="small muted center" style="padding:16px;border:1.5px dashed var(--line-strong);border-radius:12px">Belum ada peserta tambahan.</div>`;
    $("#pCount").textContent = `${qty()} peserta (maks. ${MAX_PARTICIPANTS})`;
    $("#addP").disabled = qty() >= MAX_PARTICIPANTS;
    $("#discChips").innerHTML = GROUP_DISCOUNTS.slice().reverse().map((g) => `<span class="badge ${qty() >= g.min ? "badge-green" : "badge-blue"}">${qty() >= g.min ? icon("check") : ""} ${g.min}+ peserta: hemat ${g.pct}%</span>`).join("");
  }

  function render() {
    $$("#modeSeg button").forEach((x) => x.classList.toggle("is-active", x.dataset.mode === state.mode));
    const group = state.mode === "group";
    $("#groupInfo").hidden = !group; $("#groupCard").hidden = !group;
    $("#buyerTitle").textContent = group ? "Data penanggung jawab" : "Data peserta";
    syncOpts($("#billOpts"), "bill", state.billing);
    syncOpts($("#payGroups"), "method", state.methodId);
    $("#companyFields").hidden = state.billing !== "company";
    $("#invoiceFields").hidden = state.methodId !== "invoice";
    if (group) renderParticipants();
    renderSummary();
  }

  function renderSummary() {
    const pr = calcPrice({ course: c, qty: qty(), methodId: state.methodId, voucher: state.voucher });
    const m = state.methodId ? getMethod(state.methodId) : null;
    $("#sumRows").innerHTML = `
      <div class="r"><span>Harga normal${pr.qty > 1 ? ` × ${pr.qty}` : ""}</span><span><s class="muted">${rupiah(pr.original)}</s></span></div>
      <div class="r"><span>Harga promo${pr.qty > 1 ? ` (${rupiah(pr.unit)} × ${pr.qty})` : ""}</span><span>${rupiah(pr.subtotal)}</span></div>
      ${pr.groupDisc ? `<div class="r disc"><span>Potongan kolektif ${pr.groupPct}%</span><span>${rupiah(pr.groupDisc)}</span></div>` : ""}
      ${pr.voucherDisc ? `<div class="r disc"><span>Voucher ${pr.voucher}</span><span>${rupiah(pr.voucherDisc)}</span></div>` : ""}
      <div class="r"><span>Biaya layanan${m ? ` (${m.label})` : ""}</span><span>${m ? (pr.fee ? rupiah(pr.fee) : "Gratis") : "Pilih metode"}</span></div>`;
    $("#sumTotal").textContent = rupiah(pr.total);
    $("#savedNote").innerHTML = `${icon("gift")}<span>Anda hemat <b>${rupiah(pr.saved)}</b> dari harga normal.</span>`;
    $("#payLabel").textContent = state.methodId === "invoice" ? "Ajukan Pembayaran Tempo" : `Bayar ${rupiah(pr.total)}`;
  }

  $("#modeSeg").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    state.mode = btn.dataset.mode;
    if (state.mode === "group" && !state.participants.length) state.participants.push({ name: "", email: "", wa: "" });
    render();
  });
  $("#includeSelf").addEventListener("change", (e) => { state.includeSelf = e.target.checked; renderParticipants(); renderSummary(); });
  $("#addP").addEventListener("click", () => { if (qty() < MAX_PARTICIPANTS) { state.participants.push({ name: "", email: "", wa: "" }); renderParticipants(); renderSummary(); $(".participant:last-child input")?.focus(); } });
  $("#participants").addEventListener("input", (e) => { const row = e.target.closest(".participant"); if (row) state.participants[row.dataset.i][e.target.dataset.k] = e.target.value; });
  $("#participants").addEventListener("click", (e) => { const rm = e.target.closest(".rm"); if (rm) { state.participants.splice(rm.closest(".participant").dataset.i, 1); renderParticipants(); renderSummary(); } });
  $("#billOpts").addEventListener("change", (e) => { state.billing = e.target.value; if (state.billing === "personal" && state.methodId === "invoice") state.methodId = null; render(); });
  $("#payGroups").addEventListener("change", (e) => {
    state.methodId = e.target.value; $("#methodErr").hidden = true;
    if (state.methodId === "invoice" && state.billing !== "company") { state.billing = "company"; toast("Penagihan diubah ke Perusahaan / Instansi"); }
    render();
  });
  $("#poFile").addEventListener("change", (e) => { $("#poName").textContent = e.target.files[0] ? e.target.files[0].name : "PDF, JPG, atau PNG maks. 10 MB (opsional)"; });
  $("#termsLink").addEventListener("click", (e) => { e.preventDefault(); $("#syarat").hidden = !$("#syarat").hidden; });
  $("#agree").addEventListener("change", () => { $("#agreeErr").hidden = true; });

  const applyVoucher = () => {
    const code = $("#vCode").value.trim().toUpperCase(); const msg = $("#vMsg");
    if (!code) { state.voucher = null; msg.textContent = ""; msg.className = "voucher-msg"; renderSummary(); return; }
    if (VOUCHERS[code]) { state.voucher = code; msg.textContent = `✓ ${VOUCHERS[code].label}`; msg.className = "voucher-msg ok"; }
    else { state.voucher = null; msg.textContent = "Kode voucher tidak valid atau sudah tidak berlaku."; msg.className = "voucher-msg bad"; }
    renderSummary();
  };
  $("#vApply").addEventListener("click", applyVoucher);
  $("#vCode").addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); applyVoucher(); } });
  if (state.voucher) applyVoucher();

  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const normWa = (v) => v.replace(/\D/g, "").replace(/^(62|0)/, "");
  const setErr = (id, bad) => { $(id).closest(".field").classList.toggle("has-error", bad); return bad; };
  $$("#coForm .field .input").forEach((i) => i.addEventListener("input", () => i.closest(".field").classList.remove("has-error")));

  $("#coForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    const check = (id, bad) => { if (setErr(id, bad) && !firstBad) firstBad = $(id); };
    check("#bName", $("#bName").value.trim().length < 3);
    check("#bEmail", !validEmail($("#bEmail").value.trim()));
    check("#bWa", !/^\d{8,13}$/.test(normWa($("#bWa").value)));
    if (state.billing === "company") check("#cName", !$("#cName").value.trim());
    if (state.mode === "group") {
      $$(".participant").forEach((row) => {
        const [n, em, w] = $$("input", row);
        const bad = !n.value.trim() || (!validEmail(em.value.trim()) && !/^\d{8,13}$/.test(normWa(w.value)));
        [n, em, w].forEach((x) => { x.style.borderColor = bad ? "var(--red)" : ""; });
        if (bad && !firstBad) firstBad = n;
      });
      if (qty() < 2 && !firstBad) { toast("Tambahkan minimal 1 peserta lain untuk pendaftaran tim"); firstBad = $("#addP"); }
    }
    if (!state.methodId) { $("#methodErr").hidden = false; if (!firstBad) firstBad = $("#payGroups"); }
    if (!$("#agree").checked) { $("#agreeErr").hidden = false; if (!firstBad) firstBad = $("#agree"); }
    if (firstBad) { firstBad.scrollIntoView({ behavior: "smooth", block: "center" }); if (firstBad.focus) setTimeout(() => firstBad.focus({ preventScroll: true }), 300); return; }

    const m = getMethod(state.methodId);
    const now = new Date();
    const id = existing ? existing.id : `MBV${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const wa = "62" + normWa($("#bWa").value);
    const order = Orders.save({
      id, courseId: c.id, mode: state.mode, includeSelf: state.includeSelf,
      buyer: { name: $("#bName").value.trim(), email: $("#bEmail").value.trim(), wa, org: $("#bOrg").value.trim(), job: $("#bJob").value },
      participants: state.mode === "group" ? state.participants.map((p) => ({ name: p.name.trim(), email: p.email.trim(), wa: p.wa.trim() })) : [],
      billing: { type: state.billing, company: $("#cName").value.trim(), npwp: $("#cNpwp").value.trim(), financeEmail: $("#cEmail").value.trim(), address: $("#cAddr").value.trim() },
      method: m.id,
      pricing: calcPrice({ course: c, qty: qty(), methodId: m.id, voucher: state.voucher }),
      payCode: m.type === "va" ? m.prefix + wa.slice(-8).padStart(8, "0") + String(Math.floor(Math.random() * 90 + 10)) : id,
      status: m.type === "invoice" ? "review" : "pending",
      createdAt: Date.now(), expiresAt: Date.now() + 24 * 3600 * 1000,
    });
    location.href = withLang(`pembayaran.html?order=${order.id}`);
  });

  render();
}

/* ==========================================================================
   PEMBAYARAN · pembayaran.html?order=
   ========================================================================== */
function orderSummaryCard(o, c) {
  const pr = o.pricing;
  return `
  <div class="co-card">
    <div class="sum-class">${thumbHTML(c, { top: false })}
      <div><span class="badge badge-blue">${c.code}</span><h3>${esc(c.title)}</h3><div class="xs">${c.dateShort} · ${c.timeLabel} WIB</div></div></div>
    <div class="kv mt-16">
      <div><span>No. pesanan</span><b>${o.id}</b></div>
      <div><span>Peserta</span><b>${pr.qty} orang</b></div>
      <div><span>Atas nama</span><b>${esc(o.billing.type === "company" ? o.billing.company : o.buyer.name)}</b></div>
      ${pr.groupDisc ? `<div><span>Potongan kolektif</span><b style="color:var(--green)">${rupiah(pr.groupDisc)}</b></div>` : ""}
      ${pr.voucherDisc ? `<div><span>Voucher ${pr.voucher}</span><b style="color:var(--green)">${rupiah(pr.voucherDisc)}</b></div>` : ""}
      <div><span>Biaya layanan</span><b>${pr.fee ? rupiah(pr.fee) : "Gratis"}</b></div>
    </div>
    <div class="sum-total" style="border-top:1px solid var(--line)"><span class="strong">Total</span><b>${rupiah(pr.total)}</b></div>
  </div>`;
}

function pagePayment() {
  const o = Orders.get(params.get("order"));
  const root = $("#payment");
  $("#stepper").innerHTML = stepperHTML(3);
  if (!o) {
    root.innerHTML = `<div class="empty">${icon("receipt")}<h3>Pesanan tidak ditemukan</h3><p class="muted">Tautan pembayaran tidak valid atau sudah kedaluwarsa. Silakan buat pendaftaran baru.</p><a class="btn btn-blue" href="public-training.html">Lihat jadwal kelas</a></div>`;
    return;
  }
  if (o.status === "paid") { location.replace(withLang(`sukses.html?order=${o.id}`)); return; }
  const c = getCourse(o.courseId);
  const m = getMethod(o.method);
  const pr = o.pricing;

  if (m.type === "invoice") {
    $("#stepper").innerHTML = stepperHTML(4);
    root.innerHTML = `
    <div class="pay-layout">
      <div class="co-card">
        <span class="status-pill review">Menunggu review</span>
        <h1 style="font-size:1.75rem;margin:16px 0 8px">Pengajuan pembayaran tempo diterima</h1>
        <p class="muted">Terima kasih, ${esc(o.buyer.name.split(" ")[0])}. Pengajuan tempo direview 1×24 jam kerja. Kursi dikunci sementara selama proses review, dan invoice dikirim ke <b class="strong">${esc(o.billing.financeEmail || o.buyer.email)}</b>.</p>
        <ol class="next-steps mt-32">
          <li><b>Review pengajuan</b><p>Tim MBV memeriksa data perusahaan dan dokumen PO / SPK (jika ada).</p></li>
          <li><b>Invoice terbit</b><p>Invoice NET 14 dikirim ke email finance & penanggung jawab.</p></li>
          <li><b>Kursi terkonfirmasi</b><p>Link grup WhatsApp kelas dikirim ke setiap peserta.</p></li>
        </ol>
        <div class="btn-row mt-32 no-print">
          <button class="btn btn-blue" onclick="window.print()">${icon("printer")} Cetak ringkasan</button>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${waLink(`Halo MBV, saya ingin konfirmasi pengajuan tempo ${o.id} untuk kelas ${c.code}.`)}">${icon("whatsapp")} Konfirmasi via WhatsApp</a>
        </div>
      </div>
      <aside>${orderSummaryCard(o, c)}</aside>
    </div>`;
    return;
  }

  const expired = Date.now() > o.expiresAt;
  const howto = m.type === "va" ? [
    ["Mobile Banking", [`Buka aplikasi mobile banking ${m.label}`, "Pilih menu Transfer, lalu Virtual Account", `Masukkan nomor VA <b>${o.payCode}</b>`, `Pastikan nama tagihan <b>PT Meta Bright Vision</b> dan nominal <b>${rupiah(pr.total)}</b>`, "Masukkan PIN dan selesaikan transaksi"]],
    ["ATM", ["Masukkan kartu ATM dan PIN", "Pilih Transaksi Lainnya, Transfer, lalu Virtual Account", `Masukkan nomor VA <b>${o.payCode}</b>`, "Periksa detail tagihan, lalu pilih Benar / Ya", "Simpan struk sebagai bukti pembayaran"]],
    ["Internet Banking", ["Login ke internet banking", "Pilih Transfer Dana, lalu Virtual Account", `Masukkan nomor VA <b>${o.payCode}</b>`, "Konfirmasi dengan token / OTP"]],
  ] : m.type === "qris" ? [
    ["Cara bayar dengan QRIS", ["Buka aplikasi e-wallet atau m-banking yang mendukung QRIS", "Pilih menu Scan / Bayar", "Scan kode QR di atas", `Pastikan merchant <b>PT Meta Bright Vision</b> dan nominal <b>${rupiah(pr.total)}</b>`, "Konfirmasi dengan PIN, status terupdate otomatis"]],
  ] : [
    [`Bayar dengan ${m.name}`, [`Klik tombol <b>Buka ${m.name}</b> (di HP) atau scan QR (di laptop)`, `Pastikan nominal <b>${rupiah(pr.total)}</b>`, `Konfirmasi pembayaran dengan PIN ${m.name}`, "Kembali ke halaman ini, status terupdate otomatis"]],
  ];

  const body = m.type === "va" ? `
    <div class="pay-row"><div><div class="k">Nomor Virtual Account ${m.label}</div><div class="v big">${o.payCode.replace(/(\d{4})(?=\d)/g, "$1 ")}</div></div><button class="copy-btn" data-copy="${o.payCode}">${icon("copy")} Salin</button></div>
    <div class="pay-row"><div><div class="k">Total pembayaran</div><div class="v">${rupiah(pr.total)}</div></div><button class="copy-btn" data-copy="${pr.total}">${icon("copy")} Salin</button></div>
    <div class="notice info mt-16">${icon("info")}<span>Transfer <b>tepat sesuai nominal</b>. Pembayaran terverifikasi otomatis dalam 1 sampai 5 menit.</span></div>` : `
    <div class="qr-box">
      <div class="small muted">Scan dengan aplikasi ${m.type === "qris" ? "e-wallet / m-banking apa pun" : m.name}</div>
      <div class="qr">${qrSVG(o.id)}<div class="qr-logo"><img src="assets/img/favicon.png" alt=""></div></div>
      <div style="font-size:1.5rem;font-weight:800;color:var(--ink)">${rupiah(pr.total)}</div>
      ${m.type === "ewallet" ? `<button class="btn btn-primary mt-16" type="button" onclick="toast('Membuka aplikasi ${m.name}')">Buka ${m.name}</button>` : ""}
    </div>`;

  root.innerHTML = `
  <div class="pay-layout">
    <div class="co-card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:20px">
        <div><div class="xs muted">Metode pembayaran</div><h1 style="font-size:1.375rem;margin:2px 0 0">${m.name}</h1></div>
        <span class="status-pill ${expired ? "expired" : "pending"}">${expired ? "Kedaluwarsa" : "Menunggu pembayaran"}</span>
      </div>
      ${expired ? `<div class="notice warn">${icon("info")}<span>Batas waktu pembayaran telah lewat. Silakan buat pesanan ulang selama kuota masih tersedia.</span></div>
        <a class="btn btn-primary mt-16" href="checkout.html?kelas=${c.id}">Daftar ulang</a>` : `
      <div class="timer-bar"><span>Selesaikan pembayaran dalam</span><b id="timer">00:00:00</b></div>
      ${body}
      <div class="howto"><h3>Cara pembayaran</h3><div class="accordion" data-single>${howto.map(([t, steps], i) => `
        <div class="acc-item ${i === 0 ? "is-open" : ""}"><button class="acc-q" aria-expanded="${i === 0}">${t}<span class="pm">${icon("plus")}</span></button>
        <div class="acc-a"><div><div class="inner"><ol>${steps.map((s) => `<li>${s}</li>`).join("")}</ol></div></div></div></div>`).join("")}</div></div>
      <div class="btn-row mt-24">
        <button class="btn btn-blue" id="checkBtn">${icon("checkCircle")} Cek status pembayaran</button>
        <a class="btn btn-outline" href="checkout.html?order=${o.id}">Ubah metode</a>
      </div>
      <div class="demo-box"><span><b>Mode demo:</b> belum terhubung ke payment gateway.</span><button class="btn btn-sm btn-outline" id="simulate">Simulasikan pembayaran berhasil</button></div>`}
    </div>
    <aside>${orderSummaryCard(o, c)}
      <p class="small muted center mt-16">Kendala pembayaran? <a target="_blank" rel="noopener" href="${waLink(`Halo MBV, saya butuh bantuan pembayaran pesanan ${o.id}.`)}">Hubungi kami</a></p>
      <p class="small muted center">Simpan nomor pesanan <b class="strong">${o.id}</b> untuk membuka halaman ini lagi lewat <a href="cek-pesanan.html?order=${o.id}">Cek Pesanan</a>.</p>
    </aside>
  </div>`;

  initAccordions(root);
  $$("[data-copy]", root).forEach((btn) => btn.addEventListener("click", () => {
    navigator.clipboard?.writeText(btn.dataset.copy).then(() => toast("Berhasil disalin"), () => toast("Salin manual: " + btn.dataset.copy));
  }));
  if (expired) return;
  const timer = $("#timer");
  const tick = () => {
    const ms = Math.max(0, o.expiresAt - Date.now());
    const h = Math.floor(ms / 36e5), mm = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
    timer.textContent = [h, mm, s].map((v) => String(v).padStart(2, "0")).join(":");
    if (!ms) location.reload();
  };
  tick(); setInterval(tick, 1000);
  const markPaid = () => { o.status = "paid"; o.paidAt = Date.now(); Orders.save(o); location.href = withLang(`sukses.html?order=${o.id}`); };
  $("#simulate").addEventListener("click", markPaid);
  $("#checkBtn").addEventListener("click", () => toast("Pembayaran belum terdeteksi. Coba lagi dalam beberapa menit."));
}

/* ==========================================================================
   PENDUKUNG RIWAYAT PESANAN
   ========================================================================== */
/* Link grup WhatsApp kelas. Jika link grup belum diisi di data.js (WA_GROUPS),
   arahkan ke WhatsApp admin dengan pesan berisi nomor pesanan. */
function groupLink(o, c) {
  return c.waGroup || waLink(`Halo MBV, saya sudah membayar pesanan ${o.id} untuk kelas ${c.code} (${c.title}). Mohon kirimkan link grup WhatsApp kelas.`);
}
function orderStatus(o) {
  if (o.status === "paid") return { key: "paid", label: "Lunas" };
  if (o.status === "review") return { key: "review", label: "Menunggu review" };
  if (Date.now() > o.expiresAt) return { key: "expired", label: "Kedaluwarsa" };
  return { key: "pending", label: "Menunggu pembayaran" };
}
function orderNoBox(o) {
  return `
  <div class="order-no no-print">
    <div><small>Nomor pesanan Anda</small><b>${o.id}</b></div>
    <button type="button" class="copy-btn" data-copy="${o.id}">${icon("copy")} Salin</button>
    <p>Simpan nomor pesanan ini. Link grup WhatsApp kelas dapat dibuka kembali kapan saja melalui halaman <a href="cek-pesanan.html?order=${o.id}">Cek Pesanan</a>.</p>
  </div>`;
}
function bindCopy(root) {
  $$("[data-copy]", root).forEach((btn) => btn.addEventListener("click", () => {
    navigator.clipboard?.writeText(btn.dataset.copy).then(() => toast("Berhasil disalin"), () => toast("Salin manual: " + btn.dataset.copy));
  }));
}

/* Cari pesanan. Versi statis membaca pesanan yang tersimpan di browser ini.
   Saat backend tersedia, ganti isi fungsi ini dengan pemanggilan API, mis.
   return fetch(`/api/orders/${id}?email=${email}`).then((r) => r.ok ? r.json() : null); */
async function lookupOrder(id, email) {
  const o = Orders.get(String(id || "").trim().toUpperCase());
  if (!o) return null;
  const em = String(email || "").trim().toLowerCase();
  const emails = [o.buyer.email, o.billing.financeEmail, ...o.participants.map((p) => p.email)].filter(Boolean).map((x) => x.toLowerCase());
  return emails.includes(em) ? o : null;
}

function orderCard(o, { full = false } = {}) {
  const c = getCourse(o.courseId);
  if (!c) return "";
  const st = orderStatus(o);
  const created = new Date(o.createdAt);
  const action = st.key === "paid"
    ? `<a class="btn btn-primary btn-sm" href="${groupLink(o, c)}" target="_blank" rel="noopener">${icon("whatsapp")} Gabung grup WhatsApp</a>
       <a class="btn btn-outline btn-sm" href="sukses.html?order=${o.id}">${icon("receipt")} Lihat kuitansi</a>
       <a class="btn btn-outline btn-sm" href="${gcalLink(c)}" target="_blank" rel="noopener">${icon("calendar")} Tambah ke Kalender</a>`
    : st.key === "pending"
      ? `<a class="btn btn-primary btn-sm" href="pembayaran.html?order=${o.id}">${icon("lock")} Lanjutkan pembayaran</a>`
      : st.key === "review"
        ? `<a class="btn btn-outline btn-sm" href="pembayaran.html?order=${o.id}">${icon("info")} Lihat status pengajuan</a>
           <a class="btn btn-outline btn-sm" href="${waLink(`Halo MBV, saya ingin menanyakan status pengajuan tempo ${o.id}.`)}" target="_blank" rel="noopener">${icon("whatsapp")} Tanya tim MBV</a>`
        : `<a class="btn btn-outline btn-sm" href="checkout.html?kelas=${c.id}">Daftar ulang</a>`;
  return `
  <article class="order-card">
    <div class="oc-head">
      <div><small>No. pesanan</small><b>${o.id}</b></div>
      <span class="status-pill ${st.key}">${st.label}</span>
    </div>
    <div class="oc-body">
      ${thumbHTML(c, { top: false })}
      <div>
        <h3>${esc(c.title)}</h3>
        <ul class="meta">
          <li>${icon("calendar")} ${c.dateLong}</li>
          <li>${icon("clock")} ${c.timeLabel} WIB · Live Zoom</li>
          <li>${icon("users")} ${o.pricing.qty} orang · ${rupiah(o.pricing.total)}</li>
        </ul>
        ${full ? `<p class="xs muted">Dipesan ${created.getDate()} ${_MS[created.getMonth()]} ${created.getFullYear()} atas nama ${esc(o.buyer.name)}</p>` : ""}
      </div>
    </div>
    <div class="oc-actions">${action}</div>
  </article>`;
}

/* ==========================================================================
   CEK PESANAN · cek-pesanan.html?order=
   ========================================================================== */
function pageOrders() {
  const form = $("#lookupForm");
  const result = $("#lookupResult");
  const idIn = $("#lkOrder"), emIn = $("#lkEmail");
  if (params.get("order")) idIn.value = params.get("order");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const okId = idIn.value.trim().length >= 6, okEm = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emIn.value.trim());
    idIn.closest(".field").classList.toggle("has-error", !okId);
    emIn.closest(".field").classList.toggle("has-error", !okEm);
    if (!okId || !okEm) return;
    const o = await lookupOrder(idIn.value, emIn.value);
    result.innerHTML = o ? orderCard(o, { full: true }) : `
      <div class="notice warn">${icon("info")}<span><b>Pesanan tidak ditemukan.</b> Pastikan nomor pesanan dan email sama dengan saat pendaftaran. Jika Anda mendaftar dari perangkat lain atau masih kesulitan, <a href="${waLink(`Halo MBV, saya ingin mengecek pesanan ${idIn.value.trim().toUpperCase()} atas email ${emIn.value.trim()}.`)}" target="_blank" rel="noopener">hubungi tim MBV</a>.</span></div>`;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // Pesanan yang pernah dibuat di perangkat ini
  const list = Object.values(Orders.all()).filter((o) => getCourse(o.courseId)).sort((a, b) => b.createdAt - a.createdAt);
  $("#deviceOrders").innerHTML = list.length
    ? list.map((o) => orderCard(o)).join("")
    : `<div class="empty" style="padding:40px 24px">${icon("receipt")}<h4>Belum ada pesanan di perangkat ini</h4><p class="muted">Pesanan yang Anda buat dari browser ini akan tampil di sini.</p><a class="btn btn-blue" href="public-training.html">Lihat jadwal kelas</a></div>`;
  $("#deviceCount").textContent = list.length ? `${list.length} pesanan` : "";
}

/* ==========================================================================
   SUKSES · sukses.html?order=
   ========================================================================== */
function pageSuccess() {
  const o = Orders.get(params.get("order"));
  const root = $("#success");
  $("#stepper").innerHTML = stepperHTML(5);
  if (!o || o.status !== "paid") {
    root.innerHTML = `<div class="empty">${icon("receipt")}<h3>Pesanan belum lunas atau tidak ditemukan</h3><p class="muted">Cek kembali halaman pembayaran Anda.</p>${o ? `<a class="btn btn-blue" href="pembayaran.html?order=${o.id}">Ke halaman pembayaran</a>` : `<a class="btn btn-blue" href="public-training.html">Lihat jadwal kelas</a>`}</div>`;
    return;
  }
  const c = getCourse(o.courseId);
  const m = getMethod(o.method);
  const pr = o.pricing;
  const paid = new Date(o.paidAt);
  const names = [...(o.mode === "self" || o.includeSelf ? [o.buyer.name] : []), ...o.participants.map((p) => p.name)];

  root.innerHTML = `
  <div class="success-hero">
    <div class="success-icon">${icon("check")}</div>
    <h1 style="font-size:clamp(1.75rem,1.3rem + 1.6vw,2.375rem)">Pembayaran berhasil, pendaftaran terkonfirmasi</h1>
    <p class="lead muted">Terima kasih, ${esc(o.buyer.name.split(" ")[0])}. Konfirmasi dan kuitansi telah dikirim ke <b class="strong">${esc(o.buyer.email)}</b> dan WhatsApp <b class="strong">+${esc(o.buyer.wa)}</b>.</p>
    ${orderNoBox(o)}
  </div>
  <div class="pay-layout">
    <div>
      <div class="co-card">
        <h2 style="font-size:1.25rem;margin-bottom:24px">Langkah selanjutnya</h2>
        <ol class="next-steps">
          <li><b>Bergabung ke grup WhatsApp kelas</b><p>${esc(COMMON_NOTES[0])}</p></li>
          <li><b>Siapkan perangkat</b><p>${esc(c.tools.map((x) => (typeof t === "function" ? t(x) : x)).join(", "))}.</p></li>
          <li><b>Ikuti live class</b><p>${esc(COMMON_NOTES[1])}</p></li>
          <li><b>Terima E-Certificate</b><p>${esc(COMMON_NOTES[2])}</p></li>
        </ol>
        <div class="btn-row mt-32 no-print">
          <a class="btn btn-primary" href="${groupLink(o, c)}" target="_blank" rel="noopener">${icon("whatsapp")} Gabung grup WhatsApp</a>
          <a class="btn btn-outline" href="${gcalLink(c)}" target="_blank" rel="noopener">${icon("calendar")} Tambah ke Kalender</a>
          <button class="btn btn-outline" onclick="window.print()">${icon("printer")} Cetak kuitansi</button>
        </div>
      </div>
      <div class="co-card">
        <h2 style="font-size:1.25rem;margin-bottom:8px">Peserta terdaftar</h2>
        <ul class="check-list mt-16">${names.map((n) => `<li>${icon("checkCircle")}<span>${esc(n)}</span></li>`).join("")}</ul>
      </div>
    </div>
    <aside>
      <div class="co-card">
        <div class="sum-class">${thumbHTML(c, { top: false })}
          <div><span class="badge badge-green">Lunas</span><h3>${esc(c.title)}</h3><div class="xs">${c.dateShort} · ${c.timeLabel} WIB</div></div></div>
        <div class="kv mt-16">
          <div><span>No. pesanan</span><b>${o.id}</b></div>
          <div><span>Tanggal bayar</span><b>${paid.getDate()} ${_MS[paid.getMonth()]} ${paid.getFullYear()}, ${String(paid.getHours()).padStart(2, "0")}.${String(paid.getMinutes()).padStart(2, "0")}</b></div>
          <div><span>Metode</span><b>${m.name}</b></div>
          <div><span>Peserta</span><b>${pr.qty} orang</b></div>
          <div><span>Ditagihkan ke</span><b>${esc(o.billing.type === "company" ? o.billing.company : o.buyer.name)}</b></div>
        </div>
        <div class="sum-total" style="border-top:1px solid var(--line)"><span class="strong">Total dibayar</span><b>${rupiah(pr.total)}</b></div>
      </div>
      <div class="co-card no-print">
        <h3 style="font-size:1.0625rem">Corporate Training</h3>
        <p class="small muted">Program pelatihan profesional yang dirancang untuk meningkatkan kompetensi dan produktivitas perusahaan.</p>
        <a class="link-arrow" href="corporate-training.html">Pelajari Corporate Training ${icon("arrowRight")}</a>
      </div>
    </aside>
  </div>`;
  bindCopy(root);
}

/* ---------- Router ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.shop;
  renderUpcoming();
  if (page === "catalog") pageCatalog();
  if (page === "detail") pageDetail();
  if (page === "checkout") pageCheckout();
  if (page === "payment") pagePayment();
  if (page === "success") pageSuccess();
  if (page === "orders") pageOrders();
  initAccordions();
  initImgFallback();
});
