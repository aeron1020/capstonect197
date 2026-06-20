
// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info, Eye, Download, X,
//   FileText, ShieldCheck, Ban, Calendar, Layers
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); 
  
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
      
//       if (res.data.status === "For Inspection") setOpenSection("inspection");
//       if (res.data.status === "For Payment Verification") setOpenSection("payment");
//     } catch (err) { 
//       console.error(err); 
//     }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//     const remarks = paymentRemarks[paymentId] || "";
    
//     if (decision === 'reject' && !remarks.trim()) {
//       return Swal.fire({
//         title: 'REJECTION REASON REQUIRED',
//         text: "Please provide a brief comment explaining the reason for rejection to the customer.",
//         icon: 'warning',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
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
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7', 
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
      
//       setPaymentRemarks(prev => ({ ...prev, [paymentId]: "" }));
//       fetchOrderData(); 
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Error executing payment verification workflow step.",
//         icon: 'error',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//     }
//   };

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
      
//       document.body.removeChild(linkElement);
//       window.URL.revokeObjectURL(urlWindow);
//     } catch (error) {
//       console.error("Downloader execution failure:", error);
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
//       background: '#ffffff',
//       color: '#1f2937',
//       confirmButtonColor: '#0284c7',
//       customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
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
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//       fetchOrderData(); 
//       setOpenSection("payment"); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400 tracking-wider min-h-screen bg-[#f3f4f6] flex items-center justify-center">LOADING PROJECT ENGINE...</div>;

//   const isPendingQuoteOrReview = order.status === "Pending";
//   const isLockedForPaymentVerification = ["Pending", "Quotation Sent", "For Inspection"].includes(order.status);

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased relative">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
//               order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') 
//                 ? 'bg-green-100 text-green-700' 
//                 : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
//              <p className="text-xl font-black text-gray-900 mt-0.5">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION */}
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

//         {/* 3. SITE INSPECTION SECTION */}
//         <section className={`bg-white rounded-3xl shadow-sm border transition-all ${
//           order.status === "For Inspection" ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-gray-100"
//         } overflow-hidden`}>
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
//             <div className="p-6 md:p-8 pt-0 border-t border-gray-100 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
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
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px] text-gray-800 placeholder-gray-400"
//                       placeholder="Enter site findings here..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
//                       <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
//                     />
//                     <p className="text-[10px] text-orange-600 font-bold mt-1.5 uppercase tracking-wide italic">
//                       * Change this only if the site isn't ready for the original date.
//                     </p>
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Inspection"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col justify-between">
//                    <div>
//                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-1">
//                        <Layers className="w-3.5 h-3.5 text-gray-400" /> Workflow Alert
//                      </h4>
//                      <div className="flex gap-3">
//                         <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
//                         <p className="text-xs text-gray-600 leading-relaxed">
//                           Approving this inspection will automatically transition the order to 
//                           <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
//                         </p>
//                      </div>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. UPGRADED LIGHT MODE PAYMENT VERIFICATION SECTION */}
//         <section className={`bg-white rounded-3xl shadow-sm border transition-all duration-200 ${
//           order.status === "For Payment Verification" ? "border-orange-500 ring-2 ring-orange-500/10" : "border-gray-100"
//         } overflow-hidden`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={isLockedForPaymentVerification}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${
//                 order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
//               }`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
//                   Step 3: Payment Verification
//                   {order.status === "For Payment Verification" && (
//                     <span className="bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
//                       Pending Action
//                     </span>
//                   )}
//                 </h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && (
//             <div className="p-6 md:p-8 pt-0 border-t border-gray-50 bg-white">
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-4">
//                   {order.payments.map((payment: any) => {
//                     const apiBase = api.defaults.baseURL || "http://127.0.0.1:8000/api/";
//                     const djangoHost = apiBase.replace(/\/api\/?$/, ""); 
//                     let cleanFilePath = payment.proof_file || "";
//                     let absoluteProofUrl = cleanFilePath;

//                     if (!cleanFilePath.startsWith("http")) {
//                       if (!cleanFilePath.startsWith("/")) cleanFilePath = "/" + cleanFilePath;
//                       absoluteProofUrl = cleanFilePath.startsWith("/media/") 
//                         ? `${djangoHost}${cleanFilePath}` 
//                         : `${djangoHost}/media${cleanFilePath}`;
//                     }

//                     return (
//                       <div key={payment.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 hover:border-gray-300 transition-all">
                        
