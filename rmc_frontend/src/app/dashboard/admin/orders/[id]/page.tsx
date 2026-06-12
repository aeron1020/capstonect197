

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); // Controls collapse state
  
//   // Inspection Form States
//   const [inspectionResult, setInspectionResult] = useState("Approved");
//   const [inspectionRemarks, setInspectionRemarks] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rescheduleDate, setRescheduleDate] = useState("");

//   const fetchOrderData = async () => {
//   try {
//     const res = await api.get(`orders/${orderId}/`);
//     setOrder(res.data);
//     setRescheduleDate(res.data.proposed_schedule); 
//     if (res.data.status === "For Inspection") setOpenSection("inspection");
//   } catch (err) { console.error(err); }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//   try {
//     const res = await api.post(`payments/${paymentId}/verify_payment/`, {
//       decision: decision
//     });
//     Swal.fire({
//     title: 'SYSTEM UPDATE',
//     text: res.data.message || 'Operation executed successfully.',
//     icon: 'success', // Displays a clean checkmark, or change to 'info' if preferred
//     background: '#0f172a',
//     color: '#f8fafc',
//     confirmButtonColor: '#06b6d4', // Aeron Ops Signature Cyan
//     customClass: {
//       popup: 'rounded-3xl border border-slate-800 font-sans'
//     }
//   });
//     fetchOrderData(); // This will move the order to "Ready for Pouring"
//   } catch (err) {
//     Swal.fire({
//       title: 'SYSTEM ERROR',
//       text: "Error verifying payment.",
//       icon: 'error',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#ef4444',
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });
//   }
// };

//   useEffect(() => { if (orderId) fetchOrderData(); }, [orderId]);

//   const toggleSection = (section: string) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks) return Swal.fire({
//       title: 'INPUT REQUIRED',
//       text: "Please provide inspection remarks.",
//       icon: 'warning',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#06b6d4',
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });

//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks,
//         new_date: rescheduleDate 
//       });
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//       fetchOrderData(); 
//       setOpenSection("payment"); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400">LOADING PROJECT ENGINE...</div>;

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
//               order.status.includes('Approved') ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3 h-3" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase">Total Volume</p>
//              <p className="text-xl font-black text-gray-900">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION (COLLAPSIBLE) */}
//         <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <button 
//             onClick={() => toggleSection("quotation")}
//             className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.quotation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <Calculator className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 1: Pricing & Quotation</h3>
//                 <p className="text-xs text-gray-400">Handle pump rentals, discounts, and terms.</p>
//               </div>
//             </div>
//             {openSection === "quotation" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "quotation" && (
//             <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
//               <QuotationEditor order={order} onUpdate={fetchOrderData} />
//             </div>
//           )}
//         </section>

//         {/* 3. INSPECTION SECTION (COLLAPSIBLE) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
//           order.status === "For Inspection" ? "ring-2 ring-cyan-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("inspection")}
//             disabled={order.status === "Pending"} // Disable until quote is sent
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               order.status === "Pending" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <ClipboardList className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 2: Site Inspection</h3>
//                 <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
//               </div>
//             </div>
//             {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "inspection" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold"
//                     >
//                       <option value="Approved">Approved</option>
//                       <option value="Rejected">Rejected</option>
//                       <option value="Re-inspection">Re-inspection Required</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
//                     <textarea 
//                       value={inspectionRemarks}
//                       onChange={(e) => setInspectionRemarks(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px]"
//                       placeholder="Enter site findings here..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
//                       Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
//                     />
//                     <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase italic">
//                       * Change this only if the site isn't ready for the original date.
//                     </p>
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-[#111827] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Inspection"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
//                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Workflow Alert</h4>
//                    <div className="flex gap-3">
//                       <Info className="w-5 h-5 text-cyan-500 shrink-0" />
//                       <p className="text-xs text-gray-600 leading-relaxed">
//                         Approving this inspection will automatically transition the order to 
//                         <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
//                       </p>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. PAYMENT VERIFICATION (COLLAPSIBLE) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${
//           order.status === "For Payment Verification" ? "ring-2 ring-orange-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={order.status !== "For Payment Verification"}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               order.status !== "For Payment Verification" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 3: Payment Verification</h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               {/* Assuming you'll have a Payment list in the order response */}
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-4">
//                   {order.payments.map((payment: any) => (
//                     <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
//                       <div className="flex items-center gap-4">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
//                           <img src={payment.proof_file} alt="Proof" className="w-full h-full object-cover" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-gray-900">Proof of Payment</p>
//                           <p className="text-[10px] text-gray-500 uppercase">{payment.status}</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                           className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase"
//                         >
//                           Verify
//                         </button>
//                         <button 
//                           onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                           className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase"
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl">
//                   <p className="text-sm text-gray-400 font-medium">Awaiting customer upload...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 4. LOGISTICS SECTION (LOCKED UNTIL READY) */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between ${
//           order.status !== "Ready for Pouring" ? "opacity-40" : "opacity-100"
//         }`}>
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-gray-100 text-gray-500 rounded-2xl">
//               <Truck className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-black text-sm uppercase tracking-tight text-gray-400">Step 3: Dispatch & Scheduling</h3>
//               <p className="text-xs text-gray-400 italic">Locked until site inspection is approved.</p>
//             </div>
//           </div>
//           <span className="text-[10px] font-bold text-gray-300 border border-gray-100 px-3 py-1 rounded-full uppercase">Locked</span>
//         </section>
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); // Controls collapse state
  
