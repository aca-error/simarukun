// src/components/Layout.tsx
'use client';

import { useState } from 'react';
import { Menu, X, Home, Users, FileText, Settings, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Beranda', icon: Home, href: '/' },
    { name: 'Warga', icon: Users, href: '/warga' },
    { name: 'Iuran', icon: FileText, href: '/iuran' },
    { name: 'Aduan', icon: FileText, href: '/aduan' },
    { name: 'Pengaturan', icon: Settings, href: '/pengaturan' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">SimaRukun</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-500" />
              </button>
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
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-primary-50 transition-colors mb-2"
                >
                  <item.icon className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-700">{item.name}</span>
                </a>
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