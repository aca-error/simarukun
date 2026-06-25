# SimaRukun — Task Tracker

Dokumen ini menjadi **sumber kebenaran** untuk melanjutkan pengembangan proyek.
Update status setiap kali mulai/menyelesaikan pekerjaan.

**Legenda status**

| Status | Arti |
|--------|------|
| `[ ]` | Belum dikerjakan |
| `[~]` | Sedang dikerjakan |
| `[x]` | Selesai |
| `[-]` | Dibatalkan / ditunda |

**Legenda prioritas**

| Prioritas | Arti |
|-----------|------|
| P0 | Blocker — API tidak bisa build/jalan |
| P1 | Keamanan & data integrity |
| P2 | Logika bisnis & integrasi |
| P3 | Production readiness |
| P4 | Dokumentasi & testing |

---

## Ringkasan Progress

| Area | Total | Selesai | Progress |
|------|-------|---------|----------|
| P0 Blocker | 12 | 12 | 100% |
| P1 Keamanan | 14 | 2 | 14% |
| P2 Bisnis & Integrasi | 16 | 0 | 0% |
| P3 Production | 12 | 0 | 0% |
| P4 Docs & Testing | 10 | 0 | 0% |
| **Total** | **64** | **14** | **22%** |

> Update tabel di atas setiap kali menutup task.

---

## P0 — Blocker (API tidak bisa build/jalan)

### TASK-001 — Hapus atau implementasi modul hilang di `app.module.ts`

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/app.module.ts`, `apps/api/src/modules/{laporan,backup,webhook,server}/`
- **Bug found:**
  - `LaporanModule`, `BackupModule`, `WebhookModule`, `ServerModule` di-import tetapi folder modul **tidak ada di disk** → compile error pasti.
- **Bug fixed:**
  - Dibuat skeleton module (controller + service + module) untuk keempat fitur dengan endpoint `GET` status placeholder.
- **Notes:**
  - Opsi B diterapkan. Implementasi penuh → TASK-210 s/d TASK-213.

---

### TASK-002 — Fix `UsersController.findOne` memanggil method yang tidak ada

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/modules/users/users.controller.ts`, `users.service.ts`
- **Bug found:**
  - Controller memanggil `usersService.findOne(id)` tetapi service hanya punya `findById(id)`.
- **Bug fixed:**
  - Controller memakai `findById(id)` + `NotFoundException` jika null.
  - Unit test diperbarui ke `findById`.
- **Notes:** —

---

### TASK-003 — Fix route ordering: Users

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/modules/users/users.controller.ts`
- **Bug found:**
  - `GET /users/search` dideklarasikan **setelah** `GET /users/:id` → request ke `/users/search` tertangkap sebagai `id = "search"`.
- **Bug fixed:**
  - `search` dipindah sebelum `:id`. `toggle-active` dipindah sebelum `PUT :id`.
- **Notes:** —

---

### TASK-004 — Fix route ordering: Aduan

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/modules/aduan/aduan.controller.ts`
- **Bug found:**
  - `GET /aduan/stats` dan `GET /aduan/user/:userId` dideklarasikan setelah `GET /aduan/:id`.
  - `/aduan/stats` tertangkap sebagai `id = "stats"`.
- **Bug fixed:**
  - Urutan: `stats` → `user/:userId` → `:id`. `PUT :id/status` sebelum `PUT :id`.
  - Parameter `create()` diperbaiki (required sebelum optional).
- **Notes:** —

---

### TASK-005 — Fix route ordering: Iuran

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/modules/iuran/iuran.controller.ts`
- **Bug found:**
  - `GET /iuran/report` dan `GET /iuran/user/:userId` dideklarasikan setelah `GET /iuran/:id`.
- **Bug fixed:**
  - Urutan: `report` → `user/:userId` → `:id`.
- **Notes:** —

---

### TASK-006 — Fix `main.ts`: import & wiring `MetricsService`

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/main.ts`, `apps/api/src/app.module.ts`
- **Bug found:**
  - `MetricsService` digunakan tanpa import.
  - Di-instantiate dengan `{}` stub → runtime crash saat request masuk ke `MetricsInterceptor`.