//   // Inspection Form States
//   const [inspectionResult, setInspectionResult] = useState("Approved");
//   const [inspectionRemarks, setInspectionRemarks] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rescheduleDate, setRescheduleDate] = useState("");

//   const fetchOrderData = async () => {
//     try {
//       const res = await api.get(`orders/${orderId}/`);
//       setOrder(res.data);
//       setRescheduleDate(res.data.proposed_schedule); 
//       if (res.data.status === "For Inspection") setOpenSection("inspection");
//       if (res.data.status === "For Payment Verification") setOpenSection("payment");
//     } catch (err) { 
//       console.error(err); 
//     }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//     try {
//       const res = await api.post(`payments/${paymentId}/verify_payment/`, {
//         decision: decision
//       });
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success', 
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4', // Aeron Ops Signature Cyan
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//       fetchOrderData(); 
//     } catch (err) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Error verifying payment.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//     }
//   };

//   useEffect(() => { 
//     if (orderId) fetchOrderData(); 
//   }, [orderId]);

//   const toggleSection = (section: string) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks) return Swal.fire({
//       title: 'INPUT REQUIRED',
//       text: "Please provide inspection remarks.",
//       icon: 'warning',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#06b6d4',
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });

//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks,
//         new_date: rescheduleDate 
//       });
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//       fetchOrderData(); 
//       setOpenSection("payment"); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400">LOADING PROJECT ENGINE...</div>;

//   // Evaluation Flags for Safe Layout Routing
//   const isPendingQuoteOrReview = order.status === "Pending";
//   const isLockedForPaymentVerification = ["Pending", "Quotation Sent", "For Inspection"].includes(order.status);

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
//               order.status.includes('Ready') || order.status.includes('Approved') ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3 h-3" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase">Total Volume</p>
//              <p className="text-xl font-black text-gray-900">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION (COLLAPSIBLE) */}
//         <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <button 
//             onClick={() => toggleSection("quotation")}
//             className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.quotation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <Calculator className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 1: Pricing & Quotation</h3>
//                 <p className="text-xs text-gray-400">Handle pump rentals, discounts, and terms.</p>
//               </div>
//             </div>
//             {openSection === "quotation" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "quotation" && (
//             <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
//               <QuotationEditor order={order} onUpdate={fetchOrderData} />
//             </div>
//           )}
//         </section>

//         {/* 3. Site Inspection Section */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
//           order.status === "For Inspection" ? "ring-2 ring-cyan-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("inspection")}
//             disabled={isPendingQuoteOrReview}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <ClipboardList className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 2: Site Inspection</h3>
//                 <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
//               </div>
//             </div>
//             {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "inspection" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold"
//                     >
//                       <option value="Approved">Approved</option>
//                       <option value="Rejected">Rejected</option>
//                       <option value="Re-inspection">Re-inspection Required</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
//                     <textarea 
//                       value={inspectionRemarks}
//                       onChange={(e) => setInspectionRemarks(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px]"
//                       placeholder="Enter site findings here..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
//                       Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
//                     />
//                     <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase italic">
//                       * Change this only if the site isn't ready for the original date.
//                     </p>
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-[#111827] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Inspection"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
//                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Workflow Alert</h4>
//                    <div className="flex gap-3">
//                       <Info className="w-5 h-5 text-cyan-500 shrink-0" />
//                       <p className="text-xs text-gray-600 leading-relaxed">
//                         Approving this inspection will automatically transition the order to 
//                         <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
//                       </p>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. PAYMENT VERIFICATION (ACCESSIBLE EVEN AFTER VERIFIED) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${
//           order.status === "For Payment Verification" ? "ring-2 ring-orange-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={isLockedForPaymentVerification}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.payment_status === "Paid" || order.payment_status === "Downpayment Verified" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 3: Payment Verification</h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-4">
//                   {order.payments.map((payment: any) => (
//                     <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
//                       <div className="flex items-center gap-4">
//                         <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
//                           <img 
//                             src={payment.proof_file} 
//                             alt="Proof of Payment Snapshot" 
//                             className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
//                             onClick={() => window.open(payment.proof_file, '_blank')}
//                           />
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-gray-900">Transaction Receipt Document</p>
//                           <p className="text-[10px] text-gray-500 uppercase font-black tracking-wide">{payment.status}</p>
//                         </div>
//                       </div>
                      
//                       {/* Show actions only if payment log isn't finalized */}
//                       {payment.status === "Pending" && (
//                         <div className="flex gap-2">
//                           <button 
//                             onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
//                           >
//                             Verify
//                           </button>
//                           <button 
//                             onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                             className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl">
//                   <p className="text-sm text-gray-400 font-medium">Awaiting customer proof upload submission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 5. LOGISTICS SECTION (UNLOCKED UPON POURING READY STATE) */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-opacity ${
//           order.status !== "Ready for Pouring" ? "opacity-40" : "opacity-100"
//         }`}>
//           <div className="flex items-center gap-4">
//             <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
//               <Truck className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
//               <p className="text-xs text-gray-400 italic">
//                 {order.status === "Ready for Pouring" ? "Ready for truck tracking deployment." : "Locked until site conditions or terms are verified."}
//               </p>
//             </div>
//           </div>
//           <span className={`text-[10px] font-bold border px-3 py-1 rounded-full uppercase ${
//             order.status === "Ready for Pouring" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300"
//           }`}>
//             {order.status === "Ready for Pouring" ? "Active" : "Locked"}
//           </span>
//         </section>
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); // Controls default panel collapse
  
