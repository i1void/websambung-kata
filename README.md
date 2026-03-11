# KBBI Sambung Kata

> Tool pencari kata KBBI berdasarkan awalan & akhiran — buat main Sambung Kata di Roblox.

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/username/kbbi-sk.git
cd kbbi-sk
npm install
```

### 2. Tambah database KBBI

Download `kbbi.json` dari repo berikut:

```
https://github.com/dyazincahya/KBBI-SQL-database
```

Taruh file-nya di `public/data/kbbi.json`.

### 3. Jalankan lokal

```bash
npm run dev
# buka http://localhost:3000
```

---

## Deploy ke Vercel

```bash
git add .
git commit -m "init"
git remote add origin https://github.com/username/kbbi-sk.git
git push -u origin main
```

Lalu import repo di [vercel.com](https://vercel.com) — langsung jalan, no config needed.

---

## Ganti Sumber Data

Edit nilai `mode` di `public/js/data.js`:

| Mode | Keterangan |
|------|------------|
| `local` | Pakai `/data/kbbi.json` yang dihost sendiri ✅ |
| `github` | Fetch dari GitHub raw (bisa kena CORS) |
| `api` | Fetch dari unofficial API |

Mode `local` paling direkomendasikan untuk Vercel.

---

## Fitur

- Filter kata by **awalan**, **akhiran**, atau kombinasi keduanya
- Filter **panjang kata** (min & max huruf)
- **Highlight** awalan (biru) dan akhiran (merah)
- Klik kata → **copy** ke clipboard otomatis
- Tombol **Random Langka** — auto filter kata berakhiran huruf susah (X, Z, Q, Y, W, V)
- **Pagination** otomatis untuk hasil yang banyak