- **Bug fixed:**
  - Interceptor manual dihapus dari `main.ts`.
  - `MetricsInterceptor` + `LoggerInterceptor` didaftarkan via `APP_INTERCEPTOR` di `AppModule`.
- **Notes:** `LoggerModule` diperbaiki dengan factory provider untuk DI.

---

### TASK-007 — Register custom Prometheus metrics

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/modules/monitoring/monitoring.module.ts`, `metrics.service.ts`
- **Bug found:**
  - `MetricsService` inject 8 metric via `@InjectMetric(...)` tetapi tidak ada provider registrations.
  - Nest DI gagal saat bootstrap.
- **Bug fixed:**
  - 8 custom metrics didaftarkan via `makeCounterProvider`, `makeHistogramProvider`, `makeGaugeProvider`, `makeSummaryProvider`.
  - `MetricsController` extends `PrometheusController.index()` (API v6).
- **Notes:** —

---

### TASK-008 — Fix `ThrottlerGuard` instantiation di `main.ts`

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/main.ts`, `apps/api/src/app.module.ts`
- **Bug found:**
  - `new ThrottlerGuard()` tanpa `Reflector` injection → rate limiting bisa tidak berfungsi di NestJS 10.
  - `ThrottlerModule.forRoot([...])` pakai API v5, terinstall v4.
- **Bug fixed:**
  - `APP_GUARD` + `ThrottlerGuard` di `AppModule`.
  - `ThrottlerModule.forRoot({ ttl: 60000, limit: 100 })`.
  - Semua `@Throttle('medium'|'short')` diganti `@Throttle(100, 60000)` / `@Throttle(5, 1000)`.
- **Notes:** —

---

### TASK-009 — Tambahkan global `ValidationPipe` (Zod)

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/app.module.ts`
- **Bug found:**
  - DTO memakai `nestjs-zod` tetapi tidak ada global validation pipe → body mentah bisa masuk tanpa validasi.
- **Bug fixed:**
  - `ZodValidationPipe` didaftarkan sebagai `APP_PIPE` di `AppModule`.
- **Notes:** Perlu uji manual endpoint dengan payload invalid.

---

### TASK-010 — Fix path metrics & health yang tidak konsisten

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/main.ts`, `monitoring.module.ts`, `metrics.controller.ts`
- **Bug found:**
  - Log startup menyebut `/api/health` dan `/api/metrics` tetapi tidak ada `setGlobalPrefix('api')`.
  - `PrometheusModule` path `/api/metrics` vs `MetricsController` → duplikasi/conflict.
- **Bug fixed:**
  - `app.setGlobalPrefix('api')` ditambahkan.
  - Prometheus path diseragamkan ke `metrics` (menjadi `/api/metrics`).
- **Notes:** Docker compose sudah pakai `NEXT_PUBLIC_API_URL=http://localhost:3001/api` — selaras.

---

### TASK-011 — Fix Sentry error handler timing

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/src/main.ts`
- **Bug found:**
  - `Sentry.Handlers.errorHandler()` dipasang **setelah** `app.listen()` → tidak menangkap error request dengan benar.
- **Bug fixed:**
  - Error handler dipindah sebelum `listen()`.
  - `Sentry.init()` di bootstrap jika `SENTRY_DSN` ada; `SentryService` tetap untuk module DI.
- **Notes:** —

---

### TASK-012 — Verifikasi build API berhasil

- **Status:** `[x]`
- **Prioritas:** P0
- **File:** `apps/api/`
- **Bug found:**
  - `npm run build` gagal (modul hilang, TS errors, missing nest-cli).
- **Bug fixed:**
  - `npm run build` di `apps/api` **exit code 0** (2026-06-23).
  - Ditambahkan `nest-cli.json`, `tsconfig.build.json`, `esModuleInterop`.
- **Notes:**
  - Perbaikan tambahan saat build: winston imports, Sentry API v7, health type exports, audit create, auth validateJwtPayload, role enum di aduan/iuran service (overlap TASK-107/108).

---

## P1 — Keamanan & Data Integrity

### TASK-101 — Tutup privilege escalation di `/auth/register`

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/auth/auth.controller.ts`, `auth.service.ts`
- **Bug found:**
  - Endpoint publik menerima parameter `role` → siapa pun bisa daftar sebagai admin/superadmin.
  - Swagger enum pakai `SUPERADMIN` (uppercase) sedangkan DB enum = `superadmin` (lowercase).
