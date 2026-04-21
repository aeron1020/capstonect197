"use client";
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('orders/').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase italic">Order Queue</h1>
          <p className="text-gray-500 text-sm">Action required: Verify distance and generate quotations.</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold">
            <tr>
              <th className="px-6 py-4">Project Name</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Schedule</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{order.project_name}</p>
                  <p className="text-[10px] text-gray-400">{order.project_location.substring(0, 30)}...</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                  {order.company_name}
                </td>
                <td className="px-6 py-4 text-sm font-mono">
                  {order.proposed_schedule}
                </td>
                <td className="px-6 py-4 text-center">
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                     order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                   }`}>
                     {order.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/dashboard/admin/orders/${order.id}`} className="inline-flex items-center bg-[#111827] text-white p-2 px-4 rounded-lg text-xs font-bold hover:bg-cyan-500 transition-all">
                    Process <ArrowRight className="w-3 h-3 ml-2" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}