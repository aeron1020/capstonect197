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

// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Link from 'next/link'; 
// import { Eye, Plus, Package, FileText, CheckCircle2 } from 'lucide-react';

// // Interfaces remain same...
// interface OrderItem { volume: string | number; }
// interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; }
// interface UserProfile { full_name: string; username: string; role: string; }

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

//   // Helper for consistent status colors across dashboards
//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-100 text-amber-700 border border-amber-200';
//       case 'Quotation Sent': 
//         return 'bg-blue-100 text-blue-700 border border-blue-200';
//       case 'For Inspection': 
//         return 'bg-purple-100 text-purple-700 border border-purple-200';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
//       case 'Rejected': 
//         return 'bg-rose-100 text-rose-700 border border-rose-200';
//       case 'Completed':
//         return 'bg-gray-100 text-gray-700 border border-gray-200';
//       default: 
//         return 'bg-slate-100 text-slate-700 border border-slate-200';
//     }
//   };

//   const activeOrders = orders.filter(o => !['Completed', 'Cancelled', 'Rejected'].includes(o.status)).length;
//   const pendingQuotes = orders.filter(o => o.status === 'Quotation Sent').length;
//   const completedOrders = orders.filter(o => o.status === 'Completed').length;

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//        <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing Aeron RMC Data...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
//         <h1 className="text-xl font-black italic tracking-tighter">AERON<span className="text-[#d4af37]">RMC</span></h1>
//         <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
//           <span className="hidden md:inline text-white/60">Portal: <span className="text-white">{user?.full_name}</span></span>
//           <button 
//             onClick={() => { localStorage.clear(); router.push('/login'); }}
//             className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-4 py-2 rounded-lg transition-all border border-rose-500/30"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto p-6 space-y-10">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Customer Dashboard</h2>
//             <p className="text-gray-500 text-sm mt-2">Manage your concrete requests and project scheduling.</p>
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/customer/new-order')}
//             className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#053f30] transition shadow-[0_20px_50px_rgba(6,78,59,0.2)] flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" /> New Order
//           </button>
//         </header>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
//           <StatCard title="Pending Quotations" value={pendingQuotes.toString()} icon={<FileText className="w-4 h-4" />} color="border-l-[#d4af37]" />
//           <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-blue-500" />
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
//             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Recent Transactions</h3>
//           </div>
          
//           {orders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
//                   <tr>
//                     <th className="px-8 py-4">Project / Jobsite</th>
//                     <th className="px-6 py-4">Volume</th>
//                     <th className="px-6 py-4 text-center">Pouring Date</th>
//                     <th className="px-6 py-4 text-center">Status</th>
//                     <th className="px-8 py-4 text-right">Review</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {orders.map((order) => {
//                     const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;

//                     return (
//                       <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
//                         <td className="px-8 py-5">
//                           <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
//                           <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
//                         </td>
//                         <td className="px-6 py-5">
//                           <span className="font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded text-xs">
//                             {totalVol.toFixed(2)} m³
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
//                           {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
//                             month: 'short', day: 'numeric', year: 'numeric'
//                           })}
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <Link 
//                             href={`/dashboard/customer/orders/${order.id}`}
//                             className="inline-flex items-center gap-2 bg-[#111827] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#064e3b] transition-all shadow-md"
//                           >
//                             <Eye className="w-3.5 h-3.5" /> Details
//                           </Link>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-20 text-center space-y-4">
//               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//                 <Package className="text-gray-300 w-8 h-8" />
//               </div>
//               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No projects found in your history.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
//   return (
//     <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
//         <div className="text-gray-300">{icon}</div>
//       </div>
//       <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Link from 'next/link'; 
// import { Eye, Plus, Package, FileText, CheckCircle2, Search, Filter, AlertCircle, Calendar } from 'lucide-react';

// interface OrderItem { volume: string | number; }
// interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; }
// interface UserProfile { full_name: string; username: string; role: string; }

// export default function CustomerDashboard() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // New UX State Additions
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
  
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

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-50 text-amber-700 border border-amber-200/60';
//       case 'Quotation Sent': 
//         return 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse';
//       case 'For Inspection': 
//         return 'bg-purple-50 text-purple-700 border border-purple-200/60';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black';
//       case 'Rejected': 
//         return 'bg-rose-50 text-rose-700 border border-rose-200/60';
//       case 'Completed':
//         return 'bg-gray-50 text-gray-600 border border-gray-200/60';
//       default: 
//         return 'bg-slate-50 text-slate-700 border border-slate-200/60';
//     }
//   };

//   // Check if pouring schedule matches today's system date context
//   const isPouringUrgent = (dateString: string) => {
//     const today = new Date().toDateString();
//     const targetDate = new Date(dateString).toDateString();
//     return today === targetDate;
//   };

//   // Metrics calculations
//   const activeOrders = orders.filter(o => !['Completed', 'Cancelled', 'Rejected'].includes(o.status)).length;
//   const pendingQuotes = orders.filter(o => o.status === 'Quotation Sent').length;
//   const completedOrders = orders.filter(o => o.status === 'Completed').length;