//   // Inspection Form States
//   const [inspectionResult, setInspectionResult] = useState("Approved");
//   const [inspectionRemarks, setInspectionRemarks] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rescheduleDate, setRescheduleDate] = useState("");

//   // Payment Feedback Remarks Map Indexed by paymentId
//   const [paymentRemarks, setPaymentRemarks] = useState<{ [key: number]: string }>({});

//   const fetchOrderData = async () => {
//     try {
//       const res = await api.get(`orders/${orderId}/`);
//       setOrder(res.data);
//       setRescheduleDate(res.data.proposed_schedule); 
      
//       // Smart Auto-Collapse Open Routing Steps Based on Realtime Status
//       if (res.data.status === "For Inspection") setOpenSection("inspection");
//       if (res.data.status === "For Payment Verification") setOpenSection("payment");
//     } catch (err) { 
//       console.error(err); 
//     }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//     const remarks = paymentRemarks[paymentId] || "";
    
//     // Safety Fallback Guard: Enforce reason input if rejecting
//     if (decision === 'reject' && !remarks.trim()) {
//       return Swal.fire({
//         title: 'REJECTION REASON REQUIRED',
//         text: "Please provide a brief comment explaining the reason for rejection to the customer.",
//         icon: 'warning',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     }

//     try {
//       const res = await api.post(`payments/${paymentId}/verify_payment/`, {
//         decision: decision,
//         remarks: remarks 
//       });
      
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success', 
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4', 
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
      
//       // Reset comments array state slot for this specific payment record
//       setPaymentRemarks(prev => ({ ...prev, [paymentId]: "" }));
//       fetchOrderData(); 
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Error executing payment verification workflow step.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     }
//   };

//   useEffect(() => { 
//     if (orderId) fetchOrderData(); 
//   }, [orderId]);

//   const toggleSection = (section: string) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks) return Swal.fire({
//       title: 'INPUT REQUIRED',
//       text: "Please provide inspection remarks.",
//       icon: 'warning',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#06b6d4',
//       customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//     });

//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks,
//         new_date: rescheduleDate 
//       });
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//       fetchOrderData(); 
//       setOpenSection("payment"); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400 tracking-wider">LOADING PROJECT ENGINE...</div>;

//   // Workflow Security Evaluators to control interactive section access
//   const isPendingQuoteOrReview = order.status === "Pending";
//   const isLockedForPaymentVerification = ["Pending", "Quotation Sent", "For Inspection"].includes(order.status);

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
//               order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3 h-3" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase">Total Volume</p>
//              <p className="text-xl font-black text-gray-900">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION (COLLAPSIBLE) */}
//         <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <button 
//             onClick={() => toggleSection("quotation")}
//             className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.quotation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <Calculator className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 1: Pricing & Quotation</h3>
//                 <p className="text-xs text-gray-400">Handle pump rentals, discounts, and terms.</p>
//               </div>
//             </div>
//             {openSection === "quotation" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "quotation" && (
//             <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
//               <QuotationEditor order={order} onUpdate={fetchOrderData} />
//             </div>
//           )}
//         </section>

