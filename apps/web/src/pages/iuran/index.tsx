'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Plus, Calendar, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const iuranData = [
  { id: 1, bulan: 'Januari 2026', jumlah: 'Rp 50.000', status: 'Lunas', tanggal: '15 Jan 2026' },
  { id: 2, bulan: 'Februari 2026', jumlah: 'Rp 50.000', status: 'Belum Lunas', tanggal: '-' },
  { id: 3, bulan: 'Maret 2026', jumlah: 'Rp 50.000', status: 'Lunas', tanggal: '10 Mar 2026' },
];

export default function Iuran() {
  const router = useRouter();
  const { user, hasAccess } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/iuran')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/iuran')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [search, setSearch] = useState('');

  const filteredIuran = iuranData.filter((iuran) =>
    iuran.bulan.toLowerCase().includes(search.toLowerCase()) ||
    iuran.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Iuran</h1>
          {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Tambah Iuran
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari iuran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIuran.map((iuran) => (
            <div key={iuran.id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{iuran.bulan}</h3>
                  <p className="text-sm text-gray-500 mt-1">{iuran.tanggal}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  iuran.status === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {iuran.status}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <DollarSign className="h-5 w-5 text-primary-600" />
                <p className="ml-2 text-lg font-bold text-gray-900">{iuran.jumlah}</p>
              </div>
              {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
                <button className="mt-4 w-full bg-primary-50 text-primary-600 py-2 rounded-lg hover:bg-primary-100 transition-colors">
                  Lihat Detail
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}