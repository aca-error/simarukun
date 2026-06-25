# Audit Report — SimaRukun v1.2.0

**Tanggal**: 25 Juni 2026
**Metode**: Verifikasi kode langsung terhadap 64 task di TASK.md
**Auditor**: OpenCode AI

---

## Ringkasan Eksekutif

| **Aspek** | **Hasil** |
|-----------|-----------|
| Total Task | 64 |
| ✅ PASS | 27 (42%) |
| ⚠️ PARTIAL | 7 (11%) |
| ❌ FAIL | 30 (47%) |
| **Progress PRD** | Tahap 2 (Testing) — real ~42% vs klaim 15% |
| **Backend** | Build sukses, semua module terpasang, P0 100% selesai |
| **Frontend** | **Masih mock data semua** — belum ada integrasi API |
| **Keamanan** | **10 celah kritis** belum ditambal |

---

## Progress per Prioritas

| Prioritas | Total | ✅ PASS | ⚠️ PARTIAL | ❌ FAIL | Progress |
|-----------|-------|---------|------------|---------|----------|
| P0 — Blocker | 12 | 12 | 0 | 0 | **100%** |
| P1 — Keamanan | 14 | 2 | 2 | 10 | **14%** |
| P2 — Bisnis & Integrasi | 16 | 5 | 0 | 11 | **31%** |
| P3 — Production Readiness | 12 | 3 | 2 | 7 | **25%** |
| P4 — Dokumentasi & Testing | 10 | 5 | 3 | 2 | **50%** |
| **Total** | **64** | **27** | **7** | **30** | **42%** |

---

## P0 — Blocker (✅ 12/12 Selesai)

Semua task P0 sudah diverifikasi dan selesai. API berhasil di-build.

| Task | Deskripsi | File Utama | Status |
|------|-----------|------------|--------|
| TASK-001 | Skeleton module laporan/backup/webhook/server | `app.module.ts:14-17` | ✅ |
| TASK-002 | Fix `findOne` → `findById` | `users.controller.ts:73` | ✅ |
| TASK-003 | Route ordering Users (search before :id) | `users.controller.ts:55,94` | ✅ |
| TASK-004 | Route ordering Aduan (stats→user→:id→:id/status) | `aduan.controller.ts:57,68,80,109` | ✅ |
| TASK-005 | Route ordering Iuran (report→user→:id) | `iuran.controller.ts:56,73,85` | ✅ |
| TASK-006 | MetricsService via DI (bukan manual) | `app.module.ts:83-90` | ✅ |
| TASK-007 | 8 custom Prometheus metrics | `monitoring.module.ts:14-56` | ✅ |
| TASK-008 | ThrottlerGuard via APP_GUARD | `app.module.ts:54-57,76-78` | ✅ |
| TASK-009 | ZodValidationPipe global | `app.module.ts:80-82` | ✅ |
| TASK-010 | Global prefix `/api` | `main.ts:30` | ✅ |
| TASK-011 | Sentry error handler sebelum listen | `main.ts:89-94` | ✅ |
| TASK-012 | Build API exit code 0 | `nest-cli.json`, `tsconfig.build.json` | ✅ |

---

## P1 — Keamanan & Data Integrity (❌ 10 FAIL, ⚠️ 2 PARTIAL, ✅ 2 PASS)

### ❌ FAIL

| Task | Temuan | File:Line | Dampak |
|------|--------|-----------|--------|
| **101** | Register publik menerima parameter `role` — siapapun bisa daftar sebagai SUPERADMIN | `auth.service.ts:109` | **Kritis** — privilege escalation |
| **102** | `UsersService.create()` menyimpan password **plaintext** | `users.service.ts:109-110` | **Kritis** — bocor password |
| **103** | `UsersService.update()` merge DTO langsung — password baru plaintext | `users.service.ts:140` | **Kritis** — bocor password |
| **104** | `validateUser()` tidak cek `isActive` — user nonaktif bisa login | `auth.service.ts:51-67` | **Tinggi** — bypass suspend |
| **105** | `validateJwtPayload()` tidak cek `isActive` — token tetap valid setelah suspend | `auth.service.ts:220-228` | **Tinggi** — bypass suspend |
| **109** | Warga bisa baca aduan warga lain via `GET /aduan/:id` | `aduan.controller.ts:80-87` | **Tinggi** — IDOR |
| **110** | Warga bisa baca iuran warga lain via `GET /iuran/:id` | `iuran.controller.ts:85-92` | **Tinggi** — IDOR |
| **111** | `CsrfGuard` sudah dibuat tapi **tidak pernah di-apply** | `csrf.guard.ts` vs `app.module.ts` | **Sedang** — tanpa CSRF |
| **112** | File upload tanpa validasi MIME, ukuran, atau storage | `aduan.controller.ts:97` | **Sedang** — upload sembarangan |
| **114** | Health endpoint mengembalikan `error.stack` ke client | `health.service.ts:64,152` | **Sedang** — bocor info internal |

### ⚠️ PARTIAL