//         {/* 3. SITE INSPECTION SECTION (COLLAPSIBLE) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
//           order.status === "For Inspection" ? "ring-2 ring-cyan-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("inspection")}
//             disabled={isPendingQuoteOrReview}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <ClipboardList className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 2: Site Inspection</h3>
//                 <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
//               </div>
//             </div>
//             {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "inspection" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold"
//                     >
//                       <option value="Approved">Approved</option>
//                       <option value="Rejected">Rejected</option>
//                       <option value="Re-inspection">Re-inspection Required</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
//                     <textarea 
//                       value={inspectionRemarks}
//                       onChange={(e) => setInspectionRemarks(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px]"
//                       placeholder="Enter site findings here..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
//                       Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
//                     />
//                     <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase italic">
//                       * Change this only if the site isn't ready for the original date.
//                     </p>
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-[#111827] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Inspection"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
//                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Workflow Alert</h4>
//                    <div className="flex gap-3">
//                       <Info className="w-5 h-5 text-cyan-500 shrink-0" />
//                       <p className="text-xs text-gray-600 leading-relaxed">
//                         Approving this inspection will automatically transition the order to 
//                         <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
//                       </p>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. PAYMENT VERIFICATION SECTION (COLLAPSIBLE - UNLOCKED/REMAINS VIEWABLE AFTER COMPLETION) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${
//           order.status === "For Payment Verification" ? "ring-2 ring-orange-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={isLockedForPaymentVerification}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 3: Payment Verification</h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-6">
//                   {order.payments.map((payment: any) => (
//                     <div key={payment.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                      
//                       {/* Top Meta Content Flex Group Row */}
//                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-inner shrink-0">
//                             <img 
//                               src={payment.proof_file} 
//                               alt="Proof of Payment Image" 
//                               className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
//                               onClick={() => window.open(payment.proof_file, '_blank')}
//                             />
//                           </div>
//                           <div>
//                             <p className="text-xs font-bold text-gray-900">Transaction Receipt Document</p>
//                             <p className="text-[10px] text-gray-500 uppercase font-black tracking-wide">
//                               Status: <span className={payment.status === 'Approved' ? 'text-green-600' : payment.status === 'Rejected' ? 'text-red-500' : 'text-orange-600'}>{payment.status}</span>
//                             </p>
//                           </div>
//                         </div>

//                         {/* Control Actions UI Trigger Buttons */}
//                         {payment.status === "Pending" && (
//                           <div className="flex gap-2 self-end sm:self-center">
//                             <button 
//                               onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                               className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors shadow-sm"
//                             >
//                               Approve
//                             </button>
//                             <button 
//                               onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                               className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         )}
//                       </div>

//                       {/* Interactive Feedback / History Log Segment Area */}
//                       {payment.status === "Pending" ? (
//                         <div className="pt-2 border-t border-gray-200/60">
//                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//                             Verification Comments / Audit Trail Notes
//                           </label>
//                           <input 
//                             type="text"
//                             placeholder="Add reference codes or rejection reasons here..."
//                             value={paymentRemarks[payment.id] || ""}
//                             onChange={(e) => setPaymentRemarks(prev => ({ ...prev, [payment.id]: e.target.value }))}
//                             className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
//                           />
//                         </div>
//                       ) : (
//                         payment.remarks && (
//                           <div className="p-3 bg-white border border-gray-100 rounded-xl text-xs text-gray-600">
//                             <span className="font-bold text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Admin Feedback Note:</span>
//                             "{payment.remarks}"
//                           </div>
//                         )
//                       )}

//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl">
//                   <p className="text-sm text-gray-400 font-medium">Awaiting customer proof upload submission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 5. LOGISTICS SECTION (UNLOCKED ACCORDING TO SYSTEM READY POUR STATE) */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-opacity ${
//           order.status !== "Ready for Pouring" ? "opacity-40" : "opacity-100"
//         }`}>
//           <div className="flex items-center gap-4">
//             <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
//               <Truck className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
//               <p className="text-xs text-gray-400 italic">
//                 {order.status === "Ready for Pouring" ? "Ready for truck tracking deployment." : "Locked until site conditions or terms are verified."}
//               </p>
//             </div>
//           </div>
//           <span className={`text-[10px] font-bold border px-3 py-1 rounded-full uppercase ${
//             order.status === "Ready for Pouring" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300"
//           }`}>
//             {order.status === "Ready for Pouring" ? "Active" : "Locked"}
//           </span>
//         </section>
//       </main>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info, Eye, Download, X
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); // Controls default panel collapse
  
//   // Inspection Form States
//   const [inspectionResult, setInspectionResult] = useState("Approved");
//   const [inspectionRemarks, setInspectionRemarks] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rescheduleDate, setRescheduleDate] = useState("");

//   // Payment Feedback Remarks Map Indexed by paymentId
//   const [paymentRemarks, setPaymentRemarks] = useState<{ [key: number]: string }>({});

//   // Lightbox Preview State
//   const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
//   const [isDownloading, setIsDownloading] = useState<number | null>(null);

//   const fetchOrderData = async () => {
//     try {
//       const res = await api.get(`orders/${orderId}/`);
//       setOrder(res.data);
//       setRescheduleDate(res.data.proposed_schedule); 
      
//       // Smart Auto-Collapse Open Routing Steps Based on Realtime Status
//       if (res.data.status === "For Inspection") setOpenSection("inspection");
//       if (res.data.status === "For Payment Verification") setOpenSection("payment");
//     } catch (err) { 
//       console.error(err); 
//     }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//     const remarks = paymentRemarks[paymentId] || "";
    
//     // Safety Fallback Guard: Enforce reason input if rejecting
//     if (decision === 'reject' && !remarks.trim()) {
//       return Swal.fire({
//         title: 'REJECTION REASON REQUIRED',
//         text: "Please provide a brief comment explaining the reason for rejection to the customer.",
//         icon: 'warning',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     }

//     try {
//       const res = await api.post(`payments/${paymentId}/verify_payment/`, {
//         decision: decision,
//         remarks: remarks 
//       });
      
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success', 
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4', 
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
      
//       // Reset comments array state slot for this specific payment record
//       setPaymentRemarks(prev => ({ ...prev, [paymentId]: "" }));
//       fetchOrderData(); 
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Error executing payment verification workflow step.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     }
//   };

//   // Safe Browser-Native Downloader Method
//   const handleDownloadFile = async (fileUrl: string, fileName: string, paymentId: number) => {
//     setIsDownloading(paymentId);
//     try {
//       const response = await fetch(fileUrl, { method: 'GET', mode: 'cors' });
//       if (!response.ok) throw new Error('Network file access error.');
      
//       const blob = await response.blob();
//       const urlWindow = window.URL.createObjectURL(blob);
//       const linkElement = document.createElement('a');
//       linkElement.href = urlWindow;
//       linkElement.setAttribute('download', fileName);
//       document.body.appendChild(linkElement);
//       linkElement.click();
      
