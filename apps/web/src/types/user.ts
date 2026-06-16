// User Roles based on PRD SimaRukun
export type UserRole = 'superadmin' | 'supervisor' | 'admin' | 'warga';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
}

// Role Access Definitions
export const RoleAccess = {
  superadmin: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan',
    '/backup',
    '/webhook',
    '/server'
  ],
  supervisor: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan'
  ],
  admin: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan'
  ],
  warga: [
    '/',
    '/pengaturan'
  ]
};

// Role Descriptions
export const RoleDescriptions = {
  superadmin: 'Pengembang/Pemilik Sistem - Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime.',
  supervisor: 'Ketua RT/RW - Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial.',
  admin: 'Sekretaris/Bendahara - Mengelola data warga, memantau pembayaran iuran, membuat pengumuman, dan menindaklanjuti laporan warga.',
  warga: 'Kepala Keluarga/Anggota Keluarga - Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan.'
};