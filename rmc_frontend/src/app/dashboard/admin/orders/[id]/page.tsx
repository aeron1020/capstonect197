"use client";
import { useEffect, useState, use } from 'react'; 
import api from '@/src/lib/api';
import { Calculator, CheckCircle, Truck } from 'lucide-react';
import QuotationEditor from './QuotationEditor'; 



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
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      {/* HEADER SECTION - Minimalist Dark */}
      <div className="bg-[#111827] text-white p-10 rounded-3xl flex justify-between items-end shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-2">Project Overview</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter">{order.project_name}</h1>
          <div className="flex gap-4 mt-4">
             <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 uppercase">{order.project_type}</span>
             <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/20 uppercase">{order.status}</span>
          </div>
        </div>
        <div className="text-right relative z-10">
           <p className="text-[10px] text-gray-500 font-black uppercase">Location</p>
           <p className="text-sm font-medium text-gray-300">{order.project_location}</p>
        </div>
        {/* Subtle decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAIN STAGE: 8 Columns for bigger visibility */}
        <div className="lg:col-span-8 space-y-6">
          {/* THE QUOTATION EDITOR (The logic handles switching between Details and Preview) */}
          <QuotationEditor 
            order={order} 
            onUpdate={() => api.get(`orders/${orderId}/`).then(res => setOrder(res.data))} 
          />
          
          {/* Site Info - Secondary */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Order Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
               {order.order_items?.map((item: any) => (
                 <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{item.mix_design_name}</p>
                    <p className="text-xl font-black text-gray-900">{item.volume} m³</p>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR: 4 Columns for Adjustments */}
        <div className="lg:col-span-4 space-y-6">
          {/* We'll move the input fields into a clean "Adjustment Card" inside QuotationEditor 
              or pass them as children. For this fix, let's keep QuotationEditor as the controller. */}
          <div className="sticky top-6">
             {/* If Quotation Sent, show status card */}
             {order.status === "Quotation Sent" && (
                <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg shadow-emerald-500/20 mb-6">
                   <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-black uppercase text-xs tracking-widest">Live Quote</span>
                   </div>
                   <p className="text-xs opacity-90 leading-relaxed">The client can now view and approve this quotation from their portal.</p>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}