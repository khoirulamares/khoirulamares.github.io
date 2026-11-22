/* ==========================================================================
   PROGRAM-PAGE.JS · halaman detail program Corporate Training
   program.html?id=<id>   (data: assets/js/programs.js)
   - Perbankan: daftar 12 sub-program di kiri, isi satu program di kanan
     (di HP: pilihan dropdown), dengan tombol Sebelumnya / Berikutnya.
   - Program lain: Overview, Background, The Solution, daftar program.
   ========================================================================== */

/* "ACCOUNT OFFICER PREPARATORY PROGRAM" -> "Account Officer Preparatory Program" */
const KEEP_UPPER = new Set(["AO", "L/C", "SKBDN", "UMKM", "NPL", "CEO", "BMC", "SOP", "APU", "PPT", "KMKE", "KMKI", "BE", "DO", "FO", "SO", "SDM", "5C", "7P", "AI", "HR", "SEO"]);
const KEEP_LOWER = new Set(["for", "on", "with", "of", "and", "the", "in", "to", "dan", "untuk", "di", "ke", "pada", "dari", "yang"]);
function niceTitle(s) {
  if (!s || s !== s.toUpperCase()) return s;
  return s.toLowerCase().split(" ").map((w, i) => {
    const up = w.toUpperCase();
    if (KEEP_UPPER.has(up.replace(/[,():]/g, ""))) return up;
    if (i > 0 && KEEP_LOWER.has(w)) return w;
    return w.replace(/^([("']?)(\p{L})/u, (m, a, b) => a + b.toUpperCase());
  }).join(" ");
}

/* Pecah daftar materi berdasarkan koma / "|" yang tidak berada di dalam kurung */
function splitTopics(text) {
  const out = []; let depth = 0, cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if ((ch === "," || ch === "|") && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/* "MARKETING SKILLS : Business Mapping, Strategy" -> { label, topics[] } */
function parseCoverage(item) {
  const m = item.match(/^([^:=]{2,60}?)\s*[:=]\s*(.+)$/);
  if (!m) return { label: "", topics: [item] };
  let topics = splitTopics(m[2]);
  // Rangkaian "X = a, b, c" tetap satu poin (mis. Selling Cycle = Prospecting, Approaching, ...)
  const k = topics.findIndex((x) => /\s=\s/.test(x.replace(/\([^)]*\)/g, "")));
  if (k > -1 && k < topics.length - 1) topics = [...topics.slice(0, k), topics.slice(k).join(", ")];
  // Rapikan kurung tutup berlebih dari teks sumber
  topics = topics.map((x) => {
    let open = (x.match(/\(/g) || []).length, close = (x.match(/\)/g) || []).length;
    while (close > open && /\)\s*$/.test(x)) { x = x.replace(/\)\s*$/, ""); close--; }
    return x.trim();
  });
  return { label: niceTitle(m[1].trim()), topics: topics.length ? topics : [m[2]] };
}

const tx = (s) => (typeof t === "function" ? t(s) : s);

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("program");
  const id = new URLSearchParams(location.search).get("id");
  const p = PROGRAMS.find((x) => x.id === id);
  const e = (s) => esc(s);

  if (!p) {
    root.innerHTML = `<section class="section"><div class="container container-narrow"><div class="empty">${icon("search")}<h3>Program tidak ditemukan</h3><p class="muted">Silakan pilih program dari halaman Corporate Training.</p><a class="btn btn-blue" href="corporate-training.html#our-program">Lihat Program</a></div></div></section>`;
    return;
  }
  document.title = `${p.title} | MBV Training & Consulting`;

  const others = [...PROGRAMS.filter((x) => x.id !== p.id).map((x) => ({ href: `program.html?id=${x.id}`, icon: x.icon, title: x.title, card: x.card })),
    { href: "konsultasi.html", icon: "compass", title: "Consulting & Advisory", card: "Membekali profesional dengan keterampilan dan pengetahuan yang dibutuhkan dalam peran sebagai konsultan bisnis strategis." }];

  /* ---------- Header & overview ---------- */
  const header = `
  <section class="page-header">
    <div class="container">
      <ol class="crumbs"><li><a href="index.html">Home</a></li><li>${icon("chevronRight")}</li><li><a href="corporate-training.html">Corporate Training</a></li><li>${icon("chevronRight")}</li><li>${e(p.title)}</li></ol>
      <span class="eyebrow">Corporate Training</span>
      <h1>${e(p.title)}</h1>
      <p class="lead">${e(p.card)}</p>
      <div class="pg-meta">
        <span>${icon("briefcase")} Category: <b>Banking</b></span>
        ${p.subs ? `<span>${icon("layers")} <b>${p.subs.length}</b> Program</span>` : `<span>${icon("layers")} <b>${p.list.length}</b> Program</span>`}
      </div>
    </div>
  </section>`;

  const overview = `
  <section class="section">
    <div class="container pg-overview">
      <div>
        <span class="eyebrow">Overview</span>
        <h2>${e(niceTitle(p.heading))}</h2>
        <p class="pg-lead">${e(p.intro)}</p>
        <div class="btn-row mt-24">
          <a class="btn btn-primary" href="https://wa.me/6285210000389" target="_blank" rel="noopener">${icon("whatsapp")} Contact us</a>
          <a class="btn btn-outline" href="#program-list">Lihat Program</a>
        </div>
      </div>
      <figure class="pg-photo"><img src="${p.img}" alt="${e(p.title)}"></figure>
    </div>
  </section>`;

  /* ---------- Isi utama ---------- */
  let main = "";
  if (p.subs) {
    const subs = p.subs;
    main = `
    <section class="section bg-soft" id="program-list">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Program Pelatihan</span>
          <h2>${e(niceTitle(p.heading))}</h2>
          <p>${subs.length} program pelatihan perbankan. Pilih program untuk melihat latar belakang, tujuan, durasi, dan cakupan materi.</p>
        </div>
        <div class="bk-layout">
          <nav class="bk-nav" aria-label="Daftar program">
            <label class="sr-only" for="bkSelect">Pilih program</label>
            <select class="input bk-select" id="bkSelect">${subs.map((s, i) => `<option value="${i}">${String(i + 1).padStart(2, "0")}. ${e(niceTitle(s.title))}</option>`).join("")}</select>
            <ol class="bk-list">${subs.map((s, i) => `
              <li><button type="button" data-sub="${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="tt">${e(niceTitle(s.title))}<small>${s.duration ? e(s.duration) : ""}</small></span></button></li>`).join("")}
            </ol>
          </nav>
          <article class="bk-panel" id="bkPanel" aria-live="polite"></article>
        </div>
      </div>
    </section>`;
  } else {
    main = `
    <section class="section bg-soft">
      <div class="container pg-read">
        <span class="eyebrow">Background</span>
        <h2>Background and Industry's Challenges</h2>
        ${p.background.map((b) => `<p>${e(b)}</p>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="container pg-read">
        <div class="solution-box">
          <span class="sb-ic">${icon("lightbulb")}</span>
          <div><h2>The Solution</h2><p>${e(p.solution)}</p></div>
        </div>
        ${p.corporate_heading ? `
        <div class="pg-corp">
          <h3>${e(p.corporate_heading)}</h3>
          <p>${e(p.corporate_text)}</p>
        </div>` : ""}
      </div>
    </section>
    <section class="section bg-soft" id="program-list">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Our Program</span>
          <h2>Program Pelatihan</h2>
          ${p.list_intro ? `<p>${e(p.list_intro)}</p>` : ""}
        </div>
        <div class="pg-list">${p.list.map((l, i) => {
          const sentences = l.d.split(/(?<=\.)\s+/).filter(Boolean);
          return `
          <div class="pg-item">
            <span class="n">${String(i + 1).padStart(2, "0")}</span>
            <h4>${e(l.t)}</h4>
            ${sentences.map((s) => `<p>${e(s)}</p>`).join("")}
          </div>`;
        }).join("")}</div>
      </div>
    </section>`;
  }

  /* ---------- Kontak & program lain ---------- */
  const contact = `
  <section class="section">
    <div class="container">
      <div class="pg-contact">
        <div>
          <span class="eyebrow">Project Info</span>
          <h2>Tertarik dengan program ini?</h2>
          <p>Bila anda memiliki pertanyaan atau ingin menjalin kerjasama dalam pelatihan ini, silakan hubungi kami.</p>
          <div class="btn-row mt-24">
            <a class="btn btn-primary btn-lg" href="https://wa.me/6285210000389" target="_blank" rel="noopener">${icon("whatsapp")} Contact us</a>
            <a class="btn btn-ghost-light btn-lg" href="kontak.html#form">Hubungi Kami</a>
          </div>
        </div>
        <ul class="pg-info">
          <li>${icon("briefcase")}<span><small>Category</small>Banking</span></li>
          <li>${icon("phone")}<span><small>Contact</small><a href="https://wa.me/6285210000389" target="_blank" rel="noopener">0852 1000 0389</a></span></li>
          <li>${icon("mapPin")}<span><small>Address</small>Cikarang Technopark Building, Jl. Inti I Blok C1 No. 7, Lippo Cikarang, Bekasi</span></li>
        </ul>
      </div>
    </div>
  </section>
  <section class="section bg-soft">
    <div class="container">
      <div class="section-head-row">
        <div class="section-head"><span class="eyebrow">Corporate Training</span><h2 class="mb-0">Program Lainnya</h2></div>
        <a class="link-arrow" href="corporate-training.html#our-program">Lihat semua program ${icon("arrowRight")}</a>
      </div>
      <div class="pg-others">${others.map((o) => `
        <a href="${o.href}"><span class="ic">${icon(o.icon)}</span><b>${e(o.title)}</b><span class="go">${icon("arrowRight")}</span></a>`).join("")}
      </div>
    </div>
  </section>`;

  root.innerHTML = header + overview + main + contact;

  /* ---------- Interaksi sub-program perbankan ---------- */
  if (p.subs) {
    const subs = p.subs;
    const panel = document.getElementById("bkPanel");
    const sel = document.getElementById("bkSelect");
    const btns = [...document.querySelectorAll(".bk-list button")];

    const render = (i, scroll) => {
      const s = subs[i];
      const cov = s.coverage.map(parseCoverage);
      panel.innerHTML = `
        <header class="bk-head">
          <span class="n">${String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3>${e(niceTitle(s.title))}</h3>
            ${s.duration ? `<span class="badge badge-orange">${icon("clock")} Durasi Program: ${e(s.duration)}</span>` : ""}
          </div>
        </header>
        <div class="bk-sec">
          <h4>${icon("info")} Program Background</h4>
          ${s.background.map((b) => `<p>${e(b)}</p>`).join("")}
        </div>
        <div class="bk-sec">
          <h4>${icon("target")} Program Objective</h4>
          ${s.objective_intro ? `<p class="muted">${e(s.objective_intro)}</p>` : ""}
          <ul class="check-list cols">${s.objective.map((o) => `<li>${icon("checkCircle")}<span>${e(o.replace(/[,.]$/, ""))}</span></li>`).join("")}</ul>
        </div>
        <div class="bk-sec">
          <h4>${icon("layers")} Program Coverage</h4>
          ${s.coverage_intro ? `<p class="muted">${e(s.coverage_intro)}</p>` : ""}
          <div class="cov-grid">${cov.map((c) => `
            <div class="cov-card">
              ${c.label ? `<h5>${e(c.label)}</h5>` : ""}
              <ul class="dot-list">${c.topics.map((x) => `<li>${e(x)}</li>`).join("")}</ul>
            </div>`).join("")}
          </div>
        </div>
        <footer class="bk-foot">
          <button type="button" class="btn btn-outline btn-sm" data-step="-1" ${i === 0 ? "disabled" : ""}>${icon("arrowLeft")} Sebelumnya</button>
          <span class="xs muted">${i + 1} / ${subs.length}</span>
          <button type="button" class="btn btn-blue btn-sm" data-step="1" ${i === subs.length - 1 ? "disabled" : ""}>Berikutnya ${icon("arrowRight")}</button>
        </footer>`;
      btns.forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-current", k === i ? "true" : "false"); });
      sel.value = String(i);
      history.replaceState(null, "", `#sub-${i + 1}`);
      if (scroll) document.getElementById("program-list").scrollIntoView({ behavior: "smooth", block: "start" });
      cur = i;
    };

    let cur = 0;
    btns.forEach((b) => b.addEventListener("click", () => render(Number(b.dataset.sub), window.innerWidth < 992)));
    sel.addEventListener("change", () => render(Number(sel.value), false));
    panel.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-step]"); if (!b) return;
      render(Math.min(subs.length - 1, Math.max(0, cur + Number(b.dataset.step))), true);
    });
    const fromHash = Number((location.hash.match(/sub-(\d+)/) || [])[1]);
    render(fromHash >= 1 && fromHash <= subs.length ? fromHash - 1 : 0, false);
  }
});