| Task | Temuan | File:Line |
|------|--------|-----------|
| **106** | Refresh token flow ada tapi: (1) tidak rotasi token, (2) refresh token **plaintext** di DB, (3) tidak cek isActive | `auth.service.ts:185-205` |
| **113** | Audit interceptor log `{path, data}` — login/register diredact, endpoint lain log response penuh (bocor PII) | `audit.interceptor.ts:40` |

### ✅ PASS

| Task | Verifikasi |
|------|-----------|
| **107** | `aduan.service.ts` — role comparison pakai `UserRole` enum, bukan string |
| **108** | `iuran.service.ts` — role comparison pakai `UserRole` enum, bukan string |

---

## P2 — Logika Bisnis & Integrasi FE↔BE (❌ 11 FAIL, ✅ 5 PASS)

### ❌ FAIL

| Task | Temuan | File | Dampak |
|------|--------|------|--------|
| **201** | `CreateIuranDto` tidak punya field `userId` — iuran selalu ke admin, bukan warga target | `create-iuran.dto.ts`, `iuran.service.ts:99-108` | Logika bisnis salah |
| **202** | `updateStatus()` ada di service tapi **tidak diekspos** di controller | `iuran.controller.ts` | Tidak bisa update status |
| **203** | `getAuditLogs()` pakai `req.user.id` sebagai filter — superadmin cuma lihat log sendiri | `audit.controller.ts:21-27` | Audit tidak berguna |
| **204** | `AuditInterceptor` tidak didaftarkan sebagai global `APP_INTERCEPTOR` | `audit.module.ts`, `app.module.ts` | Tidak ada audit trail |
| **205** | Tidak ada `api.ts` — axios terinstall tapi tidak dipakai | `apps/web/src/lib/` | FE tidak connect API |
| **206** | Login via `dummyUsers` + localStorage, bukan API nyata | `login.tsx:19`, `auth.ts` | Auth palsu |
| **207** | Halaman Warga — data dari array hardcoded | `warga/index.tsx:9-13` | Mock |
| **208** | Halaman Iuran — data dari array hardcoded | `iuran/index.tsx:9-13` | Mock |
| **209** | Halaman Aduan — data dari array hardcoded | `aduan/index.tsx:9-13` | Mock |
| **214** | `seed.ts` tidak ada — script `db:seed` di root package.json mengarah ke file yang tidak ada | `apps/api/src/seed.ts` | Tidak ada data demo |
| **215** | `getStats()` load **semua row** ke memory, filter di JS — tidak scalable | `aduan.service.ts:200-223` | Performa buruk |

### ✅ PASS

| Task | Verifikasi |
|------|-----------|
| **210** | `LaporanModule` skeleton ada (controller + service + module) |
| **211** | `BackupModule` skeleton ada |
| **212** | `WebhookModule` skeleton ada |
| **213** | `ServerModule` skeleton ada |
| **216** | `IuranService.findAll()` — filter bulan pakai `Between()` sudah benar |

---

## P3 — Production Readiness (❌ 7 FAIL, ⚠️ 2 PARTIAL, ✅ 3 PASS)

### ❌ FAIL

| Task | Temuan | File |
|------|--------|------|
| **301** | Folder `migrations/` tidak ada — tapi `migrationsRun: true` dan `synchronize: true` di dev | `app.module.ts:43-45` |
| **302** | `SwaggerModule.setup()` tidak dipanggil — decorator `@ApiTags` ada tapi docs tidak bisa diakses | `main.ts` |
| **305** | `FileInterceptor('file')` tanpa storage config, tanpa size/MIME limit | `aduan.controller.ts:97` |
| **308** | `MetricsInterceptor` hanya `tap()` success — error path tidak increment `http_errors_total` | `metrics.interceptor.ts` |
| **309** | Tidak ada `.env.example` — env vars tidak terdokumentasi | root, `apps/api/` |
| **311** | Health & Metrics endpoint tanpa `@Throttle` — publik tanpa rate limit | `health.controller.ts` |
| **312** | Tidak ada validasi `JWT_SECRET` saat startup — jika kosong, runtime crash | `main.ts`, `app.module.ts` |

### ⚠️ PARTIAL

| Task | Temuan |
|------|--------|
| **304** | `checkRedis()` return placeholder `"Redis is not configured"` — bukan check nyata |
| **310** | Healthcheck di docker-compose ✅, tapi secrets (JWT_SECRET, DB_PASSWORD) hardcoded ❌ |

### ✅ PASS

| Task | Verifikasi |
|------|-----------|
| **303** | `app.setGlobalPrefix('api')` ✅ |
| **306** | Satu panggilan `helmet()` dengan semua opsi ✅ |
| **307** | `LoggerInterceptor` via `APP_INTERCEPTOR` ✅ |

---

## P4 — Dokumentasi & Testing (❌ 2 FAIL, ⚠️ 3 PARTIAL, ✅ 5 PASS)

