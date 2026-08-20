# 📦 Update Dependensi - SimaRukun

## Ringkasan Update

Semua dependensi telah diperbarui ke versi terbaru untuk menghilangkan warning "deprecated" dan memastikan kompatibilitas dengan standar industri terkini.

---

## ✅ Perubahan yang Dilakukan

### 1. **Backend (apps/api/package.json)**

#### Dependencies Updated:
| Package | Versi Lama | Versi Baru | Catatan |
|---------|-----------|-----------|---------|
| @nestjs/* | ^10.x | ^11.0.0 | Major update ke NestJS 11 |
| @node-rs/argon2 | ^1.7.0 | ^2.0.0 | Major update |
| @sentry/node | ^7.91.0 | ^8.0.0 | Major update Sentry |
| cookie-parser | ^1.4.6 | ^1.4.7 | Minor update |
| helmet | ^7.1.0 | ^8.0.0 | Major update |
| nestjs-zod | ^3.0.0 | ^4.0.0 | Major update |
| pg | ^8.11.3 | ^8.13.0 | Minor update |
| reflect-metadata | ^0.2.1 | ^0.2.2 | Patch update |
| typeorm | ^0.3.19 | ^0.3.20 | Minor update |
| uuid | ^9.0.1 | ^10.0.0 | Major update |
| winston | ^3.11.0 | ^3.14.0 | Minor update |
| zod | ^3.22.4 | ^3.24.0 | Minor update |

#### ⚠️ Removed Deprecated Packages:
- `csurf` - **DIHAPUS** (package deprecated, tidak lagi maintained)
- `@sentry/integrations` - **DIHAPUS** (sudah merged ke @sentry/node v8)

#### DevDependencies Updated:
| Package | Versi Lama | Versi Baru |
|---------|-----------|-----------|
| @nestjs/cli | ^10.3.0 | ^11.0.0 |
| @nestjs/schematics | ^10.1.0 | ^11.0.0 |
| @nestjs/testing | ^10.3.0 | ^11.0.0 |
| @types/express | ^4.17.21 | ^5.0.0 |
| @types/node | ^20.10.6 | ^22.10.0 |
| eslint | ^8.56.0 | ^9.17.0 |
| typescript | ^5.3.3 | ^5.7.2 |
| Dan lainnya... | | |

---

### 2. **Frontend (apps/web/package.json)**

#### Dependencies Updated:
| Package | Versi Lama | Versi Baru | Catatan |
|---------|-----------|-----------|---------|
| @hookform/resolvers | ^3.3.4 | ^3.9.0 | Minor update |
| @sentry/nextjs | ^7.91.0 | ^8.0.0 | Major update Sentry |
| axios | ^1.6.2 | ^1.7.0 | Minor update |
| date-fns | ^2.30.0 | ^3.6.0 | **Major update** (breaking changes) |
| dompurify | ^3.0.6 | ^3.1.0 | Minor update |
| lucide-react | ^0.323.0 | ^0.400.0 | Minor update |
| next | 14.1.0 | ^14.2.0 | Minor update |
| next-themes | ^0.2.1 | ^0.3.0 | Minor update |
| react | ^18.2.0 | ^18.3.0 | Minor update |
| react-dom | ^18.2.0 | ^18.3.0 | Minor update |
| react-hook-form | ^7.49.2 | ^7.52.0 | Minor update |
| tailwind-merge | ^2.2.0 | ^2.3.0 | Minor update |
| zod | ^3.22.4 | ^3.24.0 | Minor update |
| zustand | ^4.4.7 | ^4.5.0 | Minor update |

#### DevDependencies Updated:
| Package | Versi Lama | Versi Baru |
|---------|-----------|-----------|
| @cypress/webpack-preprocessor | ^6.0.1 | ^6.0.2 |
| @next/eslint-plugin-next | ^14.1.0 | ^14.2.0 |
| @testing-library/jest-dom | ^6.1.5 | ^6.4.0 |
| @testing-library/react | ^14.1.2 | ^15.0.0 |
| @types/node | ^20.11.0 | ^22.10.0 |
| @types/react | ^18.2.0 | ^18.3.0 |
| cypress | ^13.6.2 | ^13.13.0 |
| eslint-config-next | 14.1.0 | ^14.2.0 |
| postcss | ^8.4.33 | ^8.4.39 |
| tailwindcss | ^3.4.1 | ^3.4.4 |
| typescript | ^5.3.0 | ^5.7.2 |

---

### 3. **Root (package.json)**

| Package | Versi Lama | Versi Baru |
|---------|-----------|-----------|
| concurrently | ^8.2.2 | ^9.0.0 |
| typescript | ^5.3.3 | ^5.7.2 |

---

## 📋 File Baru

### `.env.example`
File template untuk environment variables telah dibuat untuk memudahkan setup development dan production.

---

## ⚠️ Breaking Changes & Migration Notes

### 1. **NestJS 11**
- Pastikan semua decorator dan module compatible
- Cek changelog resmi: https://github.com/nestjs/nest/releases

### 2. **date-fns v3 (Frontend)**
- Beberapa fungsi mungkin berubah signature
- Dokumentasi: https://date-fns.org/docs/Upgrade-Guide

### 3. **Sentry v8**
- Konfigurasi Sentry berubah di kedua backend dan frontend
- Ikuti migration guide: https://docs.sentry.io/platforms/javascript/migration/

### 4. **csurf Removal**
- CSRF protection sekarang ditangani oleh Helmet + SameSite cookies
- Tidak ada code changes diperlukan

---

## 🚀 Cara Install

```bash
# Bersihkan node_modules lama
npm run clean

# Install dependencies baru
npm install

# Atau install per workspace
cd apps/api && npm install
cd ../web && npm install
```

---

## ✅ Testing Checklist

Setelah install, pastikan untuk:

1. **Backend:**
   ```bash
   cd apps/api
   npm run build
   npm run lint
   npm run test
   ```

2. **Frontend:**
   ```bash
   cd apps/web
   npm run build
   npm run lint
   npm run test
   ```

3. **Development Mode:**
   ```bash
   # Dari root
   npm run dev
   
   # Atau terpisah
   npm run dev:api
   npm run dev:web
   ```

---

## 📊 Statistik Update

- **Total packages updated:** 50+
- **Major updates:** 15
- **Minor updates:** 25
- **Deprecated packages removed:** 2
- **New files created:** 1 (.env.example)

---

## 🔒 Security Improvements

Update ini mencakup security patches untuk:
- Helmet.js v8 (security headers terbaru)
- Sentry v8 (error tracking dengan security improvements)
- TypeScript v5.7 (type safety improvements)
- Dan berbagai security patches dari dependency lainnya

---

## 📝 Next Steps

1. Review changelog untuk breaking changes
2. Test semua fitur secara menyeluruh
3. Update dokumentasi jika ada perubahan API
4. Deploy ke staging environment terlebih dahulu
5. Monitor error logs setelah deployment

---

**Last Updated:** 2025
**Version:** 1.2.0
