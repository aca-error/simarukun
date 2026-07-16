# Arsitektur SimaRukun

## Gambaran Umum

SimaRukun adalah sistem manajemen RT/RW berbasis web yang dibangun dengan arsitektur monorepo modern.

## Struktur Monorepo

```
/workspace
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend Next.js
├── packages/         # Shared packages (jika ada)
└── docs/             # Dokumentasi
```

## Tech Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 14+ (Pages Router)
- **Language**: TypeScript 5.x
- **State Management**: Zustand 4.4.7
- **Styling**: TailwindCSS 3.x
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Error Tracking**: Sentry

### Backend (`apps/api`)
- **Framework**: NestJS 10.3.0
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15+
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Security**: Helmet.js, CORS, Rate Limiting

## Arsitektur Frontend

### State Management (Zustand)

SimaRukun menggunakan Zustand untuk state management karena:
- Lebih sederhana daripada Redux
- Bundle size kecil
- Support persistensi otomatis
- TypeScript-first

#### Stores yang Tersedia

1. **authStore** - Manajemen autentikasi dan autorisasi
   ```typescript
   interface AuthState {
     user: User | null;
     isAuthenticated: boolean;
     login: (user: User) => void;
     logout: () => void;
     updateUser: (userData: Partial<User>) => void;
     hasAccess: (path: string) => boolean;
     getRoleDescription: () => string;
   }
   ```

2. **loadingStore** - Manajemen loading state global

### Struktur Folder Frontend

```
apps/web/src/
├── components/       # Komponen reusable (Layout, dll)
├── contexts/         # Context API (legacy, akan dihapus)
├── lib/             # Utility functions (API, auth, sanitize, csrf, sentry)
├── pages/           # Halaman aplikasi (Next.js Pages Router)
│   ├── aduan/
│   ├── backup/
│   ├── iuran/
│   ├── laporan/
│   ├── server/
│   ├── webhook/
│   └── warga/
├── stores/          # Zustand stores (authStore, loadingStore)
├── styles/          # Global styles (TailwindCSS)
└── types/           # TypeScript type definitions
```

### Role-Based Access Control (RBAC)

Sistem menggunakan 4 role dengan akses berbeda:

| Role | Akses Path |
|------|-----------|
| **superadmin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan`, `/backup`, `/webhook`, `/server` |
| **supervisor** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan`, `/backup` |
| **admin** | `/`, `/warga`, `/iuran`, `/aduan`, `/pengaturan`, `/laporan` |
| **warga** | `/`, `/pengaturan` |

Implementasi RBAC terdapat di `authStore.ts` dengan fungsi `hasAccess()`.

### Komponen Utama

#### Layout Component
- Sidebar navigasi responsif
- Navbar dengan notifikasi dan search
- Menu dinamis berdasarkan role user
- Animasi sidebar dengan Framer Motion

#### Authentication Flow
1. User login melalui `/login`
2. Credentials divalidasi via API backend
3. Token disimpan di localStorage
4. User data disimpan di Zustand store dengan persistensi
5. Protected routes dicek menggunakan `hasAccess()`

## Arsitektur Backend

### Modul Backend

Backend terdiri dari 12 modul utama:

1. **Auth Module** - Autentikasi & autorisasi
2. **User Module** - Manajemen data warga
3. **Iuran Module** - Pembayaran iuran
4. **Aduan Module** - Sistem pengaduan
5. **Laporan Module** - Generate laporan
6. **Backup Module** - Backup & restore database
7. **Webhook Module** - Integrasi bot WhatsApp/Telegram
8. **Server Module** - Monitoring server
9. **Logger Module** - Logging terpusat
10. **Notification Module** - Notifikasi real-time
11. **Payment Module** - Payment gateway integration
12. **Report Module** - Executive reports

### Security Implementation

