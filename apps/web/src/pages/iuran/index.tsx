'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { TrendingUp, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { iuranApi, Iuran } from '@/lib/api';

export default function IuranPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [iuranList, setIuranList] = useState<Iuran[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBulan, setFilterBulan] = useState<number | null>(null);
  const [filterTahun, setFilterTahun] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchIuran();
  }, [isAuthenticated]);

  const fetchIuran = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterBulan) params.bulan = filterBulan;
      if (filterTahun) params.tahun = filterTahun;
      
      const data = await iuranApi.getAll(params);
      setIuranList(data);
    } catch (error) {
      console.error('Failed to fetch iuran:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIuran = iuranList.filter(i => {
    const matchSearch = !searchTerm || 
      i.warga?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.keterangan?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    const matchBulan = !filterBulan || i.bulan === filterBulan;
    const matchTahun = !filterTahun || i.tahun === filterTahun;
    
    return matchSearch && matchStatus && matchBulan && matchTahun;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lunas': return 'bg-green-100 text-green-800';
      case 'belum_bayar': return 'bg-red-100 text-red-800';
      case 'terlambat': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canManage = user?.role === 'superadmin' || user?.role === 'supervisor' || user?.role === 'admin';
  const totalTerkumpul = iuranList.filter(i => i.status === 'lunas').reduce((sum, i) => sum + i.nominal, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Iuran</h1>
            <p className="text-gray-500 mt-1">Pencatatan dan monitoring iuran warga</p>
          </div>
          {canManage && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Iuran
            </button>
          )}
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Iuran Terkumpul</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalTerkumpul)}</p>
            </div>
            <TrendingUp className="h-16 w-16 text-green-200" />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama warga atau keterangan..."
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
            <option value="lunas">Lunas</option>
            <option value="belum_bayar">Belum Bayar</option>
            <option value="terlambat">Terlambat</option>
          </select>
          <button
            onClick={fetchIuran}
            className="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nominal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
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
                ) : filteredIuran.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Belum ada data iuran</p>
                    </td>
                  </tr>
                ) : (
                  filteredIuran.map((iuran) => (
                    <tr key={iuran.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{iuran.warga?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{iuran.warga?.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          iuran.jenis === 'iuran_wajib' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {iuran.jenis === 'iuran_wajib' ? 'Wajib' : 'Sukarela'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        Bulan {iuran.bulan} / {iuran.tahun}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatCurrency(iuran.nominal)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(iuran.status)}`}>
                          {iuran.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {iuran.keterangan || '-'}
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
            Menampilkan <strong>{filteredIuran.length}</strong> dari <strong>{iuranList.length}</strong> iuran
          </p>
        </div>
      </div>
    </Layout>
  );
}
