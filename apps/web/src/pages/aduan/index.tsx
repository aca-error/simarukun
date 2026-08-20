'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { AlertCircle, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { aduanApi, Aduan } from '@/lib/api';

export default function AduanPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [aduanList, setAduanList] = useState<Aduan[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAduan();
  }, [isAuthenticated]);

  const fetchAduan = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const data = await aduanApi.getAll(params);
      setAduanList(data);
    } catch (error) {
      console.error('Failed to fetch aduan:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAduan = aduanList.filter(a => {
    const matchSearch = !searchTerm || 
      a.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.isi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.warga?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'proses': return 'bg-blue-100 text-blue-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioritasColor = (prioritas: string) => {
    switch (prioritas) {
      case 'tinggi': return 'bg-red-100 text-red-800';
      case 'sedang': return 'bg-yellow-100 text-yellow-800';
      case 'rendah': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canManage = user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin';
  const aduanPending = aduanList.filter(a => a.status === 'pending').length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Pengaduan</h1>
            <p className="text-gray-500 mt-1">Kelola laporan dan aduan warga</p>
          </div>
          {user?.role === 'warga' && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Buat Aduan
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Aduan Pending</p>
                <p className="text-3xl font-bold mt-2">{aduanPending}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Aduan</p>
                <p className="text-3xl font-bold mt-2">{aduanList.length}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Selesai</p>
                <p className="text-3xl font-bold mt-2">{aduanList.filter(a => a.status === 'selesai').length}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-green-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul, isi, atau nama pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelapor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={canManage ? 7 : 6} className="px-6 py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredAduan.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Belum ada aduan</p>
                    </td>
                  </tr>
                ) : (
                  filteredAduan.map((aduan) => (
                    <tr key={aduan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{aduan.judul}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{aduan.isi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          {aduan.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioritasColor(aduan.prioritas)}`}>
                          {aduan.prioritas.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {aduan.warga?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(aduan.status)}`}>
                          {aduan.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(aduan.created_at).toLocaleDateString('id-ID')}
                      </td>
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
            Menampilkan <strong>{filteredAduan.length}</strong> dari <strong>{aduanList.length}</strong> aduan
          </p>
        </div>
      </div>
    </Layout>
  );
}