- **Bug fixed:** —
- **Notes:**
  - Opsi A: hapus parameter `role` dari register publik, selalu default `WARGA`.
  - Opsi B: require JWT + role superadmin/supervisor untuk create user dengan role tertentu (gunakan `UsersController` saja).
  - Tambahkan `@Public()` decorator pada login/register.

---

### TASK-102 — Hash password saat create user via `UsersController`

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/users/users.service.ts`
- **Bug found:**
  - `UsersController.create()` → `usersService.create(dto)` menyimpan password **plaintext**.
  - Berbeda dengan `AuthService.register()` yang sudah pakai Argon2.
- **Bug fixed:** —
- **Notes:**
  - Hash di service layer (bukan controller) agar semua jalur create konsisten.
  - Gunakan `@node-rs/argon2` yang sudah ada di dependencies.

---

### TASK-103 — Hash password saat update user

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/users/users.service.ts`
- **Bug found:**
  - `update()` merge DTO langsung ke entity → password baru disimpan plaintext jika dikirim di body.
- **Bug fixed:** —
- **Notes:**
  - Jika `updateUserDto.password` ada, hash dulu sebelum merge/save.
  - Pertimbangkan endpoint terpisah `PUT /users/:id/password` dengan verifikasi password lama.

---

### TASK-104 — Cek `isActive` saat login

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/auth/auth.service.ts`
- **Bug found:**
  - `validateUser()` tidak memeriksa `isActive` → user nonaktif tetap bisa login.
- **Bug fixed:** —
- **Notes:**
  - Throw `UnauthorizedException('Account is deactivated')` jika `!user.isActive`.

---

### TASK-105 — Cek `isActive` saat validasi JWT

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/auth/auth.service.ts`, `jwt.strategy.ts`
- **Bug found:**
  - `validateJwtPayload()` tidak cek `isActive` → token lama tetap valid meski akun dinonaktifkan.
- **Bug fixed:** —
- **Notes:**
  - Tambahkan pengecekan di `validateJwtPayload` atau `JwtStrategy.validate`.

---

### TASK-106 — Perbaiki refresh token flow

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/auth/auth.controller.ts`, `auth.service.ts`
- **Bug found:**
  - `POST /auth/refresh` memerlukan access token valid (`JwtAuthGuard`).
  - Jika access token expired, user tidak bisa refresh → UX rusak.
  - Refresh token disimpan **plaintext** di DB.
- **Bug fixed:** —
- **Notes:**
  - Terima `refreshToken` di request body, bukan dari access token.
  - Buat guard/strategy terpisah untuk refresh token.
  - Hash refresh token sebelum simpan (Argon2 atau SHA-256 + pepper).
  - Rotasi refresh token setiap refresh (invalidate token lama).

---

### TASK-107 — Fix role comparison di Aduan service

- **Status:** `[x]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/aduan/aduan.service.ts`
- **Bug found:**
  - Service membandingkan `currentUser.role !== 'SUPERADMIN'` (uppercase string).
  - Enum aktual = `'superadmin'` (lowercase) → permission check di service **selalu gagal** untuk admin/supervisor.
- **Bug fixed:**
  - Diganti dengan `UserRole.SUPERADMIN`, `UserRole.SUPERVISOR`, `UserRole.ADMIN` (selesai saat P0 build fix).
- **Notes:** —

---

### TASK-108 — Fix role comparison di Iuran service

- **Status:** `[x]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/iuran/iuran.service.ts`
- **Bug found:** Sama seperti TASK-107 — uppercase string vs lowercase enum.
- **Bug fixed:**
  - Diganti dengan `UserRole` enum (selesai saat P0 build fix).
- **Notes:** Lihat TASK-107.

---

### TASK-109 — Fix IDOR: Aduan read endpoints

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/aduan/aduan.service.ts`, `aduan.controller.ts`
- **Bug found:**
  - `findOne(id)` dan `findByUser(userId)` tidak verifikasi ownership.
  - Warga bisa membaca aduan warga lain.
