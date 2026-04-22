"use client";
import { useState } from 'react';
import api from '@/src/lib/api';
import { Save, Percent, Construction, CreditCard, Truck } from 'lucide-react';

export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
  const [distance, setDistance] = useState(order.distance_km || 0);
  const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
  const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
  const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
  const [paymentTerms, setPaymentTerms] = useState(order.quotation?.breakdown?.payment_terms || "Cash on Delivery");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateQuotation = async () => {
    setIsSaving(true);
    try {
      // This sends the data to your Django send_quotation action
      await api.post(`orders/${order.id}/send_quotation/`, {
        distance_km: distance,
        pump_rental: pumpRental,
        pump_mobilization: pumpMobilization,
        discount: discount,
        payment_terms: paymentTerms
      });
      alert("Quotation generated and sent to customer.");
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Error updating quotation.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tighter">Adjustment Panel</h2>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em]">Phase 02: Pricing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DISTANCE */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
               Verified Distance (KM)
            </label>
            <input 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-400 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* PAYMENT TERMS */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
              <CreditCard className="w-3 h-3 mr-2" /> Payment Terms
            </label>
            <select 
              value={paymentTerms} 
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white focus:outline-none focus:border-cyan-400 transition-all appearance-none"
            >
              <option className="bg-[#111827]">Cash on Delivery</option>
              <option className="bg-[#111827]">7 Days Term</option>
              <option className="bg-[#111827]">15 Days Term</option>
              <option className="bg-[#111827]">Bank Transfer (Pre-pour)</option>
            </select>
          </div>

          {/* PUMP RENTAL */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
              <Construction className="w-3 h-3 mr-2" /> Pump Rental Fee
            </label>
            <input 
              type="number" 
              value={pumpRental} 
              onChange={(e) => setPumpRental(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* PUMP MOBILIZATION INPUT (The corrected part) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center text-cyan-200">
              <Truck className="w-3 h-3 mr-2" /> Pump Mobilization
            </label>
            <input 
              type="number" 
              value={pumpMobilization} 
              onChange={(e) => setPumpMobilization(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-200 focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>

          {/* DISCOUNT */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">
              <Percent className="w-3 h-3 mr-2 text-rose-400" /> Special Discount
            </label>
            <input 
              type="number" 
              value={discount} 
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-rose-400 focus:outline-none focus:border-rose-400 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleUpdateQuotation}
          disabled={isSaving}
          className="w-full bg-cyan-400 hover:bg-cyan-300 text-[#111827] py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? "PROCESSING..." : (
            <>
              <Save className="w-4 h-4" /> Finalize & Send Quotation
            </>
          )}
        </button>
      </div>
    </div>
  );
}