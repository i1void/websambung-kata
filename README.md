# kbbi-sambung-kata

> Web tool untuk mencari kata KBBI berdasarkan awalan dan akhiran. Dibuat untuk membantu strategi bermain game Sambung Kata di Roblox.

## Prerequisites

- Node.js 18+
- Akses ke [Void API](https://api.ivoid.cfd) untuk dataset KBBI

## Development

```bash
npm install
npm run dev
# buka http://localhost:3000
```

## Deploy ke Vercel

```bash
git add .
git commit -m "init"
git remote add origin https://github.com/username/kbbi-sambung-kata.git
git push -u origin main
```

Import repo di [vercel.com](https://vercel.com). Set **Root Directory** ke `public` di Project Settings, lalu deploy.

## Data Source

Dataset KBBI diambil dari REST API:

```
GET https://api.ivoid.cfd/tools/kbbi
```

Mengembalikan 71.093 kata dalam format array string. Konfigurasi sumber data dapat diubah di `public/js/data.js` dengan mengganti nilai `mode`:

| Mode | URL | Keterangan |
|------|-----|------------|
| `github` | `https://api.ivoid.cfd/tools/kbbi` | Default, direkomendasikan |
| `local` | `/data/kbbi.json` | Host file sendiri |
| `api` | Custom | Unofficial API lain |

## Fitur

- Filter kata berdasarkan awalan, akhiran, atau kombinasi keduanya
- Highlight awalan (biru) dan akhiran (merah) pada hasil pencarian
- Klik kata untuk menyalin ke clipboard
- Pagination otomatis untuk hasil yang banyak

## Credit

Dataset KBBI — [dyazincahya/KBBI-SQL-database](https://github.com/dyazincahya/KBBI-SQL-database)