- **Bug fixed:** —
- **Notes:**
  - Jika `role === WARGA`: hanya boleh akses aduan milik sendiri (`userId === req.user.sub`).
  - Admin/supervisor/superadmin boleh akses semua.

---

### TASK-110 — Fix IDOR: Iuran read endpoints

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/iuran/iuran.service.ts`, `iuran.controller.ts`
- **Bug found:** Sama seperti TASK-109 untuk data iuran.
- **Bug fixed:** —
- **Notes:** Lihat TASK-109.

---

### TASK-111 — Wire `CsrfGuard` atau hapus jika tidak dipakai

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/auth/guards/csrf.guard.ts`, `app.module.ts`
- **Bug found:**
  - `CsrfGuard` diimplementasi dan diekspor tetapi tidak pernah di-apply.
  - Package `csurf` ada di dependencies tetapi tidak digunakan.
- **Bug fixed:** —
- **Notes:**
  - Jika frontend pakai cookie-based auth: wire sebagai `APP_GUARD` + set cookie `XSRF-TOKEN` di login.
  - Jika frontend pakai Bearer token only: hapus CsrfGuard dan dependency `csurf`.

---

### TASK-112 — Validasi file upload Aduan

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/aduan/aduan.controller.ts`, `aduan.service.ts`
- **Bug found:**
  - Upload hanya simpan `file.originalname` — tidak ada validasi MIME, ukuran, atau storage nyata.
- **Bug fixed:** —
- **Notes:**
  - Batasi: max 5MB, MIME `image/jpeg`, `image/png`, `application/pdf`.
  - Simpan ke disk/S3 dengan nama random (bukan originalname).
  - Scan atau block executable extensions.

---

### TASK-113 — Audit log tidak menyimpan response body penuh

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/audit/audit.interceptor.ts`
- **Bug found:**
  - Interceptor log `{ path, data }` ke metadata → bisa menyimpan password, token, PII.
- **Bug fixed:** —
- **Notes:**
  - Log hanya: action, path, method, userId, statusCode, resourceId.
  - Redact field sensitif: `password`, `refreshToken`, `accessToken`.

---

### TASK-114 — Health endpoint tidak expose stack trace

- **Status:** `[ ]`
- **Prioritas:** P1
- **File:** `apps/api/src/modules/health/health.service.ts`
- **Bug found:**
  - `checkDetailed` dan `checkDb` mengembalikan `error.stack` ke client pada kegagalan DB.
- **Bug fixed:** —
- **Notes:**
  - Di production: return message generik, log detail ke Winston/Sentry saja.

---

## P2 — Logika Bisnis & Integrasi FE ↔ BE

### TASK-201 — Fix logika create Iuran: assign ke warga target

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/iuran/dto/create-iuran.dto.ts`, `iuran.service.ts`
- **Bug found:**
  - `create()` selalu assign `userId` ke user yang login (admin), bukan warga target.
  - DTO tidak punya field `userId` / `wargaId`.
- **Bug fixed:** —
- **Notes:**
  - Tambah field `userId` (wajib) di `CreateIuranDto`.
  - Validasi: target user harus exist dan role = `WARGA`.
  - Admin membuat iuran **untuk** warga, bukan untuk diri sendiri.

---

### TASK-202 — Tambah endpoint `PUT /iuran/:id/status`

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/iuran/iuran.controller.ts`
- **Bug found:**
  - `updateStatus()` ada di service tetapi tidak diekspos di controller.
  - Tidak ada cara untuk menandai iuran lunas via API.
- **Bug fixed:** —
- **Notes:**
  - Body: `{ status, tanggalPembayaran?, buktiPembayaran? }`.
  - Warga boleh update iuran milik sendiri ke `SUDAH_BAYAR` (upload bukti).
  - Admin/supervisor boleh update semua.

---