| Task | Temuan | Status |
|------|--------|--------|
| **401** | `README.md:7` — masih menyebut **Laravel** sebagai backend (sebenarnya NestJS) | ❌ |
| **402** | `INSTALL.md` ada dan cukup lengkap | ✅ |
| **403** | `Layout.test.tsx` mock `react-router-dom` — Next.js tidak pakai itu | ⚠️ |
| **404** | Cypress E2E specs — route sudah sesuai aktual | ✅ |
| **405** | `users.controller.spec.ts` — mock `findOne` → `findById` sinkron | ✅ |
| **406** | Integration tests (`test/integration/`) — 4 spec files ada | ✅ |
| **407** | `test/e2e/` — **tidak ada** | ❌ |
| **408** | `bcrypt` (pakai argon2), `csurf` (guard custom tidak pakai) — masih di dependencies | ⚠️ |
| **409** | `.gitignore` — `logs/` ada, `uploads/` **belum** | ⚠️ |
| **410** | `package-lock.json` — **tidak di-track** git | ❌ |

---

## Struktur Proyek vs PRD

| Aspek | PRD | Aktual | Selisih |
|-------|-----|--------|---------|
| App Router | `apps/web/src/app/` | `pages/` (Pages Router) | ⚠️ Berbeda |
| `ARCHITECTURE.md` | Ada di `docs/` | **Tidak ada** | ❌ Hilang |
| Letak dokumentasi | `docs/` | Sebagian di root, sebagian di `docs/` | ⚠️ Tidak konsisten |
| Backend modules | 9 | 12 (3 bonus: health, logger, monitoring) | ✅ Bonus |
| Docker monitoring | Tidak disebut | Ada `docker/monitoring/` full stack | ✅ Bonus |
| Frontend API | Terintegrasi | **Semua mock** | ❌ Blocker |
| Seed data | Ada | `seed.ts` tidak ada | ❌ Hilang |
| CI/CD pipeline | `.github/workflows/` | Dihapus (rencana Tahap 4) | ⏳ Ditunda |

---

## Rekomendasi Prioritas

### 🔴 Segera (P1 — Keamanan)

| No | Task | Tindakan | Target File |
|----|------|----------|-------------|
| 1 | 101 | Force `role = WARGA` di register publik, hapus parameter role | `auth.service.ts:109`, `auth.controller.ts:74` |
| 2 | 102 | Hash password dengan Argon2 di `UsersService.create()` | `users.service.ts:109` |
| 3 | 103 | Hash password di `UsersService.update()` jika ada field password | `users.service.ts:140` |
| 4 | 104 | Tambah `if (!user.isActive) throw UnauthorizedException` | `auth.service.ts:51-67` |
| 5 | 105 | Tambah pengecekan isActive di `validateJwtPayload()` | `auth.service.ts:220-228`, `jwt.strategy.ts` |
| 6 | 109 | Filter ownership: Warga hanya bisa akses aduan sendiri | `aduan.service.ts`, `aduan.controller.ts` |
| 7 | 110 | Filter ownership: Warga hanya bisa akses iuran sendiri | `iuran.service.ts`, `iuran.controller.ts` |
| 8 | 114 | Ganti `error.stack` dengan pesan generik di production | `health.service.ts:64,152` |

### 🟡 Penting (P2 — Integrasi FE)

| No | Task | Tindakan |
|----|------|----------|
| 9 | 205 | Buat `api.ts` — axios instance dengan baseURL + Bearer interceptor |
| 10 | 206 | Auth: `POST /auth/login` → simpan token → redirect |
| 11 | 207-209 | Replace mock data dengan API calls di halaman Warga, Iuran, Aduan |
| 12 | 214 | Buat `seed.ts` — 4 user demo (superadmin, supervisor, admin, warga) |

### 🟠 Infra (P3)

| No | Task | Tindakan |
|----|------|----------|
| 13 | 301 | Generate TypeORM migration dari 4 entity, set `synchronize: false` |
| 14 | 302 | Setup Swagger — panggil `SwaggerModule.setup()` di `main.ts` |
| 15 | 312 | Validasi `JWT_SECRET` length >= 32 char saat startup |

### 🔵 Dokumen (P4)

| No | Task | Tindakan |
|----|------|----------|
| 16 | 401 | README: Laravel → NestJS |
| 17 | 410 | `git add package-lock.json && git commit` |

---

## Catatan Tambahan

- **Frontend masih 100% mock** — semua halaman (warga, iuran, aduan, laporan, backup, server, webhook) pakai data hardcoded
- **Backend sudah production-ready** secara struktur (12 module, security hardening, monitoring), tapi **belum diamankan** (10 celah P1)
- **Perbedaan PRD vs realita**: PRD klaim "Enterprise Compliance 85%" — berdasarkan task completion, compliance real ~42%
- **Bonus**: `docker/monitoring/` sudah siap dengan Prometheus + Grafana + Loki + Alertmanager meskipun belum dijadwalkan di roadmap

---

*Dokumen ini dibuat berdasarkan audit kode langsung. Setiap temuan telah diverifikasi dengan membaca file terkait.*