//   // Filtered and searched data processing arrays
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           order.id.toString().includes(searchTerm);
    
//     if (statusFilter === 'All') return matchesSearch;
//     if (statusFilter === 'Action Required') return matchesSearch && order.status === 'Quotation Sent';
//     if (statusFilter === 'Active') return matchesSearch && !['Completed', 'Cancelled', 'Rejected'].includes(order.status);
//     return matchesSearch && order.status === statusFilter;
//   });

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//        <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing Aeron RMC Data...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* GLOBAL BANNER IF ACTION IS REQUIRED */}
//       {pendingQuotes > 0 && (
//         <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
//           <AlertCircle className="w-4 h-4 animate-bounce" />
//           You have {pendingQuotes} draft {pendingQuotes === 1 ? 'quotation' : 'quotations'} waiting for your approval signature!
//         </div>
//       )}

//       <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
//         <h1 className="text-xl font-black italic tracking-tighter">AERON<span className="text-[#d4af37]">RMC</span></h1>
//         <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
//           <span className="hidden md:inline text-white/60">Portal: <span className="text-white">{user?.full_name}</span></span>
//           <button 
//             onClick={() => { localStorage.clear(); router.push('/login'); }}
//             className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-4 py-2 rounded-lg transition-all border border-rose-500/30"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto p-6 space-y-10">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Customer Dashboard</h2>
//             <p className="text-gray-500 text-sm mt-2">Manage your concrete requests and project scheduling.</p>
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/customer/new-order')}
//             className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#053f30] transition shadow-[0_20px_50px_rgba(6,78,59,0.2)] flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" /> New Order
//           </button>
//         </header>

//         {/* Dynamic Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
          
//           {/* Enhanced Action-centric Quotation Monitor */}
//           <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${pendingQuotes > 0 ? 'border-l-blue-500 bg-blue-50/20' : 'border-l-[#d4af37]'} transition-all`}>
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Your Action</p>
//               <div className={pendingQuotes > 0 ? 'text-blue-500' : 'text-gray-300'}><FileText className="w-4 h-4" /></div>
//             </div>
//             <div className="flex items-baseline gap-2">
//               <p className="text-4xl font-black text-gray-900 tracking-tighter">{pendingQuotes}</p>
//               {pendingQuotes > 0 && <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight bg-blue-100 px-2 py-0.5 rounded-full">Sign Invoice</span>}
//             </div>
//           </div>

//           <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-gray-400" />
//         </div>

//         {/* Interactive Query Filters and Search Row */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input 
//               type="text"
//               placeholder="Search projects by name or Order ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#064e3b] transition-all text-gray-800"
//             />
//           </div>
//           <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
//             <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:inline" />
//             {['All', 'Active', 'Action Required', 'Ready for Pouring', 'Completed'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setStatusFilter(tab)}
//                 className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
//                   statusFilter === tab 
//                     ? 'bg-[#111827] text-white border-[#111827]' 
//                     : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders Table Canvas */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
//             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
//               Showing {filteredOrders.length} of {orders.length} Transactions
//             </h3>
//           </div>
          
//           {filteredOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
//                   <tr>
//                     <th className="px-8 py-4">Project / Jobsite</th>
//                     <th className="px-6 py-4">Total Requested Volume</th>
//                     <th className="px-6 py-4 text-center">Target Pouring Date</th>
//                     <th className="px-6 py-4 text-center">Status States</th>
//                     <th className="px-8 py-4 text-right">Review Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filteredOrders.map((order) => {
//                     const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;
//                     const needsAction = order.status === 'Quotation Sent';
//                     const isUrgentPour = isPouringUrgent(order.proposed_schedule) && order.status === 'Ready for Pouring';

//                     return (
//                       <tr 
//                         key={order.id} 
//                         className={`transition-colors group ${
//                           needsAction ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-gray-50/50'
//                         }`}
//                       >
//                         <td className="px-8 py-5">
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
//                             {needsAction && (
//                               <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" title="Awaiting action" />
//                             )}
//                           </div>
//                           <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
//                         </td>
//                         <td className="px-6 py-5">
//                           <span className="font-mono font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs">
//                             {totalVol.toFixed(2)} m³
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
//                           <div className="flex flex-col items-center justify-center">
//                             <span>
//                               {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
//                                 month: 'short', day: 'numeric', year: 'numeric'
//                               })}
//                             </span>
//                             {isUrgentPour && (
//                               <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-tighter mt-1 bg-emerald-100 px-1.5 py-0.5 rounded">
//                                 <Calendar className="w-2.5 h-2.5" /> Dispatched Today
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <Link 
//                             href={`/dashboard/customer/orders/${order.id}`}
//                             className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
//                               needsAction 
//                                 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' 
//                                 : 'bg-[#111827] text-white hover:bg-[#064e3b]'
//                             }`}
//                           >
//                             <Eye className="w-3.5 h-3.5" /> {needsAction ? "Review & Sign" : "Details"}
//                           </Link>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-20 text-center space-y-4">
//               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//                 <Package className="text-gray-300 w-8 h-8" />
//               </div>
//               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No matching concrete orders found.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
//   return (
//     <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
//         <div className="text-gray-300">{icon}</div>
//       </div>
//       <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Link from 'next/link'; 
// import { Eye, Plus, Package, FileText, CheckCircle2, Search, Filter, AlertCircle, Calendar, CreditCard } from 'lucide-react';

