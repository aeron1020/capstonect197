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

"use client";
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import Link from 'next/link';
import { ArrowRight, Clock, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('orders/').then(res => setOrders(res.data));
  }, []);

  // Helper to define colors based on your specific RMC workflow
  const getStatusStyles = (status: string) => {
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
      default: 
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // Grouping logic: Organize orders by their status
  const statuses = ['Pending', 'Quotation Sent', 'For Inspection', 'Ready for Pouring', 'Rejected'];
  
  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic leading-none">Management Console</h1>
          <p className="text-gray-500 text-sm mt-2">Overseeing production flow and integrated delivery quotes.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Active Orders</p>
              <p className="text-xl font-black text-gray-900">{orders.filter(o => o.status !== 'Rejected').length}</p>
           </div>
        </div>
      </header>

      {statuses.map((statusGroup) => {
        const groupedOrders = orders.filter(o => o.status === statusGroup);
        if (groupedOrders.length === 0) return null; // Hide groups with no items

        return (
          <div key={statusGroup} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusStyles(statusGroup).split(' ')[0]}`}></div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                {statusGroup} ({groupedOrders.length})
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[9px] uppercase text-gray-400 font-bold border-b border-gray-50">
                  <tr>
                    <th className="px-8 py-4">Project Details</th>
                    <th className="px-6 py-4">Client / Company</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4 text-center">Current Status</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {groupedOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{order.project_name}</p>
                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                          {order.project_location.substring(0, 45)}...
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-700">{order.company_name || "Direct Client"}</p>
                        <p className="text-[10px] text-gray-400 italic">{order.project_type}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-xs font-mono text-gray-600 bg-gray-50 w-fit px-2 py-1 rounded">
                          <Clock className="w-3 h-3 mr-2 text-gray-400" />
                          {order.proposed_schedule}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg ${getStatusStyles(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link href={`/dashboard/admin/orders/${order.id}`} className="inline-flex items-center bg-[#111827] text-white py-2.5 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}