// "use client";
// import Link from 'next/link';
// import { LayoutDashboard, ClipboardList, Settings, LogOut, ShieldCheck } from 'lucide-react';
// import AdminGuard from '@/src/components/AdminGuard';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <AdminGuard>
//     <div className="flex h-screen bg-[#f8fafc]">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#111827] text-white flex flex-col p-6 shadow-2xl">
//         <div className="flex items-center space-x-2 mb-10 px-2">
//           <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center">
//             <ShieldCheck className="text-[#111827] w-5 h-5" />
//           </div>
//           <span className="font-black tracking-tighter text-xl uppercase">Aeron <span className="text-cyan-400">Ops</span></span>
//         </div>

//         <nav className="flex-1 space-y-2">
//           <Link href="/dashboard/admin" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100">
//             <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard Overview
//           </Link>
//           <Link href="/dashboard/admin/orders" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100 bg-white/10 text-cyan-400">
//             <ClipboardList className="w-4 h-4 mr-3" /> Order Queue
//           </Link>
//           <Link href="/dashboard/admin/settings" className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold opacity-80 hover:opacity-100">
//             <Settings className="w-4 h-4 mr-3" /> System Config
//           </Link>
//         </nav>

//         <button className="flex items-center p-3 mt-auto text-red-400 text-sm font-bold hover:bg-red-500/10 rounded-xl transition-all">
//           <LogOut className="w-4 h-4 mr-3" /> Secure Logout
//         </button>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 overflow-y-auto">
//         <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 justify-between">
//           <h2 className="text-xs font-black uppercase text-gray-400 tracking-widest">Admin Control Center</h2>
//           <div className="flex items-center space-x-4">
//              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded font-bold uppercase">System Online</span>
//           </div>
//         </header>
//         <div className="p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//     </AdminGuard>
//   );
// }

"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, LogOut, ShieldCheck } from 'lucide-react';
import AdminGuard from '@/src/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Handle logout functionality
  const handleLogout = () => {
    // Implement token clear operations here if necessary
    console.log("Terminating dynamic administrative token scope.");
    window.location.href = '/login';
  };

  return (
    <AdminGuard>
      <div className="flex h-screen bg-[#f8fafc] text-gray-800 antialiased font-sans">
        
        {/* SIDEBAR NAVIGATION ENGINE */}
        <aside className="w-64 bg-[#0f172a] text-slate-200 flex flex-col p-5 border-r border-slate-800 shadow-xl">
          {/* BRAND APEX HEAD */}
          <div className="flex items-center space-x-2.5 mb-8 px-2 py-1">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="text-slate-900 w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base uppercase leading-none">Aeron Ops</span>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">Control Center</span>
            </div>
          </div>

          {/* SIMPLIFIED MAIN ACTION NAVIGATION */}
          <nav className="flex-1 space-y-1">
            <Link 
              href="/dashboard/admin" 
              className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                pathname === '/dashboard/admin' || pathname === '/dashboard/admin'
                  ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/10' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-3" /> Order Queue
            </Link>
          </nav>

          {/* DOCK TERMINAL LOGOUT ACTION */}
          <button 
            onClick={handleLogout}
            className="flex items-center px-3.5 py-2.5 mt-auto text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-500/10 rounded-xl transition-all group"
          >
            <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-0.5 transition-transform" /> Secure Logout
          </button>
        </aside>

        {/* MAIN WORKSPACE CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* APP CONTROLLER METADATA BAR */}
          <header className="h-16 bg-white border-b border-gray-200/80 flex items-center px-8 justify-between flex-shrink-0">
            <h2 className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Core Administration Channel</h2>
            <div className="flex items-center space-x-4">
               <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 System Node Online
               </span>
            </div>
          </header>
          
          {/* INTERFACE INJECTION HUB */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
            {children}
          </div>
        </main>

      </div>
    </AdminGuard>
  );
}