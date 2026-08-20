'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import { 
  TrendingUp, Users, FileText, AlertCircle, 
  BarChart3, Database, Webhook, Server, CheckCircle
} from 'lucide-react';
import { wargaApi, iuranApi, aduanApi } from '@/lib/api';

interface DashboardStats {
  totalWarga?: number;
  totalIuran?: number;
  aduanBaru?: number;
  laporanCount?: number;
}

export default function Home() {
  const { user, isAuthenticated, getRoleDescription } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(false);

  // Fetch real data from API when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch stats based on role
        const [wargaData, iuranData, aduanData] = await Promise.all([
          wargaApi.getAll().catch(() => []),
          iuranApi.getAll().catch(() => []),
          aduanApi.getAll({ status: 'pending' }).catch(() => []),
        ]);

        setStats({
          totalWarga: wargaData.length,
          totalIuran: iuranData.reduce((sum, i) => sum + i.nominal, 0),
          aduanBaru: aduanData.length,
          laporanCount: iuranData.filter(i => i.status === 'lunas').length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Stats berdasarkan role
  const getStats = () => {
    if (!user || !isAuthenticated) {
      return [
        { name: 'Selamat Datang', value: 'Silakan login', icon: CheckCircle, color: 'bg-gray-100 text-gray-600' },
      ];
    }

    switch (user.role) {
      case 'superadmin':
        return [
          { name: 'Jumlah Warga', value: loading ? '...' : String(stats.totalWarga ?? 0), icon: Users, color: 'bg-blue-100 text-blue-600' },
          { name: 'Iuran Terkumpul', value: loading ? '...' : formatCurrency(stats.totalIuran ?? 0), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { name: 'Aduan Baru', value: loading ? '...' : String(stats.aduanBaru ?? 0), icon: AlertCircle, color: 'bg-red-100 text-red-600' },
          { name: 'Laporan', value: loading ? '...' : String(stats.laporanCount ?? 0), icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
          { name: 'Backup Status', value: 'OK', icon: Database, color: 'bg-teal-100 text-teal-600' },
          { name: 'Webhook Status', value: 'Active', icon: Webhook, color: 'bg-cyan-100 text-cyan-600' },
          { name: 'Server Uptime', value: '99.9%', icon: Server, color: 'bg-indigo-100 text-indigo-600' },
        ];
      case 'supervisor':
        return [
          { name: 'Jumlah Warga', value: loading ? '...' : String(stats.totalWarga ?? 0), icon: Users, color: 'bg-blue-100 text-blue-600' },
          { name: 'Iuran Terkumpul', value: loading ? '...' : formatCurrency(stats.totalIuran ?? 0), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { name: 'Aduan Baru', value: loading ? '...' : String(stats.aduanBaru ?? 0), icon: AlertCircle, color: 'bg-red-100 text-red-600' },
          { name: 'Laporan Eksekutif', value: loading ? '...' : String(stats.laporanCount ?? 0), icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
          { name: 'Persetujuan Tertunda', value: '3', icon: FileText, color: 'bg-yellow-100 text-yellow-600' },
        ];
      case 'admin':
        return [
          { name: 'Jumlah Warga', value: loading ? '...' : String(stats.totalWarga ?? 0), icon: Users, color: 'bg-blue-100 text-blue-600' },
          { name: 'Iuran Terkumpul', value: loading ? '...' : formatCurrency(stats.totalIuran ?? 0), icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { name: 'Aduan Baru', value: loading ? '...' : String(stats.aduanBaru ?? 0), icon: AlertCircle, color: 'bg-red-100 text-red-600' },
          { name: 'Laporan', value: loading ? '...' : String(stats.laporanCount ?? 0), icon: FileText, color: 'bg-purple-100 text-purple-600' },
        ];
      case 'warga':
      default:
        return [
          { name: 'Status Iuran', value: 'Lunas', icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { name: 'Aduan Saya', value: '1', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
          { name: 'Pengumuman', value: '3', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
        ];
    }
  };

  const displayStats = getStats();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {user && isAuthenticated ? `Selamat Datang, ${user.name}` : 'Dashboard'}
          </h1>
          {user && isAuthenticated && (
            <div className="bg-primary-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-primary-600">
                <strong>Role:</strong> {user.role}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getRoleDescription()}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayStats.map((stat) => (
            <div key={stat.name} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {(!user || !isAuthenticated) && (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <p className="text-gray-500">Silakan login untuk mengakses fitur lengkap.</p>
          </div>
        )}
        
        {user && isAuthenticated && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {user.role === 'superadmin' ? 'Panel Kontrol Super Admin' :
               user.role === 'supervisor' ? 'Panel Kontrol Supervisor' :
               user.role === 'admin' ? 'Panel Kontrol Admin' : 'Panel Warga'}
            </h2>
            <p className="text-gray-600">
              {getRoleDescription()}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
