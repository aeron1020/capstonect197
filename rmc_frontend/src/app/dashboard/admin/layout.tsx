// "use client";
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { ClipboardList, LogOut, ShieldCheck } from 'lucide-react';
// import AdminGuard from '@/src/components/AdminGuard';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   // Handle logout functionality
//   const handleLogout = () => {
//     // Implement token clear operations here if necessary
//     console.log("Terminating dynamic administrative token scope.");
//     window.location.href = '/login';
//   };

//   return (
//     <AdminGuard>
//       <div className="flex h-screen bg-[#f8fafc] text-gray-800 antialiased font-sans">
        
//         {/* SIDEBAR NAVIGATION ENGINE */}
//         <aside className="w-64 bg-[#0f172a] text-slate-200 flex flex-col p-5 border-r border-slate-800 shadow-xl">
//           {/* BRAND APEX HEAD */}
//           <div className="flex items-center space-x-2.5 mb-8 px-2 py-1">
//             <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
//               <ShieldCheck className="text-slate-900 w-5 h-5" />
//             </div>
//             <div className="flex flex-col">
//               <span className="font-extrabold tracking-tight text-base uppercase leading-none">Aeron Ops</span>
//               <span className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">Control Center</span>
//             </div>
//           </div>

//           {/* SIMPLIFIED MAIN ACTION NAVIGATION */}
//           <nav className="flex-1 space-y-1">
//             <Link 
//               href="/dashboard/admin" 
//               className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
//                 pathname === '/dashboard/admin' || pathname === '/dashboard/admin'
//                   ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/10' 
//                   : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
//               }`}
//             >
//               <ClipboardList className="w-4 h-4 mr-3" /> Order Queue
//             </Link>
//           </nav>

//           {/* DOCK TERMINAL LOGOUT ACTION */}
//           <button 
//             onClick={handleLogout}
//             className="flex items-center px-3.5 py-2.5 mt-auto text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-500/10 rounded-xl transition-all group"
//           >
//             <LogOut className="w-4 h-4 mr-3 group-hover:-translate-x-0.5 transition-transform" /> Secure Logout
//           </button>
//         </aside>

//         {/* MAIN WORKSPACE CONTENT AREA */}
//         <main className="flex-1 flex flex-col overflow-hidden">
//           {/* APP CONTROLLER METADATA BAR */}
//           <header className="h-16 bg-white border-b border-gray-200/80 flex items-center px-8 justify-between flex-shrink-0">
//             <h2 className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">Core Administration Channel</h2>
//             <div className="flex items-center space-x-4">
//                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
//                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//                  System Node Online
//                </span>
//             </div>
//           </header>
          
//           {/* INTERFACE INJECTION HUB */}
//           <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
//             {children}
//           </div>
//         </main>

//       </div>
//     </AdminGuard>
//   );
// }

"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 🔴 Added Calendar icon to match your layout style
import { ClipboardList, LogOut, ShieldCheck, Calendar } from 'lucide-react';
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
                pathname === '/dashboard/admin'
                  ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/10' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <ClipboardList className="w-4 h-4 mr-3" /> Order Queue
            </Link>

            {/* 🔴 NEW OPERATIONS CALENDAR NAVIGATION LINK */}
            <Link 
              href="/dashboard/admin/calendar" 
              className={`flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                pathname.startsWith('/dashboard/admin/calendar')
                  ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/10' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4 mr-3" /> Delivery Schedule
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