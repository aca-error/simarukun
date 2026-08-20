import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hasAccess: (path: string) => boolean;
  getRoleDescription: () => string;
}

// Role Access Definitions
const RoleAccess: Record<UserRole, string[]> = {
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
    '/laporan',
    '/backup'
  ],
  admin: [
    '/',
    '/warga',
    '/iuran',
    '/aduan',
    '/pengaturan',
    '/laporan'
  ],
  warga: [
    '/',
    '/pengaturan'
  ]
};

// Role Descriptions
const RoleDescriptions: Record<UserRole, string> = {
  superadmin: 'Pengembang/Pemilik Sistem - Mengelola sistem secara keseluruhan, backup data, pemeliharaan webhook, dan server uptime.',
  supervisor: 'Ketua RT/RW - Memantau rekapitulasi data, menerima laporan eksekutif via bot, dan memberikan persetujuan krusial.',
  admin: 'Sekretaris/Bendahara - Mengelola data warga, memantau pembayaran iuran, membuat pengumuman, dan menindaklanjuti laporan warga.',
  warga: 'Kepala Keluarga/Anggota Keluarga - Membayar iuran, melihat laporan keuangan, menerima pengumuman, dan membuat laporan.'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (token: string, user: User) => set({ 
        token,
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        token: null,
        user: null, 
        isAuthenticated: false 
      }),
      
      updateUser: (userData: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      
      hasAccess: (path: string): boolean => {
        const { user } = get();
        if (!user) return false;
        const allowedPaths = RoleAccess[user.role] || [];
        return allowedPaths.some((p) => path.startsWith(p));
      },
      
      getRoleDescription: (): string => {
        const { user } = get();
        if (!user) return 'Role tidak diketahui';
        return RoleDescriptions[user.role] || 'Role tidak diketahui';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
