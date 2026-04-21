"use client";
import Link from 'next/link';
import { LayoutDashboard, ClipboardList, Settings, LogOut, ShieldCheck } from 'lucide-react';
import AdminGuard from '@/src/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-[#111827] w-5 h-5" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase">Aeron <span className="text-cyan-400">Ops</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard/admin" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100">
            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard Overview
          </Link>
          <Link href="/dashboard/admin/orders" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100 bg-white/10 text-cyan-400">
            <ClipboardList className="w-4 h-4 mr-3" /> Order Queue
          </Link>
          <Link href="/dashboard/admin/settings" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100">
            <Settings className="w-4 h-4 mr-3" /> System Config
          </Link>
        </nav>

        <button className="flex items-center p-3 mt-auto text-red-400 text-sm font-bold hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut className="w-4 h-4 mr-3" /> Secure Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 justify-between">
          <h2 className="text-xs font-black uppercase text-gray-400 tracking-widest">Admin Control Center</h2>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded font-bold uppercase">System Online</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
    </AdminGuard>
  );
}