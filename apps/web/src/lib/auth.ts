import { User } from '@/types/user';

// Dummy user data (nanti akan diganti dengan autentikasi real)
export const dummyUsers: User[] = [
  { id: '1', nama: 'Admin RT 01', email: 'admin@rt01.com', role: 'admin' },
  { id: '2', nama: 'Bapak Joko', email: 'joko@example.com', role: 'warga' },
];

// Cek apakah user memiliki akses ke halaman
export const hasAccess = (role: string, path: string): boolean => {
  const adminPaths = ['/', '/warga', '/iuran', '/aduan', '/pengaturan'];
  const wargaPaths = ['/', '/pengaturan'];

  if (role === 'admin') {
    return adminPaths.some((p) => path.startsWith(p));
  } else if (role === 'warga') {
    return wargaPaths.some((p) => path.startsWith(p));
  }
  return false;
};

// Simpan user ke localStorage (untuk demo)
export const loginUser = (email: string, password: string): User | null => {
  const user = dummyUsers.find((u) => u.email === email && (password === 'admin123' || password === 'warga123'));
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