//                         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
//                           {/* Left Details Block */}
//                           <div className="flex items-center gap-4 w-full lg:w-auto">
//                             {/* Improved Image Thumbnail */}
//                             <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative group shrink-0 shadow-inner">
//                               <img 
//                                 src={absoluteProofUrl} 
//                                 alt="Proof of Payment" 
//                                 className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).src = "https://placehold.co/150?text=Receipt+Missing";
//                                 }}
//                               />
//                               <div 
//                                 onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                 className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
//                               >
//                                 <Eye className="w-4 h-4 text-white" />
//                               </div>
//                             </div>

//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 flex-wrap">
//                                 <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
//                                   <FileText className="w-3.5 h-3.5 text-gray-400" /> Transaction Receipt Document
//                                 </p>
//                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
//                                   payment.status === 'Approved' ? 'bg-green-100 text-green-700' : 
//                                   payment.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
//                                   'bg-amber-100 text-amber-700'
//                                 }`}>
//                                   {payment.status}
//                                 </span>
//                               </div>
//                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Record Reference ID: #{payment.id}</p>
                              
//                               {/* Meta Actions Inline */}
//                               <div className="flex gap-2 pt-0.5">
//                                 <button 
//                                   onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                   className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors"
//                                 >
//                                   <Eye className="w-3 h-3 text-cyan-600" /> View Large
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDownloadFile(absoluteProofUrl, `receipt_order_${order.id}_payment_${payment.id}.jpg`, payment.id)}
//                                   disabled={isDownloading === payment.id}
//                                   className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors disabled:opacity-40"
//                                 >
//                                   <Download className="w-3 h-3 text-gray-500" /> 
//                                   {isDownloading === payment.id ? "Downloading..." : "Download"}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Right Action Trigger Buttons */}
//                           {payment.status === "Pending" && (
//                             <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-200/60">
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                                 className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
//                               >
//                                 <Ban className="w-3.5 h-3.5" /> Reject
//                               </button>
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                                 className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors"
//                               >
//                                 <ShieldCheck className="w-3.5 h-3.5" /> Approve Payment
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {/* Text Field / Previous Feedback Logs */}
//                         {payment.status === "Pending" ? (
//                           <div className="pt-2 border-t border-gray-200/60">
//                             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
//                               Verification Comments / Audit Trail Notes
//                             </label>
//                             <input 
//                               type="text"
//                               placeholder="Type transaction references, clearing codes, or explanation notes here..."
//                               value={paymentRemarks[payment.id] || ""}
//                               onChange={(e) => setPaymentRemarks(prev => ({ ...prev, [payment.id]: e.target.value }))}
//                               className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
//                             />
//                           </div>
//                         ) : (
//                           payment.remarks && (
//                             <div className="p-3 bg-white border border-gray-100 rounded-xl text-xs text-gray-600">
//                               <span className="font-bold text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Admin Verification Note:</span>
//                               "{payment.remarks}"
//                             </div>
//                           )
//                         )}

//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl border-gray-200">
//                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Awaiting customer proof upload submission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 5. LOGISTICS SECTION */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border flex items-center justify-between transition-opacity ${
//           order.status !== "Ready for Pouring" ? "opacity-40 border-gray-100" : "opacity-100 border-green-200"
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
//           <span className={`text-[10px] font-bold border px-3 py-1 rounded-md uppercase tracking-wider ${
//             order.status === "Ready for Pouring" ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300 bg-gray-50"
//           }`}>
//             {order.status === "Ready for Pouring" ? "Active" : "Locked"}
//           </span>
//         </section>
//       </main>