### TASK-203 — Fix `GET /audit` filter salah

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/audit/audit.controller.ts`
- **Bug found:**
  - `getAuditLogs(req.user?.id, ...)` → superadmin hanya melihat log **milik sendiri**, bukan semua log.
- **Bug fixed:** —
- **Notes:**
  - Superadmin: pass `undefined` sebagai userId filter (semua log).
  - Tambah query param opsional `?userId=` untuk filter manual.

---

### TASK-204 — Wire `AuditInterceptor` secara global

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/audit/audit.module.ts`, `app.module.ts`
- **Bug found:**
  - `AuditInterceptor` dibuat tetapi tidak pernah di-register.
  - Tidak ada audit trail otomatis untuk operasi CRUD.
- **Bug fixed:** —
- **Notes:**
  - Daftarkan via `{ provide: APP_INTERCEPTOR, useClass: AuditInterceptor }`.
  - Pastikan TASK-113 (redact PII) selesai dulu.

---

### TASK-205 — Integrasi frontend: setup API client

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/web/src/lib/`
- **Bug found:**
  - `axios` terpasang tetapi tidak dipakai di halaman manapun.
  - Semua data masih mock/hardcoded.
- **Bug fixed:** —
- **Notes:**
  - Buat `apps/web/src/lib/api.ts` — axios instance dengan baseURL dari `NEXT_PUBLIC_API_URL`.
  - Interceptor: attach Bearer token, handle 401 → redirect login.
  - Wire `lib/csrf.ts` jika pakai cookie auth.

---

### TASK-206 — Integrasi frontend: auth ke API nyata

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/web/src/lib/auth.ts`, `contexts/AuthContext.tsx`, `middleware.ts`
- **Bug found:**
  - Login pakai `dummyUsers` + `localStorage`.
  - Middleware baca cookie `user`, login tulis `localStorage` → proteksi server-side tidak jalan.
- **Bug fixed:** —
- **Notes:**
  - Login: `POST /auth/login` → simpan token.
  - Pilih strategi session:
    - **A)** Bearer token di memory/localStorage + middleware client-only.
    - **B)** httpOnly cookie dari API + middleware server-side (disarankan).
  - Hapus `dummyUsers` setelah integrasi stabil.

---

### TASK-207 — Integrasi frontend: halaman Warga

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/web/src/pages/warga/index.tsx`
- **Bug found:** Data dari array mock `wargaData`.
- **Bug fixed:** —
- **Notes:**
  - `GET /users` dengan pagination & search.
  - Tombol edit/hapus → `PUT /users/:id`, `DELETE /users/:id`.

---

### TASK-208 — Integrasi frontend: halaman Iuran

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/web/src/pages/iuran/index.tsx`
- **Bug found:** Data dari array mock `iuranData`.
- **Bug fixed:** —
- **Notes:**
  - `GET /iuran`, `GET /iuran/report`.
  - Form create → `POST /iuran` (setelah TASK-201).

---

### TASK-209 — Integrasi frontend: halaman Aduan

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/web/src/pages/aduan/index.tsx`, `aduan/buat.tsx`
- **Bug found:** Data mock + form submit ke `alert()`.
- **Bug fixed:** —
- **Notes:**
  - List: `GET /aduan`.
  - Buat: `POST /aduan` (multipart jika ada lampiran).
  - Update status: `PUT /aduan/:id/status`.

---

### TASK-210 — Implementasi `LaporanModule` (API)

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/laporan/` (baru)
- **Bug found:** Modul tidak ada; frontend halaman `/laporan` pakai mock.
- **Bug fixed:** —
- **Notes:**
  - Endpoint minimal:
    - `GET /laporan/keuangan?tahun=&bulan=`
    - `GET /laporan/aduan?tahun=&bulan=`
    - `GET /laporan/warga`
    - `GET /laporan/eksekutif` (supervisor+)
  - Reuse logic dari `IuranService.getReport()` dan `AduanService.getStats()`.

---

