# Panduan Instalasi SimaRukun

Panduan ini akan memandu Anda untuk **menginstal dan menjalankan proyek SimaRukun** di lingkungan lokal.

---

## 📋 Persyaratan Sistem

Pastikan sistem Anda memenuhi persyaratan berikut:

| **Komponen**       | **Versi Minimum** | **Keterangan**                     |
|-------------------|-------------------|-----------------------------------|
| Node.js           | 18.x              | Direkomendasikan 18.2.0 atau lebih. |
| npm               | 8.x               | Biasanya terinstal dengan Node.js. |
| Git               | 2.x               | Untuk clone repository.            |
| Sistem Operasi    | Windows/Linux/macOS | Semua sistem operasi didukung.    |

---

## 🚀 Langkah-Langkah Instalasi

### **1. Clone Repository**

Clone repository `simarukun` ke direktori lokal Anda:

```bash
git clone https://github.com/aca-error/simarukun.git
cd simarukun
```

---

### **2. Pindah ke Direktori Frontend**

```bash
cd apps/web
```

---

### **3. Install Dependencies**

Instal semua dependensi yang diperlukan:

```bash
npm install
```

> **Catatan**: Proses ini akan mengunduh semua paket yang diperlukan (React, Next.js, Tailwind CSS, dll.).

---

### **4. Konfigurasi Environment (Jika Diperlukan)**

Untuk saat ini, **tidak diperlukan konfigurasi environment** khusus untuk menjalankan frontend dalam mode development. Namun, jika Anda ingin menjalankan backend nanti, akan diperlukan file `.env` yang terpisah.

---

### **5. Jalankan Aplikasi**

Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi akan berjalan di:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Menguji Aplikasi

### **1. Buka di Browser**
- Buka browser kesayangan Anda (Chrome, Firefox, Edge, dll.).
- Kunjungi **[http://localhost:3000](http://localhost:3000)**.

### **2. Login dengan Akun Demo**
Anda bisa mencoba login dengan akun demo berikut:

| **Role**  | **Email**            | **Password** | **Akses**                          |
|-----------|---------------------|--------------|------------------------------------|
| Admin     | `admin@rt01.com`    | `admin123`   | Semua halaman (Warga, Iuran, Aduan). |
| Warga     | `joko@example.com`  | `warga123`   | Dashboard & Pengaturan.             |

### **3. Uji Coba Fitur**
- **Admin**:
  - Lihat daftar warga, iuran, dan aduan.
  - Tambah/Edit/Hapus data (fitur demo).
- **Warga**:
  - Lihat status iuran dan aduan pribadi.
  - Coba akses halaman admin (akan diredirect).

---

## 🔧 Troubleshooting

### **1. Port Sudah Digunakan**
Jika port `3000` sudah digunakan, Anda bisa:
- Menghentikan aplikasi lain yang menggunakan port `3000`.
- Mengubah port dengan menambahkan `--port`:
  ```bash
  npm run dev -- --port 3001
  ```

### **2. Error Dependencies**
Jika terjadi error saat `npm install`:
- Hapus folder `node_modules` dan file `package-lock.json`:
  ```bash
  rm -rf node_modules package-lock.json
  ```
- Coba lagi:
  ```bash
  npm install
  ```

### **3. Error Node.js Version**
Jika Node.js Anda terlalu lama:
- Unduh Node.js versi terbaru dari **[nodejs.org](https://nodejs.org/)**.
- Gunakan **nvm** (Node Version Manager) untuk mengelola versi Node.js:
  ```bash
  nvm install 18
  nvm use 18
  ```

### **4. Error Git**
Jika Anda tidak memiliki Git:
- Unduh Git dari **[git-scm.com](https://git-scm.com/)**.
- Ikuti panduan instalasi untuk sistem operasi Anda.

---

## 📂 Struktur Proyek

Setelah terinstal, struktur proyek Anda akan terlihat seperti ini:

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
│       │       ├── warga/             # Halaman Warga
│       │       ├── iuran/             # Halaman Iuran
│       │       ├── aduan/             # Halaman Aduan
│       │       └── pengaturan.tsx     # Halaman Pengaturan
│       ├── package.json
│       ├── next.config.js
│       ├── tsconfig.json
│       └── tailwind.config.js
└── README.md
```

---

## 🔄 Perintah Lain yang Berguna

| **Perintah**               | **Keterangan**                          |
|----------------------------|----------------------------------------|
| `npm run dev`              | Jalankan aplikasi dalam mode development. |
| `npm run build`            | Build aplikasi untuk production.       |
| `npm run start`            | Jalankan aplikasi dalam mode production. |
| `npm run lint`             | Cek kesalahan kode dengan ESLint.       |

---

## 📌 Catatan Penting

1. **Saat ini hanya frontend yang tersedia**.
   - Backend (Node.js + Laravel) masih dalam pengembangan.
   - Data yang ditampilkan adalah **dummy data** untuk demo UI.

2. **Autentikasi masih dummy**.
   - Menggunakan `localStorage` untuk menyimpan session.
   - Nanti akan diganti dengan **JWT + API** (backend).

3. **Untuk Production**:
   - Jalankan `npm run build` untuk membuat build production.
   - Gunakan `npm run start` untuk menjalankan server production.

---

## 🤝 Dukungan

Jika Anda mengalami kesulitan atau memiliki pertanyaan:
- Pastikan Anda mengikuti langkah-langkah di atas dengan benar.
- Periksa **console browser** (F12) untuk error.
- Hubungi **[Priyo Gunawan](https://github.com/aca-error)** untuk dukungan lebih lanjut.

---

**Selamat mencoba SimaRukun!** 🚀