//       {/* --- LIGHTBOX MODAL --- */}
//       {previewImageUrl && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-200">
//           <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
//             <button 
//               onClick={() => setPreviewImageUrl(null)}
//               className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors outline-none"
//               title="Close Preview"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <div className="w-full bg-gray-900 rounded-3xl overflow-hidden p-2 border border-gray-800 shadow-2xl flex items-center justify-center">
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

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { 
//   Calculator, CheckCircle, Truck, ClipboardList, 
//   MapPin, AlertCircle, ChevronDown, ChevronUp, Info, Eye, Download, X,
//   FileText, ShieldCheck, Ban, Calendar, Layers
// } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 
// import Swal from 'sweetalert2';

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [openSection, setOpenSection] = useState<string | null>("quotation"); 
  
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
      
//       // Auto-focus logic based on state machine position
//       if (res.data.status === "For Inspection") {
//         setOpenSection("inspection");
//       } else if (res.data.status === "For Payment Verification") {
//         setOpenSection("payment");
//       }
//     } catch (err) { 
//       console.error(err); 
//     }
//   };

//   const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
//     const remarks = paymentRemarks[paymentId] || "";
    
//     if (decision === 'reject' && !remarks.trim()) {
//       return Swal.fire({
//         title: 'REJECTION REASON REQUIRED',
//         text: "Please provide a brief comment explaining the reason for rejection to the customer.",
//         icon: 'warning',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
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
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7', 
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
      
//       setPaymentRemarks(prev => ({ ...prev, [paymentId]: "" }));
//       fetchOrderData(); 
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Error executing payment verification workflow step.",
//         icon: 'error',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//     }
//   };

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
      
//       document.body.removeChild(linkElement);
//       window.URL.revokeObjectURL(urlWindow);
//     } catch (error) {
//       console.error("Downloader execution failure:", error);
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

//   // 🛑 FIX: CONDITIONAL PIPELINE TERMINATION IF SITE IS REJECTED
//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks.trim()) {
//       return Swal.fire({
//         title: 'INPUT REQUIRED',
//         text: "Please provide detailed inspection remarks explaining the technical assessment.",
//         icon: 'warning',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#0284c7',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//     }

//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks,
//         new_date: rescheduleDate 
//       });

//       if (inspectionResult === "Rejected") {
//         // Stop the panel workflow transition right here. Keep section open or clear panel focus.
//         Swal.fire({
//           title: 'ORDER PIPELINE HALTED',
//           text: "The site was marked as REJECTED. The pipeline has been frozen to prevent down-stream payments or plant dispatch slots from being created.",
//           icon: 'error',
//           background: '#ffffff',
//           color: '#1f2937',
//           confirmButtonColor: '#dc2626',
//           customClass: { popup: 'rounded-3xl border border-red-200 font-sans' }
//         });
        
//         setOpenSection("inspection"); // Force visibility here so they can track details
//       } else if (inspectionResult === "Re-inspection") {
//         Swal.fire({
//           title: 'RE-INSPECTION LOGGED',
//           text: "Order status modified to require an operational re-visit. Subsequent operational steps remain locked.",
//           icon: 'info',
//           background: '#ffffff',
//           color: '#1f2937',
//           confirmButtonColor: '#f59e0b',
//           customClass: { popup: 'rounded-3xl border border-amber-200 font-sans' }
//         });
//         setOpenSection("inspection");
//       } else {
//         // Standard operational pipeline continuation path (Approved)
//         Swal.fire({
//           title: 'INSPECTION PASSED',
//           text: res.data.message || 'Site approved successfully. Transitioning to payment workflows.',
//           icon: 'success',
//           background: '#ffffff',
//           color: '#1f2937',
//           confirmButtonColor: '#0284c7',
//           customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//         });
//         setOpenSection("payment"); 
//       }
      
//       fetchOrderData(); 
//     } catch (err: any) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: err.response?.data?.error || "Error saving inspection.",
//         icon: 'error',
//         background: '#ffffff',
//         color: '#1f2937',
//         confirmButtonColor: '#ef4444',
//         customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400 tracking-wider min-h-screen bg-[#f3f4f6] flex items-center justify-center">LOADING PROJECT ENGINE...</div>;

//   // 🛑 CONFIGURE LOCK GUARDS FOR THE REST OF THE ACCORDION CANVAS 
//   const isPendingQuoteOrReview = order.status === "Pending";
  
//   // If order status is explicitly "Rejected", "Rejected by Inspector", or "Re-inspection Required",
//   // it means it's frozen at the site inspection tier. Hard lock everything downstream.
//   const isRejectedOrHalted = ["Rejected", "Site Rejected", "Re-inspection Required"].includes(order.status);
  
//   const isLockedForPaymentVerification = isPendingQuoteOrReview || isRejectedOrHalted || ["Quotation Sent", "For Inspection"].includes(order.status);
//   const isReadyForLogistics = order.status === "Ready for Pouring" && !isRejectedOrHalted;

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased relative">
      
//       {/* 1. COMPACT HEADER */}
//       <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
//               isRejectedOrHalted 
//                 ? 'bg-red-100 text-red-700 border border-red-200'
//                 : order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') 
//                 ? 'bg-green-100 text-green-700' 
//                 : 'bg-cyan-100 text-cyan-700'
//             }`}>
//               {order.status}
//             </span>
//             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">ID: #{order.id}</span>
//           </div>
//           <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
//           <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
//             <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {order.project_location}
//           </p>
//         </div>
        
//         <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
//            <div className="text-right">
//              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
//              <p className="text-xl font-black text-gray-900 mt-0.5">
//                {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
//              </p>
//            </div>
//         </div>
//       </header>

//       <main className="space-y-4">
        
//         {/* 2. QUOTATION SECTION */}
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

//         {/* 3. SITE INSPECTION SECTION */}
//         <section className={`bg-white rounded-3xl shadow-sm border transition-all ${
//           order.status === "For Inspection" ? "border-cyan-500 ring-2 ring-cyan-500/20" : isRejectedOrHalted ? "border-red-300 bg-red-50/10" : "border-gray-100"
//         } overflow-hidden`}>
//           <button 
//             onClick={() => toggleSection("inspection")}
//             disabled={isPendingQuoteOrReview}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${isRejectedOrHalted ? 'bg-red-100 text-red-600' : order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
//                 <ClipboardList className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
//                   Step 2: Site Inspection
//                   {isRejectedOrHalted && (
//                     <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
//                       Halted / Failed
//                     </span>
//                   )}
//                 </h3>
//                 <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
//               </div>
//             </div>
//             {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "inspection" && (
//             <div className="p-6 md:p-8 pt-0 border-t border-gray-100 bg-white">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
//                     <select 
//                       value={inspectionResult}
//                       onChange={(e) => setInspectionResult(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
//                     >
//                       <option value="Approved">Approved (Pass to Next Stage)</option>
//                       <option value="Rejected">Rejected (Halt & Freeze Order)</option>
//                       <option value="Re-inspection">Re-inspection Required</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
//                     <textarea 
//                       value={inspectionRemarks}
//                       onChange={(e) => setInspectionRemarks(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px] text-gray-800 placeholder-gray-400"
//                       placeholder="Specify reasons if rejected (e.g., Narrow roads, weak electrical overhead clearance, unstable soil)..."
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-1">
//                       <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Confirmed Pouring Date
//                     </label>
//                     <input 
//                       type="date"
//                       value={rescheduleDate}
//                       onChange={(e) => setRescheduleDate(e.target.value)}
//                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
//                     />
//                   </div>
//                   <button 
//                     onClick={handleSubmitInspection}
//                     disabled={isSubmitting}
//                     className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
//                   >
//                     {isSubmitting ? "Processing..." : "Submit Verification State"}
//                   </button>
//                 </div>
                
//                 <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col justify-between">
//                    <div>
//                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-1">
//                        <Layers className="w-3.5 h-3.5 text-gray-400" /> Workflow Engine Matrix
//                      </h4>
//                      <div className="flex gap-3">
//                         <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
//                         <div className="text-xs text-gray-600 leading-relaxed space-y-2">
//                           <p>
//                             ● <span className="font-bold text-green-700">Approved:</span> Auto-promotes state to payment review or engineering queue.
//                           </p>
//                           <p>
//                             ● <span className="font-bold text-red-600">Rejected:</span> Triggers pipeline break. Disables downstream modules until technical resolution.
//                           </p>
//                         </div>
//                      </div>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* 4. UPGRADED LIGHT MODE PAYMENT VERIFICATION SECTION */}
//         <section className={`bg-white rounded-3xl shadow-sm border transition-all duration-200 ${
//           order.status === "For Payment Verification" ? "border-orange-500 ring-2 ring-orange-500/10" : "border-gray-100"
//         } ${isRejectedOrHalted ? "opacity-40" : "opacity-100"} overflow-hidden`}>
//           <button 
//             onClick={() => toggleSection("payment")}
//             disabled={isLockedForPaymentVerification}
//             className={`w-full p-6 flex justify-between items-center transition-colors ${
//               isLockedForPaymentVerification ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
//             }`}
//           >
//             <div className="flex items-center gap-4">
//               <div className={`p-3 rounded-2xl ${
//                 order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
//               }`}>
//                 <AlertCircle className="w-5 h-5" />
//               </div>
//               <div className="text-left">
//                 <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
//                   Step 3: Payment Verification
//                   {order.status === "For Payment Verification" && !isRejectedOrHalted && (
//                     <span className="bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
//                       Pending Action
//                     </span>
//                   )}
//                   {isRejectedOrHalted && (
//                     <span className="bg-red-100 text-red-600 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
//                       Locked by Site Rejection
//                     </span>
//                   )}
//                 </h3>
//                 <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
//               </div>
//             </div>
//             {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
//           </button>

//           {openSection === "payment" && !isRejectedOrHalted && (
//             <div className="p-6 md:p-8 pt-0 border-t border-gray-50 bg-white">
//               {order.payments?.length > 0 ? (
//                 <div className="mt-6 space-y-4">
//                   {order.payments.map((payment: any) => {
//                     const apiBase = api.defaults.baseURL || "http://127.0.0.1:8000/api/";
//                     const djangoHost = apiBase.replace(/\/api\/?$/, ""); 
//                     let cleanFilePath = payment.proof_file || "";
//                     let absoluteProofUrl = cleanFilePath;

//                     if (!cleanFilePath.startsWith("http")) {
//                       if (!cleanFilePath.startsWith("/")) cleanFilePath = "/" + cleanFilePath;
//                       absoluteProofUrl = cleanFilePath.startsWith("/media/") 
//                         ? `${djangoHost}${cleanFilePath}` 
//                         : `${djangoHost}/media${cleanFilePath}`;
//                     }

//                     return (
//                       <div key={payment.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4 hover:border-gray-300 transition-all">
//                         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                           <div className="flex items-center gap-4 w-full lg:w-auto">
//                             <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative group shrink-0 shadow-inner">
//                               <img 
//                                 src={absoluteProofUrl} 
//                                 alt="Proof of Payment" 
//                                 className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).src = "https://placehold.co/150?text=Receipt+Missing";
//                                 }}
//                               />
//                               <div 
//                                 onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                 className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
//                               >
//                                 <Eye className="w-4 h-4 text-white" />
//                               </div>
//                             </div>

//                             <div className="space-y-1">
//                               <div className="flex items-center gap-2 flex-wrap">
//                                 <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
//                                   <FileText className="w-3.5 h-3.5 text-gray-400" /> Transaction Receipt Document
//                                 </p>
//                                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
//                                   payment.status === 'Approved' ? 'bg-green-100 text-green-700' : 
//                                   payment.status === 'Rejected' ? 'bg-red-100 text-red-600' : 
//                                   'bg-amber-100 text-amber-700'
//                                 }`}>
//                                   {payment.status}
//                                 </span>
//                               </div>
//                               <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Record Reference ID: #{payment.id}</p>
                              
//                               <div className="flex gap-2 pt-0.5">
//                                 <button 
//                                   onClick={() => setPreviewImageUrl(absoluteProofUrl)}
//                                   className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors"
//                                 >
//                                   <Eye className="w-3 h-3 text-cyan-600" /> View Large
//                                 </button>
//                                 <button 
//                                   onClick={() => handleDownloadFile(absoluteProofUrl, `receipt_order_${order.id}_payment_${payment.id}.jpg`, payment.id)}
//                                   disabled={isDownloading === payment.id}
//                                   className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-[10px] font-bold text-gray-700 shadow-xs transition-colors disabled:opacity-40"
//                                 >
//                                   <Download className="w-3 h-3 text-gray-500" /> 
//                                   {isDownloading === payment.id ? "Downloading..." : "Download"}
//                                 </button>
//                               </div>
//                             </div>
//                           </div>

//                           {payment.status === "Pending" && (
//                             <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-200/60">
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'reject')}
//                                 className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
//                               >
//                                 <Ban className="w-3.5 h-3.5" /> Reject
//                               </button>
//                               <button 
//                                 onClick={() => handleVerifyPayment(payment.id, 'approve')}
//                                 className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-colors"
//                               >
//                                 <ShieldCheck className="w-3.5 h-3.5" /> Approve Payment
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {payment.status === "Pending" ? (
//                           <div className="pt-2 border-t border-gray-200/60">
//                             <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
//                               Verification Comments / Audit Trail Notes
//                             </label>
//                             <input 
//                               type="text"
//                               placeholder="Type transaction references, clearing codes, or explanation notes here..."
//                               value={paymentRemarks[payment.id] || ""}
//                               onChange={(e) => setPaymentRemarks(prev => ({ ...prev, [payment.id]: e.target.value }))}
//                               className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
//                             />
//                           </div>
//                         ) : (
//                           payment.remarks && (
//                             <div className="p-3 bg-white border border-gray-100 rounded-xl text-xs text-gray-600">
//                               <span className="font-bold text-gray-400 uppercase text-[9px] block mb-0.5 tracking-wider">Admin Verification Note:</span>
//                               "{payment.remarks}"
//                             </div>
//                           )
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl border-gray-200">
//                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Awaiting customer proof upload submission...</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>

//         {/* 5. LOGISTICS SECTION */}
//         <section className={`bg-white p-6 rounded-3xl shadow-sm border flex items-center justify-between transition-all ${
//           !isReadyForLogistics ? "opacity-40 border-gray-100" : "opacity-100 border-green-200"
//         }`}>
//           <div className="flex items-center gap-4">
//             <div className={`p-3 rounded-2xl ${isReadyForLogistics ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
//               <Truck className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
//               <p className="text-xs text-gray-400 italic">
//                 {isReadyForLogistics ? "Ready for truck tracking deployment." : isRejectedOrHalted ? "Locked permanently until a successful site re-inspection is logged." : "Locked until site conditions or terms are verified."}
//               </p>
//             </div>
//           </div>
//           <span className={`text-[10px] font-bold border px-3 py-1 rounded-md uppercase tracking-wider ${
//             isReadyForLogistics ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300 bg-gray-50"
//           }`}>
//             {isReadyForLogistics ? "Active" : "Locked"}
//           </span>
//         </section>
//       </main>

//       {/* --- LIGHTBOX MODAL --- */}
//       {previewImageUrl && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-200">
//           <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
//             <button 
//               onClick={() => setPreviewImageUrl(null)}
//               className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors outline-none"
//               title="Close Preview"
//             >
//               <X className="w-6 h-6" />
//             </button>
//             <div className="w-full bg-gray-900 rounded-3xl overflow-hidden p-2 border border-gray-800 shadow-2xl flex items-center justify-center">
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
  FileText, ShieldCheck, Ban, Calendar, Layers, OctagonAlert // 🆕 Added Icon for Canceled alert state
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
      
      // Auto-focus logic based on state machine position
      // 🆕 Added check: Don't shift accordion highlights if the pipeline is completely terminated
      if (res.data.status === "Cancelled") {
        setOpenSection(null);
      } else if (res.data.status === "For Inspection") {
        setOpenSection("inspection");
      } else if (res.data.status === "For Payment Verification") {
        setOpenSection("payment");
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  // 🆕 NEW: HANDLER FOR ORDER CANCELLATION EXECUTION
  const handleCancelOrderPipeline = async () => {
    const { value: text, isConfirmed } = await Swal.fire({
      title: 'TERMINATE ORDER PIPELINE?',
      input: 'textarea',
      inputPlaceholder: 'Type reason here (e.g., Jobsite flooding, persistent structural grading delays, customer cancellation request)...',
      inputAttributes: { 'aria-label': 'Specify Cancellation Audit Reason' },
      showCancelButton: true,
      confirmButtonText: 'Confirm Cancellation',
      confirmButtonColor: '#dc2626',
      cancelButtonText: 'Back',
      background: '#ffffff',
      color: '#1f2937',
      customClass: { popup: 'rounded-3xl border border-gray-200 font-sans text-sm' }
    });

    if (isConfirmed && text) {
      try {
        await api.post(`orders/${orderId}/cancel_order/`, { cancellation_reason: text });
        Swal.fire({
          title: 'PIPELINE KILLED',
          text: 'The concrete batching sequence for this track has been terminated.',
          icon: 'success',
          confirmButtonColor: '#0284c7',
          customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
        });
        fetchOrderData();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'SYSTEM ERROR',
          text: 'Failed to terminate the sequence on the server cluster.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
        });
      }
    } else if (isConfirmed && !text.trim()) {
      Swal.fire({
        title: 'REASON REQUIRED',
        text: 'You must provide a cancellation reason for operational audit logs.',
        icon: 'warning',
        confirmButtonColor: '#0284c7',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
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
    if (!inspectionRemarks.trim()) {
      return Swal.fire({
        title: 'INPUT REQUIRED',
        text: "Please provide detailed inspection remarks explaining the technical assessment.",
        icon: 'warning',
        background: '#ffffff',
        color: '#1f2937',
        confirmButtonColor: '#0284c7',
        customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
      });
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`orders/${orderId}/submit_inspection/`, {
        result: inspectionResult,
        remarks: inspectionRemarks,
        new_date: rescheduleDate 
      });

      if (inspectionResult === "Rejected") {
        Swal.fire({
          title: 'ORDER PIPELINE HALTED',
          text: "The site was marked as REJECTED. The pipeline has been frozen to prevent down-stream payments or plant dispatch slots from being created.",
          icon: 'error',
          background: '#ffffff',
          color: '#1f2937',
          confirmButtonColor: '#dc2626',
          customClass: { popup: 'rounded-3xl border border-red-200 font-sans' }
        });
        setOpenSection("inspection");
      } else if (inspectionResult === "Re-inspection") {
        Swal.fire({
          title: 'RE-INSPECTION LOGGED',
          text: "Order status modified to require an operational re-visit. Subsequent operational steps remain locked.",
          icon: 'info',
          background: '#ffffff',
          color: '#1f2937',
          confirmButtonColor: '#f59e0b',
          customClass: { popup: 'rounded-3xl border border-amber-200 font-sans' }
        });
        setOpenSection("inspection");
      } else {
        Swal.fire({
          title: 'INSPECTION PASSED',
          text: res.data.message || 'Site approved successfully. Transitioning to payment workflows.',
          icon: 'success',
          background: '#ffffff',
          color: '#1f2937',
          confirmButtonColor: '#0284c7',
          customClass: { popup: 'rounded-3xl border border-gray-200 font-sans' }
        });
        setOpenSection("payment"); 
      }
      
      fetchOrderData(); 
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

  // 🛑 CONFIGURE LOCK GUARDS FOR THE REST OF THE ACCORDION CANVAS 
  const isPendingQuoteOrReview = order.status === "Pending";
  
  // 🆕 EXTENDED: Track hard cancellation bounds explicitly
  const isOrderCancelled = order.status === "Cancelled";
  const isRejectedOrHalted = ["Rejected", "Site Rejected", "Re-inspection Required"].includes(order.status) || isOrderCancelled;
  
  const isLockedForPaymentVerification = isPendingQuoteOrReview || isRejectedOrHalted || ["Quotation Sent", "For Inspection"].includes(order.status);
  const isReadyForLogistics = order.status === "Ready for Pouring" && !isRejectedOrHalted;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased relative">
      
      {/* 🆕 NEW COMPONENT: ALERT PANEL HIGHLIGHTING COMPLETE BATCH TRACK REMOVAL */}
      {isOrderCancelled && (
        <div className="bg-red-600 text-white p-6 rounded-3xl shadow-md border border-red-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-700 rounded-2xl text-white shadow-inner shrink-0">
              <OctagonAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-md font-black uppercase tracking-tight">Production Sequence Aborted</h2>
              <p className="text-xs text-red-100 mt-0.5 font-medium">Reason: "{order.cancellation_reason || 'No specific rationale provided.'}"</p>
              <p className="text-[10px] text-red-200 uppercase font-bold tracking-wider mt-1">Logged by: {order.canceled_by_name || 'Admin Management Engine'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1. COMPACT HEADER */}
      <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
              isOrderCancelled
                ? 'bg-red-600 text-white border border-red-700'
                : isRejectedOrHalted 
                ? 'bg-red-100 text-red-700 border border-red-200'
                : order.status.includes('Ready') || order.status.includes('Approved') || order.status.includes('Paid') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-cyan-100 text-cyan-700'
            }`}>
              {order.status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">ID: #{order.id}</span>
          </div>
          <h1 className={`text-2xl font-black text-gray-900 tracking-tight uppercase ${isOrderCancelled ? 'line-through text-gray-400' : ''}`}>{order.project_name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {order.project_location}
          </p>
        </div>
        
        {/* 🆕 ACTIONS BLOCK IN THE HEADER LAYER */}
        <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
           {!isOrderCancelled && (
             <button
               onClick={handleCancelOrderPipeline}
               className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors"
             >
               <Ban className="w-3.5 h-3.5" /> Force Halt Order
             </button>
           )}
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</p>
             <p className="text-xl font-black text-gray-900 mt-0.5">
               {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
             </p>
           </div>
        </div>
      </header>

      <main className={`space-y-4 ${isOrderCancelled ? 'pointer-events-none opacity-50 select-none' : ''}`}>
        
        {/* 2. QUOTATION SECTION */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            onClick={() => toggleSection("quotation")}
            disabled={isOrderCancelled}
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
          order.status === "For Inspection" ? "border-cyan-500 ring-2 ring-cyan-500/20" : isRejectedOrHalted ? "border-red-300 bg-red-50/10" : "border-gray-100"
        } overflow-hidden`}>
          <button 
            onClick={() => toggleSection("inspection")}
            disabled={isPendingQuoteOrReview || isOrderCancelled}
            className={`w-full p-6 flex justify-between items-center transition-colors ${
              isPendingQuoteOrReview ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isRejectedOrHalted ? 'bg-red-100 text-red-600' : order.status !== "Pending" && order.status !== "Quotation Sent" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                  Step 2: Site Inspection
                  {isRejectedOrHalted && (
                    <span className="bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {isOrderCancelled ? 'Pipeline Terminated' : 'Halted / Failed'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Technical approval and accessibility check.</p>
              </div>
            </div>
            {openSection === "inspection" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "inspection" && !isOrderCancelled && (
            <div className="p-6 md:p-8 pt-0 border-t border-gray-100 bg-white">
              {/* Form implementation remains fully intact here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
                    <select 
                      value={inspectionResult}
                      onChange={(e) => setInspectionResult(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                    >
                      <option value="Approved">Approved (Pass to Next Stage)</option>
                      <option value="Rejected">Rejected (Halt & Freeze Order)</option>
                      <option value="Re-inspection">Re-inspection Required</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspector's Remarks</label>
                    <textarea 
                      value={inspectionRemarks}
                      onChange={(e) => setInspectionRemarks(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px] text-gray-800 placeholder-gray-400"
                      placeholder="Specify reasons if rejected..."
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
                  </div>
                  <button 
                    onClick={handleSubmitInspection}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Submit Verification State"}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 flex flex-col justify-between">
                   <div>
                     <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-1">
                       <Layers className="w-3.5 h-3.5 text-gray-400" /> Workflow Engine Matrix
                     </h4>
                     <div className="flex gap-3">
                        <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                          <p>● <span className="font-bold text-green-700">Approved:</span> Auto-promotes state to payment review.</p>
                          <p>● <span className="font-bold text-red-600">Rejected:</span> Triggers pipeline break.</p>
                        </div>
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
        } ${isRejectedOrHalted ? "opacity-40" : "opacity-100"} overflow-hidden`}>
          <button 
            onClick={() => toggleSection("payment")}
            disabled={isLockedForPaymentVerification || isOrderCancelled}
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
                  {order.status === "For Payment Verification" && !isRejectedOrHalted && (
                    <span className="bg-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                      Pending Action
                    </span>
                  )}
                  {isRejectedOrHalted && (
                    <span className="bg-red-100 text-red-600 border border-red-200 font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {isOrderCancelled ? 'Locked by Cancellation' : 'Locked by Site Rejection'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
              </div>
            </div>
            {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "payment" && !isRejectedOrHalted && (
            <div className="p-6 md:p-8 pt-0 border-t border-gray-50 bg-white">
              {/* Payment rows mapper logic loop remains pristine here */}
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
                      <div key={payment.id} className="p-5 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative group shrink-0">
                              <img src={absoluteProofUrl} alt="Proof of Payment" className="w-full h-full object-cover" />
                              <div onClick={() => setPreviewImageUrl(absoluteProofUrl)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">Transaction Receipt Document</p>
                              <span className="text-[9px] font-black px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md uppercase">{payment.status}</span>
                            </div>
                          </div>
                          {payment.status === "Pending" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleVerifyPayment(payment.id, 'reject')} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold uppercase">Reject</button>
                              <button onClick={() => handleVerifyPayment(payment.id, 'approve')} className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase">Approve Payment</button>
                            </div>
                          )}
                        </div>
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
        <section className={`bg-white p-6 rounded-3xl shadow-sm border flex items-center justify-between transition-all ${
          !isReadyForLogistics ? "opacity-40 border-gray-100" : "opacity-100 border-green-200"
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isReadyForLogistics ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-900">Step 4: Dispatch & Scheduling</h3>
              <p className="text-xs text-gray-400 italic">
                {isReadyForLogistics ? "Ready for truck tracking deployment." : isOrderCancelled ? "Order Cancelled. Logistics sequence deleted." : isRejectedOrHalted ? "Locked permanently until a successful site re-inspection is logged." : "Locked until site conditions or terms are verified."}
              </p>
            </div>
          </div>
          <span className={`text-[10px] font-bold border px-3 py-1 rounded-md uppercase tracking-wider ${
            isReadyForLogistics ? "border-green-300 text-green-600 bg-green-50" : "border-gray-100 text-gray-300 bg-gray-50"
          }`}>
            {isReadyForLogistics ? "Active" : "Locked"}
          </span>
        </section>
      </main>

      {/* --- LIGHTBOX MODAL --- */}
      {previewImageUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
            <button onClick={() => setPreviewImageUrl(null)} className="absolute -top-12 right-0 bg-white/20 text-white p-2 rounded-full"><X className="w-6 h-6" /></button>
            <div className="w-full bg-gray-900 rounded-3xl overflow-hidden p-2"><img src={previewImageUrl} className="max-w-full max-h-[75vh] object-contain rounded-2xl" /></div>
          </div>
        </div>
      )}

    </div>
  );
}