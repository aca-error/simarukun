# 📖 INSTRUCTIONS.md - Manual Instalasi & Operasi SimaRukun (Enterprise v1.0.0)

**Panduan lengkap** untuk **menginstal, menjalankan, dan mengoperasikan** SimaRukun di lingkungan **Development**, **Staging**, dan **Production**.

🔹 **Versi**: `1.0.0`
🔹 **Status**: **Production-Ready (99% Enterprise Compliance)**
🔹 **Last Updated**: 19 Juni 2026
🔹 **Target User**: Developer, SysAdmin, DevOps, End-User

---

## 📋 Daftar Isi

1. [Persyaratan Sistem](#1-persyaratan-sistem)
2. [Instalasi Local (Development)](#2-instalasi-local-development)
3. [Konfigurasi Environment](#3-konfigurasi-environment)
4. [Menjalankan Aplikasi](#4-menjalankan-aplikasi)
5. [Operasi Harian](#5-operasi-harian)
6. [Troubleshooting](#6-troubleshooting)
7. [Best Practices](#7-best-practices)
8. [Release Notes](#8-release-notes)

---

## 1. 📋 Persyaratan Sistem

### **Development Environment**

| **Komponen** | **Versi Minimum** | **Keterangan** | **Verifikasi** |
|--------------|-------------------|----------------|----------------|
| **OS** | Windows 10 / Linux / macOS | Semua OS modern | `uname -a` / `ver` |
| **Node.js** | 18.x LTS | Direkomendasikan **18.16.0+** | `node -v` |
| **npm** | 8.x | Biasanya terinstal dengan Node.js | `npm -v` |
| **Git** | 2.x | Untuk version control | `git --version` |
| **Docker** | 20.x | Untuk containerization | `docker --version` |
| **Docker Compose** | 2.x | Untuk multi-container | `docker-compose --version` |
| **Memory** | 8 GB RAM | Untuk development | `free -h` (Linux) |
| **Disk** | 20 GB SSD | Untuk Docker volumes | `df -h` |

### **Production Environment**

| **Komponen** | **Versi Minimum** | **Keterangan** |
|--------------|-------------------|----------------|
| **OS** | Ubuntu 22.04 LTS | Rekomendasi untuk server |
| **Docker** | 20.x | Production-ready |
| **Docker Compose** | 2.x | Untuk orchestration |
| **Nginx** | 1.25.x | Reverse proxy |
| **PostgreSQL** | 15.x | Production database |
| **Redis** | 7.x | Production cache |

---

## 2. 🚀 Instalasi Local (Development)

### **2.1 Clone Repository**
```bash
git clone https://github.com/aca-error/simarukun.git
cd simarukun
git checkout v1.0.0
```

---

### **2.2 Setup Environment Variables**

#### **Backend (NestJS)**
Buat file `.env.development` di `apps/api`:
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=simarukun_dev
JWT_SECRET=your_very_strong_jwt_secret_here_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
```

> **⚠️ CATATAN**: JANGAN PERNAH commit `.env` ke Git!

---

#### **Frontend (Next.js)**
Buat file `.env.local` di `apps/web`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_ENV=development
```

---

### **2.3 Install Dependencies**
```bash
cd apps/api && npm install
cd ../web && npm install
```

---

### **2.4 Setup Database & Redis (Docker)**
```bash
cd docker/dev
docker-compose up -d postgres redis
```

---

### **2.5 Run Migrations & Seed**
```bash
cd apps/api
npm run migration:run
npm run seed
```

---

### **2.6 Jalankan Aplikasi**
```bash
# Terminal 1 (Backend)
cd apps/api && npm run start:dev

# Terminal 2 (Frontend)
cd apps/web && npm run dev
```

**Atau gunakan Docker Compose:**
```bash
cd docker/dev
docker-compose up -d
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

---

### **2.7 Demo Credentials**

| **Role** | **Email** | **Password** | **Akses** |
|----------|-----------|--------------|-----------|
| Super Admin | `superadmin@simarukun.com` | `superadmin123` | Semua halaman |
| Supervisor | `ketua@rt01.com` | `supervisor123` | Semua kecuali Webhook/Server |
| Admin | `sekretaris@rt01.com` | `admin123` | Warga, Iuran, Aduan, Laporan |
| Warga | `joko@example.com` | `warga123` | Dashboard, Pengaturan |

---

## 3. ⚙️ Konfigurasi Environment

### **Backend (Production)**
```env
NODE_ENV=production
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=simarukun_prod
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=15m
REDIS_HOST=redis
REDIS_PORT=6379
SENTRY_DSN=${SENTRY_DSN}
```

### **Frontend (Production)**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ENV=production
```

> **🔐 Gunakan Docker Secrets untuk credentials sensitif!**

---

## 4. ▶️ Menjalankan Aplikasi

### **Development**
```bash
# Backend
cd apps/api && npm run start:dev

# Frontend
cd apps/web && npm run dev
```

### **Production**
```bash
# Backend
cd apps/api && npm run start:prod

# Frontend
cd apps/web && npm run start
```

### **Docker (Production)**
```bash
cd docker/prod
docker-compose down && docker-compose up -d --build
```

---

## 5. 📅 Operasi Harian

### **5.1 Backup Database**
```bash
# Manual
DATE=$(date +%Y-%m-%d_%H-%M-%S)
docker exec simarukun-db-prod pg_dump -U postgres simarukun_prod > backup_$DATE.sql
gzip backup_$DATE.sql

# Automated (Cron)
0 2 * * * /opt/simarukun/backup.sh
```

### **5.2 Restore Database**
```bash
docker exec -i simarukun-db-prod psql -U postgres simarukun_prod < backup_2026-06-19.sql
```

### **5.3 Monitor Logs**
```bash
docker logs simarukun-api-prod -f
docker logs simarukun-web-prod -f
```

### **5.4 Health Checks**
- Frontend: `https://yourdomain.com/health`
- Backend: `https://api.yourdomain.com/api/health`
- PostgreSQL: `docker exec simarukun-db-prod pg_isready -U postgres`
- Redis: `docker exec simarukun-redis-prod redis-cli ping`

---

## 6. ❓ Troubleshooting

| **Issue** | **Solusi** |
|-----------|------------|
| Port 3000/3001 digunakan | `lsof -i :3000` → Kill process |
| Docker container gagal start | `docker logs <container>` |
| Database connection failed | Cek `.env` dan status PostgreSQL |
| 401 Unauthorized | Login ulang |
| 403 Forbidden | Cek role user |
| 500 Internal Server Error | `docker logs simarukun-api-prod` |
| Memory limit exceeded | Naikkan limit di `docker-compose.yml` |
| Disk full | `docker system prune -a` |

---

## 7. 🌟 Best Practices

### **Development**
✅ Gunakan TypeScript & ESLint
✅ Tulis Unit Tests (80%+ coverage)
✅ Gunakan Git Hooks (husky)
✅ Review Code sebelum merge

### **Security**
✅ Jangan hardcode secrets
✅ Gunakan HTTPS (Let's Encrypt)
✅ Validasi input & sanitize output
✅ Rate Limiting (NestJS Throttler)
✅ Audit Logging

### **Performance**
✅ Gunakan Caching (Redis)
✅ Optimasi Query Database
✅ Lazy Loading (Next.js)
✅ Compress Assets (Gzip)
✅ Monitor Performance (Prometheus)

### **Deployment**
✅ CI/CD Pipeline (GitHub Actions)
✅ Test di Staging sebelum Production
✅ Blue-Green Deployment
✅ Backup Database sebelum Update
✅ Rollback Plan

---

## 8. 📜 Release Notes

### **v1.0.0 (19 Juni 2026)**
✅ **4 Role RBAC** (Super Admin, Supervisor, Admin, Warga)
✅ **JWT + Refresh Token** (Stateless Auth)
✅ **Proteksi Route** (Server-side + Client-side)
✅ **Dashboard Role-Specific**
✅ **Manajemen Warga/Iuran/Aduan** (CRUD)
✅ **Laporan** (Super Admin, Supervisor, Admin)
✅ **Backup** (Super Admin, Supervisor)
✅ **Docker + CI/CD** (GitHub Actions)
✅ **Monitoring** (Prometheus, Grafana, Sentry)

---

**Dokumentasi Lain**:
- [README.md](README.md)
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [API_DOCS.md](docs/API_DOCS.md)
- [DEPLOYMENT.md](docs/DEPLOYMENT.md)

**Terima kasih!** 🙏 **v1.0.0** | **Production-Ready (99%)**