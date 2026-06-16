# SimaRukun - Sistem Manajemen RT/RW

## Deskripsi
SimaRukun adalah aplikasi berbasis web responsif yang dirancang untuk memodernisasi dan mendigitalkan pengelolaan administrasi, komunikasi, dan keuangan di tingkat RT dan RW.

## Struktur Proyek
```
simarukun/
├── apps/
│   └── web/                  # Frontend (Next.js)
│       ├── public/
│       │   └── assets/       # Icon, gambar, dll.
│       ├── src/
│       │   ├── components/   # Komponen reusable
│       │   ├── pages/        # Halaman utama
│       │   ├── styles/       # Global CSS, Tailwind config
│       │   ├── lib/          # Utility functions
│       │   ├── types/        # TypeScript types
│       │   └── hooks/        # Custom hooks
│       ├── package.json
│       ├── next.config.js
│       ├── tsconfig.json
│       └── tailwind.config.js
└── README.md
```

## Cara Menjalankan (Development)
1. Pindah ke direktori frontend:
   ```bash
   cd apps/web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Buka browser di [http://localhost:3000](http://localhost:3000)

## Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, TypeScript
- **Icons**: Lucide React, Heroicons
- **Animasi**: Framer Motion

## Fitur
- Dashboard dengan statistik warga, iuran, aduan, dan laporan
- Menu di pojok kiri bawah yang memunculkan panel isi
- Desain bergaya gabungan Windows 11 dan admin panel
- Warna dan icon trend 2026

## Catatan
- Saat ini hanya frontend UI/UX yang dikembangkan.
- Backend (Node.js dan Laravel) akan dikembangkan selanjutnya.