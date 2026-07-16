'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/stores/authStore';

const wargaData = [
  { id: 1, nama: 'Bapak Joko', alamat: 'RT 01 RW 03', status: 'Aktif', iuran: 'Lunas' },
  { id: 2, nama: 'Ibu Siti', alamat: 'RT 01 RW 03', status: 'Aktif', iuran: 'Belum Lunas' },
  { id: 3, nama: 'Mas Budi', alamat: 'RT 02 RW 03', status: 'Aktif', iuran: 'Lunas' },
];

export default function Warga() {
  const router = useRouter();
  const { user, hasAccess } = useAuthStore();

  useEffect(() => {
    if (!user || !hasAccess('/warga')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/warga')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [search, setSearch] = useState('');

  const filteredWarga = wargaData.filter((warga) =>
    warga.nama.toLowerCase().includes(search.toLowerCase()) ||
    warga.alamat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Daftar Warga</h1>
          {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Tambah Warga
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari warga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Alamat</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Iuran</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWarga.map((warga) => (
                <tr key={warga.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warga.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warga.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      warga.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {warga.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      warga.iuran === 'Lunas' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {warga.iuran}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin') && (
                      <>
                        <button className="text-primary-600 hover:text-primary-800 mr-2">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}