/**
 * User roles for SimaRukun application
 * Used for Role-Based Access Control (RBAC)
 */
export enum UserRole {
  SUPERADMIN = 'superadmin',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
  WARGA = 'warga',
}

/**
 * Role descriptions for documentation
 */
export const UserRoleDescriptions: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: 'Pengembang/Pemilik Sistem - Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime.',
  [UserRole.SUPERVISOR]: 'Ketua RT/RW - Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial.',
  [UserRole.ADMIN]: 'Sekretaris/Bendahara - Mengelola data warga, memantau pembayaran iuran, membuat pengumuman, dan menindaklanjuti laporan warga.',
  [UserRole.WARGA]: 'Kepala Keluarga/Anggota Keluarga - Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan.',
};

/**
 * Role access definitions for RBAC
 * Defines which paths each role can access
 */
export const RoleAccess: Record<UserRole, string[]> = {
  [UserRole.SUPERADMIN]: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan',
    '/backup',
    '/webhook',
    '/server',
    '/audit',
  ],
  [UserRole.SUPERVISOR]: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan',
    '/backup',
    '/audit',
  ],
  [UserRole.ADMIN]: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan',
  ],
  [UserRole.WARGA]: [
    '/',
    '/pengaturan',
  ],
};
