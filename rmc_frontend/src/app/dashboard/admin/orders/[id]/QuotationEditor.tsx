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

// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import { Save, Percent, Construction, CreditCard, Truck, Eye, CheckCircle } from 'lucide-react';

// export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
//   const [distance, setDistance] = useState(order.distance_km || 0);
//   const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
//   const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
//   const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
  
//   // Updated default to match backend choice key
//   const [paymentTerms, setPaymentTerms] = useState(order.quotation?.payment_terms || "COD"); 

//   useEffect(() => {
//   if (order?.payment_term) {
//     setPaymentTerms(order.payment_term);
//   } else if (order?.quotation?.payment_terms) {
//     // Fallback in case it's stored inside the quotation object
//     setPaymentTerms(order.quotation.payment_terms);
//   }
// }, [order?.payment_term, order?.quotation?.payment_terms]);

// const termLabels: Record<string, string> = {
//   COD: "Cash on Delivery",
//   Terms: "Credit Terms (30 Days)",
//   Advance: "Full Advance Payment",
//   DP: "Percentage Downpayment",
// };
  
//   const [isSaving, setIsSaving] = useState(false);
//   const [previewData, setPreviewData] = useState<any>(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const handleGeneratePreview = async () => {
//     try {
//       const response = await api.post(`/orders/${order.id}/preview_quotation/`, {
//         pump_rental: pumpRental,
//         pump_mobilization: pumpMobilization,
//         discount: discount,
//         payment_terms: paymentTerms,
//         distance_km: distance
//       });
      
//       setPreviewData(response.data.preview_breakdown);
//       setShowPreview(true); 
//     } catch (err) {
//       alert("Error calculating preview. Check if distance is valid.");
//       console.error(err);
//     }
//   };

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
//             <select 
//               value={paymentTerms} 
//               onChange={(e) => setPaymentTerms(e.target.value)} 
//               className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
//             >
//               <option value="COD" className="bg-[#111827]">Cash on Delivery (COD)</option>
//               <option value="Terms" className="bg-[#111827]">Credit Terms (30 Days)</option>
//               <option value="Advance" className="bg-[#111827]">Full Advance Payment</option>
//               <option value="DP" className="bg-[#111827]">Downpayment (Percentage)</option>
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

//         {/* PREVIEW BOX */}
//         {showPreview && previewData && (
//           <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
//             <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-4 border-cyan-500">
//               <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
//                 <div>
//                   <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800">Draft Quotation</h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-Validation Copy</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase">Terms</p>
//                   <p className="text-xs font-black text-cyan-600 uppercase">
//                     {paymentTerms === "COD" ? "Cash on Delivery" : 
//                      paymentTerms === "Terms" ? "Credit Terms" : 
//                      paymentTerms === "Advance" ? "Full Advance" : "Downpayment"}
//                   </p>
//                 </div>
//               </div>

