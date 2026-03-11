# KBBI Sambung Kata

Tool pencari kata KBBI berdasarkan awalan & akhiran, buat main Sambung Kata di Roblox.

## Struktur

```
kbbi-sambung-kata/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── data.js   ← konfigurasi sumber data
│   │   └── app.js    ← logic utama
│   └── data/
│       └── kbbi.json ← taruh file KBBI di sini
├── vercel.json
├── package.json
└── README.md
```

## Setup & Deploy

### 1. Tambah database KBBI

Download `kbbi.json` dari:
https://github.com/dyazincahya/KBBI-SQL-database

Taruh di `public/data/kbbi.json`

### 2. Deploy ke Vercel

```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "init"
git remote add origin https://github.com/username/kbbi-sk.git
git push -u origin main

# Lalu import di vercel.com
```

### 3. Dev lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

## Ganti Sumber Data

Edit `public/js/data.js`, ubah nilai `mode`:

| Mode     | Keterangan                                   |
|----------|----------------------------------------------|
| `local`  | `/data/kbbi.json` yang lu host sendiri ✅    |
| `github` | Fetch dari GitHub raw (bisa kena CORS)       |
| `api`    | Fetch dari unofficial API                    |

## Fitur

- Filter awalan + akhiran (bisa kombinasi)
- Filter panjang kata (min/max huruf)
- Highlight awalan (biru) & akhiran (merah)
- Klik kata → copy ke clipboard
- Random kata berakhiran huruf langka (X, Z, Q, Y...)
- Pagination otomatis
