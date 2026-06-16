export type UserRole = 'admin' | 'warga';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
}