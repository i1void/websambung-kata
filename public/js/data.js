/**
 * data.js — Konfigurasi sumber data KBBI
 */

const DataSource = {
  mode: "github",

  sources: {
    local: {
      url: "/data/kbbi.json",
      parse: normalizeWords,
    },
    github: {
      url: "https://api.ivoid.cfd/tools/kbbi",
      parse: (data) => normalizeWords(data?.result ?? data),
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
