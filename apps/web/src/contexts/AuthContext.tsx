'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types/user';
import { getCurrentUser, logoutUser, loginUser, hasAccess } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  hasAccess: () => false,
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

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess: checkAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);