- **Helmet.js**: HTTP security headers
- **CORS**: Cross-origin resource sharing protection
- **Rate Limiting**: Mencegah brute force attacks
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Anti-CSRF tokens
- **Password Hashing**: bcrypt dengan salt rounds 10+

## Database Schema

### Entity Relationship

```
User (warga)
├── id
├── nama
├── email
├── password (hashed)
├── role (superadmin/supervisor/admin/warga)
├── rt_rw
└── created_at

Iuran
├── id
├── user_id (FK)
├── bulan
├── tahun
├── jumlah
├── status (lunas/belum_lunas)
└── tanggal_bayar

Aduan
├── id
├── user_id (FK)
├── judul
├── deskripsi
├── foto_url
├── status (belum_ditangani/diproses/selesai)
└── created_at

Laporan
├── id
├── jenis
├── file_url
├── tanggal
└── dibuat_oleh (FK)
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (admin+)
- `POST /api/users` - Create user (admin+)
- `PUT /api/users/:id` - Update user (admin+)
- `DELETE /api/users/:id` - Delete user (superadmin only)

### Iuran
- `GET /api/iuran` - List iuran
- `POST /api/iuran` - Create iuran record
- `PUT /api/iuran/:id` - Update payment status
- `GET /api/iuran/my` - Get my iuran (warga)

### Aduan
- `GET /api/aduan` - List aduan
- `POST /api/aduan` - Create aduan
- `PUT /api/aduan/:id` - Update status
- `GET /api/aduan/my` - Get my aduan (warga)

### Laporan
- `GET /api/laporan` - List laporan
- `POST /api/laporan` - Generate laporan
- `GET /api/laporan/:id/download` - Download laporan

### Backup (Super Admin + Supervisor)
- `GET /api/backup` - List backups
- `POST /api/backup` - Create backup
- `POST /api/backup/:id/restore` - Restore backup
- `GET /api/backup/:id/download` - Download backup

### Webhook (Super Admin Only)
- `GET /api/webhook` - List webhooks
- `POST /api/webhook/test` - Test webhook
- `PUT /api/webhook/:id/toggle` - Toggle webhook status

### Server (Super Admin Only)
- `GET /api/server/stats` - Server statistics
- `POST /api/server/restart` - Restart server
- `POST /api/server/optimize` - Optimize resources

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/simarukun
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
PORT=3001
NODE_ENV=development
```

## Development Workflow

### Menjalankan Development Server

```bash
# Terminal 1 - Backend
cd apps/api
npm run dev

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

### Build untuk Production

```bash
# Build backend
cd apps/api
npm run build

# Build frontend
cd apps/web
npm run build
```

## Testing Strategy

### Unit Tests
- Jest untuk unit testing
- Testing Library untuk component testing

### Integration Tests
- Supertest untuk API testing
- Cypress untuk E2E testing

### Test Coverage Target
- Minimum 80% code coverage
- Critical paths: 100% coverage

## Deployment

### Docker Setup

```bash
# Build dan run dengan Docker Compose
docker-compose up -d
```

### Services
- **PostgreSQL**: Database server
- **Backend**: NestJS API server
- **Frontend**: Next.js web server
- **pgAdmin**: Database management UI

## Monitoring & Logging

### Application Monitoring
- Sentry untuk error tracking
- Custom logging dengan Logger Module
- Server health checks

### Performance Metrics
- Response time monitoring
- Database query optimization
- Cache hit rates

## Future Improvements

1. **Migrate to Next.js App Router** - Untuk fitur server components yang lebih baik
2. **GraphQL API** - Alternatif REST API untuk query yang lebih fleksibel
3. **Real-time Updates** - WebSocket integration untuk notifikasi live
4. **Mobile App** - React Native untuk akses mobile
5. **Advanced Analytics** - Dashboard analytics yang lebih detail

## Referensi

- [PRD.md](../../PRD.md) - Product Requirements Document
- [README.md](../../README.md) - Project Overview
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