// interface OrderItem { volume: string | number; }
// interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; }
// interface UserProfile { full_name: string; username: string; role: string; }

// export default function CustomerDashboard() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // UX Filter States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
  
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

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-50 text-amber-700 border border-amber-200/60';
//       case 'Quotation Sent': 
//         return 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse';
//       case 'For Inspection': 
//         return 'bg-purple-50 text-purple-700 border border-purple-200/60';
//       case 'For Payment Verification':
//         return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black';
//       case 'Rejected': 
//         return 'bg-rose-50 text-rose-700 border border-rose-200/60';
//       case 'Completed':
//         return 'bg-gray-50 text-gray-600 border border-gray-200/60';
//       default: 
//         return 'bg-slate-50 text-slate-700 border border-slate-200/60';
//     }
//   };

//   // Check if pouring schedule matches today's system date context
//   const isPouringUrgent = (dateString: string) => {
//     const today = new Date().toDateString();
//     const targetDate = new Date(dateString).toDateString();
//     return today === targetDate;
//   };

//   // Metrics calculations
//   const activeOrders = orders.filter(o => !['Completed', 'Cancelled', 'Rejected'].includes(o.status)).length;
//   const pendingQuotes = orders.filter(o => o.status === 'Quotation Sent').length;
//   const pendingPayments = orders.filter(o => o.status === 'For Payment Verification').length;
//   const completedOrders = orders.filter(o => o.status === 'Completed').length;

//   // Filtered and searched data processing arrays
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           order.id.toString().includes(searchTerm);
    
//     if (statusFilter === 'All') return matchesSearch;
//     if (statusFilter === 'Action Required') return matchesSearch && order.status === 'Quotation Sent';
//     if (statusFilter === 'Active') return matchesSearch && !['Completed', 'Cancelled', 'Rejected'].includes(order.status);
//     return matchesSearch && order.status === statusFilter;
//   });

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//        <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing Aeron RMC Data...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* GLOBAL BANNER IF ACTION IS REQUIRED */}
//       {pendingQuotes > 0 && (
//         <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
//           <AlertCircle className="w-4 h-4 animate-bounce" />
//           You have {pendingQuotes} draft {pendingQuotes === 1 ? 'quotation' : 'quotations'} waiting for your approval signature!
//         </div>
//       )}

//       {/* GLOBAL BANNER FOR PAYMENT VERIFICATION ATTAINMENT */}
//       {pendingPayments > 0 && (
//         <div className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
//           <CreditCard className="w-4 h-4 animate-pulse" />
//           Notice: {pendingPayments} {pendingPayments === 1 ? 'order is' : 'orders are'} currently pending accounting payment verification clearance.
//         </div>
//       )}

//       <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
//         <h1 className="text-xl font-black italic tracking-tighter">AERON<span className="text-[#d4af37]">RMC</span></h1>
//         <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
//           <span className="hidden md:inline text-white/60">Portal: <span className="text-white">{user?.full_name}</span></span>
//           <button 
//             onClick={() => { localStorage.clear(); router.push('/login'); }}
//             className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-4 py-2 rounded-lg transition-all border border-rose-500/30"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto p-6 space-y-10">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Customer Dashboard</h2>
//             <p className="text-gray-500 text-sm mt-2">Manage your concrete requests and project scheduling.</p>
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/customer/new-order')}
//             className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#053f30] transition shadow-[0_20px_50px_rgba(6,78,59,0.2)] flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" /> New Order
//           </button>
//         </header>

//         {/* Dynamic Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
          
//           {/* Enhanced Action-centric Quotation Monitor */}
//           <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${pendingQuotes > 0 ? 'border-l-blue-500 bg-blue-50/20' : 'border-l-[#d4af37]'} transition-all`}>
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Your Action</p>
//               <div className={pendingQuotes > 0 ? 'text-blue-500' : 'text-gray-300'}><FileText className="w-4 h-4" /></div>
//             </div>
//             <div className="flex items-baseline gap-2">
//               <p className="text-4xl font-black text-gray-900 tracking-tighter">{pendingQuotes}</p>
//               {pendingQuotes > 0 && <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight bg-blue-100 px-2 py-0.5 rounded-full">Sign Invoice</span>}
//             </div>
//           </div>

//           <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-gray-400" />
//         </div>

//         {/* Interactive Query Filters and Search Row */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input 
//               type="text"
//               placeholder="Search projects by name or Order ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#064e3b] transition-all text-gray-800"
//             />
//           </div>
//           <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
//             <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:inline" />
//             {['All', 'Active', 'Action Required', 'For Payment Verification', 'Ready for Pouring', 'Completed'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setStatusFilter(tab)}
//                 className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
//                   statusFilter === tab 
//                     ? 'bg-[#111827] text-white border-[#111827]' 
//                     : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders Table Canvas */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
//             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
//               Showing {filteredOrders.length} of {orders.length} Transactions
//             </h3>
//           </div>
          
