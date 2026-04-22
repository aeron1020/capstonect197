// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Link from 'next/link'; // Standardized import
// import { Eye } from 'lucide-react';

// interface OrderItem {
//   volume: string | number;
// }

// interface Order {
//   id: number;
//   project_name: string;
//   status: string;
//   proposed_schedule: string;
//   order_items: OrderItem[]; // Added this to track volumes
// }

// interface UserProfile {
//   full_name: string;
//   username: string;
//   role: string;
// }

// export default function CustomerDashboard() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [profileRes, ordersRes] = await Promise.all([
//           api.get('me/'),
//           api.get('orders/')
//         ]);

//         if (profileRes.data.role !== 'customer') {
//           router.push('/login');
//           return;
//         }

//         setUser(profileRes.data);
//         setOrders(ordersRes.data);
//       } catch (err) {
//         console.error("Dashboard Fetch Error:", err);
//         router.push('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [router]);

//   // Statistics Calculation
//   const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
//   const pendingQuotes = orders.filter(o => o.status === 'Pending' || o.status === 'For Quotation').length;
//   const completedOrders = orders.filter(o => o.status === 'Completed').length;

//   if (isLoading) return <div className="p-10 text-center font-sans">Loading AERON RMC Dashboard...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
//         <h1 className="text-xl font-bold">AERON<span className="text-[#d4af37]">RMC</span></h1>
//         <div className="flex items-center gap-4 text-sm">
//           <span>Welcome, <strong>{user?.full_name}</strong></span>
//           <button 
//             onClick={() => { localStorage.clear(); router.push('/login'); }}
//             className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition border border-white/20"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto p-6">
//         <header className="mb-8 flex justify-between items-end">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-800">Customer Dashboard</h2>
//             <p className="text-gray-500 text-sm">Track your concrete deliveries and billing</p>
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/customer/new-order')}
//             className="bg-[#064e3b] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#053f30] transition shadow-lg"
//           >
//             + New Order
//           </button>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <StatCard title="Active Orders" value={activeOrders.toString()} color="border-l-[#064e3b]" />
//           <StatCard title="Pending Quotations" value={pendingQuotes.toString()} color="border-l-[#d4af37]" />
//           <StatCard title="Completed" value={completedOrders.toString()} color="border-l-blue-500" />
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-4 border-b bg-gray-50">
//             <h3 className="font-bold text-gray-700">Recent Requests</h3>
//           </div>
//           {orders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
//                 <tr>
//                     <th className="p-4">Project</th>
//                     <th className="p-4">Total Volume</th>
//                     <th className="p-4">Schedule</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 text-right">Action</th>
//                 </tr>
//                 </thead>
//                 <tbody className="divide-y text-gray-700">
//                 {orders.map((order) => {
//                     // CALCULATE VOLUME SUM FOR THIS ROW
//                     const totalVol = order.order_items?.reduce(
//                       (acc, item) => acc + Number(item.volume), 0
//                     ) || 0;

//                     return (
//                       <tr key={order.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="p-4 font-semibold text-gray-800">{order.project_name}</td>
//                         {/* FIX: Showing the calculated sum */}
//                         <td className="p-4 font-mono">{totalVol.toFixed(2)} m³</td>
//                         <td className="p-4">
//                             {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                             })}
//                         </td>
//                         <td className="p-4">
//                             <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
//                             order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
//                             order.status === 'Quotation Sent' ? 'bg-blue-100 text-blue-700' : 
//                             'bg-green-100 text-green-700'
//                             }`}>
//                             {order.status}
//                             </span>
//                         </td>
//                         <td className="p-4 text-right">
//                             <Link 
//                             href={`/dashboard/customer/orders/${order.id}`}
//                             className="inline-flex items-center gap-2 bg-gray-100 hover:bg-[#064e3b] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
//                             >
//                             <Eye className="w-3.5 h-3.5" />
//                             View
//                             </Link>
//                         </td>
//                       </tr>
//                     )
//                 })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-12 text-center">
//               <p className="text-gray-400 text-sm">No orders found. Start by creating a new request!</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
//   return (
//     <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}>
//       <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
//       <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import Link from 'next/link'; 
import { Eye, Plus, Package, FileText, CheckCircle2 } from 'lucide-react';

// Interfaces remain same...
interface OrderItem { volume: string | number; }
interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; }
interface UserProfile { full_name: string; username: string; role: string; }

export default function CustomerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          api.get('me/'),
          api.get('orders/')
        ]);
        if (profileRes.data.role !== 'customer') {
          router.push('/login');
          return;
        }
        setUser(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Helper for consistent status colors across dashboards
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': 
        return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Quotation Sent': 
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'For Inspection': 
        return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Ready for Pouring': 
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Rejected': 
        return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border border-gray-200';
      default: 
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const activeOrders = orders.filter(o => !['Completed', 'Cancelled', 'Rejected'].includes(o.status)).length;
  const pendingQuotes = orders.filter(o => o.status === 'Quotation Sent').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing Aeron RMC Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-black italic tracking-tighter">AERON<span className="text-[#d4af37]">RMC</span></h1>
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <span className="hidden md:inline text-white/60">Portal: <span className="text-white">{user?.full_name}</span></span>
          <button 
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-4 py-2 rounded-lg transition-all border border-rose-500/30"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Customer Dashboard</h2>
            <p className="text-gray-500 text-sm mt-2">Manage your concrete requests and project scheduling.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/customer/new-order')}
            className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#053f30] transition shadow-[0_20px_50px_rgba(6,78,59,0.2)] flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Order
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
          <StatCard title="Pending Quotations" value={pendingQuotes.toString()} icon={<FileText className="w-4 h-4" />} color="border-l-[#d4af37]" />
          <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-blue-500" />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Recent Transactions</h3>
          </div>
          
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Project / Jobsite</th>
                    <th className="px-6 py-4">Volume</th>
                    <th className="px-6 py-4 text-center">Pouring Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-8 py-4 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded text-xs">
                            {totalVol.toFixed(2)} m³
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
                          {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Link 
                            href={`/dashboard/customer/orders/${order.id}`}
                            className="inline-flex items-center gap-2 bg-[#111827] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#064e3b] transition-all shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Package className="text-gray-300 w-8 h-8" />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No projects found in your history.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <div className="text-gray-300">{icon}</div>
      </div>
      <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
    </div>
  );
}