### TASK-211 — Implementasi `BackupModule` (API)

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/backup/` (baru)
- **Bug found:** Modul tidak ada; frontend halaman `/backup` pakai mock.
- **Bug fixed:** —
- **Notes:**
  - MVP: `POST /backup/create`, `GET /backup/list`, `POST /backup/restore/:id`, `GET /backup/download/:id`.
  - Gunakan `pg_dump` / `pg_restore` via child process atau service terpisah.
  - Role: superadmin, supervisor.

---

### TASK-212 — Implementasi `WebhookModule` (API)

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/webhook/` (baru)
- **Bug found:** Modul tidak ada; frontend halaman `/webhook` pakai mock.
- **Bug fixed:** —
- **Notes:**
  - Entity: `webhooks` (url, events[], isActive, secret).
  - Endpoint: CRUD + `POST /webhook/:id/test`.
  - Role: superadmin only.
  - Siapkan untuk integrasi WhatsApp bot (PRD).

---

### TASK-213 — Implementasi `ServerModule` (API)

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/server/` (baru)
- **Bug found:** Modul tidak ada; frontend halaman `/server` pakai mock.
- **Bug fixed:** —
- **Notes:**
  - Expose metrics dari `HealthService.checkDetailed()` + process stats.
  - Endpoint: `GET /server/stats`, `GET /server/activity`.
  - Role: superadmin only.
  - Bisa delegasi ke Prometheus/Grafana untuk data riil.

---

### TASK-214 — Seed database dengan user demo

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/seed.ts` (baru)
- **Bug found:**
  - Root `package.json` punya script `db:seed` → `apps/api/src/seed.ts` tetapi file **tidak ada**.
  - Tidak ada data awal untuk development.
- **Bug fixed:** —
- **Notes:**
  - Seed 4 user demo (superadmin, supervisor, admin, warga) sesuai README.
  - Password di-hash Argon2.
  - Opsional: seed sample iuran & aduan.

---

### TASK-215 — Optimasi `AduanService.getStats()` dengan SQL aggregation

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/aduan/aduan.service.ts`
- **Bug found:**
  - `getStats()` load semua row ke memory lalu filter di JS — tidak scalable.
- **Bug fixed:** —
- **Notes:**
  - Ganti dengan `QueryBuilder` + `COUNT` + `GROUP BY kategori, status`.

---

### TASK-216 — Fix filter bulan di `IuranService.findAll()`

- **Status:** `[ ]`
- **Prioritas:** P2
- **File:** `apps/api/src/modules/iuran/iuran.service.ts`
- **Bug found:**
  - Filter tanggal hanya aktif jika tahun **dan** bulan keduanya diisi.
  - Filter bulan saja diabaikan.
- **Bug fixed:** —
- **Notes:**
  - Tambah branch: jika hanya `bulan` → filter semua tahun untuk bulan tersebut.
  - Atau require `tahun` di API docs jika memang disengaja.

---

## P3 — Production Readiness

### TASK-301 — Buat TypeORM migrations

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/migrations/` (baru)
- **Bug found:**
  - `migrationsRun: true` di config tetapi folder migrations kosong.
  - `synchronize: true` di dev → schema drift tanpa kontrol versi.
- **Bug fixed:** —
- **Notes:**
  - Generate initial migration dari 4 entity existing.
  - Set `synchronize: false` di semua environment.
  - Script: `npm run typeorm migration:generate`.

---

### TASK-302 — Setup Swagger / OpenAPI

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/main.ts`
- **Bug found:**
  - Decorator `@ApiTags`, `@ApiOperation` ada di controller tetapi `SwaggerModule.setup()` tidak dipanggil.
- **Bug fixed:** —
- **Notes:**
  - Endpoint docs: `/api/docs`.
  - Include Bearer auth scheme.

---

### TASK-303 — Set global prefix `/api`

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/main.ts`
- **Bug found:** Inkonsistensi path — beberapa referensi `/api/*`, beberapa tidak.
- **Bug fixed:** —
- **Notes:**
  - `app.setGlobalPrefix('api')`.
  - Update `NEXT_PUBLIC_API_URL`, docker-compose, nginx config, monitoring.

---