//               {/* ... Items Table Logic ... */}
//               <div className="space-y-4">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-100">
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2">Description</th>
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-center text-nowrap">Price / m³</th>
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-right">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {previewData.items && Object.entries(previewData.items).map(([name, detail]: any) => (
//                       <tr key={name} className="border-b border-slate-50">
//                         <td className="py-3">
//                           <p className="font-bold text-slate-700">{name}</p>
//                           <p className="text-[10px] text-slate-400">{detail.volume} m³ Quantity</p>
//                         </td>
//                         <td className="py-3 text-center font-medium text-slate-600">
//                           ₱{detail.unit_price?.toLocaleString() ?? "0"}
//                         </td>
//                         <td className="py-3 text-right font-bold text-slate-800 text-nowrap">
//                           ₱{detail.subtotal?.toLocaleString() ?? "0"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Extra Fees */}
//                 <div className="space-y-2 pt-2">
//                   {pumpRental > 0 && (
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Concrete Pump Rental</span>
//                       <span className="font-bold text-slate-700">₱{pumpRental.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {pumpMobilization > 0 && (
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Pump Mobilization Fee</span>
//                       <span className="font-bold text-slate-700">₱{pumpMobilization.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {discount > 0 && (
//                     <div className="flex justify-between text-xs text-rose-500 font-bold">
//                       <span>Special Adjustment/Discount</span>
//                       <span>- ₱{discount.toLocaleString()}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
//                   <div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Total Payable Amount</p>
//                     <p className="text-xs text-slate-400 italic">VAT Inclusive</p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-3xl font-black text-slate-900">
//                       ₱{previewData.final_total?.toLocaleString() ?? "0"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex gap-3">
//               <button onClick={() => setShowPreview(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
//                 Discard & Edit
//               </button>
//               <button 
//                 onClick={handleFinalSend} 
//                 disabled={isSaving} 
//                 className="flex-[2] bg-cyan-400 hover:bg-cyan-300 text-[#111827] py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(34,211,238,0.2)]"
//               >
//                 {isSaving ? "GENERATING..." : (
//                   <>
//                     <CheckCircle className="w-4 h-4" /> Finalize & Send
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import api from '@/src/lib/api';
// import { Percent, Construction, CreditCard, Truck, Eye, CheckCircle, Printer } from 'lucide-react';

// export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
//   const [distance, setDistance] = useState(order.distance_km || 0);
//   const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
//   const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
//   const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
//   const [paymentTerms, setPaymentTerms] = useState(order.quotation?.payment_terms || "COD"); 

//   const [isSaving, setIsSaving] = useState(false);
//   const [previewData, setPreviewData] = useState<any>(null);
//   const [showPreview, setShowPreview] = useState(false);

//   useEffect(() => {
//     if (order?.payment_term) {
//       setPaymentTerms(order.payment_term);
//     } else if (order?.quotation?.payment_terms) {
//       setPaymentTerms(order.quotation.payment_terms);
//     }
//   }, [order?.payment_term, order?.quotation?.payment_terms]);

//   const handleGeneratePreview = async () => {
//     try {
//       const response = await api.post(`/orders/${order.id}/preview_quotation/`, {
//         pump_rental: pumpRental,
//         pump_mobilization: pumpMobilization,
//         discount: discount,
//         payment_terms: paymentTerms,
//         distance_km: distance
//       });
      
//       const rawData = response.data;
//       const cleanData = rawData.preview_breakdown ? rawData.preview_breakdown : rawData;
      
//       setPreviewData(cleanData);
//       setShowPreview(true); 
//     } catch (err) {
//       alert("Error calculating preview. Check if distance is valid.");
//       console.error(err);
//     }
//   };

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

//   const getTermsLabel = (term: string) => {
//     const labels: Record<string, string> = {
//       COD: "Cash on Delivery (COD)",
//       Terms: "Credit Terms (30 Days)",
//       Advance: "Full Advance Payment",
//       DP: "Percentage Downpayment",
//     };
//     return labels[term] || term;
//   };

//   // Recreates the document canvas cleanly into an independent document target context
//   const handlePrintPDF = () => {
//     if (typeof window === "undefined" || !previewData) return;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) {
//       alert("Popup blocked! Please allow popups to view and download the PDF document.");
//       return;
//     }

//     const currentDate = new Date().toLocaleDateString("en-PH", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
    
//     const orderIdString = order?.id?.toString().padStart(4, "0") || "0000";
//     const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;
//     const totalPayable = (previewData.final_total || previewData.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//     // Generate dynamic line-items explicitly for standard raw HTML parsing strings
//     let tableRowsHTML = "";
//     if (previewData.items) {
//       Object.entries(previewData.items).map(([name, detail]: any) => {
//         const itemVol = detail.volume || order?.volume || 0;
//         tableRowsHTML += `
//           <tr style="border-b: 1px solid #e5e7eb; font-style: italic;">
//             <td style="padding: 8px;"><strong style="font-style: normal;">${name}</strong></td>
//             <td style="text-align: right; padding: 8px; font-family: monospace;">₱${(detail.unit_price || 0).toLocaleString()}</td>
//             <td style="text-align: center; padding: 8px; font-family: monospace;">${itemVol}</td>
//             <td style="text-align: right; padding: 8px; font-weight: bold; font-family: monospace;">₱${(detail.subtotal || 0).toLocaleString()}</td>
//           </tr>
//         `;
//       });
//     }

