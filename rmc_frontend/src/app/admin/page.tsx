"use client";
import React, { useEffect, useState } from 'react';
import api from '@/src/lib/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleGenerateQuotation = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/generate_quotation/`);
      alert("Quotation generated successfully!");
      const updated = await api.get('/orders/');
      setOrders(updated.data);
    } catch (err) {
      alert("Error generating quotation.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col mb-6">
        <h1 className="text-xl font-bold text-[#064e3b]">Admin Control</h1>
        <p className="text-sm text-gray-500">Manage pending concrete orders and generate pricing.</p>
      </div>

      {/* Orders List (Instagram Post Style) */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="insta-card p-10 text-center text-gray-400 text-sm">
            No pending orders at the moment.
          </div>
        ) : (
          orders.map((order: any) => (
            <div key={order.id} className="insta-card">
              {/* Card Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#f8f9fa] border border-[#d4af37] flex items-center justify-center">
                    <span className="text-[#064e3b] font-bold text-xs">RMC</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{order.project_name}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-tighter">
                      ID: #00{order.id} • {order.project_type}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                  order.status === 'Pending' 
                    ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5' 
                    : 'border-[#064e3b] text-[#064e3b] bg-[#064e3b]/5'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-right">{order.project_location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Schedule:</span>
                  <span className="font-medium">{order.proposed_schedule}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-[#f8f9fa] border-t border-gray-100">
                {order.status === "Pending" ? (
                  <button 
                    onClick={() => handleGenerateQuotation(order.id)}
                    className="w-full btn-primary shadow-sm active:scale-[0.98]"
                  >
                    Generate Quotation
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full py-2 px-4 rounded-md border border-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed"
                  >
                    Quotation Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}