//       // Clean up the DOM memory references
//       document.body.removeChild(linkElement);
//       window.URL.revokeObjectURL(urlWindow);
//     } catch (error) {
//       console.error("Downloader execution failure:", error);
//       // Fallback fallback: open in an external window if stream breaks
//       window.open(fileUrl, '_blank');
//     } finally {
//       setIsDownloading(null);
//     }
//   };

//   useEffect(() => { 
//     if (orderId) fetchOrderData(); 
//   }, [orderId]);

//   const toggleSection = (section: string) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks) return Swal.fire({
//       title: 'INPUT REQUIRED',
//       text: "Please provide inspection remarks.",
//       icon: 'warning',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#06b6d4',
//       customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//     });

//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks,
//         new_date: rescheduleDate 
//       });
//       Swal.fire({
//         title: 'SYSTEM UPDATE',
//         text: res.data.message || 'Operation executed successfully.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#06b6d4',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//       fetchOrderData(); 
//       setOpenSection("payment"); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-slate-800 font-sans' }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400 tracking-wider">LOADING PROJECT ENGINE...</div>;

//   // Workflow Security Evaluators to control interactive section access
//   const isPendingQuoteOrReview = order.status === "Pending";
//   const isLockedForPaymentVerification = ["Pending", "Quotation Sent", "For Inspection"].includes(order.status);

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans relative">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
//               order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3 h-3" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase">Total Volume</p>
//              <p className="text-xl font-black text-gray-900">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION (COLLAPSIBLE) */}
//         <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <button 
//             onClick={() => toggleSection("quotation")}
//             className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.quotation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <Calculator className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 1: Pricing & Quotation</h3>
//                 <p className="text-xs text-gray-400">Handle pump rentals, discounts, and terms.</p>
//               </div>
//             </div>
//             {openSection === "quotation" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "quotation" && (
//             <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
//               <QuotationEditor order={order} onUpdate={fetchOrderData} />
//             </div>
//           )}
//         </section>

//         {/* 3. SITE INSPECTION SECTION (COLLAPSIBLE) */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
//           order.status === "For Inspection" ? "ring-2 ring-cyan-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("inspection")}
//             disabled={isPendingQuoteOrReview}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <ClipboardList className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 2: Site Inspection</h3>
//                 <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
//               </div>
//             </div>
//             {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "inspection" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold"
//                     >
//                       <option value="Approved">Approved</option>
//                       <option value="Rejected">Rejected</option>
//                       <option value="Re-inspection">Re-inspection Required</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
//                     <textarea 
//                       value={inspectionRemarks}
//                       onChange={(e) => setInspectionRemarks(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px]"
//                       placeholder="Enter site findings here..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
//                       Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
//                     />
//                     <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase italic">
//                       * Change this only if the site isn't ready for the original date.
//                     </p>
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-[#111827] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Inspection"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
//                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Workflow Alert</h4>
//                    <div className="flex gap-3">
//                       <Info className="w-5 h-5 text-cyan-500 shrink-0" />
//                       <p className="text-xs text-gray-600 leading-relaxed">
//                         Approving this inspection will automatically transition the order to 
//                         <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
//                       </p>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. PAYMENT VERIFICATION SECTION */}
//         <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${
//           order.status === "For Payment Verification" ? "ring-2 ring-orange-500 ring-offset-2" : ""
//         }`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={isLockedForPaymentVerification}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight">Step 3: Payment Verification</h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && (
//             <div className="p-8 pt-0 border-t border-gray-50 bg-white">
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-6">
//                   {order.payments.map((payment: any) => {
//                     // --- STRATEGIC URL ROUTING ADJUSTMENT ---
//                     const apiBase = api.defaults.baseURL || "http://127.0.0.1:8000/api/";
//                     const djangoHost = apiBase.replace(/\/api\/?$/, ""); 
//                     let cleanFilePath = payment.proof_file || "";
//                     let absoluteProofUrl = cleanFilePath;

//                     if (!cleanFilePath.startsWith("http")) {
//                       if (!cleanFilePath.startsWith("/")) {
//                         cleanFilePath = "/" + cleanFilePath;
//                       }
//                       if (cleanFilePath.startsWith("/media/")) {
//                         absoluteProofUrl = `${djangoHost}${cleanFilePath}`;
//                       } else {
//                         absoluteProofUrl = `${djangoHost}/media${cleanFilePath}`;
//                       }
//                     }

//                     return (
//                       <div key={payment.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                        
//                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                           <div className="flex items-center gap-4">
                            
//                             {/* Improved Clickable Image Thumbnail Container */}
//                             <div className="w-20 h-20 bg-gray-200 rounded-2xl overflow-hidden border border-gray-300 shadow-inner shrink-0 relative group">
//                               <img 
//                                 src={absoluteProofUrl} 
//                                 alt="Proof of Payment Image" 
//                                 className="w-full h-full object-cover transition-transform group-hover:scale-110" 
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).src = "https://placehold.co/150?text=Receipt+Missing";
//                                 }}
//                               />
//                               <div 
//                                 onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                 className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
//                               >
//                                 <Eye className="w-5 h-5 text-white" />
//                               </div>
//                             </div>