//           {filteredOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
//                   <tr>
//                     <th className="px-8 py-4">Project / Jobsite</th>
//                     <th className="px-6 py-4">Total Requested Volume</th>
//                     <th className="px-6 py-4 text-center">Target Pouring Date</th>
//                     <th className="px-6 py-4 text-center">Status States</th>
//                     <th className="px-8 py-4 text-right">Review Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filteredOrders.map((order) => {
//                     const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;
//                     const needsAction = order.status === 'Quotation Sent';
//                     const isPaymentVerify = order.status === 'For Payment Verification';
//                     const isUrgentPour = isPouringUrgent(order.proposed_schedule) && order.status === 'Ready for Pouring';

//                     return (
//                       <tr 
//                         key={order.id} 
//                         className={`transition-colors group ${
//                           needsAction ? 'bg-blue-50/30 hover:bg-blue-50/50' : isPaymentVerify ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-gray-50/50'
//                         }`}
//                       >
//                         <td className="px-8 py-5">
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
//                             {needsAction && (
//                               <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" title="Awaiting action" />
//                             )}
//                           </div>
//                           <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
//                         </td>
//                         <td className="px-6 py-5">
//                           <span className="font-mono font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs">
//                             {totalVol.toFixed(2)} m³
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
//                           <div className="flex flex-col items-center justify-center">
//                             <span>
//                               {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
//                                 month: 'short', day: 'numeric', year: 'numeric'
//                               })}
//                             </span>
//                             {isUrgentPour && (
//                               <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-tighter mt-1 bg-emerald-100 px-1.5 py-0.5 rounded">
//                                 <Calendar className="w-2.5 h-2.5" /> Dispatched Today
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <Link 
//                             href={`/dashboard/customer/orders/${order.id}`}
//                             className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
//                               needsAction 
//                                 ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' 
//                                 : isPaymentVerify
//                                 ? 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-[1.02]'
//                                 : 'bg-[#111827] text-white hover:bg-[#064e3b]'
//                             }`}
//                           >
//                             <Eye className="w-3.5 h-3.5" /> 
//                             {needsAction ? "Review & Sign" : isPaymentVerify ? "Payment Info" : "Details"}
//                           </Link>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-20 text-center space-y-4">
//               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//                 <Package className="text-gray-300 w-8 h-8" />
//               </div>
//               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No matching concrete orders found.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
//   return (
//     <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
//         <div className="text-gray-300">{icon}</div>
//       </div>
//       <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Link from 'next/link'; 
// import { Eye, Plus, Package, FileText, CheckCircle2, Search, Filter, AlertCircle, Calendar, CreditCard, Trash2, Archive, ArchiveRestore } from 'lucide-react';
// import Swal from 'sweetalert2';

// interface OrderItem { volume: string | number; }
// interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; is_archived?: boolean; }
// interface UserProfile { full_name: string; username: string; role: string; }

// export default function CustomerDashboard() {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // UX Filter States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [showArchived, setShowArchived] = useState(false);
  
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

//   // Order Deletion Handler (Allowed only for Pending orders)
//   const handleDeleteOrder = async (orderId: number) => {
//     const prompt = await Swal.fire({
//       title: 'DELETE TRANSACTION?',
//       text: "Are you sure you want to completely permanently delete this pending order request?",
//       icon: 'warning',
//       showCancelButton: true,
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#ef4444',
//       cancelButtonColor: '#334155',
//       confirmButtonText: 'YES, DELETE',
//       cancelButtonText: 'CANCEL',
//       customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//     });

//     if (!prompt.isConfirmed) return;

//     try {
//       await api.delete(`orders/${orderId}/`);
//       setOrders(prev => prev.filter(o => o.id !== orderId));
      
//       Swal.fire({
//         title: 'RECORD DELETED',
//         text: 'The order pipeline record has been cleanly cleared out.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#10b981'
//       });
//     } catch (err) {
//       console.error("Failed to delete order row:", err);
//       Swal.fire({
//         title: 'ACTION DENIED',
//         text: 'Could not remove records from system context framework.',
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444'
//       });
//     }
//   };

//   // Local/Remote Archive Status Switcher
//   const handleToggleArchive = async (orderId: number, currentArchiveState: boolean) => {
//     try {
//       // Toggle backend archive flag state context
//       await api.patch(`orders/${orderId}/`, { is_archived: !currentArchiveState });
      
//       setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_archived: !currentArchiveState } : o));
      
