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

## 👥 Profil Pengguna (User Personas)

Aplikasi SimaRukun mendukung **4 role** yang berbeda, sesuai dengan PRD:

| **Role** | **Deskripsi** | **Tugas Utama** |
|----------|--------------|------------------|
| **Super Admin** | Pengembang/Pemilik Sistem | Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime. |
| **Supervisor** | Ketua RT/RW | Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial. |
| **Admin/Staff** | Sekretaris/Bendahara | Mengelola data warga, memantau pembayaran iuran otomatis/manual, membuat pengumuman, dan menindaklanjuti laporan warga. |
| **Warga** | Kepala Keluarga/Anggota Keluarga | Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan (aduan/keamanan). |

---

## 📚 Daftar Isi

1. [Deskripsi Proyek](#-deskripsi-proyek)
2. [Tujuan dan Goal](#-tujuan-dan-goal)
3. [Profil Pengguna](#-profil-pengguna-user-personas)
4. [Daftar Isi](#-daftar-isi)
5. [Panduan Instalasi](INSTALL.md)
6. [Panduan Pengguna](USER.md)
7. [Struktur Proyek](#-struktur-proyek)
8. [Tech Stack](#-tech-stack)
9. [Fitur Utama](#-fitur-utama)
10. [Keamanan dan Privasi](#-keamanan-dan-privasi)
11. [Demo Credentials](#-demo-credentials)
12. [Kontribusi](#-kontribusi)
13. [Lisensi](#-lisensi)

---

## 📖 Panduan

- **[Panduan Instalasi](INSTALL.md)** – Langkah-langkah untuk menginstal dan menjalankan proyek secara lokal.
- **[Panduan Pengguna](USER.md)** – Panduan penggunaan aplikasi untuk semua role.

---

## 🗂️ Struktur Proyek

```
simarukun/
├── apps/
│   └── web/                          # Frontend (Next.js)
│       ├── public/                   # Asset statis
│       ├── src/
│       │   ├── components/           # Komponen reusable
│       │   │   └── Layout.tsx         # Layout dengan navigasi berbasis role
│       │   ├── contexts/              # Context API (Auth)
│       │   │   └── AuthContext.tsx    # Context untuk autentikasi
│       │   ├── lib/                   # Helper functions
│       │   │   └── auth.ts            # Helper autentikasi (login, logout, hasAccess)
│       │   ├── types/                 # Tipe data
│       │   │   └── user.ts            # Tipe User dan Role (4 roles)
│       │   ├── middleware.ts          # Proteksi route (server-side)
│       │   └── pages/                 # Halaman aplikasi
│       │       ├── index.tsx         # Dashboard (berbeda per role)
│       │       ├── login.tsx          # Halaman Login
│       │       ├── warga/
│       │       │   └── index.tsx       # Daftar Warga (superadmin, supervisor, admin)
│       │       ├── iuran/
│       │       │   └── index.tsx       # Daftar Iuran (superadmin, supervisor, admin)
│       │       ├── aduan/
│       │       │   ├── index.tsx       # Daftar Aduan (superadmin, supervisor, admin)
│       │       │   └── buat.tsx        # Buat Aduan (superadmin, supervisor, admin)
│       │       ├── laporan/
│       │       │   └── index.tsx       # Laporan (superadmin, supervisor)
│       │       ├── backup/
│       │       │   └── index.tsx       # Backup (superadmin only)
│       │       ├── webhook/
│       │       │   └── index.tsx       # Webhook (superadmin only)
│       │       ├── server/
│       │       │   └── index.tsx       # Server (superadmin only)
│       │       └── pengaturan.tsx      # Pengaturan (semua role)
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

### **🔐 Autentikasi & Otorisasi (RBAC)**
- **4 Role**: Super Admin, Supervisor, Admin, Warga.
- **Proteksi Route**: Server-side (middleware) + Client-side (hasAccess).
- **Tidak Ada Akses Shortcut**: Semua percobaan akses ilegal akan diredirect.

### **📊 Dashboard (Berbeda per Role)**
- **Super Admin**: Statistik lengkap + Backup/Webhook/Server status.
- **Supervisor**: Statistik + Laporan Eksekutif + Persetujuan.
- **Admin**: Statistik Warga, Iuran, Aduan, Laporan.
- **Warga**: Status Iuran, Aduan Saya, Pengumuman.

### **👥 Manajemen Warga** (Super Admin, Supervisor, Admin)
- Daftar warga dengan filter pencarian.
- Status warga (Aktif) dan status iuran (Lunas/Belum).
- Tombol aksi (Edit, Hapus) - hanya untuk Admin ke atas.

### **💰 Manajemen Iuran** (Super Admin, Supervisor, Admin)
- Daftar iuran dengan status (Lunas/Belum).
- Pencarian berdasarkan bulan/status.
- Lihat detail iuran.

### **📝 Manajemen Aduan** (Super Admin, Supervisor, Admin)
- Daftar aduan dengan status (Belum Ditangani/Diproses/Selesai).
- Form untuk membuat aduan baru.
- Filter pencarian.

### **📄 Laporan** (Super Admin, Supervisor)
- Laporan Keuangan, Aduan, Warga, Eksekutif.
- Export laporan.
- Super Admin: Lihat status Backup dan Webhook.

### **💾 Backup** (Super Admin only)
- Buat backup baru.
- Restore backup.
- Download backup.
- Statistik backup.

### **🔌 Webhook** (Super Admin only)
- Monitor status webhook.
- Test webhook.
- Toggle webhook.
- Statistik webhook.

### **🖥️ Server** (Super Admin only)
- Monitor uptime, CPU, Memory, Bandwidth.
- Kontrol server (Restart, Optimize).
- Aktivitas terbaru.

### **⚙️ Pengaturan** (Semua Role)
- Edit profil (nama, email).
- Toggle notifikasi.
- Lihat informasi akun (role, ID).
- **Super Admin**: Panel khusus (Backup, Webhook, Server).
- **Supervisor**: Panel khusus (Laporan Eksekutif, Persetujuan).

---

## 🔒 Keamanan dan Privasi

### **1. Role-Based Access Control (RBAC)**

| **Role** | **Halaman yang Bisa Diakses** |
|----------|--------------------------------------|
| **Super Admin** | Semua halaman (`/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan`, `/backup`, `/webhook`, `/server`) |
| **Supervisor** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan` |
| **Admin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan` |
| **Warga** | `/`, `/pengaturan` |

### **2. Proteksi Route**
- **Server-side**: `middleware.ts` memastikan tidak ada akses langsung via URL tanpa autentikasi.
- **Client-side**: Setiap halaman memeriksa `hasAccess()` sebelum render.

### **3. Tidak Ada Akses Shortcut**
- Contoh: Warga **tidak bisa** mengakses `/warga`, `/iuran`, `/aduan`.
- Contoh: Admin **tidak bisa** mengakses `/backup`, `/webhook`, `/server`.
- Semua percobaan akses ilegal akan **diredirect ke `/login` atau `/`**.

---

## 🔑 Demo Credentials

Anda bisa mencoba login dengan akun demo berikut:

| **Role** | **Email** | **Password** | **Akses** |
|----------|-----------|--------------|-----------|
| Super Admin | `superadmin@simarukun.com` | `superadmin123` | Semua halaman |
| Supervisor | `ketua@rt01.com` | `supervisor123` | Semua halaman kecuali Backup/Webhook/Server |
| Admin | `sekretaris@rt01.com` | `admin123` | Warga, Iuran, Aduan, Pengaturan |
| Warga | `joko@example.com` | `warga123` | Dashboard, Pengaturan |

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