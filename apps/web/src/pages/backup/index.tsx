'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Database, Clock, CheckCircle, XCircle, RefreshCw, Download, Upload } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuthStore } from '@/stores/authStore';

// Dummy data for backup
const backupData = [
  { id: 1, nama: 'Backup Harian', tanggal: '16 Jun 2026 06:00', status: 'Sukses', ukuran: '15 MB' },
  { id: 2, nama: 'Backup Mingguan', tanggal: '15 Jun 2026 06:00', status: 'Sukses', ukuran: '120 MB' },
  { id: 3, nama: 'Backup Bulanan', tanggal: '01 Jun 2026 06:00', status: 'Sukses', ukuran: '1.2 GB' },
];

export default function Backup() {
  const router = useRouter();
  const { user, hasAccess, getRoleDescription } = useAuthStore();

  useEffect(() => {
    if (!user || !hasAccess('/backup')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/backup')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      alert('Backup berhasil dibuat!');
    }, 2000);
  };

  const handleRestore = (id: number) => {
    alert(`Restore backup ${id} berhasil!`);
  };

  const handleDownload = (id: number) => {
    alert(`Download backup ${id} dimulai!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sukses': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Gagal': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  // REVISED: backup accessible by superadmin AND supervisor
  const getAccessNote = () => {
    if (user.role === 'superadmin') {
      return 'Halaman ini dapat diakses oleh Super Admin dan Supervisor.';
    } else {
      return 'Halaman ini dapat diakses oleh Super Admin dan Supervisor.';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Backup</h1>
          {(user.role === 'superadmin' || user.role === 'supervisor') && (
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isBackingUp ? 'animate-spin' : ''}`} />
              {isBackingUp ? 'Membuat Backup...' : 'Buat Backup Baru'}
            </button>
          )}
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>Catatan:</strong> {getAccessNote()}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {getRoleDescription(user.role)}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nama Backup</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Ukuran</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backupData.map((backup) => (
                <tr key={backup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{backup.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.tanggal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(backup.status)}
                      <span className="ml-1">{backup.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.ukuran}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleDownload(backup.id)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {(user.role === 'superadmin' || user.role === 'supervisor') && (
                        <button
                          onClick={() => handleRestore(backup.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-900 mb-3">
            Statistik Backup
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border text-center">
              <Database className="h-6 w-6 text-purple-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">25</p>
              <p className="text-xs text-gray-500">Total Backup</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              <p className="text-xs text-gray-500">Backup Sukses</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-xs text-gray-500">Backup Terakhir</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <Database className="h-6 w-6 text-orange-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">1.5 GB</p>
              <p className="text-xs text-gray-500">Total Ukuran</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}