'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { wargaApi, Warga } from '@/lib/api';

export default function WargaPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchWarga();
  }, [isAuthenticated]);

  const fetchWarga = async () => {
    setLoading(true);
    try {
      const data = await wargaApi.getAll();
      setWargaList(data);
    } catch (error) {
      console.error('Failed to fetch warga:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarga = wargaList.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.nik.includes(searchTerm) ||
    w.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Warga</h1>
            <p className="text-gray-500 mt-1">Kelola data warga RT/RW</p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Tambah Warga
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIK, atau alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. KK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RT/RW</th>
                  {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={canManage ? 6 : 5} className="px-6 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredWarga.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Belum ada data warga</p>
                    </td>
                  </tr>
                ) : (
                  filteredWarga.map((warga) => (
                    <tr key={warga.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{warga.name}</div>
                        <div className="text-sm text-gray-500">{warga.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warga.nik}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warga.no_kk}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{warga.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RT {warga.rt} / RW {warga.rw}</td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 rounded-lg">
          <p className="text-sm text-gray-600">
            Total: <strong>{filteredWarga.length}</strong> dari <strong>{wargaList.length}</strong> warga
          </p>
        </div>
      </div>
    </Layout>
  );
}
