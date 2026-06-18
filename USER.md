# Panduan Pengguna SimaRukun

Panduan ini akan memandu Anda untuk **menggunakan aplikasi SimaRukun** sesuai dengan **role** Anda. Aplikasi mendukung **4 role** yang berbeda: **Super Admin**, **Supervisor**, **Admin/Staff**, dan **Warga**. Pastikan Anda telah menginstal aplikasi terlebih dahulu (lihat **[Panduan Instalasi](INSTALL.md)**).

---

## 📌 Daftar Isi

1. [Profil Pengguna (User Roles)](#-profil-pengguna-user-roles)
2. [Login](#-login)
3. [Dashboard](#-dashboard)
4. [Fitur Umum](#-fitur-umum)
5. [Halaman Super Admin](#-halaman-super-admin)
6. [Halaman Supervisor](#-halaman-supervisor)
7. [Halaman Admin/Staff](#-halaman-adminstaff)
8. [Halaman Warga](#-halaman-warga)
9. [Pengaturan](#-pengaturan)
10. [Keamanan & Privasi](#-keamanan--privasi)
11. [Demo Credentials](#-demo-credentials)
12. [FAQ](#-faq)

---

## 👥 Profil Pengguna (User Roles)

Aplikasi SimaRukun mendukung **4 role** yang berbeda:

| **Role** | **Deskripsi** | **Tugas Utama** |
|----------|--------------|------------------|
| **Super Admin** | Pengembang/Pemilik Sistem | Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime. |
| **Supervisor** | Ketua RT/RW | Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial. |
| **Admin/Staff** | Sekretaris/Bendahara | Mengelola data warga, memantau pembayaran iuran otomatis/manual, membuat pengumuman, dan menindaklanjuti laporan warga. |
| **Warga** | Kepala Keluarga/Anggota Keluarga | Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan (aduan/keamanan). |

---

## 🔐 Login

### **Cara Login**
1. Buka aplikasi di **[http://localhost:3000](http://localhost:3000)**.
2. Masukkan **Email** dan **Kata Sandi**.
3. Klik tombol **"Masuk"**.
4. Anda akan diarahkan ke **Dashboard** yang sesuai dengan role Anda.

### **Demo Credentials**
Gunakan akun demo berikut untuk mencoba aplikasi:

| **Role** | **Email** | **Password** | **Akses** |
|----------|-----------|--------------|-----------|
| **Super Admin** | `superadmin@simarukun.com` | `superadmin123` | Semua halaman (termasuk Backup, Webhook, Server) |
| **Supervisor** | `ketua@rt01.com` | `supervisor123` | Semua halaman kecuali Webhook, Server |
| **Admin** | `sekretaris@rt01.com` | `admin123` | Warga, Iuran, Aduan, **Laporan**, Pengaturan |
| **Warga** | `joko@example.com` | `warga123` | Dashboard, Pengaturan |

---

## 📊 Dashboard

Dashboard menampilkan **statistik ringkasan** yang **berbeda tergantung pada role** Anda.

### **Untuk Super Admin**
- **Jumlah Warga**: Total warga yang terdaftar.
- **Iuran Terkumpul**: Total iuran yang sudah dibayar.
- **Aduan Baru**: Jumlah aduan yang belum ditangani.
- **Laporan**: Jumlah laporan yang tersedia.
- **Backup Status**: Status backup terakhir.
- **Webhook Status**: Status webhook.
- **Server Uptime**: Persentase uptime server.

### **Untuk Supervisor**
- **Jumlah Warga**: Total warga yang terdaftar.
- **Iuran Terkumpul**: Total iuran yang sudah dibayar.
- **Aduan Baru**: Jumlah aduan yang belum ditangani.
- **Laporan Eksekutif**: Jumlah laporan eksekutif.
- **Persetujuan Tertunda**: Jumlah persetujuan yang tertunda.

### **Untuk Admin/Staff**
- **Jumlah Warga**: Total warga yang terdaftar.
- **Iuran Terkumpul**: Total iuran yang sudah dibayar.
- **Aduan Baru**: Jumlah aduan yang belum ditangani.
- **Laporan**: Jumlah laporan yang tersedia.

### **Untuk Warga**
- **Status Iuran**: Status pembayaran iuran Anda.
- **Aduan Saya**: Jumlah aduan yang Anda laporkan.
- **Pengumuman**: Jumlah pengumuman yang diterima.

---

## ✨ Fitur Umum

### **Navigasi Berdasarkan Role**
- Menu sidebar **akan menampilkan opsi yang sesuai** dengan role Anda.
- Contoh: Super Admin akan melihat menu **Backup**, **Webhook**, **Server**. 
- Contoh: Supervisor akan melihat menu **Backup**, **Laporan**. 
- Contoh: Admin akan melihat menu **Laporan**. 
- Contoh: Warga hanya akan melihat menu **Pengaturan**.

### **Proteksi Route**
- **Tidak ada akses langsung via URL** tanpa autentikasi.
- Jika mencoba mengakses halaman yang tidak sesuai dengan role, Anda akan **diredirect ke `/`** atau **`/login`**.

---

## 👑 Halaman Super Admin

> **🔐 HANYA BISA DIAKSES OLEH SUPER ADMIN**

Super Admin memiliki **akses penuh** ke semua fitur, termasuk:

### **1. Kelola Backup** (`/backup`)
- Buat backup database baru.
- Restore backup yang sudah ada.
- Download backup.
- Lihat statistik backup (total, sukses, terakhir, ukuran).

### **2. Kelola Webhook** (`/webhook`)
- Monitor status webhook (WhatsApp, Telegram, Payment Gateway).
- Test webhook.
- Toggle status webhook.
- Lihat statistik webhook.

### **3. Monitor Server** (`/server`)
- Lihat statistik server (Uptime, CPU Usage, Memory, Bandwidth, Connections, Response Time).
- Kontrol server (Restart, Optimize CPU, Reset Network).
- Lihat aktivitas terbaru.

### **4. Laporan** (`/laporan`)
- Lihat semua laporan (Keuangan, Aduan, Warga, Eksekutif).
- Export laporan.
- Lihat Laporan Khusus Super Admin (Backup Status, Webhook Status).

### **5. Manajemen Warga, Iuran, Aduan**
- Semua fitur yang dimiliki Admin.

---

## 👔 Halaman Supervisor

> **🔐 HANYA BISA DIAKSES OLEH SUPERVISOR (KETUA RT/RW)**

Supervisor memiliki akses ke **semua fitur admin** ditambah:

### **1. Laporan Eksekutif** (`/laporan`)
- Lihat laporan eksekutif RT/RW.
- Export laporan.
- **Tidak bisa** mengakses Laporan Khusus Super Admin.

### **2. Backup** (`/backup`)
- **REVISED**: Sekarang Supervisor bisa akses Backup.
- Buat backup database baru.
- Restore backup yang sudah ada.
- Download backup.
- Lihat statistik backup.

### **3. Persetujuan**
- Beri persetujuan untuk aduan/laporan krusial.
- Lihat daftar persetujuan yang tertunda.

### **4. Manajemen Warga, Iuran, Aduan**
- Semua fitur yang dimiliki Admin.

### **Pembatasan**
- **Tidak bisa** mengakses: `/webhook`, `/server`.

---

## 👨‍💼 Halaman Admin/Staff

> **🔐 HANYA BISA DIAKSES OLEH ADMIN (SEKRETARIS/BENDAHARA)**

Admin memiliki akses untuk **mengelola data RT/RW**:

### **1. Manajemen Warga** (`/warga`)
- **Daftar Warga**: Lihat semua warga yang terdaftar.
- **Pencarian**: Cari warga berdasarkan nama atau alamat.
- **Status**: Lihat status warga (Aktif) dan status iuran (Lunas/Belum).
- **Aksi**:
  - **Tambah Warga**: Tambahkan warga baru.
  - **Edit**: Ubah data warga.
  - **Hapus**: Hapus warga dari sistem.

### **2. Manajemen Iuran** (`/iuran`)
- **Daftar Iuran**: Lihat daftar iuran bulanan.
- **Status**: Lihat status pembayaran (Lunas/Belum).
- **Pencarian**: Cari iuran berdasarkan bulan atau status.
- **Detail**: Lihat detail iuran (tanggal pembayaran, jumlah).
- **Aksi**:
  - **Tambah Iuran**: Tambahkan iuran baru.
  - **Lihat Detail**: Lihat detail iuran.

### **3. Manajemen Aduan** (`/aduan`)
- **Daftar Aduan**: Lihat semua aduan yang dilaporkan.
- **Status**: Lihat status aduan (Belum Ditangani/Diproses/Selesai).
- **Pencarian**: Cari aduan berdasarkan judul atau status.
- **Aksi**:
  - **Buat Aduan**: Tambahkan aduan baru.
  - **Lihat Detail**: Lihat detail aduan.

#### **Status Aduan**
| **Status** | **Icon** | **Keterangan** |
|------------|----------|----------------|
| Belum Ditangani | ❌ | Aduan belum diproses. |
| Diproses | ⏳ | Aduan sedang diproses. |
| Selesai | ✅ | Aduan sudah selesai. |

### **4. Laporan** (`/laporan`)
- **REVISED**: Sekarang Admin bisa akses Laporan.
- Lihat laporan (Keuangan, Aduan, Warga).
- Export laporan.

### **Pembatasan**
- **Tidak bisa** mengakses: `/backup`, `/webhook`, `/server`.

---

## 👨‍👩‍👧‍👦 Halaman Warga

> **🔒 HANYA BISA MELIHAT DASHBOARD DAN PENGATURAN**

Sebagai **Warga**, Anda **hanya bisa**:

### **1. Dashboard** (`/`)
- Lihat **Status Iuran** Anda (Lunas/Belum).
- Lihat **Aduan Saya** (jumlah aduan yang dilaporkan).
- Lihat **Pengumuman** (jumlah pengumuman yang diterima).

### **2. Pengaturan** (`/pengaturan`)
- **Edit Profil**: Ubah nama dan email.
- **Preferensi**: Aktifkan/nonaktifkan notifikasi.
- **Informasi Akun**: Lihat role (Warga) dan ID user.

### **Pembatasan**
- **Tidak bisa** mengakses: `/warga`, `/iuran`, `/aduan`, `/laporan`, `/backup`, `/webhook`, `/server`.
- Semua percobaan akses akan **diredirect ke `/`**.

---

## ⚙️ Pengaturan

**URL**: `/pengaturan`

### **Fitur Umum (Semua Role)**
- **Edit Profil**: Ubah nama dan email.
- **Preferensi**: Aktifkan/nonaktifkan notifikasi.
- **Informasi Akun**: Lihat role, ID, dan email user.

### **Fitur Khusus per Role**

#### **Super Admin**
- **Panel Super Admin**:
  - Kelola Backup
  - Kelola Webhook
  - Monitor Server

#### **Supervisor**
- **Panel Supervisor**:
  - Lihat Laporan Eksekutif
  - Beri Persetujuan
  - **REVISED**: Kelola Backup

#### **Admin**
- **REVISED**: Sekarang Admin bisa melihat Laporan di Dashboard.

#### **Warga**
- Tidak ada panel khusus di Pengaturan.

### **Cara Menggunakan**
1. Klik menu **"Pengaturan"** di sidebar.
2. Ubah data profil jika diperlukan.
3. Aktifkan/nonaktifkan notifikasi.
4. Klik **"Simpan Perubahan"** untuk menyimpan.
5. Klik **"Logout"** untuk keluar dari akun.

---

## 🔒 Keamanan & Privasi

### **1. Role-Based Access Control (RBAC)**
Aplikasi menggunakan **sistem role** untuk membatasi akses:

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
- Contoh: Jika login sebagai **Warga** dan mencoba membuka `/warga/1` → **diredirect ke `/`**.
- Contoh: Jika login sebagai **Admin** dan mencoba membuka `/backup` → **diredirect ke `/`**.
- Contoh: Jika login sebagai **Supervisor** dan mencoba membuka `/webhook` → **diredirect ke `/`**.
- Contoh: Jika **tidak login** dan mencoba membuka `/warga` → **diredirect ke `/login`**.

---

## 💡 Tips & Trik

### **Untuk Super Admin**
- **Monitor server** secara berkala untuk memastikan uptime.
- **Backup data** secara rutin untuk mencegah kehilangan data.
- **Test webhook** untuk memastikan integrasi berjalan dengan baik.

### **Untuk Supervisor**
- **Lihat laporan eksekutif** untuk memantau kinerja RT/RW.
- **Beri persetujuan** dengan cepat untuk mempercepat proses.
- **Monitor aduan** untuk memastikan semua aduan ditangani.
- **REVISED**: Gunakan fitur Backup untuk mencadangkan data.

### **Untuk Admin**
- **Gunakan pencarian** untuk menemukan data dengan cepat.
- **Periksa status iuran** secara berkala untuk memastikan pembayaran tepat waktu.
- **Tangani aduan** dengan cepat untuk meningkatkan kepuasan warga.
- **REVISED**: Lihat laporan untuk memantau status keuangan.

### **Untuk Warga**
- **Laporkan aduan** jika ada masalah di lingkungan RT/RW.
- **Periksa status iuran** Anda secara berkala.
- **Jangan mencoba** mengakses halaman admin, karena akan diredirect.

---

## ❓ FAQ (Pertanyaan yang Sering Diajukan)

### **1. Mengapa saya tidak bisa mengakses halaman Backup/Webhook/Server?**
- **Jawaban**: Halaman-halaman tersebut **hanya untuk Super Admin dan Supervisor (Backup)**. Jika Anda login sebagai Admin atau Warga, Anda tidak memiliki akses ke halaman ini.

### **2. Mengapa saya tidak bisa mengakses halaman Laporan?**
- **Jawaban**: Halaman Laporan **untuk Super Admin, Supervisor, dan Admin**. Jika Anda login sebagai Warga, Anda tidak memiliki akses.

### **3. Mengapa saya tidak bisa mengakses halaman Warga/Iuran/Aduan?**
- **Jawaban**: Halaman-halaman tersebut **hanya untuk Super Admin, Supervisor, dan Admin**. Jika Anda login sebagai Warga, Anda tidak memiliki akses.

### **4. Bagaimana cara reset password?**
- **Jawaban**: Saat ini, fitur reset password **belum tersedia** (dalam pengembangan). Gunakan akun demo yang disediakan.

### **5. Apakah data saya aman?**
- **Jawaban**: Ya. Aplikasi ini menggunakan **Role-Based Access Control (RBAC)** untuk memastikan data Anda **tidak bisa diakses** oleh user dengan role yang berbeda.

### **6. Bagaimana cara menambahkan warga baru?**
- **Jawaban**: Login sebagai **Super Admin**, **Supervisor**, atau **Admin**, lalu buka halaman **Warga** dan klik **"Tambah Warga"**.

### **7. Bagaimana cara melihat laporan?**
- **Jawaban**: Login sebagai **Super Admin**, **Supervisor**, atau **Admin**, lalu buka halaman **Laporan**.

### **8. Apakah aplikasi ini bisa digunakan di mobile?**
- **Jawaban**: Ya. Aplikasi ini **responsif** dan bisa digunakan di **desktop, tablet, dan mobile**.

---

## 📝 Catatan Revisi
- **Laporan**: Sekarang dapat diakses oleh **Super Admin, Supervisor, dan Admin** (sebelumnya hanya Super Admin & Supervisor).
- **Backup**: Sekarang dapat diakses oleh **Super Admin dan Supervisor** (sebelumnya hanya Super Admin).

---

## 📞 Dukungan

Jika Anda mengalami kesulitan atau memiliki pertanyaan:
- Pastikan Anda mengikuti **[Panduan Instalasi](INSTALL.md)** dengan benar.
- Periksa **role** Anda dan pastikan Anda mengakses halaman yang sesuai.
- Hubungi **[Priyo Gunawan](https://github.com/aca-error)** untuk dukungan lebih lanjut.

---

**Terima kasih telah menggunakan SimaRukun!** 🙏