### TASK-304 — Implementasi Redis health check nyata

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/modules/health/health.service.ts`
- **Bug found:**
  - Redis ada di `docker/dev/docker-compose.yml` tetapi health selalu return "not configured".
- **Bug fixed:** —
- **Notes:**
  - Tambah `@nestjs/cache-manager` + `cache-manager-redis-yet` atau `ioredis`.
  - Ping Redis di `checkRedis()`.

---

### TASK-305 — File upload ke storage nyata

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/modules/aduan/`
- **Bug found:** Upload hanya simpan filename, bukan file.
- **Bug fixed:** —
- **Notes:**
  - MVP: simpan ke `uploads/` di disk dengan nama UUID.
  - Production: S3/MinIO compatible storage.
  - Berlaku juga untuk `buktiPembayaran` di iuran.

---

### TASK-306 — Hapus double `helmet()` di `main.ts`

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/main.ts`
- **Bug found:** `app.use(helmet())` dipanggil dua kali + konfigurasi terpisah.
- **Bug fixed:** —
- **Notes:** Satukan ke satu panggilan `helmet({ ... })` dengan semua opsi.

---

### TASK-307 — Wire `LoggerInterceptor` via DI

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/main.ts`, `logger.module.ts`
- **Bug found:** Logger di-instantiate manual di `main.ts`, bypass DI.
- **Bug fixed:** —
- **Notes:**
  - Daftarkan sebagai `APP_INTERCEPTOR` di `LoggerModule`.
  - Fix double-log per request (log sekali di `tap`, bukan sebelum dan sesudah).

---

### TASK-308 — `MetricsInterceptor` handle error path

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/modules/monitoring/metrics.interceptor.ts`
- **Bug found:**
  - Hanya `tap` pada success — `http_errors_total` tidak di-increment saat error.
- **Bug fixed:** —
- **Notes:** Tambahkan `catchError` pipe untuk increment error metrics + rethrow.

---

### TASK-309 — Environment files & contoh konfigurasi

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `.env.example`, `apps/api/.env.example`
- **Bug found:**
  - Tidak ada `.env.example` untuk API.
  - `.env.monitoring.example` sudah ada dari pull terakhir.
- **Bug fixed:** —
- **Notes:**
  - Dokumentasikan: `DB_*`, `JWT_*`, `SENTRY_DSN`, `REDIS_*`, `PORT`, `NODE_ENV`, `LOG_LEVEL`.

---

### TASK-310 — Production docker-compose review

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `docker/prod/docker-compose.yml`
- **Bug found:** Belum diaudit — kemungkinan hardcoded secrets, missing healthcheck.
- **Bug fixed:** —
- **Notes:**
  - Pastikan secrets via env file, bukan hardcoded.
  - Tambah healthcheck untuk api & web.
  - Review nginx SSL config.

---

### TASK-311 — Rate limit health & metrics endpoints

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `health.controller.ts`, `metrics.controller.ts`
- **Bug found:** Endpoint publik tanpa throttle khusus.
- **Bug fixed:** —
- **Notes:**
  - Health: `@Throttle({ default: { ttl: 60000, limit: 30 } })`.
  - Metrics: restrict ke internal network atau require API key di production.

---

### TASK-312 — JWT secret validation saat startup

- **Status:** `[ ]`
- **Prioritas:** P3
- **File:** `apps/api/src/app.module.ts` atau `main.ts`
- **Bug found:**
  - Docker dev pakai `JWT_SECRET: your_very_strong_jwt_secret_here_min_32_chars`.
  - Tidak ada validasi panjang/kekuatan secret saat boot.
- **Bug fixed:** —
- **Notes:**
  - Fail fast jika `JWT_SECRET` kosong atau < 32 karakter di production.

---

## P4 — Dokumentasi & Testing

### TASK-401 — Update README.md

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `README.md`
- **Bug found:**
  - Masih menyebut Laravel sebagai backend (sebenarnya NestJS).
  - Struktur proyek hanya `apps/web`, tidak ada `apps/api`.
  - Menyebut SQLite dev (sebenarnya PostgreSQL).
- **Bug fixed:** —
- **Notes:** Selaraskan dengan monorepo structure aktual.

---

### TASK-402 — Update INSTALL.md

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `INSTALL.md`
- **Bug found:**
  - Hanya menjelaskan instalasi frontend.
  - Tidak ada langkah Docker, database, atau `npm run dev` monorepo.
- **Bug fixed:** —
- **Notes:**
  - Tambah: clone → `npm install` di root → `docker:dev` → `npm run dev`.
  - Dokumentasikan demo credentials setelah seed (TASK-214).

---

### TASK-403 — Fix unit test `Layout.test.tsx`

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/web/src/components/Layout.test.tsx`
- **Bug found:**
  - Mock komponen `Sidebar` dan `Navbar` yang tidak ada.
  - Tidak match struktur `Layout.tsx` saat ini.
