# SimaRukun - Sistem Manajemen RT/RW

## 📌 Deskripsi Proyek

**SimaRukun** (Sistem Manajemen Rukun Warga & Rukun Tetangga) adalah aplikasi berbasis web responsif yang dirancang untuk **memodernisasi dan mendigitalkan pengelolaan administrasi, komunikasi, dan keuangan** di tingkat RT dan RW. Aplikasi ini menjembatani kesenjangan komunikasi antara pengurus (Ketua RT/RW, Bendahara) dan warga, memastikan **transparansi iuran bulanan**, serta menyediakan saluran resmi untuk **pelaporan dan aduan**. 

Aplikasi ini dibangun dengan **Next.js (React)**, **Tailwind CSS**, dan **TypeScript** untuk frontend, serta **Node.js** dan **Laravel** untuk backend (dalam pengembangan).

---

## 🎯 Tujuan dan Goal

### **Tujuan Utama**
- **Efisiensi Administrasi**: Mengurangi waktu yang dihabiskan pengurus untuk menagih iuran dan mencatat data warga secara manual.
- **Transparansi Keuangan**: Warga dapat melihat status iuran mereka dan laporan kas RT/RW secara *real-time*.
- **Respons Cepat Aduan**: Mengelola dan melacak status aduan warga secara sistematis dengan notifikasi instan.
- **Keamanan Data**: Melindungi data pribadi warga dengan standar keamanan tinggi untuk setiap akses.

### **Metrik Kesuksesan (KPIs)**
- **Adopsi Pengguna**: 80% Kepala Keluarga (KK) terdaftar di Web dan 90% terhubung dengan Bot dalam 3 bulan pertama.
- **Kolektibilitas Iuran**: Peningkatan pembayaran iuran tepat waktu sebesar 30% pada bulan kedua.
- **Resolusi Aduan**: Waktu rata-rata respons awal pengurus terhadap aduan di bawah 2 jam.

---

## 📚 Daftar Isi

