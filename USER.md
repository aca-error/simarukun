# Panduan Pengguna SimaRukun

Panduan ini akan memandu Anda untuk **menggunakan aplikasi SimaRukun** sebagai **Admin (Pengurus RT/RW)** atau **Warga**. Pastikan Anda telah menginstal aplikasi terlebih dahulu (lihat **[Panduan Instalasi](INSTALL.md)**).

---

## 📌 Daftar Isi

1. [Login](#-login)
2. [Dashboard](#-dashboard)
3. [Halaman Admin](#-halaman-admin)
   - [Manajemen Warga](#manajemen-warga)
   - [Manajemen Iuran](#manajemen-iuran)
   - [Manajemen Aduan](#manajemen-aduan)
4. [Halaman Warga](#-halaman-warga)
5. [Pengaturan](#-pengaturan)
6. [Keamanan & Privasi](#-keamanan--privasi)
7. [Demo Credentials](#-demo-credentials)

---

## 🔐 Login

### **Cara Login**
1. Buka aplikasi di **[http://localhost:3000](http://localhost:3000)**.
2. Masukkan **Email** dan **Kata Sandi**.
3. Klik tombol **"Masuk"**.
4. Anda akan diarahkan ke **Dashboard**.

### **Demo Credentials**
Gunakan akun demo berikut untuk mencoba aplikasi:

| **Role**  | **Email**            | **Password** | **Akses**                          |
|-----------|---------------------|--------------|------------------------------------|
| **Admin** | `admin@rt01.com`    | `admin123`   | Semua halaman (Warga, Iuran, Aduan). |
| **Warga** | `joko@example.com`  | `warga123`   | Dashboard & Pengaturan.             |

---

## 📊 Dashboard

Dashboard menampilkan **statistik ringkasan** yang berbeda tergantung pada role Anda.

### **Untuk Admin**
- **Jumlah Warga**: Total warga yang terdaftar.
- **Iuran Terkumpul**: Total iuran yang sudah dibayar.
- **Aduan Baru**: Jumlah aduan yang belum ditangani.
- **Laporan**: Jumlah laporan yang tersedia.

### **Untuk Warga**
- **Status Iuran**: Status pembayaran iuran Anda.
- **Aduan Saya**: Jumlah aduan yang Anda laporkan.

---

## 👥 Halaman Admin

> **⚠️ HANYA BISA DIAKSES OLEH ADMIN (PENGURUS RT/RW)**

### **Manajemen Warga**
**URL**: `/warga`

#### **Fitur**
- **Daftar Warga**: Lihat semua warga yang terdaftar.
- **Pencarian**: Cari warga berdasarkan nama atau alamat.
- **Status**: Lihat status warga (Aktif) dan status iuran (Lunas/Belum).
- **Aksi**:
  - **Edit**: Ubah data warga.
  - **Hapus**: Hapus warga dari sistem.

#### **Cara Menggunakan**
1. Klik menu **"Warga"** di sidebar.
2. Gunakan kotak pencarian untuk mencari warga.
3. Klik tombol **"Tambah Warga"** untuk menambahkan warga baru.
4. Klik ikon **Edit** (✏️) atau **Hapus** (🗑️) untuk mengelola data.

---

### **Manajemen Iuran**
**URL**: `/iuran`

#### **Fitur**
- **Daftar Iuran**: Lihat daftar iuran bulanan.
- **Status**: Lihat status pembayaran (Lunas/Belum).
- **Pencarian**: Cari iuran berdasarkan bulan atau status.
- **Detail**: Lihat detail iuran (tanggal pembayaran, jumlah).

#### **Cara Menggunakan**
1. Klik menu **"Iuran"** di sidebar.
2. Gunakan kotak pencarian untuk mencari iuran.
3. Klik tombol **"Tambah Iuran"** untuk menambahkan iuran baru.
4. Klik **"Lihat Detail"** untuk melihat detail iuran.

---

### **Manajemen Aduan**
**URL**: `/aduan`

#### **Fitur**
- **Daftar Aduan**: Lihat semua aduan yang dilaporkan.
- **Status**: Lihat status aduan (Belum Ditangani/Diproses/Selesai).
- **Pencarian**: Cari aduan berdasarkan judul atau status.
- **Buat Aduan**: Tambahkan aduan baru.
- **Detail**: Lihat detail aduan (deskripsi, foto, tanggal).

#### **Status Aduan**
| **Status**          | **Icon** | **Keterangan**                     |
|---------------------|----------|-----------------------------------|
| Belum Ditangani     | ❌       | Aduan belum diproses.             |
| Diproses           | ⏳       | Aduan sedang diproses.            |
| Selesai            | ✅       | Aduan sudah selesai.              |

#### **Cara Menggunakan**
1. Klik menu **"Aduan"** di sidebar.
2. Gunakan kotak pencarian untuk mencari aduan.
3. Klik tombol **"Buat Aduan"** untuk menambahkan aduan baru.
4. Klik **"Lihat Detail"** untuk melihat detail aduan.

---

## 👤 Halaman Warga

> **🔒 HANYA BISA MELIHAT DASHBOARD DAN PENGATURAN**

Sebagai **Warga**, Anda **tidak bisa** mengakses halaman **Warga**, **Iuran**, atau **Aduan**. Jika mencoba, Anda akan **diredirect ke halaman utama**.

### **Apa yang Bisa Dilakukan Warga?**
1. **Lihat Dashboard**:
   - Status iuran pribadi.
   - Jumlah aduan yang dilaporkan.
2. **Pengaturan**:
   - Edit profil (nama, email).
   - Atur preferensi notifikasi.

---

## ⚙️ Pengaturan

**URL**: `/pengaturan`

### **Fitur**
- **Edit Profil**: Ubah nama dan email.
- **Preferensi**: Aktifkan/nonaktifkan notifikasi.
- **Informasi Akun**: Lihat role dan ID user.

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

| **Role**  | **Halaman yang Bisa Diakses**                          |
|-----------|-------------------------------------------------------|
| **Admin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`        |
| **Warga** | `/`, `/pengaturan`                                    |

### **2. Proteksi Route**
- **Tidak ada akses langsung via URL** tanpa autentikasi.
- **Warga tidak bisa** mengakses `/warga`, `/iuran`, `/aduan`, atau `/warga/[id]`.
- Semua percobaan akses ilegal akan **diredirect ke `/login` atau `/`**.

### **3. Tidak Ada Akses Shortcut**
- Contoh: Jika Anda login sebagai **Warga** dan mencoba membuka `/warga/1`, Anda akan **diredirect ke `/`**.
- Contoh: Jika Anda **tidak login** dan mencoba membuka `/warga`, Anda akan **diredirect ke `/login`**.

---

## 💡 Tips & Trik

### **Untuk Admin**
- **Gunakan pencarian** untuk menemukan data dengan cepat.
- **Periksa status iuran** secara berkala untuk memastikan pembayaran tepat waktu.
- **Tangani aduan** dengan cepat untuk meningkatkan kepuasan warga.

### **Untuk Warga**
- **Laporkan aduan** jika ada masalah di lingkungan RT/RW.
- **Periksa status iuran** Anda secara berkala.
- **Jangan mencoba** mengakses halaman admin, karena akan diredirect.

---

## ❓ FAQ (Pertanyaan yang Sering Diajukan)

### **1. Mengapa saya tidak bisa mengakses halaman Warga?**
- **Jawaban**: Halaman Warga **hanya untuk Admin (Pengurus RT/RW)**. Jika Anda login sebagai Warga, Anda tidak memiliki akses ke halaman tersebut.

### **2. Bagaimana cara reset password?**
- **Jawaban**: Saat ini, fitur reset password **belum tersedia** (dalam pengembangan). Gunakan akun demo yang disediakan.

### **3. Apakah data saya aman?**
- **Jawaban**: Ya. Aplikasi ini menggunakan **Role-Based Access Control (RBAC)** untuk memastikan data Anda **tidak bisa diakses** oleh user lain.

### **4. Bagaimana cara menambahkan warga baru?**
- **Jawaban**: Login sebagai **Admin**, lalu buka halaman **Warga** dan klik **"Tambah Warga"**.

### **5. Apakah aplikasi ini bisa digunakan di mobile?**
- **Jawaban**: Ya. Aplikasi ini **responsif** dan bisa digunakan di **desktop, tablet, dan mobile**.

---

## 📞 Dukungan

Jika Anda mengalami kesulitan atau memiliki pertanyaan:
- Pastikan Anda mengikuti **[Panduan Instalasi](INSTALL.md)** dengan benar.
- Periksa **role** Anda (Admin/Warga) dan pastikan Anda mengakses halaman yang sesuai.
- Hubungi **[Priyo Gunawan](https://github.com/aca-error)** untuk dukungan lebih lanjut.

---

**Terima kasih telah menggunakan SimaRukun!** 🙏