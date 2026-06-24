// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import Link from 'next/link';
// import { ArrowRight, Clock } from 'lucide-react';

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     api.get('orders/').then(res => setOrders(res.data));
//   }, []);

//   return (
//     <div className="space-y-6">
//       <header className="flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 uppercase italic">Order Queue</h1>
//           <p className="text-gray-500 text-sm">Action required: Verify distance and generate quotations.</p>
//         </div>
//       </header>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold">
//             <tr>
//               <th className="px-6 py-4">Project Name</th>
//               <th className="px-6 py-4">Client</th>
//               <th className="px-6 py-4">Schedule</th>
//               <th className="px-6 py-4 text-center">Status</th>
//               <th className="px-6 py-4 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {orders.map((order: any) => (
//               <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
//                 <td className="px-6 py-4">
//                   <p className="font-bold text-gray-900">{order.project_name}</p>
//                   <p className="text-[10px] text-gray-400">{order.project_location.substring(0, 30)}...</p>
//                 </td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-600">
//                   {order.company_name}
//                 </td>
//                 <td className="px-6 py-4 text-sm font-mono">
//                   {order.proposed_schedule}
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
//                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
//                    }`}>
//                      {order.status}
//                    </span>
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   <Link href={`/dashboard/admin/orders/${order.id}`} className="inline-flex items-center bg-[#111827] text-white p-2 px-4 rounded-lg text-xs font-bold hover:bg-cyan-500 transition-all">
//                     Process <ArrowRight className="w-3 h-3 ml-2" />
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import Link from 'next/link';
// import { ArrowRight, Clock } from 'lucide-react';

// interface Order {
//   id: number | string;
//   project_name: string;
//   project_location: string;
//   company_name?: string;
//   project_type?: string;
//   proposed_schedule: string;
//   status: string;
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);

//   useEffect(() => {
//     api.get('orders/').then(res => setOrders(res.data));
//   }, []);

//   // Helper to define colors based on your specific RMC workflow
//   const getStatusStyles = (status: string) => {
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
//       default: 
//         return 'bg-gray-100 text-gray-700 border border-gray-200';
//     }
//   };

//   // Grouping logic: Organize orders by their status
//   const statuses = ['Pending', 'Quotation Sent', 'For Inspection', 'Ready for Pouring', 'Rejected'];
  
//   return (
//     <div className="space-y-10">
//       <header className="flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Management Console</h1>
//           <p className="text-gray-500 text-sm mt-2">Overseeing production flow and integrated delivery quotes.</p>
//         </div>
//         <div className="flex gap-2">
//            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
//               <p className="text-[10px] font-bold text-gray-400 uppercase">Active Orders</p>
//               <p className="text-xl font-black text-gray-900">{orders.filter((o: Order) => o.status !== 'Rejected').length}</p>
//            </div>
//         </div>
//       </header>

//       {statuses.map((statusGroup) => {
//         const groupedOrders = orders.filter(o => o.status === statusGroup);
//         if (groupedOrders.length === 0) return null; // Hide groups with no items

//         return (
//           <div key={statusGroup} className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${getStatusStyles(statusGroup).split(' ')[0]}`}></div>
//               <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
//                 {statusGroup} ({groupedOrders.length})
//               </h2>
//             </div>

//             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50/50 text-[9px] uppercase text-gray-400 font-bold border-b border-gray-50">
//                   <tr>
//                     <th className="px-8 py-4">Project Details</th>
//                     <th className="px-6 py-4">Client / Company</th>
//                     <th className="px-6 py-4">Schedule</th>
//                     <th className="px-6 py-4 text-center">Current Status</th>
//                     <th className="px-8 py-4 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {groupedOrders.map((order: any) => (
//                     <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
//                       <td className="px-8 py-5">
//                         <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{order.project_name}</p>
//                         <p className="text-[10px] text-gray-400 font-medium tracking-tight">
//                           {order.project_location.substring(0, 45)}...
//                         </p>
//                       </td>
//                       <td className="px-6 py-5">
//                         <p className="text-sm font-bold text-gray-700">{order.company_name || "Direct Client"}</p>
//                         <p className="text-[10px] text-gray-400 italic">{order.project_type}</p>
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex items-center text-xs font-mono text-gray-600 bg-gray-50 w-fit px-2 py-1 rounded">
//                           <Clock className="w-3 h-3 mr-2 text-gray-400" />
//                           {order.proposed_schedule}
//                         </div>
//                       </td>
//                       <td className="px-6 py-5 text-center">
//                         <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg ${getStatusStyles(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-8 py-5 text-right">
//                         <Link href={`/dashboard/admin/orders/${order.id}`} className="inline-flex items-center bg-[#111827] text-white py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
//                           Manage
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import Link from 'next/link';
// import { ArrowRight, Clock, Box, Layers, Wallet, Users } from 'lucide-react';

