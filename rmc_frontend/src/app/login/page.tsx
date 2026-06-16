"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import api from '@/src/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Get the JWT Tokens
      const res = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // 2. Get User Profile to check Role
      const profileRes = await api.get('/me/');
      const role = profileRes.data.role;

      // 3. Redirect based on role
      if (role === 'admin' || role === 'dispatcher') {
        router.push('/dashboard/admin');
      } else if (role === 'dispatcher') {
        router.push('/dashboard/dispatcher');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="bg-white border border-gray-200 p-10 w-full max-w-[350px] space-y-6 shadow-sm">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter text-[#064e3b]">
            AERON<span className="text-[#d4af37]">RMC</span>
          </h1>
          <p className="text-gray-400 text-sm font-semibold mt-2 uppercase tracking-widest text-[10px]">
            Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-gray-50 border border-gray-200 rounded-sm p-2 text-xs focus:border-gray-400 outline-none transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-gray-50 border border-gray-200 rounded-sm p-2 text-xs focus:border-gray-400 outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit" className="w-full btn-primary text-sm py-1.5 mt-2 shadow-sm active:scale-[0.98]">
            Log In
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-xs font-medium animate-pulse">{error}</p>
        )}

        <div className="flex items-center space-x-2 py-2">
          <div className="h-[1px] bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-[10px] font-bold uppercase">OR</span>
          <div className="h-[1px] bg-gray-200 flex-1"></div>
        </div>

        <Link href="/forgot-password">
          <p className="text-center text-xs text-[#064e3b] font-semibold cursor-pointer hover:underline">
            Forgot password?
          </p>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 p-6 w-full max-w-[350px] mt-3 text-center shadow-sm">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#d4af37] font-bold hover:text-[#064e3b] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}