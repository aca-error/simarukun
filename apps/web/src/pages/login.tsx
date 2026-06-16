'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const success = login(email, password);
      if (success) {
        router.push('/');
      } else {
        setError('Email atau password salah.');
      }
    } else {
      setError('Email dan password harus diisi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-600">SimaRukun</h1>
          <p className="text-gray-500 mt-2">Masuk untuk mengakses sistem</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="contoh@email.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Masuk
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p>Demo Login:</p>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div>
              <span className="font-medium text-purple-600">Super Admin:</span>
              <p className="text-xs">superadmin@simarukun.com / superadmin123</p>
            </div>
            <div>
              <span className="font-medium text-blue-600">Supervisor:</span>
              <p className="text-xs">ketua@rt01.com / supervisor123</p>
            </div>
            <div>
              <span className="font-medium text-green-600">Admin:</span>
              <p className="text-xs">sekretaris@rt01.com / admin123</p>
            </div>
            <div>
              <span className="font-medium text-orange-600">Warga:</span>
              <p className="text-xs">joko@example.com / warga123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}