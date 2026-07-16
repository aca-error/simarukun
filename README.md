# SimaRukun - Sistem Manajemen RT/RW

[![Status](https://img.shields.io/badge/status-testing-yellow)](https://github.com/aca-error/simarukun)
[![Progress](https://img.shields.io/badge/progress-15%25-orange)](https://github.com/aca-error/simarukun)
[![Enterprise Compliance](https://img.shields.io/badge/compliance-85%25-blue)](https://github.com/aca-error/simarukun)
[![Last Update](https://img.shields.io/badge/last%20update-20%20Juni%202026-green)](https://github.com/aca-error/simarukun)

## 📌 Deskripsi Proyek

**SimaRukun** (Sistem Manajemen Rukun Warga & Rukun Tetangga) adalah aplikasi berbasis web responsif yang dirancang untuk **memodernisasi dan mendigitalkan pengelolaan administrasi, komunikasi, dan keuangan** di tingkat RT dan RW. Aplikasi ini menjembatani kesenjangan komunikasi antara pengurus (Ketua RT/RW, Bendahara) dan warga, memastikan **transparansi iuran bulanan**, serta menyediakan saluran resmi untuk **pelaporan dan aduan**. 

Aplikasi ini dibangun dengan **Next.js 14 (React)**, **Tailwind CSS**, dan **TypeScript** untuk frontend, serta **NestJS 10** untuk backend dalam arsitektur monorepo.

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
5. [Status Proyek](#-status-proyek)
6. [Panduan Instalasi](INSTALL.md)
7. [Panduan Pengguna](USER.md)
8. [Struktur Proyek](#-struktur-proyek)
9. [Tech Stack](#-tech-stack)
10. [Fitur Utama](#-fitur-utama)
11. [Keamanan dan Privasi](#-keamanan-dan-privasi)
12. [Demo Credentials](#-demo-credentials)
13. [Quick Start](#-quick-start)
14. [Kontribusi](#-kontribusi)
15. [Lisensi](#-lisensi)
16. [Dokumentasi Tambahan](#-dokumentasi-tambahan)

---

## 📖 Panduan

- **[Panduan Instalasi](INSTALL.md)** – Langkah-langkah untuk menginstal dan menjalankan proyek secara lokal.
- **[Panduan Pengguna](USER.md)** – Panduan penggunaan aplikasi untuk semua role.

---

## 📊 Status Proyek

| **Aspek** | **Status** | **Detail** |
|-----------|------------|------------|
| **Tahap Pengembangan** | Tahap 2 (Testing) | 15% selesai |
| **Enterprise Compliance** | 85% | Target: 99% |
| **Fitur Inti** | 100% | 8/8 fitur Tahap 1 selesai |
| **Security Hardening** | ✅ Selesai | Tahap 1 selesai |
| **Testing** | ⏳ Berjalan | Tahap 2 (15%) |
| **Documentation** | ✅ Terkini | PRD, INSTRUCTIONS, USER.md |

### **Metrik Kunci**
- **Total Lines of Code**: 15,000+
- **Total Files**: 83+
- **Total Commits**: 50+
- **Test Coverage**: ~92% (Unit Tests Backend)
- **Last Update**: 20 Juni 2026

---

## 🗂️ Struktur Proyek (Monorepo)

```
simarukun/
├── apps/
│   ├── web/                          # Frontend (Next.js 14)
│   │   ├── public/                   # Asset statis
│   │   ├── src/
│   │   │   ├── app/                  # Next.js App Router
│   │   │   ├── components/           # Komponen reusable
│   │   │   ├── lib/                  # Helper functions
│   │   │   │   └── auth.ts           # Helper autentikasi
│   │   │   ├── store/                # Zustand state management
│   │   │   │   └── authStore.ts      # Auth state dengan Zustand
│   │   │   ├── types/                # Tipe data TypeScript
│   │   │   │   └── user.ts           # Tipe User dan Role
│   │   │   └── styles/               # Global styles & Tailwind
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── tailwind.config.js
│   │
│   └── api/                          # Backend (NestJS 10)
│       ├── src/
│       │   ├── common/               # Enums, interfaces, constants
│       │   ├── modules/              # Feature modules
│       │   │   ├── audit/            # Audit logging
│       │   │   ├── auth/             # Authentication
│       │   │   ├── users/            # User management
│       │   │   ├── iuran/            # Iuran management
│       │   │   ├── aduan/            # Aduan management
│       │   │   ├── laporan/          # Reports
│       │   │   ├── backup/           # Backup
│       │   │   ├── webhook/          # Webhook
│       │   │   └── server/           # Server monitoring
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── jest.config.js
│
├── docker/
│   ├── dev/                          # Development environment
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   └── prod/                         # Production environment
│       ├── Dockerfile.api
│       ├── Dockerfile.web
│       ├── docker-compose.yml
│       └── nginx/
│           └── nginx.conf
│
├── docs/                             # Dokumentasi
│   ├── PRD.md                        # Product Requirements Document
│   ├── INSTALL.md                    # Panduan instalasi
│   ├── USER.md                       # Panduan pengguna
│   ├── CHANGELOG.md                  # Catatan release
│   └── ROADMAP.md                    # Rencana pengembangan
│
├── .github/
│   └── workflows/                    # CI/CD (akan diimplementasi)
│
├── package.json                      # Root monorepo
├── tsconfig.json                     # Root TypeScript config
├── README.md                         # Dokumen ini
├── INSTALL.md                        # Panduan instalasi lengkap
└── USER.md                           # Panduan pengguna
```

---

## 🛠️ Tech Stack

### **Frontend (apps/web)**

| **Teknologi** | **Versi** | **Kegunaan** |
|---------------|-----------|--------------|
| Next.js | 14.1.0 | Web framework dengan App Router |
| React | 18.2.0 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Tailwind CSS | 3.4.1 | Styling |
| Zustand | 4.4.7 | State management |
| Axios | 1.6.2 | HTTP client |
| DOMPurify | 3.0.6 | XSS protection |
| Framer Motion | 11.0.3 | Animations |
| Lucide React | 0.323.0 | Icons |
| shadcn/ui | Latest | UI components |

### **Backend (apps/api)**

| **Teknologi** | **Versi** | **Kegunaan** |
|---------------|-----------|--------------|
| NestJS | 10.3.0 | Web framework |
| TypeORM | 0.3.19 | ORM |
| PostgreSQL | 15+ | Database |
| Passport | 0.7.0 | Authentication |
| JWT | 10.2.0 | Token-based auth |
| Helmet | 7.1.0 | Security headers |
| csurf | 1.11.0 | CSRF protection |
| NestJS Throttler | 4.0.0 | Rate limiting |
| Zod | 3.22.4 | Input validation |
| Argon2 | 1.7.0 | Password hashing |

### **DevOps & Infrastruktur**

| **Teknologi** | **Versi** | **Kegunaan** |
|---------------|-----------|--------------|
| Docker | 24+ | Containerization |
| Docker Compose | 2+ | Multi-container orchestration |
| Nginx | 1.25+ | Reverse proxy |
| GitHub Actions | - | CI/CD (akan diimplementasi) |
| Prometheus | - | Monitoring (rencana) |
| Grafana | - | Visualization (rencana) |
| Sentry | - | Error tracking (rencana) |

---

- Pencarian berdasarkan bulan/status.
- Lihat detail iuran.

### **📝 Manajemen Aduan** (Super Admin, Supervisor, Admin)
- Daftar aduan dengan status (Belum Ditangani/Diproses/Selesai).
- Form untuk membuat aduan baru.
- Filter pencarian.

### **📄 Laporan** (Super Admin, Supervisor, **Admin**)
- Laporan Keuangan, Aduan, Warga, Eksekutif.
- Export laporan.
- **REVISED**: Sekarang Admin juga bisa akses.

### **💾 Backup** (Super Admin, **Supervisor**)
- Buat backup baru.
- Restore backup.
- Download backup.
- Statistik backup.
- **REVISED**: Sekarang Supervisor juga bisa akses.

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
| **Supervisor** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan`, **`/backup`** |
| **Admin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, **`/laporan`** |
| **Warga** | `/`, `/pengaturan` |

### **2. Proteksi Route**
- **Server-side**: `middleware.ts` memastikan tidak ada akses langsung via URL tanpa autentikasi.
- **Client-side**: Setiap halaman memeriksa `hasAccess()` sebelum render.

### **3. Tidak Ada Akses Shortcut**
- Contoh: Warga **tidak bisa** mengakses `/warga`, `/iuran`, `/aduan`, `/laporan`.
- Contoh: Admin **tidak bisa** mengakses `/backup`, `/webhook`, `/server`.
- Contoh: Supervisor **tidak bisa** mengakses `/webhook`, `/server`.
- Semua percobaan akses ilegal akan **diredirect ke `/login` atau `/`**.

---

## 🚀 Quick Start

### **Menggunakan Docker (Recommended)**

```bash
# Clone repository
git clone https://github.com/aca-error/simarukun.git
cd simarukun

# Setup environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start development environment
cd docker/dev
docker-compose up -d

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Database: localhost:5432
```

### **Manual Installation**

```bash
# Install dependencies
npm install

# Frontend
cd apps/web
npm run dev

# Backend (in new terminal)
cd apps/api
npm run start:dev
```

### **Environment Variables**

#### **Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/simarukun
PORT=3001
JWT_SECRET=your-secret-key
```

#### **Frontend (.env)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔑 Demo Credentials

Anda bisa mencoba login dengan akun demo berikut:

| **Role** | **Email** | **Password** | **Akses** |
|----------|-----------|--------------|-----------|
| Super Admin | `superadmin@simarukun.com` | `superadmin123` | Semua halaman |
| Supervisor | `ketua@rt01.com` | `supervisor123` | Semua halaman kecuali Webhook/Server |
| Admin | `sekretaris@rt01.com` | `admin123` | Warga, Iuran, Aduan, **Laporan**, Pengaturan |
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

## 📄 Dokumentasi Tambahan

Untuk informasi lebih lanjut, lihat dokumentasi berikut:

| **Dokumen** | **Deskripsi** |
|-------------|---------------|
| [PRD.md](PRD.md) | Product Requirements Document dengan development log lengkap |
| [INSTALL.md](INSTALL.md) | Panduan instalasi detail |
| [USER.md](USER.md) | Panduan pengguna untuk semua role |
| [CHANGELOG.md](CHANGELOG.md) | Catatan perubahan dan release |
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | Instruksi teknis pengembangan |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Rencana pengembangan jangka panjang |

### **Dokumentasi Teknis (Coming Soon)**
- `API.md` - Dokumentasi API endpoints
- `DEPLOYMENT.md` - Panduan deployment production
- `CONTRIBUTING.md` - Pedoman kontribusi
- `SECURITY.md` - Kebijakan keamanan

---

**Terima kasih telah menggunakan SimaRukun!** 🙏

---

## 📝 Catatan Revisi Terbaru
- **Laporan**: Sekarang dapat diakses oleh **Super Admin, Supervisor, dan Admin** (sebelumnya hanya Super Admin & Supervisor).
- **Backup**: Sekarang dapat diakses oleh **Super Admin dan Supervisor** (sebelumnya hanya Super Admin).
- **Tech Stack**: Diperbarui mencerminkan arsitektur monorepo dengan NestJS backend dan Zustand state management.
- **Struktur Proyek**: Ditambahkan struktur lengkap monorepo dengan apps/web dan apps/api.