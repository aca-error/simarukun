'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Mail, Lock, Bell, Save, ShieldCheck, BarChart3, Database, Webhook, Server } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function Pengaturan() {
  const router = useRouter();
  const { user, hasAccess, getRoleDescription } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/pengaturan')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/pengaturan')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [nama, setNama] = useState(user.nama);
  const [email, setEmail] = useState(user.email);
  const [notifikasi, setNotifikasi] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
  };

  // Get role icon based on user role
  const getRoleIcon = () => {
    switch (user.role) {
      case 'superadmin':
        return <ShieldCheck className="h-6 w-6 text-purple-600" />;
      case 'supervisor':
        return <BarChart3 className="h-6 w-6 text-blue-600" />;
      case 'admin':
        return <Database className="h-6 w-6 text-green-600" />;
      case 'warga':
        return <User className="h-6 w-6 text-orange-600" />;
      default:
        return <User className="h-6 w-6 text-gray-600" />;
    }
  };

  // Get role color based on user role
  const getRoleColor = () => {
    switch (user.role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-green-100 text-green-800';
      case 'warga':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        
        {/* Role Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getRoleColor()}`}>
              {getRoleIcon()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Role: {user.role}</h2>
              <p className="text-sm text-gray-500">{getRoleDescription(user.role)}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferensi</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifikasi"
                checked={notifikasi}
                onChange={(e) => setNotifikasi(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="notifikasi" className="ml-2 block text-sm text-gray-700">
                Aktifkan Notifikasi
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Simpan Perubahan
          </button>
        </form>
        
        {/* Account Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun</h2>
          <div className="space-y-2">
            <p><span className="font-medium">ID:</span> {user.id}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
          </div>
        </div>
        
        {/* Super Admin Only Section */}
        {user.role === 'superadmin' && (
          <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">
              Panel Super Admin
            </h2>
            <div className="space-y-2">
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Database className="h-5 w-5 mr-2" />
                Kelola Backup
              </button>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Webhook className="h-5 w-5 mr-2" />
                Kelola Webhook
              </button>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Server className="h-5 w-5 mr-2" />
                Monitor Server
              </button>
            </div>
          </div>
        )}
        
        {/* Supervisor Only Section */}
        {user.role === 'supervisor' && (
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              Panel Supervisor
            </h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Lihat Laporan Eksekutif
              </button>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 mr-2" />
                Beri Persetujuan
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}