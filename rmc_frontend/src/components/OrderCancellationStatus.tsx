// src/app/dashboard/components/OrderCancellationStatus.tsx
'use client';
import { useState } from 'react';
import api from '../lib/api'; // Your Axios instance setup
// Use relative import to resolve module from this components directory
import CancelOrderModal from './modals/CancelOrderModals';

interface OrderProps {
  order: {
    id: number;
    status: string;
    cancellation_reason?: string;
    cancellation_date?: string;
    canceled_by_name?: string;
  };
  refreshOrder: () => void; // Trigger a reload of parent state data
}

export default function OrderCancellationStatus({ order, refreshOrder }: OrderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCancelSubmit = async (reason: string) => {
    try {
      await api.post(`/api/orders/${order.id}/cancel/`, { cancellation_reason: reason });
      refreshOrder(); // Instantly update view data contracts
    } catch (err) {
      alert("Failed to submit cancel state to server pipeline.");
    }
  };

  // Condition 1: System state is already halted
  if (order.status === 'Cancelled') {
    return (
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
          Batch Pipeline Terminated
        </div>
        <p className="mt-2 text-sm italic text-slate-300">
          "{order.cancellation_reason || 'No cancellation reason stated.'}"
        </p>
        <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Logged By: <span className="text-slate-200">{order.canceled_by_name || 'System'}</span> on {order.cancellation_date ? new Date(order.cancellation_date).toLocaleString() : 'N/A'}
        </div>
      </div>
    );
  }

  // Condition 2: Active project flow showing actionable cancel prompt
  return (
    <>
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Need to halt this order?</h4>
          <p className="text-xs text-slate-400">Cancelling updates plant inventory metrics and scheduling grids instantly.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-rose-600/10 border border-rose-500/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-600 hover:text-white transition"
        >
          Cancel Order
        </button>
      </div>

      <CancelOrderModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={handleCancelSubmit} 
      />
    </>
  );
}