//       Swal.fire({
//         title: !currentArchiveState ? 'MOVED TO ARCHIVE' : 'RESTORED TO ACTIVE',
//         text: !currentArchiveState ? 'Order moved out of daily workspace dashboards.' : 'Order layout restored to standard workflows.',
//         icon: 'success',
//         toast: true,
//         position: 'top-end',
//         showConfirmButton: false,
//         timer: 3000,
//         background: '#0f172a',
//         color: '#f8fafc'
//       });
//     } catch (err) {
//       // Fallback state manipulation logic if custom backend field lacks automated patch mutations
//       setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_archived: !currentArchiveState } : o));
//     }
//   };

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-50 text-amber-700 border border-amber-200/60';
//       case 'Quotation Sent': 
//         return 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse';
//       case 'For Inspection': 
//         return 'bg-purple-50 text-purple-700 border border-purple-200/60';
//       case 'For Payment Verification':
//         return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black';
//       case 'Rejected': 
//         return 'bg-rose-50 text-rose-700 border border-rose-200/60';
//       case 'Completed':
//         return 'bg-gray-50 text-gray-600 border border-gray-200/60';
//       default: 
//         return 'bg-slate-50 text-slate-700 border border-slate-200/60';
//     }
//   };

//   const isPouringUrgent = (dateString: string) => {
//     const today = new Date().toDateString();
//     const targetDate = new Date(dateString).toDateString();
//     return today === targetDate;
//   };

//   // Metrics calculations (excluding archived row scopes)
//   const nonArchivedOrders = orders.filter(o => !o.is_archived);
//   const activeOrders = nonArchivedOrders.filter(o => !['Completed', 'Cancelled', 'Rejected'].includes(o.status)).length;
//   const pendingQuotes = nonArchivedOrders.filter(o => o.status === 'Quotation Sent').length;
//   const pendingPayments = nonArchivedOrders.filter(o => o.status === 'For Payment Verification').length;
//   const completedOrders = nonArchivedOrders.filter(o => o.status === 'Completed').length;

//   // Filtered, Searched and Sorted (Newest at top) Data processing arrays
//   const filteredOrders = orders
//     .filter(order => {
//       // Primary view filtering layer split by archive context flag states
//       if (showArchived) {
//         if (!order.is_archived && !['Completed', 'Rejected', 'Cancelled'].includes(order.status)) return false;
//       } else {
//         if (order.is_archived) return false;
//       }

//       const matchesSearch = order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                             order.id.toString().includes(searchTerm);
      
//       if (statusFilter === 'All') return matchesSearch;
//       if (statusFilter === 'Action Required') return matchesSearch && order.status === 'Quotation Sent';
//       if (statusFilter === 'Active') return matchesSearch && !['Completed', 'Cancelled', 'Rejected'].includes(order.status);
//       return matchesSearch && order.status === statusFilter;
//     })
//     // SORTATION RULE: Newest transaction database records placed cleanly up top via primary keys 
//     .sort((a, b) => b.id - a.id);

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//        <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing Aeron RMC Data...</p>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {pendingQuotes > 0 && (
//         <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
//           <AlertCircle className="w-4 h-4 animate-bounce" />
//           You have {pendingQuotes} draft {pendingQuotes === 1 ? 'quotation' : 'quotations'} waiting for your approval signature!
//         </div>
//       )}

//       {pendingPayments > 0 && (
//         <div className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
//           <CreditCard className="w-4 h-4 animate-pulse" />
//           Notice: {pendingPayments} {pendingPayments === 1 ? 'order is' : 'orders are'} currently pending accounting payment verification clearance.
//         </div>
//       )}

//       <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
//         <h1 className="text-xl font-black italic tracking-tighter">AERON<span className="text-[#d4af37]">RMC</span></h1>
//         <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
//           <span className="hidden md:inline text-white/60">Portal: <span className="text-white">{user?.full_name}</span></span>
//           <button 
//             onClick={() => { localStorage.clear(); router.push('/login'); }}
//             className="bg-rose-500/20 hover:bg-rose-500 text-rose-100 px-4 py-2 rounded-lg transition-all border border-rose-500/30"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto p-6 space-y-10">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Customer Dashboard</h2>
//             <p className="text-gray-500 text-sm mt-2">Manage your concrete requests and project scheduling.</p>
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/customer/new-order')}
//             className="w-full md:w-auto bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#053f30] transition shadow-[0_20px_50px_rgba(6,78,59,0.2)] flex items-center justify-center gap-2"
//           >
//             <Plus className="w-4 h-4" /> New Order
//           </button>
//         </header>

//         {/* Dynamic Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
          
//           <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${pendingQuotes > 0 ? 'border-l-blue-500 bg-blue-50/20' : 'border-l-[#d4af37]'} transition-all`}>
//             <div className="flex items-center justify-between mb-4">
//               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Your Action</p>
//               <div className={pendingQuotes > 0 ? 'text-blue-500' : 'text-gray-300'}><FileText className="w-4 h-4" /></div>
//             </div>
//             <div className="flex items-baseline gap-2">
//               <p className="text-4xl font-black text-gray-900 tracking-tighter">{pendingQuotes}</p>
//               {pendingQuotes > 0 && <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight bg-blue-100 px-2 py-0.5 rounded-full">Sign Invoice</span>}
//             </div>
//           </div>

//           <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-gray-400" />
//         </div>

//         {/* Interactive Query Filters and Search Row */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input 
//               type="text"
//               placeholder="Search projects by name or Order ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#064e3b] transition-all text-gray-800"
//             />
//           </div>
          