//     // Conditional optional fee parameters formatting loops
//     let extrasHTML = "";
//     if (pumpRental > 0) {
//       extrasHTML += `
//         <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
//           <span style="color: #6b7280; font-weight: bold; text-transform: uppercase;">Pumpcrete Rental</span>
//           <span style="font-family: monospace; font-weight: bold;">₱${pumpRental.toLocaleString()}</span>
//         </div>
//       `;
//     }
//     if (pumpMobilization > 0) {
//       extrasHTML += `
//         <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
//           <span style="color: #6b7280; font-weight: bold; text-transform: uppercase;">Mobilization Fee</span>
//           <span style="font-family: monospace; font-weight: bold;">₱${pumpMobilization.toLocaleString()}</span>
//         </div>
//       `;
//     }
//     if (discount > 0) {
//       extrasHTML += `
//         <div style="display: flex; justify-content: space-between; font-size: 11px; color: #b91c1c; font-weight: bold; margin-bottom: 6px;">
//           <span style="text-transform: uppercase;">Less: Discount</span>
//           <span style="font-family: monospace;">- ₱${discount.toLocaleString()}</span>
//         </div>
//       `;
//     }

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>${controlNumber}</title>
//           <style>
//             @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:italic,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');
//             @page { size: A4; margin: 0; }
//             body { background: #ffffff; color: #1a1a1a; font-family: 'Libre Baskerville', serif; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
//             .canvas { width: 210mm; min-height: 297mm; padding: 15mm; box-sizing: border-box; position: relative; margin: 0 auto; }
//             .font-sans { font-family: 'Inter', sans-serif; }
//             .heading-font { font-family: 'Cinzel', serif; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
//             th { text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 900; background: #f9fafb; padding: 8px; text-align: left; }
//           </style>
//         </head>
//         <body>
//           <div class="canvas">
//             <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 16px; margin-bottom: 32px;">
//               <div>
//                 <h1 class="heading-font" style="font-size: 24px; font-weight: bold; color: #064e3b; margin: 0;">AERON RMC</h1>
//                 <p class="font-sans" style="font-size: 9px; uppercase; font-weight: bold; color: #6b7280; letter-spacing: 0.2em; margin: 4px 0 0 0;">READY-MIXED CONCRETE SPECIALIST</p>
//                 <div class="font-sans" style="margin-top: 8px; font-size: 10px; color: #4b5563; line-height: 1.4;">
//                   <p style="margin:0;">Villasis Plant Operation Office, Pangasinan</p>
//                   <p style="margin:0;">Contact: +63 (0917) 000-0000</p>
//                 </div>
//               </div>
//               <div class="font-sans" style="text-align: right;">
//                 <h2 style="font-size: 18px; font-weight: 900; color: #d1d5db; text-transform: uppercase; margin: 0 0 4px 0;">Quotation</h2>
//                 <p style="font-size: 8px; color: #9ca3af; text-transform: uppercase; font-weight: bold; margin: 0;">Control Number</p>
//                 <p style="font-family: monospace; font-weight: bold; font-size: 12px; background: #f9fafb; padding: 2px 8px; border: 1px solid #e5e7eb; border-radius: 4px; margin: 2px 0 8px 0;">${controlNumber}</p>
//                 <p style="font-size: 8px; color: #9ca3af; text-transform: uppercase; font-weight: bold; margin: 0;">Date</p>
//                 <p style="font-size: 12px; font-weight: bold; margin: 2px 0 0 0;">${currentDate}</p>
//               </div>
//             </div>