1. [Deskripsi Proyek](#-deskripsi-proyek)
2. [Tujuan dan Goal](#-tujuan-dan-goal)
3. [Daftar Isi](#-daftar-isi)
4. [Panduan Instalasi](INSTALL.md)
5. [Panduan Pengguna](USER.md)
6. [Struktur Proyek](#-struktur-proyek)
7. [Tech Stack](#-tech-stack)
8. [Fitur Utama](#-fitur-utama)
9. [Keamanan dan Privasi](#-keamanan-dan-privasi)
10. [Kontribusi](#-kontribusi)
11. [Lisensi](#-lisensi)

---

## 📖 Panduan

- **[Panduan Instalasi](INSTALL.md)** – Langkah-langkah untuk menginstal dan menjalankan proyek secara lokal.
- **[Panduan Pengguna](USER.md)** – Panduan penggunaan aplikasi untuk Admin dan Warga.

---

## 🗂️ Struktur Proyek

```
simarukun/
├── apps/
│   └── web/                          # Frontend (Next.js)
│       ├── public/                   # Asset statis
│       ├── src/
│       │   ├── components/           # Komponen reusable
│       │   ├── contexts/              # Context API (Auth)
│       │   ├── lib/                   # Helper functions
│       │   ├── middleware.ts          # Proteksi route
│       │   ├── types/                 # Tipe data
│       │   └── pages/                 # Halaman aplikasi
│       │       ├── login.tsx          # Halaman Login
│       │       ├── warga/             # Halaman Warga (admin-only)
│       │       ├── iuran/             # Halaman Iuran (admin-only)
│       │       ├── aduan/             # Halaman Aduan (admin-only)
│       │       └── pengaturan.tsx     # Halaman Pengaturan
│       ├── package.json
│       ├── next.config.js
│       ├── tsconfig.json
│       └── tailwind.config.js
├── INSTALL.md                        # Panduan instalasi
├── USER.md                           # Panduan pengguna
└── README.md                         # Dokumen ini
```

---

## 🛠️ Tech Stack

| **Layer**       | **Teknologi**                          | **Kegunaan**                          |
|-----------------|----------------------------------------|---------------------------------------|
| **Frontend**    | Next.js, React, TypeScript, Tailwind CSS | UI/UX responsif dan modern.           |
| **State**       | React Context API                      | Manajemen state autentikasi.          |
| **Icons**       | Lucide React                           | Icon modern dan ringan.                |
| **Animasi**     | Framer Motion                          | Animasi halus untuk UI.               |
| **Backend**     | Node.js, Laravel                       | API dan logic bisnis (dalam pengembangan). |
| **Database**    | SQLite (dev), MySQL/PostgreSQL (prod)   | Penyimpanan data.                     |
| **Docker**      | Docker, Docker Compose                 | Containerisasi aplikasi dan database. |

---

## ✨ Fitur Utama

### **🔐 Autentikasi & Otorisasi**
- **Role-Based Access Control (RBAC)**: Admin dan Warga memiliki akses yang berbeda.
- **Proteksi Route**: Tidak ada akses langsung via URL tanpa autentikasi.
- **Login/Logout**: Sistem autentikasi dengan demo credentials.

### **📊 Dashboard**
- **Admin**: Statistik Jumlah Warga, Iuran Terkumpul, Aduan Baru, Laporan.
- **Warga**: Status Iuran dan Aduan Saya.

### **👥 Manajemen Warga** (Admin-only)
- Daftar warga dengan filter pencarian.
- Status warga dan iuran.
- Tombol aksi (Edit, Hapus).

### **💰 Manajemen Iuran** (Admin-only)
- Daftar iuran dengan status (Lunas/Belum).
- Pencarian berdasarkan bulan/status.

### **📝 Manajemen Aduan** (Admin-only)
- Daftar aduan dengan status (Belum Ditangani/Diproses/Selesai).
- Form untuk membuat aduan baru.

### **⚙️ Pengaturan** (Admin & Warga)
- Edit profil (nama, email).
- Toggle notifikasi.
- Lihat role user.

---

## 🔒 Keamanan dan Privasi

### **1. Role-Based Access Control (RBAC)**
| **Role**  | **Halaman yang Bisa Diakses**                          |
|-----------|-------------------------------------------------------|
| **Admin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`        |
| **Warga** | `/`, `/pengaturan`                                    |

### **2. Proteksi Route**
- **Server-side**: `middleware.ts` memastikan tidak ada akses langsung via URL tanpa autentikasi.
- **Client-side**: Setiap halaman memeriksa `hasAccess()` sebelum render.

### **3. Tidak Ada Akses Shortcut**
- Warga **tidak bisa** mengakses `/warga`, `/iuran`, `/aduan`, atau `/warga/[id]`.
- Semua percobaan akses ilegal akan **diredirect ke `/login` atau `/`**.

---

## 🤝 Kontribusi

Proyek ini dikembangkan oleh **LeChat (AI Assistant)** atas permintaan **Priyo Gunawan**. Saat ini, pengembangan dilakukan secara **mandiri** tanpa tim pengembang manusia.

Jika Anda ingin berkontribusi, silakan:
1. Fork repository ini.
2. Buat branch baru (`git checkout -b fitur-baru`).
3. Commit perubahan (`git commit -am 'Menambahkan fitur baru'`).
4. Push ke branch (`git push origin fitur-baru`).
5. Buat Pull Request.

---

## 📜 Lisensi

Proyek ini **belum memiliki lisensi resmi**. Hak cipta dan penggunaan proyek ini sepenuhnya milik **Priyo Gunawan**.

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:
- **Owner**: [Priyo Gunawan](https://github.com/aca-error)
- **Repository**: [aca-error/simarukun](https://github.com/aca-error/simarukun)

---

**Terima kasih telah menggunakan SimaRukun!** 🙏