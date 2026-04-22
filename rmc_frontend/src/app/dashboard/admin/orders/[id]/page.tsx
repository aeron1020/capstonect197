"use client";
import { useEffect, useState, use } from 'react'; 
import api from '@/src/lib/api';
import { Calculator, CheckCircle, Truck } from 'lucide-react';

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [distance, setDistance] = useState('');
  const [pumpRental, setPumpRental] = useState(0);
  const [pumpMobilization, setPumpMobilization] = useState(0); // Added Mobilization State
  const [discount, setDiscount] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      api.get(`orders/${orderId}/`)
        .then(res => {
          setOrder(res.data);
          if (res.data.distance_km) setDistance(res.data.distance_km);
          
          if (res.data.quotation?.breakdown) {
            const b = res.data.quotation.breakdown;
            setPumpRental(b.pump_rental || 0);
            setPumpMobilization(b.pump_mobilization || 0); // Load saved mobilization
            setDiscount(b.discount || 0);
            setPaymentTerms(b.payment_terms || "Cash on Delivery");
          }
        })
    }
  }, [orderId]);

  const handleSendQuote = async () => {
    setLoading(true);
    try {
      await api.post(`orders/${orderId}/send_quotation/`, {
        distance_km: distance,
        pump_rental: pumpRental,
        pump_mobilization: pumpMobilization, // Included in payload
        discount: discount,
        payment_terms: paymentTerms
      });
      alert("Quotation generated and sent!");
      window.location.reload();
    } catch (err) { 
      console.error(err);
      alert("Error sending quote"); 
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="p-10 text-center">Loading Project...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl flex justify-between items-center shadow-xl">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">{order.project_name}</h1>
          <p className="text-cyan-400 font-mono text-sm tracking-widest">{order.project_type} PROJECT</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold">Current Status</p>
          <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Project Details & Items */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-[0.2em]">Requested Mix Designs</h3>
            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-[#064e3b]">
                  <span className="font-bold text-gray-700">{item.mix_design_name}</span>
                  <span className="text-lg font-black text-gray-900">{item.volume} m³</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-[0.2em]">Site Information</h3>
             <p className="text-gray-800 font-medium">{order.project_location}</p>
          </section>
        </div>

        {/* RIGHT: Admin Actions (Distance & Pricing) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#064e3b] text-white p-6 rounded-2xl shadow-lg space-y-6">
            <h3 className="flex items-center text-sm font-bold border-b border-white/10 pb-4">
              <Truck className="w-4 h-4 mr-2" /> Quotation Adjustments
            </h3>
            
            <div className="space-y-4">
              {/* 1. DISTANCE */}
              <div>
                <label className="text-[10px] uppercase opacity-60 font-bold">Travel Distance (KM)</label>
                <input 
                  type="number" 
                  value={distance} 
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 mt-1 outline-none focus:bg-white/20 transition-all font-mono"
                  placeholder="0.00"
                />
              </div>

              {/* 2. PUMP RENTAL */}
              <div>
                <label className="text-[10px] uppercase opacity-60 font-bold text-cyan-300">Pump Rental Fee (₱)</label>
                <input 
                  type="number" 
                  value={pumpRental} 
                  onChange={(e) => setPumpRental(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 mt-1 outline-none focus:bg-white/20 transition-all font-mono text-cyan-300"
                />
              </div>

              {/* 2.5 PUMP MOBILIZATION */}
              <div>
                <label className="text-[10px] uppercase opacity-60 font-bold text-cyan-200">Pump Mobilization (₱)</label>
                <input 
                  type="number" 
                  value={pumpMobilization} 
                  onChange={(e) => setPumpMobilization(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 mt-1 outline-none focus:bg-white/20 transition-all font-mono text-cyan-200"
                  placeholder="0.00"
                />
              </div>

              {/* 3. DISCOUNT */}
              <div>
                <label className="text-[10px] uppercase opacity-60 font-bold text-orange-400">Apply Discount (₱)</label>
                <input 
                  type="number" 
                  value={discount} 
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 mt-1 outline-none focus:bg-white/20 transition-all font-mono text-orange-400"
                />
              </div>

              {/* 4. PAYMENT TERMS */}
              <div>
                <label className="text-[10px] uppercase opacity-60 font-bold">Payment Terms</label>
                <select 
                  value={paymentTerms} 
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-3 mt-1 outline-none focus:bg-white/20 transition-all text-xs font-bold"
                >
                  <option className="text-black">Cash on Delivery</option>
                  <option className="text-black">7 Days Term</option>
                  <option className="text-black">15 Days Term</option>
                  <option className="text-black">Bank Transfer (Pre-pour)</option>
                </select>
              </div>

              {/* ACTION BUTTON */}
              <button 
                onClick={handleSendQuote}
                disabled={loading || !distance}
                className="w-full bg-cyan-400 text-[#064e3b] py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center shadow-lg hover:bg-cyan-300 disabled:bg-gray-600 disabled:text-gray-400 transition-all mt-4"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {loading ? "Calculating..." : "Update & Send Quote"}
              </button>
            </div>
          </div>

          {order.status === "Quotation Sent" && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center text-green-700">
               <CheckCircle className="w-5 h-5 mr-2" />
               <span className="text-xs font-bold uppercase">Quotation is live for client review</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}