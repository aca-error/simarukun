'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Webhook, CheckCircle, XCircle, RefreshCw, Code, Bell, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

// Dummy data for webhook
const webhookData = [
  { id: 1, nama: 'WhatsApp Bot', endpoint: '/api/webhook/whatsapp', status: 'Active', lastPing: '5 menit lalu' },
  { id: 2, nama: 'Telegram Bot', endpoint: '/api/webhook/telegram', status: 'Active', lastPing: '2 menit lalu' },
  { id: 3, nama: 'Payment Gateway', endpoint: '/api/webhook/payment', status: 'Inactive', lastPing: '1 jam lalu' },
];

export default function Webhook() {
  const router = useRouter();
  const { user, hasAccess, getRoleDescription } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/webhook')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/webhook')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const [isTesting, setIsTesting] = useState<number | null>(null);

  const handleTest = (id: number) => {
    setIsTesting(id);
    setTimeout(() => {
      setIsTesting(null);
      alert(`Webhook ${id} berhasil dites!`);
    }, 2000);
  };

  const handleToggle = (id: number) => {
    alert(`Webhook ${id} status diubah!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Inactive': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Webhook</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Refresh Status
          </button>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>Catatan:</strong> Halaman ini <strong>hanya dapat diakses oleh Super Admin</strong>.
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {getRoleDescription('superadmin')}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Nama</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Endpoint</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Ping</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {webhookData.map((webhook) => (
                <tr key={webhook.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Webhook className="h-5 w-5 text-purple-600 mr-2" />
                      {webhook.nama}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded">{webhook.endpoint}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(webhook.status)}
                      <span className="ml-1">{webhook.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{webhook.lastPing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleTest(webhook.id)}
                        disabled={isTesting === webhook.id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {isTesting === webhook.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggle(webhook.id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h2 className="text-lg font-semibold text-purple-900 mb-3">
            Statistik Webhook
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg border text-center">
              <Webhook className="h-6 w-6 text-purple-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              <p className="text-xs text-gray-500">Total Webhook</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <p className="text-xs text-gray-500">Webhook Aktif</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <XCircle className="h-6 w-6 text-red-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">1</p>
              <p className="text-xs text-gray-500">Webhook Tidak Aktif</p>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto" />
              <p className="text-2xl font-bold text-gray-900 mt-1">5m</p>
              <p className="text-xs text-gray-500">Rata-rata Ping</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}