// src/components/modals/CancelOrderModal.tsx
'use client';
import { useState } from 'react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

export default function CancelOrderModal({ isOpen, onClose, onConfirm }: CancelOrderModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-slate-100">Halt Production Pipeline</h3>
        <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider">Specify Cancellation Audit Reason</p>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <textarea
            required
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type reason here (e.g., Jobsite flooding, grading delays...)"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
          />
          
          <div className="flex justify-end gap-2 text-xs font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-slate-400 hover:bg-slate-800 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}