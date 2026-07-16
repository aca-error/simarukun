'use client';

import { useState } from 'react';
import {
  Menu, X, Home, Users, FileText, Settings, Bell, Search, 
  AlertCircle, LogIn, LogOut, BarChart3, Database, Webhook, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  // Menu berdasarkan role (4 roles: superadmin, supervisor, admin, warga)
  // REVISED: laporan for superadmin, supervisor, admin
  // REVISED: backup for superadmin, supervisor
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
          { name: 'Logout', icon: LogOut, href: '/', action: logout },
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
          { name: 'Logout', icon: LogOut, href: '/', action: logout },
        ];
      case 'admin':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Warga', icon: Users, href: '/warga' },
          { name: 'Iuran', icon: FileText, href: '/iuran' },
          { name: 'Aduan', icon: AlertCircle, href: '/aduan' },
          { name: 'Laporan', icon: BarChart3, href: '/laporan' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
          { name: 'Logout', icon: LogOut, href: '/', action: logout },
        ];
      case 'warga':
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
          { name: 'Logout', icon: LogOut, href: '/', action: logout },
        ];
      default:
        return [
          { name: 'Beranda', icon: Home, href: '/' },
          { name: 'Logout', icon: LogOut, href: '/', action: logout },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-600">SimaRukun</Link>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Search className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Button (Pojok Kiri Bawah) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 bottom-20 top-16 w-64 bg-white shadow-xl border-r z-40"
          >
            <div className="p-4">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.action ? (
                    <button
                      onClick={() => {
                        item.action();
                        setIsSidebarOpen(false);
                      }}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors mb-2 text-left"
                    >
                      <item.icon className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium text-red-700">{item.name}</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center p-3 rounded-lg hover:bg-primary-50 transition-colors mb-2"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 text-primary-600 mr-3" />
                      <span className="font-medium text-gray-700">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}