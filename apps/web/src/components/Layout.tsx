'use client';

import { useState, useEffect } from 'react';
import {
  Menu, X, Home, Users, FileText, Settings, Bell, Search, 
  AlertCircle, LogIn, LogOut, BarChart3, Database, Webhook, Server,
  Sun, Moon, ChevronDown, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuthStore();

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Menu berdasarkan role (4 roles: superadmin, supervisor, admin, warga)
  const getMenuItems = () => {
    if (!user) {
      return [
        { name: 'Beranda', icon: Home, href: '/' },
        { name: 'Login', icon: LogIn, href: '/login' },
      ];
    }

    switch (user.role) {
      case 'superadmin':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Warga', icon: Users, href: '/warga' },
          { name: 'Iuran', icon: FileText, href: '/iuran' },
          { name: 'Aduan', icon: AlertCircle, href: '/aduan' },
          { name: 'Laporan', icon: BarChart3, href: '/laporan' },
          { name: 'Backup', icon: Database, href: '/backup' },
          { name: 'Webhook', icon: Webhook, href: '/webhook' },
          { name: 'Server', icon: Server, href: '/server' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
        ];
      case 'supervisor':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Warga', icon: Users, href: '/warga' },
          { name: 'Iuran', icon: FileText, href: '/iuran' },
          { name: 'Aduan', icon: AlertCircle, href: '/aduan' },
          { name: 'Laporan', icon: BarChart3, href: '/laporan' },
          { name: 'Backup', icon: Database, href: '/backup' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
        ];
      case 'admin':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Warga', icon: Users, href: '/warga' },
          { name: 'Iuran', icon: FileText, href: '/iuran' },
          { name: 'Aduan', icon: AlertCircle, href: '/aduan' },
          { name: 'Laporan', icon: BarChart3, href: '/laporan' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
        ];
      case 'warga':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
        ];
      default:
        return [
          { name: 'Beranda', icon: Home, href: '/' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  SimaRukun
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {user && (
                <>
                  <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <UserCircle className="h-8 w-8 text-gray-600" />
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <Badge variant="info" className="text-xs">{user.role}</Badge>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 bottom-0 w-72 bg-white shadow-xl border-r border-gray-200 z-40 overflow-y-auto"
            >
              <div className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 transition-all group"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-primary-700">{item.name}</span>
                  </Link>
                ))}
                
                {/* Logout Button */}
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group mt-4"
                  >
                    <LogOut className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-700">Logout</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2024 SimaRukun - Sistem Manajemen RT/RW. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}