- **Bug fixed:** —
- **Notes:** Rewrite test sesuai Layout aktual (navbar + floating sidebar).

---

### TASK-404 — Fix Cypress E2E tests

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/web/cypress/e2e/*.cy.ts`
- **Bug found:**
  - Route `/auth/login`, `/dashboard`, `/auth/register` tidak ada.
  - Route aktual: `/login`, `/`.
- **Bug fixed:** —
- **Notes:** Update semua spec ke route dan flow aktual.

---

### TASK-405 — Fix `users.controller.spec.ts` mock `findOne`

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/api/src/modules/users/users.controller.spec.ts`
- **Bug found:** Mock `findOne` padahal service punya `findById` — test tidak catch bug TASK-002.
- **Bug fixed:** —
- **Notes:** Setelah TASK-002 selesai, pastikan test match method name yang benar.

---

### TASK-406 — Tambah integration test dengan test database

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/api/test/integration/`
- **Bug found:**
  - Integration test mock semua service — bukan true DB integration.
- **Bug fixed:** —
- **Notes:**
  - Setup test Postgres (docker) + `beforeAll` seed.
  - Test minimal: auth login flow, CRUD users, create iuran.

---

### TASK-407 — API E2E test (supertest)

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/api/test/e2e/`
- **Bug found:** File `jest-e2e.json` ada di script tetapi coverage belum jelas.
- **Bug fixed:** —
- **Notes:**
  - Test: health check, login, protected route 401, RBAC 403.

---

### TASK-408 — Hapus dependency tidak terpakai

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `apps/api/package.json`, `apps/web/package.json`
- **Bug found:**
  - API: `bcrypt` (pakai argon2), `csurf` (guard custom tidak dipakai).
  - Web: `zustand`, `react-hook-form` terpasang tetapi tidak dipakai di `src/`.
- **Bug fixed:** —
- **Notes:** Audit setelah integrasi FE selesai — beberapa mungkin akan dipakai.

---

### TASK-409 — Tambah `logs/` ke `.gitignore`

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `.gitignore`
- **Bug found:** Winston menulis ke `logs/combined.log` dan `logs/error.log` — bisa ter-commit.
- **Bug fixed:** —
- **Notes:** Tambah juga `uploads/` setelah TASK-305.

---

### TASK-410 — Commit `package-lock.json`

- **Status:** `[ ]`
- **Prioritas:** P4
- **File:** `package-lock.json`
- **Bug found:** File untracked di git status.
- **Bug fixed:** —
- **Notes:**
  - Jalankan `npm install` di root untuk generate lockfile konsisten.
  - Commit lockfile untuk reproducible builds.

---

## Changelog

Catat perubahan signifikan di sini setiap sesi kerja.

| Tanggal | Task | Perubahan |
|---------|------|-----------|
| 2026-06-23 | TASK-001–012 | P0 selesai: skeleton modules, route fix, DI wiring, build sukses |
| 2026-06-23 | — | TASK.md dibuat berdasarkan audit teknis API & frontend |

---

## Cara Pakai Dokumen Ini

1. Pilih task berdasarkan prioritas (P0 dulu).
2. Set status ke `[~]` saat mulai mengerjakan.
3. Isi **Bug fixed** dan **Notes** saat selesai.
4. Set status ke `[x]`.
5. Update tabel **Ringkasan Progress** di atas.
6. Tambah baris di **Changelog**.

**Urutan disarankan untuk sesi berikutnya:**

```
P0: TASK-001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010 → 011 → 012
P1: TASK-101 → 102 → 103 → 104 → 105 → 107 → 108 → 109 → 110
P2: TASK-214 (seed) → 205 → 206 → 201 → 202 → 207 → 208 → 209
```
