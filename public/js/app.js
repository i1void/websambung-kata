/**
 * app.js — Logic utama KBBI Sambung Kata
 */

let allWords    = [];
let filtered    = [];
let currentPage = 1;
let currentMode = "sambung";
const PER_PAGE  = 120;

// ── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  bindEnterKeys();
  loadData();
});

async function loadData() {
  setOutput(`
    <div class="loading">
      MEMUAT DATABASE KBBI...
      <div class="loading-bar"><div class="loading-fill"></div></div>
    </div>
  `);

  try {
    const words = await DataSource.load();
    allWords = [...new Set(words)].sort();
    showInitial();
  } catch (e) {
    console.error("Load failed:", e);
    showError();
  }
}

// ── MODE ─────────────────────────────────────────────────────────────────────

function setMode(mode) {
  currentMode = mode;

  document.getElementById("modeSambung").style.display  = mode === "sambung"  ? "block" : "none";
  document.getElementById("modeLengkapi").style.display = mode === "lengkapi" ? "block" : "none";

  document.getElementById("btnModeSambung").classList.toggle("active",  mode === "sambung");
  document.getElementById("btnModeLengkapi").classList.toggle("active", mode === "lengkapi");

  const heroTitle = document.getElementById("heroTitle");
  const tipsBox   = document.getElementById("tipsBox");

  if (mode === "sambung") {
    heroTitle.innerHTML = "Cari kata by<br><mark>awalan & akhiran</mark>";
    tipsBox.style.display = "block";
  } else {
    heroTitle.innerHTML = "Cari kata by<br><mark>pola huruf</mark>";
    tipsBox.style.display = "none";
  }

  doReset();
}

// ── SEARCH ───────────────────────────────────────────────────────────────────

function doSearch() {
  clearFieldError();

  if (currentMode === "sambung") {
    searchSambung();
  } else {
    searchLengkapi();
  }
}

function searchSambung() {
  const prefix = val("inputPrefix");
  const suffix = val("inputSuffix");

  if (!prefix && !suffix) {
    showFieldError("Isi minimal awalan atau akhiran dulu.");
    return;
  }

  filtered = allWords.filter(w => {
    if (prefix && !w.startsWith(prefix)) return false;
    if (suffix && !w.endsWith(suffix))   return false;
    if (prefix && suffix && w.length < prefix.length + suffix.length) return false;
    return true;
  });

  currentPage = 1;
  renderResults();
}

