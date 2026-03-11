# kbbi-sambung-kata

> Web tool untuk mencari kata KBBI berdasarkan awalan, akhiran, dan pola huruf. Dibuat untuk membantu strategi bermain game Sambung Kata dan Lengkapi Kata di Roblox.

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

Mengembalikan 71.093 kata dalam format array string. Konfigurasi sumber data dapat diubah di `public/js/data.js`.

## Fitur

**Mode Sambung Kata** — filter kata berdasarkan awalan, akhiran, atau kombinasi keduanya.

**Mode Lengkapi Kata** — cari kata berdasarkan pola huruf menggunakan `_` sebagai wildcard per huruf. Contoh: `b_t_` akan menemukan kata seperti batu, beti, buta.

Klik kata untuk menyalin ke clipboard. Hasil dipaginasi otomatis.

## Credit

Dataset KBBI — [dyazincahya/KBBI-SQL-database](https://github.com/dyazincahya/KBBI-SQL-database)