//           <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
//             {/* ARCHIVE DIRECTORY TOGGLE ROUTER BUTTON */}
//             <button
//               onClick={() => { setShowArchived(!showArchived); setStatusFilter("All"); }}
//               className={`text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
//                 showArchived 
//                   ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
//                   : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
//               }`}
//             >
//               <Archive className="w-3.5 h-3.5" />
//               {showArchived ? "View Active" : "View Archive"}
//             </button>

//             <div className="h-6 w-[1px] bg-gray-200 mx-1 shrink-0" />

//             <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:inline" />
//             {(showArchived ? ['All', 'Completed', 'Rejected'] : ['All', 'Active', 'Action Required', 'For Payment Verification', 'Ready for Pouring', 'Completed']).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setStatusFilter(tab)}
//                 className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
//                   statusFilter === tab 
//                     ? 'bg-[#111827] text-white border-[#111827]' 
//                     : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders Table Canvas */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
//             <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
//               Showing {filteredOrders.length} {showArchived ? 'Archived' : 'Active'} Transactions
//             </h3>
//           </div>
          
//           {filteredOrders.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
//                   <tr>
//                     <th className="px-8 py-4">Project / Jobsite</th>
//                     <th className="px-6 py-4">Total Requested Volume</th>
//                     <th className="px-6 py-4 text-center">Target Pouring Date</th>
//                     <th className="px-6 py-4 text-center">Status States</th>
//                     <th className="px-8 py-4 text-right">Review Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filteredOrders.map((order) => {
//                     const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;
//                     const needsAction = order.status === 'Quotation Sent';
//                     const isPaymentVerify = order.status === 'For Payment Verification';
//                     const isUrgentPour = isPouringUrgent(order.proposed_schedule) && order.status === 'Ready for Pouring';
                    
//                     // Business Rule Logic: Only allow deletion if the request remains unprocessed inside "Pending"
//                     const isDeletable = order.status === 'Pending';
//                     // Business Rule Logic: Allow archive toggles only for terminal step workflows
//                     const isArchivable = ['Completed', 'Rejected', 'Cancelled'].includes(order.status);

//                     return (
//                       <tr 
//                         key={order.id} 
//                         className={`transition-colors group ${
//                           needsAction ? 'bg-blue-50/30 hover:bg-blue-50/50' : isPaymentVerify ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-gray-50/50'
//                         }`}
//                       >
//                         <td className="px-8 py-5">
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
//                             {needsAction && (
//                               <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" title="Awaiting action" />
//                             )}
//                           </div>
//                           <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
//                         </td>
//                         <td className="px-6 py-5">
//                           <span className="font-mono font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs">
//                             {totalVol.toFixed(2)} m³
//                           </span>
//                         </td>
//                         <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
//                           <div className="flex flex-col items-center justify-center">
//                             <span>
//                               {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
//                                 month: 'short', day: 'numeric', year: 'numeric'
//                               })}
//                             </span>
//                             {isUrgentPour && (
//                               <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-tighter mt-1 bg-emerald-100 px-1.5 py-0.5 rounded">
//                                 <Calendar className="w-2.5 h-2.5" /> Dispatched Today
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-5 text-center">
//                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
//                             {order.status}
//                           </span>
//                         </td>
//                         <td className="px-8 py-5 text-right">
//                           <div className="flex items-center justify-end gap-2">
                            
//                             {/* DYNAMIC ACTION 1: PIPELINE WORKSPACE RECORD DELETION */}
//                             {isDeletable && (
//                               <button
//                                 onClick={() => handleDeleteOrder(order.id)}
//                                 className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 border border-gray-200/60 hover:border-red-200 rounded-xl transition-all"
//                                 title="Delete Order Proposal"
//                               >
//                                 <Trash2 className="w-3.5 h-3.5" />
//                               </button>
//                             )}

//                             {/* DYNAMIC ACTION 2: ARCHIVE WORKSPACE MOVEMENT TOGGLE */}
//                             {isArchivable && (
//                               <button
//                                 onClick={() => handleToggleArchive(order.id, !!order.is_archived)}
//                                 className={`p-2.5 border rounded-xl transition-all ${
//                                   order.is_archived
//                                     ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
//                                     : 'text-gray-400 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 border-gray-200/60 hover:border-amber-200'
//                                 }`}
//                                 title={order.is_archived ? "Restore to Main Feed" : "Archive Complete Record"}
//                               >
//                                 {order.is_archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
//                               </button>
//                             )}