//                             <div>
//                               <p className="text-xs font-bold text-gray-900">Transaction Receipt Document</p>
//                               <p className="text-[10px] text-gray-500 uppercase font-black tracking-wide mb-2">
//                                 Status: <span className={payment.status === 'Approved' ? 'text-green-600' : payment.status === 'Rejected' ? 'text-red-500' : 'text-orange-600'}>{payment.status}</span>
//                               </p>
                              
//                               <div className="flex gap-2">
//                                 <button 
//                                   onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                   className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-[11px] font-bold text-gray-700 shadow-sm transition-colors"
//                                 >
//                                   <Eye className="w-3.5 h-3.5 text-cyan-600" /> Preview Receipt
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDownloadFile(absoluteProofUrl, `receipt_order_${order.id}_payment_${payment.id}.jpg`, payment.id)}
//                                   disabled={isDownloading === payment.id}
//                                   className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-[11px] font-bold text-gray-700 shadow-sm transition-colors disabled:opacity-40"
//                                 >
//                                   <Download className="w-3.5 h-3.5 text-gray-500" /> 
//                                   {isDownloading === payment.id ? "Downloading..." : "Download"}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>

//                           {payment.status === "Pending" && (
//                             <div className="flex gap-2 self-end sm:self-center">
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                                 className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors shadow-sm"
//                               >
//                                 Approve
//                               </button>
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                                 className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-colors"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {payment.status === "Pending" ? (
//                           <div className="pt-2 border-t border-gray-200/60">
//                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
//                               Verification Comments / Audit Trail Notes
//                             </label>
//                             <input 
//                               type="text"
//                               placeholder="Add reference codes or rejection reasons here..."
//                               value={paymentRemarks[payment.id] || ""}
//                               onChange={(e) => setPaymentRemarks(prev => ({ ...prev, [payment.id]: e.target.value }))}
//                               className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
//                             />
//                           </div>
//                         ) : (
//                           payment.remarks && (
//                             <div className="p-3 bg-white border border-gray-100 rounded-xl text-xs text-gray-600">
//                               <span className="font-bold text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Admin Feedback Note:</span>
//                               "{payment.remarks}"
//                             </div>
//                           )
//                         )}

//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl">
//                   <p className="text-sm text-gray-400 font-medium">Awaiting customer proof upload submission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 5. LOGISTICS SECTION */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between transition-opacity ${
//           order.status !== "Ready for Pouring" ? "opacity-40" : "opacity-100"
//         }`}>
//           <div className="flex items-center gap-4">
//             <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
//               <Truck className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
//               <p className="text-xs text-gray-400 italic">
//                 {order.status === "Ready for Pouring" ? "Ready for truck tracking deployment." : "Locked until site conditions or terms are verified."}
//               </p>
//             </div>
//           </div>
//           <span className={`text-[10px] font-bold border px-3 py-1 rounded-full uppercase ${
//             order.status === "Ready for Pouring" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300"
//           }`}>
//             {order.status === "Ready for Pouring" ? "Active" : "Locked"}
//           </span>
//         </section>
//       </main>

