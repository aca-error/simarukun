'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

// Dummy data for laporan
const laporanData = [
  { id: 1, judul: 'Laporan Keuangan Bulanan', jenis: 'Keuangan', tanggal: '30 Jun 2026', status: 'Tersedia' },
  { id: 2, judul: 'Laporan Aduan Triwulan', jenis: 'Aduan', tanggal: '30 Jun 2026', status: 'Tersedia' },
  { id: 3, judul: 'Rekapitulasi Data Warga', jenis: 'Warga', tanggal: '15 Jun 2026', status: 'Tersedia' },
  { id: 4, judul: 'Laporan Eksekutif RT/RW', jenis: 'Eksekutif', tanggal: '10 Jun 2026', status: 'Tersedia' },
];

export default function Laporan() {
  const router = useRouter();
  const { user, hasAccess, getRoleDescription } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/laporan')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/laporan')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [search, setSearch] = useState('');

  const filteredLaporan = laporanData.filter((laporan) =>
    laporan.judul.toLowerCase().includes(search.toLowerCase()) ||
    laporan.jenis.toLowerCase().includes(search.toLowerCase())
  );

  // REVISED: laporan accessible by superadmin, supervisor, admin
  const getAccessNote = () => {
    if (user.role === 'superadmin') {
      return 'Halaman ini dapat diakses oleh Super Admin, Supervisor, dan Admin.';
    } else if (user.role === 'supervisor') {
      return 'Halaman ini dapat diakses oleh Super Admin, Supervisor, dan Admin.';
    } else {
      return 'Halaman ini dapat diakses oleh Super Admin, Supervisor, dan Admin.';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          {(user.role === 'superadmin' || user.role === 'supervisor' || user.role === 'admin') && (
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Laporan
            </button>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> {getAccessNote()}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {getRoleDescription(user.role)}
          </p>
        </div>
        
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari laporan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLaporan.map((laporan) => (
            <div key={laporan.id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{laporan.judul}</h3>
                  <p className="text-sm text-gray-500 mt-1">{laporan.jenis}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs bg-green-100 text-green-800`}>
                  {laporan.status}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <p className="text-sm text-gray-500">{laporan.tanggal}</p>
                </div>
                <button className="text-primary-600 hover:text-primary-800 flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Unduh
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Super Admin Specific */}
        {user.role === 'superadmin' && (
          <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">
              Laporan Khusus Super Admin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900">Backup Status</h3>
                <p className="text-sm text-gray-500">Status backup terakhir: OK</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900">Webhook Status</h3>
                <p className="text-sm text-gray-500">Status webhook: Active</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Supervisor Specific */}
        {user.role === 'supervisor' && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Laporan Eksekutif
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900">Persetujuan Tertunda</h3>
                <p className="text-sm text-gray-500">Jumlah: 5</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900">Rekapitulasi Data</h3>
                <p className="text-sm text-gray-500">Status: Terbaru</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}