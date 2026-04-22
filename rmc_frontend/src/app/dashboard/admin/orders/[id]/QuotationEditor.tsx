// "use client";
// import { useState } from 'react';
// import api from '@/src/lib/api';
// import { Save, Percent, Construction, CreditCard, Truck, Eye, CheckCircle } from 'lucide-react';

// export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
//   const [distance, setDistance] = useState(order.distance_km || 0);
//   const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
//   const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
//   const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
//   const [paymentTerms, setPaymentTerms] = useState(order.quotation?.payment_terms || "Cash on Delivery");
  
//   const [isSaving, setIsSaving] = useState(false);
//   const [previewData, setPreviewData] = useState<any>(null);
//   const [showPreview, setShowPreview] = useState(false);

//   // STEP 1: PREVIEW (Admin sees the numbers first)
//   const handleGeneratePreview = async () => {
//     try {
//       const response = await api.post(`/orders/${order.id}/preview_quotation/`, {
//         pump_rental: pumpRental,
//         pump_mobilization: pumpMobilization,
//         discount: discount,
//         payment_terms: paymentTerms,
//         distance_km: distance
//       });
      
//       // Update state with the breakdown from Django
//       setPreviewData(response.data.preview_breakdown);
//       setShowPreview(true); 
//     } catch (err) {
//       alert("Error calculating preview. Check if distance is valid.");
//       console.error(err);
//     }
//   };

//   // STEP 2: FINALIZE (Saves the "Live Copy" to DB)
//   const handleFinalSend = async () => {
//     setIsSaving(true);
//     try {
//       await api.post(`orders/${order.id}/send_quotation/`, {
//         distance_km: distance,
//         pump_rental: pumpRental,
//         pump_mobilization: pumpMobilization,
//         discount: discount,
//         payment_terms: paymentTerms
//       });
//       alert("Quotation officially recorded and sent!");
//       setShowPreview(false);
//       onUpdate();
//     } catch (err) {
//       alert("Error saving quotation.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="bg-[#111827] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
//       <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

//       <div className="relative z-10 space-y-8">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-black uppercase tracking-tighter">Adjustment Panel</h2>
//           <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.3em]">Phase 02: Pricing</span>
//         </div>

//         {/* INPUT GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">Verified Distance (KM)</label>
//             <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-400 focus:outline-none focus:border-cyan-400 transition-all"/>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><CreditCard className="w-3 h-3 mr-2" /> Payment Terms</label>
//             <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white focus:outline-none focus:border-cyan-400 transition-all appearance-none">
//               <option className="bg-[#111827]">Cash on Delivery</option>
//               <option className="bg-[#111827]">7 Days Term</option>
//               <option className="bg-[#111827]">15 Days Term</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><Construction className="w-3 h-3 mr-2" /> Pump Rental</label>
//             <input type="number" value={pumpRental} onChange={(e) => setPumpRental(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-white focus:outline-none focus:border-cyan-400 transition-all"/>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center text-cyan-200"><Truck className="w-3 h-3 mr-2" /> Mobilization</label>
//             <input type="number" value={pumpMobilization} onChange={(e) => setPumpMobilization(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-200 focus:outline-none focus:border-cyan-400 transition-all"/>
//           </div>

//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><Percent className="w-3 h-3 mr-2 text-rose-400" /> Special Discount</label>
//             <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-rose-400 focus:outline-none focus:border-rose-400 transition-all"/>
//           </div>
//         </div>

//         {/* STEP 1 BUTTON: PREVIEW */}
//         {!showPreview && (
//           <button 
//             onClick={handleGeneratePreview}
//             className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
//           >
//             <Eye className="w-4 h-4" /> Preview Live Quote
//           </button>
//         )}

//         {/* PREVIEW BOX (The Verification Copy) */}
//         {showPreview && previewData && (
//         <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
//             {/* THE "PAPER" PREVIEW */}
//             <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-4 border-cyan-500">
//             {/* WATERMARK OR LOGO AREA */}
//             <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
//                 <div>
//                 <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800">Draft Quotation</h3>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-Validation Copy</p>
//                 </div>
//                 <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase">Terms</p>
//                 <p className="text-xs font-black text-cyan-600 uppercase">{paymentTerms}</p>
//                 </div>
//             </div>