// interface Order {
//   id: number | string;
//   project_name: string;
//   project_location: string;
//   company_name?: string;
//   project_type?: string;
//   proposed_schedule: string;
//   status: string;
// }

// interface MiniStats {
//   activeCount: number;
//   paymentPendingCount: number;
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [stats, setStats] = useState<MiniStats>({ activeCount: 0, paymentPendingCount: 0 });

//   useEffect(() => {
//     api.get('orders/')
//       .then(res => {
//         const data = res.data || [];
//         setOrders(data);
        
//         // Calculate basic counters directly from the working payload as a fallback
//         setStats({
//           activeCount: data.filter((o: Order) => o.status !== 'Rejected').length,
//           paymentPendingCount: data.filter((o: Order) => o.status === 'For Payment Verification').length
//         });
//       })
//       .catch(err => console.error("Error reading order pipeline:", err));
//   }, []);

//   // Helper to define colors based on your specific RMC workflow
//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-100 text-amber-700 border border-amber-200';
//       case 'Quotation Sent': 
//         return 'bg-blue-100 text-blue-700 border border-blue-200';
//       case 'For Inspection': 
//         return 'bg-purple-100 text-purple-700 border border-purple-200';
//       case 'For Payment Verification': 
//         return 'bg-cyan-100 text-cyan-700 border border-cyan-200 shadow-sm shadow-cyan-100/30';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
//       case 'Rejected': 
//         return 'bg-rose-100 text-rose-700 border border-rose-200';
//       default: 
//         return 'bg-gray-100 text-gray-700 border border-gray-200';
//     }
//   };

//   // Grouping logic: Organize orders by their status including your payment checkpoint step
//   const statuses = [
//     'Pending', 
//     'Quotation Sent', 
//     'For Inspection', 
//     'For Payment Verification', 
//     'Ready for Pouring', 
//     'Rejected'
//   ];
  
//   return (
//     <div className="space-y-10">
//       {/* HEADER SECTION */}
//       <header className="flex justify-between items-end border-b border-gray-100 pb-6">
//         <div>
//           <h1 className="text-3xl font-black text-gray-900 uppercase italic leading-none tracking-tighter">Management Console</h1>
//           <p className="text-gray-500 text-sm mt-2">Overseeing production flow and integrated delivery quotes.</p>
//         </div>
//       </header>

//       {/* QUICK STATUS STRIP CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
//           <div className="p-3.5 bg-gray-50 rounded-xl text-gray-700"><Box className="w-5 h-5" /></div>
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Run Orders</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.activeCount}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
//           <div className="p-3.5 bg-cyan-50 rounded-xl text-cyan-600"><Wallet className="w-5 h-5" /></div>
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Awaiting Verification</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.paymentPendingCount}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
//           <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600"><Users className="w-5 h-5" /></div>
//           <div>
//             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pipeline Items</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{orders.length}</p>
//           </div>
//         </div>
//       </div>

//       {/* ORDER TABLES GROUPS LOOP */}
//       {statuses.map((statusGroup) => {
//         const groupedOrders = orders.filter(o => o.status === statusGroup);
//         if (groupedOrders.length === 0) return null; // Hide empty groups seamlessly

//         return (
//           <div key={statusGroup} className="space-y-4">
//             <div className="flex items-center justify-between px-1">
//               <div className="flex items-center gap-2">
//                 <div className={`w-2.5 h-2.5 rounded-full ${getStatusStyles(statusGroup).split(' ')[0]}`}></div>
//                 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
//                   {statusGroup}
//                 </h2>
//               </div>
//               <span className="text-[11px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
//                 {groupedOrders.length}
//               </span>
//             </div>