function searchLengkapi() {
  const pola = val("inputPola");

  if (!pola) {
    showFieldError("Isi pola kata dulu. Contoh: b_t_");
    return;
  }

  if (!pola.includes("_")) {
    showFieldError("Pola harus mengandung _ sebagai huruf kosong.");
    return;
  }

  // Convert pola ke regex: _ → satu huruf apapun
  const regexStr = "^" + pola.split("").map(c => c === "_" ? "[a-z]" : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("") + "$";
  const regex = new RegExp(regexStr);

  filtered = allWords.filter(w => regex.test(w));

  currentPage = 1;
  renderResults();
}

function doReset() {
  ["inputPrefix", "inputSuffix", "inputPola"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  filtered = [];
  clearFieldError();
  document.getElementById("pagination").innerHTML    = "";
  document.getElementById("resultsLabel").style.display = "none";
  showInitial();
}

// ── RENDER ───────────────────────────────────────────────────────────────────

function renderResults() {
  const total      = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const pageWords  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const prefix = currentMode === "sambung" ? val("inputPrefix") : "";
  const suffix = currentMode === "sambung" ? val("inputSuffix") : "";
  const pola   = currentMode === "lengkapi" ? val("inputPola") : "";

  // Stats
  const statsBar = document.getElementById("statsBar");
  statsBar.style.display = "flex";
  statsBar.innerHTML = `
    <div class="stat-chip">📚 <span>${allWords.length.toLocaleString()}</span> KATA</div>
    <div class="stat-chip">🔍 <span>${total.toLocaleString()}</span> HASIL</div>
    ${prefix ? `<div class="stat-chip">▶ <span>${prefix}</span></div>` : ""}
    ${suffix ? `<div class="stat-chip">◀ <span>${suffix}</span></div>` : ""}
    ${pola   ? `<div class="stat-chip">~ <span>${pola}</span></div>`   : ""}
  `;

  // Header
  const rh = document.getElementById("resultsLabel");
  rh.style.display = "block";
  rh.textContent   = total === 0
    ? "Tidak ada hasil"
    : `Halaman ${currentPage} / ${totalPages} — ${total.toLocaleString()} kata`;

  if (total === 0) {
    setOutput(`
      <div class="state-box">
        <div class="icon">😞</div>
        <p>Tidak ada kata yang cocok.<br>Coba pola lain.</p>
      </div>
    `);
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  const cards = pageWords.map(w => `
    <div class="word-card" onclick="copyWord('${w}')">
      <div class="word-text">${currentMode === "sambung" ? highlight(w, prefix, suffix) : highlightPola(w, pola)}</div>
      <div class="word-len">${w.length} huruf</div>
    </div>
  `).join("");

  setOutput(`<div class="word-grid">${cards}</div>`);
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pg = document.getElementById("pagination");
  if (totalPages <= 1) { pg.innerHTML = ""; return; }

  const from = Math.max(1, currentPage - 2);
  const to   = Math.min(totalPages, from + 4);
  let html   = "";

  html += `<button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>← PREV</button>`;
  if (from > 1) html += `<button class="page-btn" onclick="changePage(1)">1</button><span class="page-ellipsis">…</span>`;
  for (let i = from; i <= to; i++) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="changePage(${i})">${i}</button>`;
  }
  if (to < totalPages) html += `<span class="page-ellipsis">…</span><button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
  html += `<button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>NEXT →</button>`;

  pg.innerHTML = html;
}

function changePage(p) {
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function highlight(w, prefix, suffix) {
  const pl = prefix.length;
  const sl = suffix.length;
  if (pl && sl && pl + sl <= w.length) {
    return `<span class="hl-s">${w.slice(0, pl)}</span>${w.slice(pl, w.length - sl)}<span class="hl-e">${w.slice(w.length - sl)}</span>`;
  }
  if (pl && pl <= w.length) return `<span class="hl-s">${w.slice(0, pl)}</span>${w.slice(pl)}`;
  if (sl && sl <= w.length) return `${w.slice(0, w.length - sl)}<span class="hl-e">${w.slice(w.length - sl)}</span>`;
  return w;
}

function highlightPola(w, pola) {
  if (!pola) return w;
  return w.split("").map((c, i) => {
    if (pola[i] === "_") return `<span class="hl-s">${c}</span>`;
    return c;
  }).join("");
}

function copyWord(w) {
  navigator.clipboard.writeText(w).then(() => showToast(`✓ "${w}" disalin!`));
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}

function showInitial() {
  const statsBar = document.getElementById("statsBar");
  statsBar.style.display = "flex";
  statsBar.innerHTML = `<div class="stat-chip">📚 <span>${allWords.length.toLocaleString()}</span> KATA DIMUAT</div>`;
  setOutput(`
    <div class="state-box">
      <div class="icon">🔤</div>
      <p>Masukkan ${currentMode === "sambung" ? "awalan atau akhiran" : "pola kata"}<br>lalu tekan Cari</p>
    </div>
  `);
}

function showError() {
  setOutput(`
    <div class="state-box">
      <div class="icon">⚠️</div>
      <p>Gagal load database.<br>atau ganti mode di <code>js/data.js</code></p>
    </div>
  `);
}

function setOutput(html) {
  document.getElementById("output").innerHTML = html;
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim().toLowerCase() : "";
}

function showFieldError(msg) {
  clearFieldError();
  const err = document.createElement("p");
  err.id = "fieldError";
  err.style.cssText = "font-size:12px;color:#d93025;margin-top:8px;font-family:'DM Mono',monospace;";
  err.textContent = msg;
  document.querySelector(".actions").before(err);
}

function clearFieldError() {
  const el = document.getElementById("fieldError");
  if (el) el.remove();
}

function bindEnterKeys() {
  ["inputPrefix", "inputSuffix", "inputPola"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
  });
}
