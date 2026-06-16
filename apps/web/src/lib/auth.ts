import { User, RoleAccess } from '@/types/user';

// Dummy user data (nanti akan diganti dengan autentikasi real)
export const dummyUsers: User[] = [
  { id: '1', nama: 'Super Admin', email: 'superadmin@simarukun.com', role: 'superadmin', password: 'superadmin123' },
  { id: '2', nama: 'Ketua RT 01', email: 'ketua@rt01.com', role: 'supervisor', password: 'supervisor123' },
  { id: '3', nama: 'Sekretaris RT 01', email: 'sekretaris@rt01.com', role: 'admin', password: 'admin123' },
  { id: '4', nama: 'Bendahara RT 01', email: 'bendahara@rt01.com', role: 'admin', password: 'admin123' },
  { id: '5', nama: 'Bapak Joko', email: 'joko@example.com', role: 'warga', password: 'warga123' },
];

// Cek apakah user memiliki akses ke halaman
export const hasAccess = (role: string, path: string): boolean => {
  const allowedPaths = RoleAccess[role as keyof typeof RoleAccess] || [];
  return allowedPaths.some((p) => path.startsWith(p));
};

// Simpan user ke localStorage (untuk demo)
export const loginUser = (email: string, password: string): User | null => {
  const user = dummyUsers.find((u) => u.email === email && u.password === password);
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  }
  return null;
};

// Ambil user dari localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Logout
export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Get all users (for demo purposes)
export const getAllUsers = (): User[] => {
  return dummyUsers;
};

// Get role description
export const getRoleDescription = (role: string): string => {
  const descriptions = {
    superadmin: 'Pengembang/Pemilik Sistem - Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime.',
    supervisor: 'Ketua RT/RW - Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial.',
    admin: 'Sekretaris/Bendahara - Mengelola data warga, memantau pembayaran iuran, membuat pengumuman, dan menindaklanjuti laporan warga.',
    warga: 'Kepala Keluarga/Anggota Keluarga - Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan.'
  };
  return descriptions[role as keyof typeof descriptions] || 'Role tidak diketahui';
};