//             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50/50 text-[9px] uppercase text-gray-400 font-bold border-b border-gray-50">
//                   <tr>
//                     <th className="px-8 py-4">Project Details</th>
//                     <th className="px-6 py-4">Client / Company</th>
//                     <th className="px-6 py-4">Schedule</th>
//                     <th className="px-6 py-4 text-center">Current Status</th>
//                     <th className="px-8 py-4 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {groupedOrders.map((order: any) => (
//                     <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
//                       <td className="px-8 py-5">
//                         <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{order.project_name}</p>
//                         <p className="text-[10px] text-gray-400 font-medium tracking-tight mt-0.5">
//                           {order.project_location && order.project_location.length > 45 
//                             ? `${order.project_location.substring(0, 45)}...` 
//                             : order.project_location}
//                         </p>
//                       </td>
//                       <td className="px-6 py-5">
//                         <p className="text-sm font-bold text-gray-700">{order.company_name || "Direct Client"}</p>
//                         <p className="text-[10px] text-gray-400 italic mt-0.5">{order.project_type}</p>
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex items-center text-xs font-mono text-gray-600 bg-gray-50 w-fit px-2 py-1 rounded">
//                           <Clock className="w-3 h-3 mr-2 text-gray-400" />
//                           {order.proposed_schedule || "Not Assigned"}
//                         </div>
//                       </td>
//                       <td className="px-6 py-5 text-center">
//                         <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg tracking-wider ${getStatusStyles(order.status)}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-8 py-5 text-right">
//                         <Link href={`/dashboard/admin/orders/${order.id}`} className="inline-flex items-center bg-[#111827] text-white py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white hover:shadow-lg hover:shadow-cyan-500/30 transition-all group">
//                           Manage <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import Link from 'next/link';
// import { ArrowRight, Clock, Box, Wallet, Users, ChevronRight } from 'lucide-react';

// interface Order {
//   id: number | string;
//   project_name: string;
//   project_location: string;
//   company_name?: string;
//   project_type?: string;
//   proposed_schedule: string;
//   status: string;
// }

// interface MiniStats {
//   activeCount: number;
//   paymentPendingCount: number;
//   totalCount: number;
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [stats, setStats] = useState<MiniStats>({ activeCount: 0, paymentPendingCount: 0, totalCount: 0 });
//   const [activeTab, setActiveTab] = useState<string>('All');

//   useEffect(() => {
//     api.get('orders/')
//       .then(res => {
//         const data = res.data || [];
//         setOrders(data);
        
//         setStats({
//           activeCount: data.filter((o: Order) => o.status !== 'Rejected').length,
//           paymentPendingCount: data.filter((o: Order) => o.status === 'For Payment Verification').length,
//           totalCount: data.length
//         });
//       })
//       .catch(err => console.error("Error reading order pipeline:", err));
//   }, []);

//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case 'Pending': 
//         return 'bg-amber-50 text-amber-700 border border-amber-200/60';
//       case 'Quotation Sent': 
//         return 'bg-blue-50 text-blue-700 border border-blue-200/60';
//       case 'For Inspection': 
//         return 'bg-purple-50 text-purple-700 border border-purple-200/60';
//       case 'For Payment Verification': 
//         return 'bg-cyan-50 text-cyan-700 border border-cyan-200/60 shadow-sm';
//       case 'Ready for Pouring': 
//         return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
//       case 'Rejected': 
//         return 'bg-rose-50 text-rose-700 border border-rose-200/60';
//       default: 
//         return 'bg-gray-50 text-gray-600 border border-gray-200';
//     }
//   };

//   const statuses = ['All', 'Pending', 'Quotation Sent', 'For Inspection', 'For Payment Verification', 'Ready for Pouring', 'Rejected'];

//   // Filter orders dynamically based on selected workflow tab
//   const filteredOrders = activeTab === 'All' 
//     ? orders 
//     : orders.filter(o => o.status === activeTab);

//   return (
//     <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in">
//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
//         <div>
//           <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Management Console</h1>
//           <p className="text-sm text-gray-500 mt-1">Oversee commercial production workflows, quality logistics, and pipeline validation.</p>
//         </div>
//       </div>

//       {/* QUICK METRICS GRID */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
//           <div className="p-3 bg-gray-50 rounded-xl text-gray-600 border border-gray-100"><Box className="w-5 h-5" /></div>
//           <div>
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Operations</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.activeCount}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
//           <div className="p-3 bg-cyan-50/60 rounded-xl text-cyan-600 border border-cyan-100"><Wallet className="w-5 h-5" /></div>
//           <div>
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Awaiting Verification</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.paymentPendingCount}</p>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
//           <div className="p-3 bg-emerald-50/60 rounded-xl text-emerald-600 border border-emerald-100"><Users className="w-5 h-5" /></div>
//           <div>
//             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders Registered</p>
//             <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.totalCount}</p>
//           </div>
//         </div>
//       </div>

