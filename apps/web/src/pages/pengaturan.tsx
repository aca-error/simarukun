'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Mail, Lock, Bell, Save } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function Pengaturan() {
  const router = useRouter();
  const { user, hasAccess } = useAuth();

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

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Akun</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Role:</span> {user.role === 'admin' ? ' Admin' : ' Warga'}</p>
            <p><span className="font-medium">ID:</span> {user.id}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}