//             <div style="margin-bottom: 32px; font-size: 12px;">
//               <h3 class="font-sans" style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin: 0 0 4px 0; letter-spacing: 0.1em;">Client Details:</h3>
//               <p style="font-weight: bold; font-size: 14px; margin: 0;">${order?.contact_person || "Valued Client"}</p>
//               <p class="font-sans" style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #374151; margin: 2px 0;">${order?.company_name || ""}</p>
//               <p style="color: #4b5563; font-style: italic; margin: 2px 0;">${order?.project_location || ""}</p>
//             </div>

//             <div style="margin-bottom: 24px; font-size: 12px; line-height: 1.6;">
//               <p style="margin: 0 0 8px 0;">Dear <strong>${order?.contact_person || "Sir/Madam"}</strong>,</p>
//               <p style="text-align: justify; margin: 0;">We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.</p>
//             </div>

//             <table style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
//               <thead>
//                 <tr>
//                   <th>Description of Material</th>
//                   <th style="text-align: right;">Price/m³</th>
//                   <th style="text-align: center;">Qty</th>
//                   <th style="text-align: right;">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${tableRowsHTML}
//               </tbody>
//             </table>

//             <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
//               <div class="font-sans" style="width: 256px;">
//                 <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
//                   ${extrasHTML}
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center;">
//                   <span class="heading-font" style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Grand Total</span>
//                   <div style="text-align: right;">
//                     <span style="font-size: 20px; font-weight: 900; color: #064e3b;">₱${totalPayable}</span>
//                     <p style="font-size: 7px; color: #9ca3af; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; margin: 2px 0 0 0;">VAT Inclusive</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div class="font-sans" style="display: grid; grid-template-cols: repeat(2, minmax(0, 1fr)); gap: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px; font-size: 9px;">
//               <div style="float: left; width: 45%;">
//                 <h4 style="font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; padding-bottom: 2px; margin: 0 0 6px 0;">Terms & Validity</h4>
//                 <p style="margin: 3px 0;"><strong>PAYMENT:</strong> ${getTermsLabel(paymentTerms)}</p>
//                 <p style="margin: 3px 0;"><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
//                 <p style="font-style: italic; color: #9ca3af; margin-top: 8px;">Note: Price is subject to change based on actual site distance verification.</p>
//               </div>
//               <div style="float: right; width: 45%;">
//                 <h4 style="font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; padding-bottom: 2px; margin: 0 0 6px 0;">Customer Conforme</h4>
//                 <p style="font-style: italic; color: #9ca3af; text-align: justify; margin: 0 0 16px 0;">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
//                 <div style="border-top: 1px solid #000; margin-top: 16px; padding-top: 4px;">
//                   <p style="font-weight: bold; text-transform: uppercase; text-align: center; letter-spacing: 0.1em; margin: 0;">Authorized Signature</p>
//                 </div>
//               </div>
//               <div style="clear: both;"></div>
//             </div>

//             <div class="font-sans" style="margin-top: 48px; display: flex; justify-content: space-between; font-size: 10px;">
//               <div style="float: left; width: 160px; text-align: center;">
//                 <p style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0;">Olsen Aeron Paduit</p>
//                 <p style="font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Technical & Accounting</p>
//               </div>
//               <div style="float: right; width: 160px; text-align: center;">
//                 <p style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0;">Plant Manager</p>
//                 <p style="font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Authorized Approver</p>
//               </div>
//               <div style="clear: both;"></div>
//             </div>
//           </div>
//           <script>
//             window.onload = function() {
//               window.print();
//               setTimeout(function() { window.close(); }, 500);
//             };
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
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
//             <select 
//               value={paymentTerms} 
//               onChange={(e) => setPaymentTerms(e.target.value)} 
//               className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-white focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
//             >
//               <option value="COD" className="bg-[#111827]">Cash on Delivery (COD)</option>
//               <option value="Terms" className="bg-[#111827]">Credit Terms (30 Days)</option>
//               <option value="Advance" className="bg-[#111827]">Full Advance Payment</option>
//               <option value="DP" className="bg-[#111827]">Downpayment (Percentage)</option>
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