//       {/* FILTER TABS */}
//       <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-px overflow-x-auto scrollbar-none">
//         {statuses.map((tab) => {
//           const count = tab === 'All' ? orders.length : orders.filter(o => o.status === tab).length;
//           const isActive = activeTab === tab;
          
//           return (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px rounded-t-lg ${
//                 isActive 
//                   ? 'border-cyan-500 text-cyan-600 bg-cyan-50/30' 
//                   : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
//               }`}
//             >
//               {tab}
//               <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md ${isActive ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
//                 {count}
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* RENDER TABLE DYNAMIC CONTAINER */}
//       {filteredOrders.length === 0 ? (
//         <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center max-w-xl mx-auto">
//           <p className="text-sm font-semibold text-gray-500">No projects currently sit under this category flag.</p>
//           <p className="text-xs text-gray-400 mt-1">Incoming pipelines adjust automatically as operational statuses shift.</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-4">Project Information</th>
//                   <th className="px-6 py-4">Client Identity</th>
//                   <th className="px-6 py-4">Target Schedule</th>
//                   <th className="px-6 py-4 text-center">Workflow Checkpoint</th>
//                   <th className="px-6 py-4 text-right">Action Interface</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredOrders.map((order: any) => (
//                   <tr key={order.id} className="hover:bg-gray-50/40 transition-colors group">
//                     <td className="px-6 py-4.5 max-w-sm">
//                       <p className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">{order.project_name}</p>
//                       <p className="text-xs text-gray-400 truncate mt-0.5" title={order.project_location}>
//                         {order.project_location}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4.5">
//                       <p className="text-sm font-medium text-gray-800">{order.company_name || "Direct Account"}</p>
//                       <p className="text-[11px] text-gray-400 font-mono mt-0.5">{order.project_type || 'N/A'}</p>
//                     </td>
//                     <td className="px-6 py-4.5">
//                       <div className="flex items-center text-xs font-mono text-gray-600 bg-gray-50 border border-gray-100 w-fit px-2 py-1 rounded-md">
//                         <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
//                         {order.proposed_schedule || "Unscheduled"}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4.5 text-center">
//                       <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusStyles(order.status)}`}>
//                         {order.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4.5 text-right">
//                       <Link 
//                         href={`/dashboard/admin/orders/${order.id}`} 
//                         className="inline-flex items-center gap-1.5 bg-gray-900 text-white hover:bg-cyan-500 py-2 px-4 rounded-lg text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all"
//                       >
//                         Control <ChevronRight className="w-3.5 h-3.5" />
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import Link from 'next/link';
import { ArrowRight, Clock, Box, Wallet, Users, ChevronRight, Search, Archive, Filter, AlertCircle } from 'lucide-react';

interface Order {
  id: number | string;
  project_name: string;
  project_location: string;
  company_name?: string;
  project_type?: string;
  proposed_schedule: string;
  status: string;
  is_archived?: boolean;
}

interface MiniStats {
  activeCount: number;
  paymentPendingCount: number;
  totalCount: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<MiniStats>({ activeCount: 0, paymentPendingCount: 0, totalCount: 0 });
  const [activeTab, setActiveTab] = useState<string>('All');
  
