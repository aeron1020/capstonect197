"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Added icon for back navigation
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

      // 3. Redirect based on role (Fixed logical overlap block here)
      if (role === 'admin') {
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative px-4 antialiased">
      
      {/* Premium Floating Back Button */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#064e3b] transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Core Input Card Wrapper Box */}
      <div className="bg-white border border-slate-200 p-8 md:p-10 w-full max-w-[350px] space-y-6 shadow-sm rounded-2xl">
        
        {/* Logo Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black italic tracking-tighter text-[#064e3b]">
            LC<span className="text-[#d4af37]">RMC</span>C
          </h1>
          <p className="text-slate-400 text-[9px] font-black mt-1.5 uppercase tracking-widest">
            Management System Gateway
          </p>
        </div>

        {/* Input Form Structure */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit" 
            className="w-full bg-[#064e3b] hover:bg-[#053f30] text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] mt-2"
          >
            Log In
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-xs font-bold animate-pulse">{error}</p>
        )}

        {/* Decorative Separator Matrix */}
        <div className="flex items-center space-x-2 py-1">
          <div className="h-[1px] bg-slate-100 flex-1"></div>
          <span className="text-slate-300 text-[9px] font-black uppercase tracking-wider">OR</span>
          <div className="h-[1px] bg-slate-100 flex-1"></div>
        </div>

        <Link href="/forgot-password">
          <p className="text-center text-xs text-[#064e3b] font-bold cursor-pointer hover:underline">
            Forgot password?
          </p>
        </Link>
      </div>

      {/* Alternate Onboarding Flow Routing */}
      <div className="bg-white border border-slate-200 p-5 w-full max-w-[350px] mt-3 text-center shadow-sm rounded-2xl">
        <p className="text-xs font-semibold text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#d4af37] font-black uppercase tracking-wider hover:text-[#064e3b] transition-colors ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}