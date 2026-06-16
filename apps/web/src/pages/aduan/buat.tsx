'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Camera, Send } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function BuatAduan() {
  const router = useRouter();
  const { user, hasAccess } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/aduan')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/aduan')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Aduan berhasil dikirim!');
    router.push('/aduan');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Buat Aduan Baru</h1>
          {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
            <span className="text-sm text-gray-500">
              Hanya Admin, Supervisor, dan Super Admin yang dapat membuat aduan
            </span>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Aduan</label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Contoh: Jalan Rusak di RT 01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Jelaskan aduan Anda secara detail..."
              rows={5}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lampirkan Foto (Opsional)</label>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
              <Camera className="h-10 w-10 text-gray-400" />
              <span className="ml-3 text-gray-500">Klik untuk upload foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {foto && <p className="mt-2 text-sm text-gray-600">File: {foto.name}</p>}
          </div>
          {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Kirim Aduan
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
}