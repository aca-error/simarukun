'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const aduanData = [
  { id: 1, judul: 'Jalan Rusak', deskripsi: 'Jalan di depan rumah rusak parah.', status: 'Belum Ditangani', tanggal: '15 Jun 2026' },
  { id: 2, judul: 'Sampah Menumpuk', deskripsi: 'Sampah menumpuk di depan pos RT.', status: 'Diproses', tanggal: '14 Jun 2026' },
  { id: 3, judul: 'Lampu Jalan Mati', deskripsi: 'Lampu jalan di RT 02 mati sejak seminggu lalu.', status: 'Selesai', tanggal: '13 Jun 2026' },
];

export default function Aduan() {
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

  const [search, setSearch] = useState('');

  const filteredAduan = aduanData.filter((aduan) =>
    aduan.judul.toLowerCase().includes(search.toLowerCase()) ||
    aduan.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Belum Ditangani': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Diproses': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Selesai': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Aduan</h1>
          {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Buat Aduan
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari aduan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="space-y-4">
          {filteredAduan.map((aduan) => (
            <div key={aduan.id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getStatusIcon(aduan.status)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{aduan.judul}</h3>
                    <p className="text-sm text-gray-500 mt-1">{aduan.tanggal}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  aduan.status === 'Belum Ditangani' ? 'bg-red-100 text-red-800' :
                  aduan.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {aduan.status}
                </span>
              </div>
              <p className="mt-3 text-gray-600">{aduan.deskripsi}</p>
              {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
                <button className="mt-4 text-primary-600 hover:text-primary-800">
                  Lihat Detail →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}