//             {/* ITEMS TABLE */}
//             <div className="space-y-4">
//             <table className="w-full text-left">
//             <thead>
//             <tr className="border-b border-slate-100">
//                 <th className="text-[10px] font-bold text-slate-400 uppercase pb-2">Description</th>
//                 <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-center text-nowrap">Price / m³</th>
//                 <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-right">Subtotal</th>
//             </tr>
//             </thead>
//             <tbody className="text-sm">
//             {previewData.items && Object.entries(previewData.items).map(([name, detail]: any) => (
//                 <tr key={name} className="border-b border-slate-50">
//                 <td className="py-3">
//                     <p className="font-bold text-slate-700">{name}</p>
//                     <p className="text-[10px] text-slate-400">{detail.volume} m³ Quantity</p>
//                 </td>
//                 <td className="py-3 text-center font-medium text-slate-600">
//                     ₱{detail.unit_price?.toLocaleString() ?? "0"}
//                 </td>
//                 <td className="py-3 text-right font-bold text-slate-800 text-nowrap">
//                     ₱{detail.subtotal?.toLocaleString() ?? "0"}
//                 </td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>

//         {/* EXTRA FEES */}
//         <div className="space-y-2 pt-2">
//           {pumpRental > 0 && (
//             <div className="flex justify-between text-xs">
//               <span className="text-slate-500">Concrete Pump Rental</span>
//               <span className="font-bold text-slate-700">₱{pumpRental.toLocaleString()}</span>
//             </div>
//           )}
//           {pumpMobilization > 0 && (
//             <div className="flex justify-between text-xs">
//               <span className="text-slate-500">Pump Mobilization Fee</span>
//               <span className="font-bold text-slate-700">₱{pumpMobilization.toLocaleString()}</span>
//             </div>
//           )}
//           {discount > 0 && (
//             <div className="flex justify-between text-xs text-rose-500 font-bold">
//               <span>Special Adjustment/Discount</span>
//               <span>- ₱{discount.toLocaleString()}</span>
//             </div>
//           )}
//         </div>

//         {/* TOTAL FOOTER */}
//         <div className="mt-6 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
//           <div>
//             <p className="text-[10px] font-bold text-slate-400 uppercase">Total Payable Amount</p>
//             <p className="text-xs text-slate-400 italic">VAT Inclusive</p>
//           </div>
//           <div className="text-right">
//             <span className="text-3xl font-black text-slate-900">
//               ₱{previewData.final_total?.toLocaleString() ?? "0"}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* ACTIONS BENEATH PREVIEW */}
//     <div className="flex gap-3">
//       <button 
//         onClick={() => setShowPreview(false)}
//         className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
//       >
//         Discard & Edit
//       </button>
//       <button 
//         onClick={handleFinalSend}
//         disabled={isSaving}
//         className="flex-[2] bg-cyan-400 hover:bg-cyan-300 text-[#111827] py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(34,211,238,0.2)]"
//       >
//         {isSaving ? "GENERATING..." : (
//           <>
//             <CheckCircle className="w-4 h-4" /> Finalize & Send
//           </>
//         )}
//       </button>
//     </div>
//   </div>
// )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from 'react';
import api from '@/src/lib/api';
import { Save, Percent, Construction, CreditCard, Truck, Eye, CheckCircle } from 'lucide-react';

