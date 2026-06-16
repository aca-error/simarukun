'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole, RoleDescriptions } from '@/types/user';
import { getCurrentUser, logoutUser, loginUser, hasAccess, getRoleDescription } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (path: string) => boolean;
  getRoleDescription: (role: string) => string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  hasAccess: () => false,
  getRoleDescription: () => '',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = loginUser(email, password);
    if (user) {
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const checkAccess = (path: string): boolean => {
    if (!user) return false;
    return hasAccess(user.role, path);
  };

  const getRoleDescription = (role: string): string => {
    return RoleDescriptions[role as UserRole] || 'Role tidak diketahui';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess: checkAccess, getRoleDescription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);