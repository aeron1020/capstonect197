"use client";
import { useEffect, useState, use } from 'react';
import api from '@/src/lib/api';
import QuotationView from '@/src/components/QuotationView';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`orders/${resolvedParams.id}/`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load order:", err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this quotation?")) return;
    try {
      await api.post(`orders/${resolvedParams.id}/approve_quotation/`);
      alert("Quotation Approved! Status updated.");
      window.location.reload();
    } catch (err) {
      alert("Failed to approve quotation. Please contact support.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
    </div>
  );

  if (!order) return <p className="p-10 text-center">Order not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
      {/* NAVIGATION & STATUS */}
      <div className="flex justify-between items-center">
        <Link href="/dashboard/customer" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
        </Link>
        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* LEFT SIDE: ORDER SUMMARY */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
                <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Site Location</p>
                <p className="font-medium text-gray-600 text-xs italic">{order.project_location}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
                <p className="font-black text-xl text-[#064e3b]">{order.volume_m3} m³</p>
              </div>
            </div>
          </section>

          {/* APPROVAL ACTION BOX */}
          {order.status === "Quotation Sent" && (
            <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
              <p className="text-white text-xs font-bold mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
              </p>
              <button 
                onClick={handleApprove}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
              >
                Approve Quotation
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: THE FORMAL QUOTATION LETTER */}
        <div className="lg:col-span-3">
          {order.quotation ? (
            <QuotationView data={order.quotation} orderData={order} />
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
              <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
                <AlertCircle className="text-amber-500 w-6 h-6" />
              </div>
              <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
              <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
                Admin is currently verifying distance and material costs for your site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}