//         {/* SELF-CONTAINED PREVIEW BOX */}
//         {showPreview && previewData && (
//           <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
//             <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-4 border-cyan-500">
//               <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
//                 <div>
//                   <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800">Draft Quotation</h3>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-Validation Copy</p>
//                 </div>
//                 <div className="text-right flex flex-col items-end gap-2">
//                   <button 
//                     onClick={handlePrintPDF}
//                     className="bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow"
//                   >
//                     <Printer className="w-3 h-3" /> Download / Print PDF
//                   </button>
//                   <p className="text-[9px] font-medium text-slate-400 italic">Official Document Preview</p>
//                 </div>
//               </div>

//               {/* Items Table Section */}
//               <div className="space-y-4">
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="border-b border-slate-100">
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2">Description</th>
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-center text-nowrap">Price / m³</th>
//                       <th className="text-[10px] font-bold text-slate-400 uppercase pb-2 text-right">Subtotal</th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-sm">
//                     {previewData.items && Object.entries(previewData.items).map(([name, detail]: any) => (
//                       <tr key={name} className="border-b border-slate-50">
//                         <td className="py-3">
//                           <p className="font-bold text-slate-700">{name}</p>
//                           <p className="text-[10px] text-slate-400">{detail.volume || order?.volume || 0} m³ Quantity</p>
//                         </td>
//                         <td className="py-3 text-center font-medium text-slate-600">
//                           ₱{(detail.unit_price || 0).toLocaleString()}
//                         </td>
//                         <td className="py-3 text-right font-bold text-slate-800 text-nowrap">
//                           ₱{(detail.subtotal || 0).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {/* Fees Breakdown */}
//                 <div className="space-y-2 pt-2">
//                   <div className="flex justify-between text-xs">
//                     <span className="text-slate-500">Payment Terms</span>
//                     <span className="font-bold text-cyan-600">{getTermsLabel(paymentTerms)}</span>
//                   </div>
//                   {pumpRental > 0 && (
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Concrete Pump Rental</span>
//                       <span className="font-bold text-slate-700">₱{pumpRental.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {pumpMobilization > 0 && (
//                     <div className="flex justify-between text-xs">
//                       <span className="text-slate-500">Pump Mobilization Fee</span>
//                       <span className="font-bold text-slate-700">₱{pumpMobilization.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {discount > 0 && (
//                     <div className="flex justify-between text-xs text-rose-500 font-bold">
//                       <span>Special Adjustment/Discount</span>
//                       <span>- ₱{discount.toLocaleString()}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-6 pt-6 border-t-2 border-slate-900 flex justify-between items-end">
//                   <div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase">Total Payable Amount</p>
//                     <p className="text-xs text-slate-400 italic">VAT Inclusive</p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-3xl font-black text-slate-900">
//                       ₱{(previewData.final_total || previewData.grand_total || 0).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ACTION FOOTER BUTTONS */}
//             <div className="flex gap-3">
//               <button onClick={() => setShowPreview(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
//                 Discard & Edit
//               </button>
//               <button 
//                 onClick={handleFinalSend} 
//                 disabled={isSaving} 
//                 className="flex-[2] bg-cyan-400 hover:bg-cyan-300 text-[#111827] py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_50px_rgba(34,211,238,0.2)]"
//               >
//                 {isSaving ? "GENERATING..." : (
//                   <>
//                     <CheckCircle className="w-4 h-4" /> Finalize & Send
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import api from '@/src/lib/api';
import { Percent, Construction, CreditCard, Truck, Eye, CheckCircle, Printer } from 'lucide-react';
import Swal from 'sweetalert2';