  // UX Search and Workspace View Toggles
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showArchived, setShowArchived] = useState<boolean>(false);

  useEffect(() => {
    api.get('orders/')
      .then(res => {
        const payload = res.data as any;
        const data = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.results)
          ? payload.results
          : Array.isArray(payload?.orders)
          ? payload.orders
          : [];

        setOrders(data);
        
        // Compute base workflow KPIs across active operational scopes
        setStats({
          activeCount: data.filter((o: Order) => !['Rejected', 'Cancelled', 'Completed'].includes(o.status) && !o.is_archived).length,
          paymentPendingCount: data.filter((o: Order) => o.status === 'For Payment Verification' && !o.is_archived).length,
          totalCount: data.filter((o: Order) => !o.is_archived).length
        });

        if (!Array.isArray(payload)) {
          console.warn('Normalized admin orders response to array:', payload);
        }
      })
      .catch(err => console.error("Error reading order pipeline:", err));
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending': 
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'Quotation Sent': 
        return 'bg-blue-50 text-blue-700 border border-blue-200/60';
      case 'For Inspection': 
        return 'bg-purple-50 text-purple-700 border border-purple-200/60';
      case 'For Payment Verification': 
        return 'bg-cyan-50 text-cyan-700 border border-cyan-200/60 shadow-sm';
      case 'Ready for Pouring': 
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'Rejected': 
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'Completed':
        return 'bg-gray-50 text-gray-600 border border-gray-200';
      default: 
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  // Status arrays dynamically configured based on workspace mode context
  const statuses = showArchived 
    ? ['All', 'Completed', 'Rejected']
    : ['All', 'Pending', 'Quotation Sent', 'For Inspection', 'For Payment Verification', 'Ready for Pouring'];

  // Multi-tier query engine: Filters by Archive State, Text String matches, and Workflow Checkpoint Status Tabs
  const filteredOrders = orders
    .filter(order => {
      // Step 1: Filter out items based on active/archived directory view state
      if (showArchived) {
        if (!order.is_archived && !['Completed', 'Rejected', 'Cancelled'].includes(order.status)) return false;
      } else {
        if (order.is_archived) return false;
      }

      // Step 2: Global Search matching parameter arrays
      const matchesSearch = 
        order.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm) ||
        (order.company_name && order.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.project_location.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Step 3: Checkpoint active sub-tab category layer routing
      if (activeTab === 'All') return true;
      return order.status === activeTab;
    })
    // SORTATION MATRIX: Enforce newest transactions matching highest primary key ID up top
    .sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-fade-in pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase italic">Management Console</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            Oversee commercial production workflows, quality logistics, and pipeline validation.
          </p>
        </div>
      </div>

      {/* QUICK METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-600 border border-gray-100"><Box className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Operations</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-cyan-50/60 rounded-xl text-cyan-600 border border-cyan-100"><Wallet className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Awaiting Verification</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.paymentPendingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-50/60 rounded-xl text-emerald-600 border border-emerald-100"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Workspace Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{stats.totalCount}</p>
          </div>
        </div>
      </div>

      {/* UTILITIES AND SEARCH CONTROL BAR */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search by Order ID, project title, client identity, or site address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/80 rounded-xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-cyan-600 transition-all text-gray-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* ARCHIVE DIRECTORY VIEWER TOGGLE LINK */}
          <button
            onClick={() => {
              setShowArchived(!showArchived);
              setActiveTab("All");
            }}
            className={`text-[10px] font-black uppercase tracking-wider px-4 py-3 rounded-xl border transition-all flex items-center gap-1.5 shrink-0 ${
              showArchived 
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? "View Live Feeds" : "System Archives"}
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-px overflow-x-auto scrollbar-none">
        {statuses.map((tab) => {
          // Dynamic tracking totals synchronized contextually with current directory filters
          const count = tab === 'All' 
            ? orders.filter(o => showArchived ? (o.is_archived || ['Completed', 'Rejected', 'Cancelled'].includes(o.status)) : !o.is_archived).length
            : orders.filter(o => o.status === tab && (showArchived ? true : !o.is_archived)).length;
            
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 -mb-px rounded-t-lg ${
                isActive 
                  ? 'border-cyan-500 text-cyan-600 bg-cyan-50/30' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              {tab}
              <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded-md ${isActive ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* RENDER TABLE DYNAMIC CONTAINER */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-16 text-center max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">No active operational logs.</p>
          <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
            No workflows matches current query definitions or status segment markers inside this view frame.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[9px] uppercase text-gray-400 font-black tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Project Information</th>
                  <th className="px-6 py-4">Client Identity</th>
                  <th className="px-6 py-4">Target Schedule</th>
                  <th className="px-6 py-4 text-center">Workflow Checkpoint</th>
                  <th className="px-6 py-4 text-right">Action Interface</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="px-6 py-4.5 max-w-sm">
                      <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{order.project_name}</p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium" title={order.project_location}>
                        ID: #{order.id} • {order.project_location}
                      </p>
                    </td>
                    <td className="px-6 py-4.5">
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{order.company_name || "Direct Account"}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{order.project_type || 'Standard'}</p>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center text-xs font-mono font-bold text-gray-600 bg-gray-50 border border-gray-100 w-fit px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {order.proposed_schedule ? new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : "Unscheduled"}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tight ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <Link 
                        href={`/dashboard/admin/orders/${order.id}`} 
                        className="inline-flex items-center gap-1.5 bg-gray-900 text-white hover:bg-cyan-600 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all"
                      >
                        Control <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}