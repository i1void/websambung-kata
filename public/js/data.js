/**
 * data.js — Konfigurasi sumber data KBBI
 *
 * Ganti SOURCE_MODE untuk switch sumber data:
 *   "local"  → /data/kbbi.json (host sendiri, recommended)
 *   "github" → fetch dari GitHub raw (butuh internet, bisa kena CORS)
 *   "api"    → unofficial API
 */

const DataSource = {
  mode: "github", // ← ganti di sini

  sources: {
    local: {
      url: "/data/kbbi.json",
      parse: normalizeWords,
    },
    github: {
      url: "https://api.ivoid.cfd/tools/kbbi",
      parse: (data) => normalizeWords(data?.result ?? data),
    },
    api: {
      url: "https://services.x-labs.my.id/kbbi/randomwords?limit=10000",
      parse: (data) => normalizeWords(data?.data ?? data),
    },
  },

  async load() {
    const src = this.sources[this.mode];
    const res = await fetch(src.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return src.parse(json);
  },
};

/**
 * Normalisasi berbagai format JSON → string[]
 * Support: string[], {kata}[], {word}[], plain object
 */
function normalizeWords(data) {
  if (!data) return [];

  if (Array.isArray(data)) {
    if (typeof data[0] === "string")   return data.map(clean).filter(Boolean);
    if (data[0]?.kata)                 return data.map(w => clean(w.kata)).filter(Boolean);
    if (data[0]?.word)                 return data.map(w => clean(w.word)).filter(Boolean);
    return data.map(w => clean(String(Object.values(w)[0]))).filter(Boolean);
  }

  if (typeof data === "object") {
    return Object.keys(data).map(clean).filter(Boolean);
  }

  return [];
}

function clean(w) {
  return String(w).toLowerCase().trim();
}
