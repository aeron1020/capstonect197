"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import { ShieldCheck } from 'lucide-react';

export default function AdminSecretLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('token/', credentials);
      const user = res.data.user;

      // Check if the person logging in is actually an Admin
      if (user.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', res.data.access);
        router.push('/dashboard/admin');
      } else {
        setError("Access Denied: Administrative privileges required.");
      }
    } catch (err: any) {
      setError("Invalid credentials. Attempt logged.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        {/* Aesthetic Icon Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <ShieldCheck className="text-cyan-400 w-8 h-8" />
          </div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tighter">
            LC<span className="text-cyan-400">RMC</span> <span className="text-cyan-400">Vault</span>
          </h1>
          <p className="text-gray-500 text-xs font-mono mt-2 uppercase tracking-widest">
            Restricted Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Admin ID</label>
            <input
              type="text"
              required
              className="w-full bg-[#161616] border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50 transition-all"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Access Key</label>
            <input
              type="password"
              required
              className="w-full bg-[#161616] border border-gray-800 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50 transition-all"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-cyan-400 transition-all uppercase text-xs tracking-widest mt-6"
          >
            {loading ? "Decrypting..." : "Authorize Entry"}
          </button>
        </form>

        <div className="text-center">
            <button 
                onClick={() => router.push('/')} 
                className="text-[10px] text-gray-600 uppercase hover:text-gray-400 transition-colors"
            >
                Return to Surface
            </button>
        </div>
      </div>
    </div>
  );
}