export default function QuotationEditor({ order, onUpdate }: { order: any, onUpdate: () => void }) {
  const [distance, setDistance] = useState(order.distance_km || 0);
  const [pumpRental, setPumpRental] = useState(order.quotation?.breakdown?.pump_rental || 0);
  const [pumpMobilization, setPumpMobilization] = useState(order.quotation?.breakdown?.pump_mobilization || 0);
  const [discount, setDiscount] = useState(order.quotation?.breakdown?.discount || 0);
  const [paymentTerms, setPaymentTerms] = useState(order.quotation?.payment_terms || "COD"); 

  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (order?.payment_term) {
      setPaymentTerms(order.payment_term);
    } else if (order?.quotation?.payment_terms) {
      setPaymentTerms(order.quotation.payment_terms);
    }
  }, [order?.payment_term, order?.quotation?.payment_terms]);

  const handleGeneratePreview = async () => {
    try {
      const response = await api.post(`/orders/${order.id}/preview_quotation/`, {
        pump_rental: pumpRental,
        pump_mobilization: pumpMobilization,
        discount: discount,
        payment_terms: paymentTerms,
        distance_km: distance
      });
      
      const rawData = response.data;
      const cleanData = rawData.preview_breakdown ? rawData.preview_breakdown : rawData;
      
      setPreviewData(cleanData);
      setShowPreview(true); 
    } catch (err) {
      Swal.fire({
      title: 'CALCULATION ERROR',
      text: 'Could not calculate price preview. Please verify if the delivery distance field holds a valid numeric value.',
      icon: 'error',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444', // Red error accent
      customClass: {
        popup: 'rounded-3xl border border-slate-800 font-sans'
      }
    });
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
      Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#0f172a', 
        color: '#f8fafc',     
      }).fire({
        icon: 'success',
        title: 'QUOTATION ISSUED',
        text: 'Quotation officially recorded and sent!'
      });
      setShowPreview(false);
      onUpdate();
    } catch (err) {
      Swal.fire({
        title: 'SAVE ERROR',
        text: 'Error saving quotation.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-3xl border border-slate-800 font-sans'
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getTermsLabel = (term: string) => {
    const labels: Record<string, string> = {
      COD: "Cash on Delivery (COD)",
      Terms: "Credit Terms (30 Days)",
      Advance: "Full Advance Payment",
      DP: "Percentage Downpayment",
    };
    return labels[term] || term;
  };

  // Recreates the document canvas cleanly into an independent document target context
  const handlePrintPDF = () => {
    if (typeof window === "undefined" || !previewData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      Swal.fire({
      title: 'POPUP BLOCKER DETECTED',
      text: 'Your browser blocked the document window. Please allow popups for this site in your browser URL bar to view and download the official PDF invoice.',
      icon: 'warning',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#f59e0b', // Amber warning color
      customClass: {
        popup: 'rounded-3xl border border-slate-800 font-sans'
      }
    });
      return;
    }

    const currentDate = new Date().toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // Calculate Revision-Aware Control Number for Window HTML
    const orderIdString = order?.id?.toString().padStart(4, "0") || "0000";
    const baseControlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;
    const revNo = previewData?.revision_number || order?.quotation?.revision_number || 0;
    const controlNumber = revNo > 0 ? `${baseControlNumber}-R${revNo}` : baseControlNumber;

    const totalPayable = (previewData.final_total || previewData.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Generate dynamic line-items explicitly for standard raw HTML parsing strings
    let tableRowsHTML = "";
    if (previewData.items) {
      Object.entries(previewData.items).map(([name, detail]: any) => {
        const itemVol = detail.volume || order?.volume || 0;
        tableRowsHTML += `
          <tr style="border-b: 1px solid #e5e7eb; font-style: italic;">
            <td style="padding: 8px;"><strong style="font-style: normal;">${name}</strong></td>
            <td style="text-align: right; padding: 8px; font-family: monospace;">₱${(detail.unit_price || 0).toLocaleString()}</td>
            <td style="text-align: center; padding: 8px; font-family: monospace;">${itemVol}</td>
            <td style="text-align: right; padding: 8px; font-weight: bold; font-family: monospace;">₱${(detail.subtotal || 0).toLocaleString()}</td>
          </tr>
        `;
      });
    }

    // Conditional optional fee parameters formatting loops
    let extrasHTML = "";
    if (pumpRental > 0) {
      extrasHTML += `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
          <span style="color: #6b7280; font-weight: bold; text-transform: uppercase;">Pumpcrete Rental</span>
          <span style="font-family: monospace; font-weight: bold;">₱${pumpRental.toLocaleString()}</span>
        </div>
      `;
    }
    if (pumpMobilization > 0) {
      extrasHTML += `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px;">
          <span style="color: #6b7280; font-weight: bold; text-transform: uppercase;">Mobilization Fee</span>
          <span style="font-family: monospace; font-weight: bold;">₱${pumpMobilization.toLocaleString()}</span>
        </div>
      `;
    }
    if (discount > 0) {
      extrasHTML += `
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #b91c1c; font-weight: bold; margin-bottom: 6px;">
          <span style="text-transform: uppercase;">Less: Discount</span>
          <span style="font-family: monospace;">- ₱${discount.toLocaleString()}</span>
        </div>
      `;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${controlNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:italic,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');
            @page { size: A4; margin: 0; }
            body { background: #ffffff; color: #1a1a1a; font-family: 'Libre Baskerville', serif; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            .canvas { width: 210mm; min-height: 297mm; padding: 15mm; box-sizing: border-box; position: relative; margin: 0 auto; }
            .font-sans { font-family: 'Inter', sans-serif; }
            .heading-font { font-family: 'Cinzel', serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
            th { text-transform: uppercase; font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 900; background: #f9fafb; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <div class="canvas">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 16px; margin-bottom: 32px;">
              <div>
                <h1 class="heading-font" style="font-size: 24px; font-weight: bold; color: #064e3b; margin: 0;">AERON RMC</h1>
                <p class="font-sans" style="font-size: 9px; uppercase; font-weight: bold; color: #6b7280; letter-spacing: 0.2em; margin: 4px 0 0 0;">READY-MIXED CONCRETE SPECIALIST</p>
                <div class="font-sans" style="margin-top: 8px; font-size: 10px; color: #4b5563; line-height: 1.4;">
                  <p style="margin:0;">Villasis Plant Operation Office, Pangasinan</p>
                  <p style="margin:0;">Contact: +63 (0917) 000-0000</p>
                </div>
              </div>
              <div class="font-sans" style="text-align: right;">
                <h2 style="font-size: 18px; font-weight: 900; color: #d1d5db; text-transform: uppercase; margin: 0 0 4px 0;">Quotation</h2>
                <p style="font-size: 8px; color: #9ca3af; text-transform: uppercase; font-weight: bold; margin: 0;">Control Number</p>
                <p style="font-family: monospace; font-weight: bold; font-size: 12px; background: #f9fafb; padding: 2px 8px; border: 1px solid #e5e7eb; border-radius: 4px; margin: 2px 0 8px 0;">${controlNumber}</p>
                <p style="font-size: 8px; color: #9ca3af; text-transform: uppercase; font-weight: bold; margin: 0;">Date</p>
                <p style="font-size: 12px; font-weight: bold; margin: 2px 0 0 0;">${currentDate}</p>
              </div>
            </div>

            <div style="margin-bottom: 32px; font-size: 12px;">
              <h3 class="font-sans" style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin: 0 0 4px 0; letter-spacing: 0.1em;">Client Details:</h3>
              <p style="font-weight: bold; font-size: 14px; margin: 0;">${order?.contact_person || "Valued Client"}</p>
              <p class="font-sans" style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #374151; margin: 2px 0;">${order?.company_name || ""}</p>
              <p style="color: #4b5563; font-style: italic; margin: 2px 0;">${order?.project_location || ""}</p>
            </div>

            <div style="margin-bottom: 24px; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">Dear <strong>${order?.contact_person || "Sir/Madam"}</strong>,</p>
              <p style="text-align: justify; margin: 0;">We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.</p>
            </div>

            <table style="border-top: 1px solid #000; border-bottom: 1px solid #000;">
              <thead>
                <tr>
                  <th>Description of Material</th>
                  <th style="text-align: right;">Price/m³</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
              <div class="font-sans" style="width: 256px;">
                <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px;">
                  ${extrasHTML}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="heading-font" style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Grand Total</span>
                  <div style="text-align: right;">
                    <span style="font-size: 20px; font-weight: 900; color: #064e3b;">₱${totalPayable}</span>
                    <p style="font-size: 7px; color: #9ca3af; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; margin: 2px 0 0 0;">VAT Inclusive</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="font-sans" style="display: grid; grid-template-cols: repeat(2, minmax(0, 1fr)); gap: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px; font-size: 9px;">
              <div style="float: left; width: 45%;">
                <h4 style="font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; padding-bottom: 2px; margin: 0 0 6px 0;">Terms & Validity</h4>
                <p style="margin: 3px 0;"><strong>PAYMENT:</strong> ${getTermsLabel(paymentTerms)}</p>
                <p style="margin: 3px 0;"><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
                <p style="font-style: italic; color: #9ca3af; margin-top: 8px;">Note: Price is subject to change based on actual site distance verification.</p>
              </div>
              <div style="float: right; width: 45%;">
                <h4 style="font-weight: 900; text-transform: uppercase; border-bottom: 1px solid #f3f4f6; padding-bottom: 2px; margin: 0 0 6px 0;">Customer Conforme</h4>
                <p style="font-style: italic; color: #9ca3af; text-align: justify; margin: 0 0 16px 0;">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
                <div style="border-top: 1px solid #000; margin-top: 16px; padding-top: 4px;">
                  <p style="font-weight: bold; text-transform: uppercase; text-align: center; letter-spacing: 0.1em; margin: 0;">Authorized Signature</p>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>

            <div class="font-sans" style="margin-top: 48px; display: flex; justify-content: space-between; font-size: 10px;">
              <div style="float: left; width: 160px; text-align: center;">
                <p style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0;">Olsen Aeron Paduit</p>
                <p style="font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Technical & Accounting</p>
              </div>
              <div style="float: right; width: 160px; text-align: center;">
                <p style="font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0;">Plant Manager</p>
                <p style="font-size: 8px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Authorized Approver</p>
              </div>
              <div style="clear: both;"></div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

        {/* SELF-CONTAINED PREVIEW BOX */}
        {showPreview && previewData && (
          <div className="mt-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white text-slate-900 rounded-xl p-8 shadow-2xl relative overflow-hidden border-t-4 border-cyan-500">
              <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter uppercase text-slate-800">Draft Quotation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Pre-Validation Copy { (previewData?.revision_number || order?.quotation?.revision_number || 0) > 0 ? `(Rev ${previewData?.revision_number || order?.quotation?.revision_number})` : "" }
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <button 
                    onClick={handlePrintPDF}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-3 h-3" /> Download / Print PDF
                  </button>
                  <p className="text-[9px] font-medium text-slate-400 italic">Official Document Preview</p>
                </div>
              </div>

              {/* Items Table Section */}
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
                          <p className="text-[10px] text-slate-400">{detail.volume || order?.volume || 0} m³ Quantity</p>
                        </td>
                        <td className="py-3 text-center font-medium text-slate-600">
                          ₱{(detail.unit_price || 0).toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-800 text-nowrap">
                          ₱{(detail.subtotal || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Fees Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Payment Terms</span>
                    <span className="font-bold text-cyan-600">{getTermsLabel(paymentTerms)}</span>
                  </div>
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
                      ₱{(previewData.final_total || previewData.grand_total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION FOOTER BUTTONS */}
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