export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
  const [distance, setDistance] = useState(order.distance_km || 0);
  const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
  const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
  const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
  
  // Updated default to match backend choice key
  const [paymentTerms, setPaymentTerms] = useState(order.quotation?.payment_terms || "COD"); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGeneratePreview = async () => {
    try {
      const response = await api.post(`/orders/${order.id}/preview_quotation/`, {
        pump_rental: pumpRental,
        pump_mobilization: pumpMobilization,
        discount: discount,
        payment_terms: paymentTerms,
        distance_km: distance
      });
      
      setPreviewData(response.data.preview_breakdown);
      setShowPreview(true); 
    } catch (err) {
      alert("Error calculating preview. Check if distance is valid.");
      console.error(err);
    }
  };

  const handleFinalSend = async () => {
    setIsSaving(true);
    try {
      await api.post(`orders/${order.id}/send_quotation/`, {
        distance_km: distance,
        pump_rental: pumpRental,
        pump_mobilization: pumpMobilization,
        discount: discount,
        payment_terms: paymentTerms
      });
      alert("Quotation officially recorded and sent!");
      setShowPreview(false);
      onUpdate();
    } catch (err) {
      alert("Error saving quotation.");
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

        {/* INPUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center">Verified Distance (KM)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-400 focus:outline-none focus:border-cyan-400 transition-all"/>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><CreditCard className="w-3 h-3 mr-2" /> Payment Terms</label>
            <select 
              value={paymentTerms} 
              onChange={(e) => setPaymentTerms(e.target.value)} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
            >
              <option value="COD" className="bg-[#111827]">Cash on Delivery (COD)</option>
              <option value="Terms" className="bg-[#111827]">Credit Terms (30 Days)</option>
              <option value="Advance" className="bg-[#111827]">Full Advance Payment</option>
              <option value="DP" className="bg-[#111827]">Downpayment (Percentage)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><Construction className="w-3 h-3 mr-2" /> Pump Rental</label>
            <input type="number" value={pumpRental} onChange={(e) => setPumpRental(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-white focus:outline-none focus:border-cyan-400 transition-all"/>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center text-cyan-200"><Truck className="w-3 h-3 mr-2" /> Mobilization</label>
            <input type="number" value={pumpMobilization} onChange={(e) => setPumpMobilization(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-cyan-200 focus:outline-none focus:border-cyan-400 transition-all"/>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center"><Percent className="w-3 h-3 mr-2 text-rose-400" /> Special Discount</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black text-rose-400 focus:outline-none focus:border-rose-400 transition-all"/>
          </div>
        </div>

        {/* STEP 1 BUTTON: PREVIEW */}
        {!showPreview && (
          <button 
            onClick={handleGeneratePreview}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> Preview Live Quote
          </button>
        )}

        {/* PREVIEW BOX */}
        {showPreview && previewData && (
          <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-4 border-cyan-500">
              <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800">Draft Quotation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-Validation Copy</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Terms</p>
                  <p className="text-xs font-black text-cyan-600 uppercase">
                    {paymentTerms === "COD" ? "Cash on Delivery" : 
                     paymentTerms === "Terms" ? "Credit Terms" : 
                     paymentTerms === "Advance" ? "Full Advance" : "Downpayment"}
                  </p>
                </div>
              </div>

              {/* ... Items Table Logic ... */}
              <div className="space-y-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-[10px] font-bold text-slate-400 uppercase pb-2">Description</th>
                      <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-center text-nowrap">Price / m³</th>
                      <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {previewData.items && Object.entries(previewData.items).map(([name, detail]: any) => (
                      <tr key={name} className="border-b border-slate-50">
                        <td className="py-3">
                          <p className="font-bold text-slate-700">{name}</p>
                          <p className="text-[10px] text-slate-400">{detail.volume} m³ Quantity</p>
                        </td>
                        <td className="py-3 text-center font-medium text-slate-600">
                          ₱{detail.unit_price?.toLocaleString() ?? "0"}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-800 text-nowrap">
                          ₱{detail.subtotal?.toLocaleString() ?? "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Extra Fees */}
                <div className="space-y-2 pt-2">
                  {pumpRental > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Concrete Pump Rental</span>
                      <span className="font-bold text-slate-700">₱{pumpRental.toLocaleString()}</span>
                    </div>
                  )}
                  {pumpMobilization > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Pump Mobilization Fee</span>
                      <span className="font-bold text-slate-700">₱{pumpMobilization.toLocaleString()}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-xs text-rose-500 font-bold">
                      <span>Special Adjustment/Discount</span>
                      <span>- ₱{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Payable Amount</p>
                    <p className="text-xs text-slate-400 italic">VAT Inclusive</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-slate-900">
                      ₱{previewData.final_total?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button onClick={() => setShowPreview(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                Discard & Edit
              </button>
              <button 
                onClick={handleFinalSend} 
                disabled={isSaving} 
                className="flex-[2] bg-cyan-400 hover:bg-cyan-300 text-[#111827] py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(34,211,238,0.2)]"
              >
                {isSaving ? "GENERATING..." : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Finalize & Send
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}