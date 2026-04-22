"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import Link from 'next/link'; // Standardized import
import { Eye } from 'lucide-react';

interface OrderItem {
  volume: string | number;
}

interface Order {
  id: number;
  project_name: string;
  status: string;
  proposed_schedule: string;
  order_items: OrderItem[]; // Added this to track volumes
}

interface UserProfile {
  full_name: string;
  username: string;
  role: string;
}

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

  // Statistics Calculation
  const activeOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const pendingQuotes = orders.filter(o => o.status === 'Pending' || o.status === 'For Quotation').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  if (isLoading) return <div className="p-10 text-center font-sans">Loading AERON RMC Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-[#064e3b] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-10">
        <h1 className="text-xl font-bold">AERON<span className="text-[#d4af37]">RMC</span></h1>
        <div className="flex items-center gap-4 text-sm">
          <span>Welcome, <strong>{user?.full_name}</strong></span>
          <button 
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition border border-white/20"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customer Dashboard</h2>
            <p className="text-gray-500 text-sm">Track your concrete deliveries and billing</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/customer/new-order')}
            className="bg-[#064e3b] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#053f30] transition shadow-lg"
          >
            + New Order
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Active Orders" value={activeOrders.toString()} color="border-l-[#064e3b]" />
          <StatCard title="Pending Quotations" value={pendingQuotes.toString()} color="border-l-[#d4af37]" />
          <StatCard title="Completed" value={completedOrders.toString()} color="border-l-blue-500" />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-700">Recent Requests</h3>
          </div>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold">
                <tr>
                    <th className="p-4">Project</th>
                    <th className="p-4">Total Volume</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y text-gray-700">
                {orders.map((order) => {
                    // CALCULATE VOLUME SUM FOR THIS ROW
                    const totalVol = order.order_items?.reduce(
                      (acc, item) => acc + Number(item.volume), 0
                    ) || 0;

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-gray-800">{order.project_name}</td>
                        {/* FIX: Showing the calculated sum */}
                        <td className="p-4 font-mono">{totalVol.toFixed(2)} m³</td>
                        <td className="p-4">
                            {new Date(order.proposed_schedule).toLocaleDateString('en-PH', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            order.status === 'Quotation Sent' ? 'bg-blue-100 text-blue-700' : 
                            'bg-green-100 text-green-700'
                            }`}>
                            {order.status}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <Link 
                            href={`/dashboard/customer/orders/${order.id}`}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-[#064e3b] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                            <Eye className="w-3.5 h-3.5" />
                            View
                            </Link>
                        </td>
                      </tr>
                    )
                })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">No orders found. Start by creating a new request!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
    </div>
  );
}