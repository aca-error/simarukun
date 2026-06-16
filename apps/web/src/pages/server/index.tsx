'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Server, Cpu, MemoryStick, Network, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

// Dummy data for server monitoring
const serverStats = {
  uptime: '99.9%',
  cpuUsage: '45%',
  memoryUsage: '65%',
  diskUsage: '75%',
  bandwidth: '10 Mbps',
  activeConnections: 42,
  responseTime: '120ms',
};

const recentActivities = [
  { id: 1, timestamp: '06:15:23', event: 'Server started', status: 'success' },
  { id: 2, timestamp: '06:10:10', event: 'Backup completed', status: 'success' },
  { id: 3, timestamp: '06:05:45', event: 'High CPU usage', status: 'warning' },
  { id: 4, timestamp: '06:00:00', event: 'Daily restart', status: 'success' },
];

export default function Server() {
  const router = useRouter();
  const { user, hasAccess, getRoleDescription } = useAuth();

  useEffect(() => {
    if (!user || !hasAccess('/server')) {
      router.push('/login');
    }
  }, [user, router, hasAccess]);

  if (!user || !hasAccess('/server')) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitor Server</h1>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>Catatan:</strong> Halaman ini <strong>hanya dapat diakses oleh Super Admin</strong>.
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {getRoleDescription('superadmin')}
          </p>
        </div>
        
        {/* Server Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <Server className="h-8 w-8 text-purple-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.uptime}</p>
            <p className="text-xs text-gray-500">Uptime</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <Cpu className="h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.cpuUsage}</p>
            <p className="text-xs text-gray-500">CPU Usage</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <MemoryStick className="h-8 w-8 text-green-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.memoryUsage}</p>
            <p className="text-xs text-gray-500">Memory</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <Network className="h-8 w-8 text-orange-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.bandwidth}</p>
            <p className="text-xs text-gray-500">Bandwidth</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <Activity className="h-8 w-8 text-cyan-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.activeConnections}</p>
            <p className="text-xs text-gray-500">Connections</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <Activity className="h-8 w-8 text-pink-600 mx-auto" />
            <p className="text-2xl font-bold text-gray-900 mt-2">{serverStats.responseTime}</p>
            <p className="text-xs text-gray-500">Response Time</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <div className="h-8 w-8 bg-green-500 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-600 mt-2">Online</p>
            <p className="text-xs text-gray-500">Status</p>
          </div>
        </div>
        
        {/* Server Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kontrol Server</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
              <Server className="h-5 w-5 mr-2" />
              Restart Server
            </button>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Cpu className="h-5 w-5 mr-2" />
              Optimize CPU
            </button>
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
              <Network className="h-5 w-5 mr-2" />
              Reset Network
            </button>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="mr-3">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}