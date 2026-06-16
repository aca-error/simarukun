'use client';

import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { TrendingUp, Users, FileText, AlertCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const stats = user?.role === 'admin'
    ? [
        { name: 'Jumlah Warga', value: '120', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { name: 'Iuran Terkumpul', value: 'Rp 12.000.000', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
        { name: 'Aduan Baru', value: '5', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
        { name: 'Laporan', value: '20', icon: FileText, color: 'bg-purple-100 text-purple-600' },
      ]
    : [
        { name: 'Status Iuran', value: 'Lunas', icon: FileText, color: 'bg-blue-100 text-blue-600' },
        { name: 'Aduan Saya', value: '1', icon: AlertCircle, color: 'bg-red-100 text-red-600' },
      ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user ? `Selamat Datang, ${user.nama}` : 'Dashboard'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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
        {!user && (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <p className="text-gray-500">Silakan login untuk mengakses fitur lengkap.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}