//                             {/* DYNAMIC ACTION 3: PIPELINE DETAILS REDIRECT */}
//                             <Link 
//                               href={`/dashboard/customer/orders/${order.id}`}
//                               className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
//                                 needsAction 
//                                   ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' 
//                                   : isPaymentVerify
//                                   ? 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-[1.02]'
//                                   : 'bg-[#111827] text-white hover:bg-[#064e3b]'
//                               }`}
//                             >
//                               <Eye className="w-3.5 h-3.5" /> 
//                               {needsAction ? "Review & Sign" : isPaymentVerify ? "Payment Info" : "Details"}
//                             </Link>
//                           </div>
//                         </td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-20 text-center space-y-4">
//               <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//                 <Package className="text-gray-300 w-8 h-8" />
//               </div>
//               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
//                 {showArchived ? "No archived orders found." : "No matching active concrete orders found."}
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ title, value, color, icon }: { title: string; value: string; color: string; icon: React.ReactNode }) {
//   return (
//     <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}>
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
//         <div className="text-gray-300">{icon}</div>
//       </div>
//       <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import Link from 'next/link'; 
import { Eye, Plus, Package, FileText, CheckCircle2, Search, Filter, AlertCircle, Calendar, CreditCard, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import Swal from 'sweetalert2';

interface OrderItem { volume: string | number; }
interface Order { id: number; project_name: string; status: string; proposed_schedule: string; order_items: OrderItem[]; is_archived?: boolean; }
interface UserProfile { full_name: string; username: string; role: string; }

export default function CustomerDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UX Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showArchived, setShowArchived] = useState(false);
  
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

        const payload = ordersRes.data as any;
        const normalizedOrders = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload?.orders)
          ? payload.orders
          : [];

        setUser(profileRes.data);
        setOrders(normalizedOrders);

        if (!Array.isArray(payload)) {
          console.warn('Normalized orders response to array:', payload);
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  // Order Deletion Handler (Allowed only for Pending orders)
  const handleDeleteOrder = async (orderId: number) => {
    const prompt = await Swal.fire({
      title: 'DELETE TRANSACTION?',
      text: "Are you sure you want to completely permanently delete this pending order request?",
      icon: 'warning',
      showCancelButton: true,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'YES, DELETE',
      cancelButtonText: 'CANCEL',
      customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
    });

    if (!prompt.isConfirmed) return;

    try {
      await api.delete(`orders/${orderId}/`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      
      Swal.fire({
        title: 'RECORD DELETED',
        text: 'The order pipeline record has been cleanly cleared out.',
        icon: 'success',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#10b981'
      });
    } catch (err) {
      console.error("Failed to delete order row:", err);
      Swal.fire({
        title: 'ACTION DENIED',
        text: 'Could not remove records from system context framework.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  // Local/Remote Archive Status Switcher
  const handleToggleArchive = async (orderId: number, currentArchiveState: boolean) => {
    try {
      await api.patch(`orders/${orderId}/`, { is_archived: !currentArchiveState });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_archived: !currentArchiveState } : o));
      
      Swal.fire({
        title: !currentArchiveState ? 'MOVED TO ARCHIVE' : 'RESTORED TO ACTIVE',
        text: !currentArchiveState ? 'Order moved out of daily workspace dashboards.' : 'Order layout restored to standard workflows.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#0f172a',
        color: '#f8fafc'
      });
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_archived: !currentArchiveState } : o));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending': 
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'Quotation Sent': 
        return 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse';
      case 'For Inspection': 
        return 'bg-purple-50 text-purple-700 border border-purple-200/60';
      case 'For Payment Verification':
        return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
      case 'Ready for Pouring': 
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black';
      case 'Rejected': 
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'Delivered':
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border border-gray-300 font-bold';
      default: 
        return 'bg-slate-50 text-slate-700 border border-slate-200/60';
    }
  };

  const isPouringUrgent = (dateString: string) => {
    const today = new Date().toDateString();
    const targetDate = new Date(dateString).toDateString();
    return today === targetDate;
  };

  // Metrics calculations (FIX: Maps Delivered statuses seamlessly into completed calculations)
  const nonArchivedOrders = orders.filter(o => !o.is_archived);
  const activeOrders = nonArchivedOrders.filter(o => !['Completed', 'Delivered', 'Cancelled', 'Rejected'].includes(o.status)).length;
  const pendingQuotes = nonArchivedOrders.filter(o => o.status === 'Quotation Sent').length;
  const pendingPayments = nonArchivedOrders.filter(o => o.status === 'For Payment Verification').length;
  const completedOrders = nonArchivedOrders.filter(o => ['Completed', 'Delivered'].includes(o.status)).length;

  // Filtered, Searched and Sorted Data processing arrays
  const filteredOrders = orders
    .filter(order => {
      if (showArchived) {
        if (!order.is_archived && !['Completed', 'Delivered', 'Rejected', 'Cancelled'].includes(order.status)) return false;
      } else {
        if (order.is_archived) return false;
      }

      const matchesSearch = order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.id.toString().includes(searchTerm);
      
      if (statusFilter === 'All') return matchesSearch;
      if (statusFilter === 'Action Required') return matchesSearch && order.status === 'Quotation Sent';
      if (statusFilter === 'Active') return matchesSearch && !['Completed', 'Delivered', 'Cancelled', 'Rejected'].includes(order.status);
      if (statusFilter === 'Completed' || statusFilter === 'Delivered') {
        return matchesSearch && ['Completed', 'Delivered'].includes(order.status);
      }
      return matchesSearch && order.status === statusFilter;
    })
    .sort((a, b) => b.id - a.id);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400 uppercase">Synchronizing LCRMCC Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {pendingQuotes > 0 && (
        <div className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-4 h-4 animate-bounce" />
          You have {pendingQuotes} draft {pendingQuotes === 1 ? 'quotation' : 'quotations'} waiting for your approval signature!
        </div>
      )}

      {pendingPayments > 0 && (
        <div className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <CreditCard className="w-4 h-4 animate-pulse" />
          Notice: {pendingPayments} {pendingPayments === 1 ? 'order is' : 'orders are'} currently pending accounting payment verification clearance.
        </div>
      )}

      <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-black italic tracking-tighter">LCRMCC<span className="text-[#d4af37]">Vault</span></h1>
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

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Active Requests" value={activeOrders.toString()} icon={<Package className="w-4 h-4" />} color="border-l-[#064e3b]" />
          
          <div className={`bg-white p-8 rounded-3xl shadow-sm border-l-4 ${pendingQuotes > 0 ? 'border-l-blue-500 bg-blue-50/20' : 'border-l-[#d4af37]'} transition-all`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Your Action</p>
              <div className={pendingQuotes > 0 ? 'text-blue-500' : 'text-gray-300'}><FileText className="w-4 h-4" /></div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-gray-900 tracking-tighter">{pendingQuotes}</p>
              {pendingQuotes > 0 && <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-tight bg-blue-100 px-2 py-0.5 rounded-full">Sign Invoice</span>}
            </div>
          </div>

          <StatCard title="Total Completed" value={completedOrders.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="border-l-gray-400" />
        </div>

        {/* Interactive Query Filters and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search projects by name or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-[#064e3b] transition-all text-gray-800"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => { setShowArchived(!showArchived); setStatusFilter("All"); }}
              className={`text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
                showArchived 
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              {showArchived ? "View Active" : "View Archive"}
            </button>

            <div className="h-6 w-[1px] bg-gray-200 mx-1 shrink-0" />

            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:inline" />
            {(showArchived ? ['All', 'Completed', 'Rejected'] : ['All', 'Active', 'Action Required', 'For Payment Verification', 'Ready for Pouring', 'Completed']).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
                  statusFilter === tab 
                    ? 'bg-[#111827] text-white border-[#111827]' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab === 'Completed' && !showArchived ? 'Delivered' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Canvas */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-white flex justify-between items-center">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Showing {filteredOrders.length} {showArchived ? 'Archived' : 'Active'} Transactions
            </h3>
          </div>
          
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Project / Jobsite</th>
                    <th className="px-6 py-4">Total Requested Volume</th>
                    <th className="px-6 py-4 text-center">Target Pouring Date</th>
                    <th className="px-6 py-4 text-center">Status States</th>
                    <th className="px-8 py-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => {
                    const totalVol = order.order_items?.reduce((acc, item) => acc + Number(item.volume), 0) || 0;
                    const needsAction = order.status === 'Quotation Sent';
                    const isPaymentVerify = order.status === 'For Payment Verification';
                    const isUrgentPour = isPouringUrgent(order.proposed_schedule) && order.status === 'Ready for Pouring';
                    
                    const isDeletable = order.status === 'Pending';
                    const isArchivable = ['Completed', 'Delivered', 'Rejected', 'Cancelled'].includes(order.status);

                    return (
                      <tr 
                        key={order.id} 
                        className={`transition-colors group ${
                          needsAction ? 'bg-blue-50/30 hover:bg-blue-50/50' : isPaymentVerify ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 group-hover:text-[#064e3b] transition-colors">{order.project_name}</p>
                            {needsAction && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0" title="Awaiting action" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium">Order ID: #{order.id}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded text-xs">
                            {totalVol.toFixed(2)} m³
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center text-xs font-medium text-gray-600">
                          <div className="flex flex-col items-center justify-center">
                            <span>
                              {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </span>
                            {isUrgentPour && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 tracking-tighter mt-1 bg-emerald-100 px-1.5 py-0.5 rounded">
                                <Calendar className="w-2.5 h-2.5" /> Dispatched Today
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            
                            {isDeletable && (
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 border border-gray-200/60 hover:border-red-200 rounded-xl transition-all"
                                title="Delete Order Proposal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {isArchivable && (
                              <button
                                onClick={() => handleToggleArchive(order.id, !!order.is_archived)}
                                className={`p-2.5 border rounded-xl transition-all ${
                                  order.is_archived
                                    ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                                    : 'text-gray-400 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 border-gray-200/60 hover:border-amber-200'
                                }`}
                                title={order.is_archived ? "Restore to Main Feed" : "Archive Complete Record"}
                              >
                                {order.is_archived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            <Link 
                              href={`/dashboard/customer/orders/${order.id}`}
                              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                                needsAction 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02]' 
                                  : isPaymentVerify
                                  ? 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-[1.02]'
                                  : 'bg-[#111827] text-white hover:bg-[#064e3b]'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" /> 
                              {needsAction ? "Review & Sign" : isPaymentVerify ? "Payment Info" : "Details"}
                            </Link>
                          </div>
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
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {showArchived ? "No archived orders found." : "No matching active concrete orders found."}
              </p>
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