//       {/* --- IN-APP LIGHTBOX IMAGE PREVIEW MODAL --- */}
//       {previewImageUrl && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200">
//           <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
//             <button 
//               onClick={() => setPreviewImageUrl(null)}
//               className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors outline-none"
//               title="Close Preview"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <div className="w-full bg-slate-900 rounded-3xl overflow-hidden p-2 border border-slate-700/50 shadow-2xl flex items-center justify-center">
//               <img 
//                 src={previewImageUrl} 
//                 alt="Receipt Fullscreen Preview" 
//                 className="max-w-full max-h-[75vh] object-contain rounded-2xl"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = "https://placehold.co/600?text=File+Not+Found+On+Server";
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";
import { useEffect, useState, use } from 'react'; 
import api from '@/src/lib/api';
import { 
  Calculator, CheckCircle, Truck, ClipboardList, 
  MapPin, AlertCircle, ChevronDown, ChevronUp, Info, Eye, Download, X,
  FileText, ShieldCheck, Ban, Calendar, Layers
} from 'lucide-react';
import QuotationEditor from './QuotationEditor'; 
import Swal from 'sweetalert2';

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string | null>("quotation"); 
  
  // Inspection Form States
  const [inspectionResult, setInspectionResult] = useState("Approved");
  const [inspectionRemarks, setInspectionRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Payment Feedback Remarks Map Indexed by paymentId
  const [paymentRemarks, setPaymentRemarks] = useState<{ [key: number]: string }>({});

  // Lightbox Preview State
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const fetchOrderData = async () => {
    try {
      const res = await api.get(`orders/${orderId}/`);
      setOrder(res.data);
      setRescheduleDate(res.data.proposed_schedule); 
      
      if (res.data.status === "For Inspection") setOpenSection("inspection");
      if (res.data.status === "For Payment Verification") setOpenSection("payment");
    } catch (err) { 
      console.error(err); 
    }
  };

  const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
    const remarks = paymentRemarks[paymentId] || "";
    
    if (decision === 'reject' && !remarks.trim()) {
      return Swal.fire({
        title: 'REJECTION REASON REQUIRED',
        text: "Please provide a brief comment explaining the reason for rejection to the customer.",
        icon: 'warning',
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#0284c7',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
    }

    try {
      const res = await api.post(`payments/${paymentId}/verify_payment/`, {
        decision: decision,
        remarks: remarks 
      });
      
      Swal.fire({
        title: 'SYSTEM UPDATE',
        text: res.data.message || 'Operation executed successfully.',
        icon: 'success', 
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#0284c7', 
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
      
      setPaymentRemarks(prev => ({ ...prev, [paymentId]: "" }));
      fetchOrderData(); 
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'SYSTEM ERROR',
        text: "Error executing payment verification workflow step.",
        icon: 'error',
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
    }
  };

  const handleDownloadFile = async (fileUrl: string, fileName: string, paymentId: number) => {
    setIsDownloading(paymentId);
    try {
      const response = await fetch(fileUrl, { method: 'GET', mode: 'cors' });
      if (!response.ok) throw new Error('Network file access error.');
      
      const blob = await response.blob();
      const urlWindow = window.URL.createObjectURL(blob);
      const linkElement = document.createElement('a');
      linkElement.href = urlWindow;
      linkElement.setAttribute('download', fileName);
      document.body.appendChild(linkElement);
      linkElement.click();
      
      document.body.removeChild(linkElement);
      window.URL.revokeObjectURL(urlWindow);
    } catch (error) {
      console.error("Downloader execution failure:", error);
      window.open(fileUrl, '_blank');
    } finally {
      setIsDownloading(null);
    }
  };

  useEffect(() => { 
    if (orderId) fetchOrderData(); 
  }, [orderId]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubmitInspection = async () => {
    if (!inspectionRemarks) return Swal.fire({
      title: 'INPUT REQUIRED',
      text: "Please provide inspection remarks.",
      icon: 'warning',
      background: '#ffffff',
      color: '#1f2937',
      confirmButtonColor: '#0284c7',
      customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
    });

    setIsSubmitting(true);
    try {
      const res = await api.post(`orders/${orderId}/submit_inspection/`, {
        result: inspectionResult,
        remarks: inspectionRemarks,
        new_date: rescheduleDate 
      });
      Swal.fire({
        title: 'SYSTEM UPDATE',
        text: res.data.message || 'Operation executed successfully.',
        icon: 'success',
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#0284c7',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
      fetchOrderData(); 
      setOpenSection("payment"); 
    } catch (err: any) {
      Swal.fire({
        title: 'SYSTEM ERROR',
        text: err.response?.data?.error || "Error saving inspection.",
        icon: 'error',
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#ef4444',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400 tracking-wider min-h-screen bg-[#f3f4f6] flex items-center justify-center">LOADING PROJECT ENGINE...</div>;

  const isPendingQuoteOrReview = order.status === "Pending";
  const isLockedForPaymentVerification = ["Pending", "Quotation Sent", "For Inspection"].includes(order.status);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased relative">
      
      {/* 1. COMPACT HEADER */}
      <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
              order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-cyan-100 text-cyan-700'
            }`}>
              {order.status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">ID: #{order.id}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {order.project_location}
          </p>
        </div>
        
        <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">
               {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
             </p>
           </div>
        </div>
      </header>

      <main className="space-y-4">
        
        {/* 2. QUOTATION SECTION */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => toggleSection("quotation")}
            className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${order.quotation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <Calculator className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-tight">Step 1: Pricing & Quotation</h3>
                <p className="text-xs text-gray-400">Handle pump rentals, discounts, and terms.</p>
              </div>
            </div>
            {openSection === "quotation" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "quotation" && (
            <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
              <QuotationEditor order={order} onUpdate={fetchOrderData} />
            </div>
          )}
        </section>

        {/* 3. SITE INSPECTION SECTION */}
        <section className={`bg-white rounded-3xl shadow-sm border transition-all ${
          order.status === "For Inspection" ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-gray-100"
        } overflow-hidden`}>
          <button 
            onClick={() => toggleSection("inspection")}
            disabled={isPendingQuoteOrReview}
            className={`w-full p-6 flex justify-between items-center transition-colors ${
              isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-tight">Step 2: Site Inspection</h3>
                <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
              </div>
            </div>
            {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "inspection" && (
            <div className="p-6 md:p-8 pt-0 border-t border-gray-100 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
                    <select 
                      value={inspectionResult}
                      onChange={(e) => setInspectionResult(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Re-inspection">Re-inspection Required</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
                    <textarea 
                      value={inspectionRemarks}
                      onChange={(e) => setInspectionRemarks(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px] text-gray-800 placeholder-gray-400"
                      placeholder="Enter site findings here..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Confirmed Pouring Date
                    </label>
                    <input 
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    />
                    <p className="text-[10px] text-orange-600 font-bold mt-1.5 uppercase tracking-wide italic">
                      * Change this only if the site isn't ready for the original date.
                    </p>
                  </div>
                  <button 
                    onClick={handleSubmitInspection}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Submit Inspection"}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col justify-between">
                   <div>
                     <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-1">
                       <Layers className="w-3.5 h-3.5 text-gray-400" /> Workflow Alert
                     </h4>
                     <div className="flex gap-3">
                        <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Approving this inspection will automatically transition the order to 
                          <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
                        </p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. UPGRADED LIGHT MODE PAYMENT VERIFICATION SECTION */}
        <section className={`bg-white rounded-3xl shadow-sm border transition-all duration-200 ${
          order.status === "For Payment Verification" ? "border-orange-500 ring-2 ring-orange-500/10" : "border-gray-100"
        } overflow-hidden`}>
          <button 
            onClick={() => toggleSection("payment")}
            disabled={isLockedForPaymentVerification}
            className={`w-full p-6 flex justify-between items-center transition-colors ${
              isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${
                order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                  Step 3: Payment Verification
                  {order.status === "For Payment Verification" && (
                    <span className="bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                      Pending Action
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
              </div>
            </div>
            {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "payment" && (
            <div className="p-6 md:p-8 pt-0 border-t border-gray-50 bg-white">
              {order.payments?.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {order.payments.map((payment: any) => {
                    const apiBase = api.defaults.baseURL || "http://127.0.0.1:8000/api/";
                    const djangoHost = apiBase.replace(/\/api\/?$/, ""); 
                    let cleanFilePath = payment.proof_file || "";
                    let absoluteProofUrl = cleanFilePath;

                    if (!cleanFilePath.startsWith("http")) {
                      if (!cleanFilePath.startsWith("/")) cleanFilePath = "/" + cleanFilePath;
                      absoluteProofUrl = cleanFilePath.startsWith("/media/") 
                        ? `${djangoHost}${cleanFilePath}` 
                        : `${djangoHost}/media${cleanFilePath}`;
                    }

                    return (
                      <div key={payment.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 hover:border-gray-300 transition-all">
                        
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Left Details Block */}
                          <div className="flex items-center gap-4 w-full lg:w-auto">
                            {/* Improved Image Thumbnail */}
                            <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative group shrink-0 shadow-inner">
                              <img 
                                src={absoluteProofUrl} 
                                alt="Proof of Payment" 
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://placehold.co/150?text=Receipt+Missing";
                                }}
                              />
                              <div 
                                onClick={() => setPreviewImageUrl(absoluteProofUrl)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                              >
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5 text-gray-400" /> Transaction Receipt Document
                                </p>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
                                  payment.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                  payment.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {payment.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Record Reference ID: #{payment.id}</p>
                              
                              {/* Meta Actions Inline */}
                              <div className="flex gap-2 pt-0.5">
                                <button 
                                  onClick={() => setPreviewImageUrl(absoluteProofUrl)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors"
                                >
                                  <Eye className="w-3 h-3 text-cyan-600" /> View Large
                                </button>
                                <button 
                                  onClick={() => handleDownloadFile(absoluteProofUrl, `receipt_order_${order.id}_payment_${payment.id}.jpg`, payment.id)}
                                  disabled={isDownloading === payment.id}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors disabled:opacity-40"
                                >
                                  <Download className="w-3 h-3 text-gray-500" /> 
                                  {isDownloading === payment.id ? "Downloading..." : "Download"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Right Action Trigger Buttons */}
                          {payment.status === "Pending" && (
                            <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-200/60">
                              <button 
                                onClick={() => handleVerifyPayment(payment.id, 'reject')}
                                className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5" /> Reject
                              </button>
                              <button 
                                onClick={() => handleVerifyPayment(payment.id, 'approve')}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" /> Approve Payment
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Text Field / Previous Feedback Logs */}
                        {payment.status === "Pending" ? (
                          <div className="pt-2 border-t border-gray-200/60">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                              Verification Comments / Audit Trail Notes
                            </label>
                            <input 
                              type="text"
                              placeholder="Type transaction references, clearing codes, or explanation notes here..."
                              value={paymentRemarks[payment.id] || ""}
                              onChange={(e) => setPaymentRemarks(prev => ({ ...prev, [payment.id]: e.target.value }))}
                              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                            />
                          </div>
                        ) : (
                          payment.remarks && (
                            <div className="p-3 bg-white border border-gray-100 rounded-xl text-xs text-gray-600">
                              <span className="font-bold text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Admin Verification Note:</span>
                              "{payment.remarks}"
                            </div>
                          )
                        )}

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl border-gray-200">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Awaiting customer proof upload submission...</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 5. LOGISTICS SECTION */}
        <section className={`bg-white p-6 rounded-3xl shadow-sm border flex items-center justify-between transition-opacity ${
          order.status !== "Ready for Pouring" ? "opacity-40 border-gray-100" : "opacity-100 border-green-200"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
              <p className="text-xs text-gray-400 italic">
                {order.status === "Ready for Pouring" ? "Ready for truck tracking deployment." : "Locked until site conditions or terms are verified."}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold border px-3 py-1 rounded-md uppercase tracking-wider ${
            order.status === "Ready for Pouring" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300 bg-gray-50"
          }`}>
            {order.status === "Ready for Pouring" ? "Active" : "Locked"}
          </span>
        </section>
      </main>

      {/* --- LIGHTBOX MODAL --- */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-200">
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
            <button 
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors outline-none"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full bg-gray-900 rounded-3xl overflow-hidden p-2 border border-gray-800 shadow-2xl flex items-center justify-center">
              <img 
                src={previewImageUrl} 
                alt="Receipt Fullscreen Preview" 
                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600?text=File+Not+Found+On+Server";
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}