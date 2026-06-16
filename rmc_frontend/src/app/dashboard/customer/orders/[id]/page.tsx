// // "use client";
// // import { useEffect, useState, use } from 'react';
// // import api from '@/src/lib/api';
// // import QuotationView from '@/src/components/QuotationView';
// // import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
// // import Link from 'next/link';

// // export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
// //   const resolvedParams = use(params);
// //   const [order, setOrder] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     api.get(`orders/${resolvedParams.id}/`)
// //       .then(res => {
// //         setOrder(res.data);
// //         setLoading(false);
// //       })
// //       .catch(err => {
// //         console.error("Failed to load order:", err);
// //         setLoading(false);
// //       });
// //   }, [resolvedParams.id]);

// //   const handleApprove = async () => {
// //     if (!confirm("Are you sure you want to approve this quotation?")) return;
// //     try {
// //       await api.post(`orders/${resolvedParams.id}/approve_quotation/`);
// //       alert("Quotation Approved! Status updated.");
// //       window.location.reload();
// //     } catch (err) {
// //       alert("Failed to approve quotation. Please contact support.");
// //     }
// //   };

// //   if (loading) return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
// //     </div>
// //   );

// //   if (!order) return <p className="p-10 text-center">Order not found.</p>;

// //   return (
// //     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
// //       {/* NAVIGATION & STATUS */}
// //       <div className="flex justify-between items-center">
// //         <Link href="/dashboard/customer" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors">
// //           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
// //         </Link>
// //         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
// //           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
// //         }`}>
// //           {order.status}
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
// //         {/* LEFT SIDE: ORDER SUMMARY */}
// //         <div className="lg:col-span-1 space-y-6">
// //           <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
// //             <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
// //             <div className="space-y-4">
// //               <div>
// //                 <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
// //                 <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] text-gray-400 uppercase">Site Location</p>
// //                 <p className="font-medium text-gray-600 text-xs italic">{order.project_location}</p>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
// //                 <p className="font-black text-xl text-[#064e3b]">
// //                   {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
// //                 </p>
// //               </div>
// //             </div>
// //           </section>

// //           {/* APPROVAL ACTION BOX */}
// //           {order.status === "Quotation Sent" && (
// //             <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
// //               <p className="text-white text-xs font-bold mb-4 flex items-center">
// //                 <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
// //               </p>
// //               <button 
// //                 onClick={handleApprove}
// //                 className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
// //               >
// //                 Approve Quotation
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* RIGHT SIDE: THE FORMAL QUOTATION LETTER */}
// //         <div className="lg:col-span-3">
// //           {order.quotation ? (
// //             <QuotationView data={order.quotation} orderData={order} />
// //           ) : (
// //             <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
// //               <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
// //                 <AlertCircle className="text-amber-500 w-6 h-6" />
// //               </div>
// //               <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
// //               <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
// //                 Admin is currently verifying distance and material costs for your site.
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";
// import { useEffect, useState, use } from 'react';
// import api from '@/src/lib/api';
// import QuotationView from '@/src/components/QuotationView';
// import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';

// export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params);
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get(`orders/${resolvedParams.id}/`)
//       .then(res => {
//         setOrder(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to load order:", err);
//         setLoading(false);
//       });
//   }, [resolvedParams.id]);

//   // Check if any mix design in the order requires a pump
//   const needsPump = order?.order_items?.some((item: any) => 
//     item.pump_required === true || 
//     item.mix_design_name?.toUpperCase().includes("PCD")
//   );

//   const handleApprove = async () => {
//     if (!confirm("Are you sure you want to approve this quotation?")) return;
//     try {
//       await api.post(`orders/${resolvedParams.id}/approve_quotation/`);
//       alert("Quotation Approved! Status updated.");
//       window.location.reload();
//     } catch (err) {
//       alert("Failed to approve quotation. Please contact support.");
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
//     </div>
//   );

//   if (!order) return <p className="p-10 text-center">Order not found.</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       {/* NAVIGATION & STATUS */}
//       <div className="flex justify-between items-center">
//         <Link href="/dashboard/customer" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors">
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
//         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
//         }`}>
//           {order.status}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* LEFT SIDE: ORDER SUMMARY */}
//         <div className="lg:col-span-1 space-y-6">
//           <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//             <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
//                 <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
//               </div>
              
//               {/* PUMP INDICATOR */}
//               {needsPump && (
//                 <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
//                     <p className="text-[9px] text-cyan-600 font-bold uppercase tracking-tighter">Equipment Required</p>
//                     <p className="text-[11px] font-black text-cyan-700 uppercase">Pumpcrete Service Included</p>
//                 </div>
//               )}

//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Site Location</p>
//                 <p className="font-medium text-gray-600 text-xs italic">{order.project_location}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
//                 <p className="font-black text-xl text-[#064e3b]">
//                   {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* APPROVAL ACTION BOX */}
//           {order.status === "Quotation Sent" && (
//             <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
//               <p className="text-white text-xs font-bold mb-4 flex items-center">
//                 <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
//               </p>
//               <button 
//                 onClick={handleApprove}
//                 className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
//               >
//                 Approve Quotation
//               </button>
//             </div>
//           )}
//         </div>

//         {/* RIGHT SIDE: THE FORMAL QUOTATION LETTER */}
//         <div className="lg:col-span-3">
//           {order.quotation ? (
//             <QuotationView 
//                 data={order.quotation} 
//                 orderData={order} 
//                 showPumpDetails={needsPump} 
//             />
//           ) : (
//             <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
//               <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
//                 <AlertCircle className="text-amber-500 w-6 h-6" />
//               </div>
//               <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
//               <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
//                 Admin is currently verifying distance and material costs for your site.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react';
// import api from '@/src/lib/api';
// import QuotationView from '@/src/components/QuotationView';
// import { CheckCircle, AlertCircle, ArrowLeft, XCircle } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params);
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get(`orders/${resolvedParams.id}/`)
//       .then(res => {
//         setOrder(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to load order:", err);
//         setLoading(false);
//       });
//   }, [resolvedParams.id]);

//   const needsPump = order?.order_items?.some((item: any) => 
//     item.pump_required === true || 
//     item.mix_design_name?.toUpperCase().includes("PCD")
//   );

//   // NEW: Handle Customer Decision (Approve or Reject)
//  const handleDecision = async (decision: 'approve' | 'reject') => {
//   // 1. Sleek Modern Confirmation Prompt
//   const prompt = await Swal.fire({
//     title: decision === 'approve' ? 'CONFIRM APPROVAL' : 'CONFIRM REJECTION',
//     text: decision === 'approve' 
//       ? "Are you sure you want to approve this quotation?" 
//       : "Are you sure you want to reject this quotation? This will end the transaction.",
//     icon: 'warning',
//     showCancelButton: true,
//     background: '#0f172a',
//     color: '#f8fafc',
//     confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', // Green for approve, Red for reject
//     cancelButtonColor: '#334155',
//     confirmButtonText: decision === 'approve' ? 'YES, APPROVE' : 'YES, REJECT',
//     cancelButtonText: 'CANCEL',
//     customClass: {
//       popup: 'rounded-3xl border border-slate-800 font-sans'
//     }
//   });

//   // Guard block: if the user clicks cancel, safely drop out of the execution context
//   if (!prompt.isConfirmed) return;

//   // 2. Process Backend Transaction State
//   try {
//     // Calling the customer_decision action we have in the backend
//     await api.post(`quotations/${order.quotation.id}/customer_decision/`, {
//       decision: decision
//     });
    
//     // Success Notification Modal
//     await Swal.fire({
//       title: decision === 'approve' ? 'QUOTATION APPROVED' : 'QUOTATION REJECTED',
//       text: `The commercial pricing layout has been officially marked as ${decision === 'approve' ? 'approved' : 'rejected'} inside the pipeline system database.`,
//       icon: decision === 'approve' ? 'success' : 'error',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', 
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });

//     // Refresh state smoothly
//     window.location.reload();

//   } catch (err) {
//     // Failure Notification Fallback
//     Swal.fire({
//       title: 'SYSTEM ERROR',
//       text: "Failed to process decision. Please contact technical staff.",
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

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
//     </div>
//   );

//   if (!order) return <p className="p-10 text-center">Order not found.</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       {/* NAVIGATION & STATUS */}
//       <div className="flex justify-between items-center">
//         <Link href="/dashboard/customer" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors">
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
//         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//           order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
//           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
//           'bg-emerald-100 text-emerald-700'
//         }`}>
//           {order.status}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-1 space-y-6">
//           {/* <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//             <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
//                 <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
//               </div>
//               {needsPump && (
//                 <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
//                   <p className="text-[9px] text-cyan-600 font-bold uppercase tracking-tighter">Equipment Required</p>
//                   <p className="text-[11px] font-black text-cyan-700 uppercase">Pumpcrete Service Included</p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
//                 <p className="font-black text-xl text-[#064e3b]">
//                   {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
//                 </p>
//               </div>
//             </div>
//           </section> */}

//           {/* UPDATED ACTION BOX WITH REJECT BUTTON */}
//           {order.status === "Quotation Sent" && (
//             <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
//               <p className="text-white text-xs font-bold mb-4 flex items-center">
//                 <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
//               </p>
//               <div className="space-y-3">
//                 <button 
//                   onClick={() => handleDecision('approve')}
//                   className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
//                 >
//                   Approve Quotation
//                 </button>
//                 <button 
//                   onClick={() => handleDecision('reject')}
//                   className="w-full bg-white/5 text-gray-400 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2"
//                 >
//                   <XCircle className="w-3 h-3" /> Reject Quotation
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-3">
//           {order.quotation ? (
//             <QuotationView 
//               data={order.quotation} 
//               orderData={order} 
//               // showPumpDetails={needsPump} 
//             />
//           ) : (
//             <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
//               <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
//                 <AlertCircle className="text-amber-500 w-6 h-6" />
//               </div>
//               <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
//               <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
//                 Admin is currently verifying distance and material costs for your site.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react';
// import api from '@/src/lib/api';
// import QuotationView from '@/src/components/QuotationView';
// import { CheckCircle, AlertCircle, ArrowLeft, XCircle, Upload, FileCheck, Loader2 } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params);
//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
  
//   // State for Handling Payment File Uploads
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     api.get(`orders/${resolvedParams.id}/`)
//       .then(res => {
//         setOrder(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to load order:", err);
//         setLoading(false);
//       });
//   }, [resolvedParams.id]);

//   const needsPump = order?.order_items?.some((item: any) => 
//     item.pump_required === true || 
//     item.mix_design_name?.toUpperCase().includes("PCD")
//   );

//   // Handle Customer Decision (Approve or Reject Quotation)
//   const handleDecision = async (decision: 'approve' | 'reject') => {
//     const prompt = await Swal.fire({
//       title: decision === 'approve' ? 'CONFIRM APPROVAL' : 'CONFIRM REJECTION',
//       text: decision === 'approve' 
//         ? "Are you sure you want to approve this quotation?" 
//         : "Are you sure you want to reject this quotation? This will end the transaction.",
//       icon: 'warning',
//       showCancelButton: true,
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', 
//       cancelButtonColor: '#334155',
//       confirmButtonText: decision === 'approve' ? 'YES, APPROVE' : 'YES, REJECT',
//       cancelButtonText: 'CANCEL',
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });

//     if (!prompt.isConfirmed) return;

//     try {
//       await api.post(`quotations/${order.quotation.id}/customer_decision/`, {
//         decision: decision
//       });
      
//       await Swal.fire({
//         title: decision === 'approve' ? 'QUOTATION APPROVED' : 'QUOTATION REJECTED',
//         text: `The commercial pricing layout has been officially marked as ${decision === 'approve' ? 'approved' : 'rejected'} inside the pipeline system database.`,
//         icon: decision === 'approve' ? 'success' : 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', 
//         customClass: {
//           popup: 'rounded-3xl border border-slate-800 font-sans'
//         }
//       });

//       window.location.reload();

//     } catch (err) {
//       Swal.fire({
//         title: 'SYSTEM ERROR',
//         text: "Failed to process decision. Please contact technical staff.",
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

//   // Handle Proof of Payment File Upload Action
//   const handleFileUpload = async () => {
//     if (!selectedFile) {
//       Swal.fire({
//         title: 'MISSING ATTACHMENT',
//         text: 'Please select a valid receipt image or PDF document first.',
//         icon: 'info',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#d4af37'
//       });
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('proof_of_payment', selectedFile);
//     formData.append('order_id', resolvedParams.id);

//     try {
//       // FIX: Removed manual header config block to let Axios parse boundaries natively
//       await api.post(`orders/${resolvedParams.id}/upload_payment/`, formData);

//       await Swal.fire({
//         title: 'RECEIPT SUBMITTED',
//         text: 'Your proof of payment has been uploaded successfully. Accounting will verify it shortly.',
//         icon: 'success',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#10b981',
//         customClass: { popup: 'rounded-3xl' }
//       });

//       setSelectedFile(null);
//       window.location.reload();
//     } catch (err) {
//       console.error("Payment upload error:", err);
//       Swal.fire({
//         title: 'UPLOAD FAILED',
//         text: 'Failed to upload proof of payment. Please ensure the file size is within valid limits.',
//         icon: 'error',
//         background: '#0f172a',
//         color: '#f8fafc',
//         confirmButtonColor: '#ef4444'
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
//     </div>
//   );

//   if (!order) return <p className="p-10 text-center">Order not found.</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       {/* NAVIGATION & STATUS */}
//       <div className="flex justify-between items-center">
//         <Link href="/dashboard/customer" className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors">
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
//         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//           order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
//           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
//           order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
//           'bg-emerald-100 text-emerald-700'
//         }`}>
//           {order.status}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         <div className="lg:col-span-1 space-y-6">
//           {/* PROJECT SUMMARY PANEL */}
//           <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//             <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
//                 <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
//               </div>
//               {needsPump && (
//                 <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
//                   <p className="text-[9px] text-cyan-600 font-bold uppercase tracking-tighter">Equipment Required</p>
//                   <p className="text-[11px] font-black text-cyan-700 uppercase">Pumpcrete Service Included</p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
//                 <p className="font-black text-xl text-[#064e3b]">
//                   {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* WORKFLOW CONDITIONAL BOX 1: QUOTATION REVIEW ACTIONS */}
//           {order.status === "Quotation Sent" && (
//             <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
//               <p className="text-white text-xs font-bold mb-4 flex items-center">
//                 <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
//               </p>
//               <div className="space-y-3">
//                 <button 
//                   onClick={() => handleDecision('approve')}
//                   className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
//                 >
//                   Approve Quotation
//                 </button>
//                 <button 
//                   onClick={() => handleDecision('reject')}
//                   className="w-full bg-white/5 text-gray-400 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2"
//                 >
//                   <XCircle className="w-3 h-3" /> Reject Quotation
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* WORKFLOW CONDITIONAL BOX 2: ADVANCE PAYMENT PROOF UPLOADER */}
//           {order.status === "For Payment Verification" && (
//             <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200/70 space-y-4">
//               <div className="flex items-center gap-2 text-amber-800">
//                 <Upload className="w-4 h-4 shrink-0 animate-bounce" />
//                 <p className="text-[11px] font-black uppercase tracking-wider">Upload Payment</p>
//               </div>
//               <p className="text-gray-500 text-[11px] leading-relaxed">
//                 Please attach your bank transfer receipt, deposit slip, or electronic transaction receipt screenshot to secure your pouring slot clearance.
//               </p>
              
//               <div className="relative border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
//                 <input 
//                   type="file" 
//                   accept="image/*,application/pdf"
//                   onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   disabled={uploading}
//                 />
//                 <div className="flex flex-col items-center justify-center gap-1.5">
//                   <FileCheck className={`w-5 h-5 ${selectedFile ? 'text-emerald-600' : 'text-gray-400 group-hover:text-amber-600'} transition-colors`} />
//                   <p className="text-[10px] font-bold text-gray-700 max-w-[150px] truncate">
//                     {selectedFile ? selectedFile.name : "Choose receipt file..."}
//                   </p>
//                   <p className="text-[8px] text-gray-400 uppercase font-semibold">Images or PDF format</p>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFileUpload}
//                 disabled={!selectedFile || uploading}
//                 className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
//                   selectedFile && !uploading
//                     ? 'bg-[#064e3b] text-white hover:bg-[#053f30]' 
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 {uploading ? (
//                   <>
//                     <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
//                   </>
//                 ) : (
//                   "Submit Proof"
//                 )}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* DETAILS LAYOUT AND PRICE BLOCKS CANVAS */}
//         <div className="lg:col-span-3">
//           {order.quotation ? (
//             <QuotationView 
//               data={order.quotation} 
//               orderData={order} 
//             />
//           ) : (
//             <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
//               <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
//                 <AlertCircle className="text-amber-500 w-6 h-6" />
//               </div>
//               <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
//               <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
//                 Admin is currently verifying distance and material costs for your site.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, use } from 'react';
import api from '@/src/lib/api';
import QuotationView from '@/src/components/QuotationView';
import { CheckCircle, AlertCircle, ArrowLeft, XCircle, Upload, FileCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State for Handling Payment File Uploads
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get(`orders/${resolvedParams.id}/`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load order:", err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const needsPump = order?.order_items?.some((item: any) => 
    item.pump_required === true || 
    item.mix_design_name?.toUpperCase().includes("PCD")
  );

  // Handle Customer Decision (Approve or Reject Quotation)
  const handleDecision = async (decision: 'approve' | 'reject') => {
    const prompt = await Swal.fire({
      title: decision === 'approve' ? 'CONFIRM APPROVAL' : 'CONFIRM REJECTION',
      text: decision === 'approve' 
        ? "Are you sure you want to approve this quotation?" 
        : "Are you sure you want to reject this quotation? This will end the transaction.",
      icon: 'warning',
      showCancelButton: true,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', 
      cancelButtonColor: '#334155',
      confirmButtonText: decision === 'approve' ? 'YES, APPROVE' : 'YES, REJECT',
      cancelButtonText: 'CANCEL',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 font-sans'
      }
    });

    if (!prompt.isConfirmed) return;

    try {
      await api.post(`quotations/${order.quotation.id}/customer_decision/`, {
        decision: decision
      });
      
      await Swal.fire({
        title: decision === 'approve' ? 'QUOTATION APPROVED' : 'QUOTATION REJECTED',
        text: `The commercial pricing layout has been officially marked as ${decision === 'approve' ? 'approved' : 'rejected'} inside the pipeline system database.`,
        icon: decision === 'approve' ? 'success' : 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: decision === 'approve' ? '#10b981' : '#ef4444', 
        customClass: {
          popup: 'rounded-3xl border border-slate-800 font-sans'
        }
      });

      window.location.reload();

    } catch (err) {
      Swal.fire({
        title: 'SYSTEM ERROR',
        text: "Failed to process decision. Please contact technical staff.",
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-3xl border border-slate-800 font-sans'
        }
      });
    }
  };

  // Handle Proof of Payment File Upload Action
  const handleFileUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        title: 'MISSING ATTACHMENT',
        text: 'Please select a valid receipt image or PDF document first.',
        icon: 'info',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#d4af37'
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('proof_of_payment', selectedFile);
    formData.append('order_id', resolvedParams.id);

    try {
      await api.post(`orders/${resolvedParams.id}/upload_payment/`, formData);

      await Swal.fire({
        title: 'RECEIPT SUBMITTED',
        text: 'Your proof of payment has been uploaded successfully. Accounting will verify it shortly.',
        icon: 'success',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-3xl' }
      });

      setSelectedFile(null);
      window.location.reload();
    } catch (err) {
      console.error("Payment upload error:", err);
      Swal.fire({
        title: 'UPLOAD FAILED',
        text: 'Failed to upload proof of payment. Please ensure the file size is within valid limits.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
    </div>
  );

  if (!order) return <p className="p-10 text-center">Order not found.</p>;

  return (
    // 🔴 print:p-0 ensures no extra margins cut off your document edges on paper
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 print:p-0 print:pb-0">
      
            {/* 🔴 Parent container stays visible during printing, but switches to flex-end to push the badge to the right side on paper */}
      <div className="flex justify-between items-center print:justify-end">
        
        {/* 🔴 Link is hidden exclusively when printing */}
        <Link 
          href="/dashboard/customer" 
          className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors print:hidden"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
        </Link>
        
        {/* 🟢 Status Badge stays visible both on screen and on paper! */}
        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
          order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
          order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {order.status}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        
        {/* LEFT BAR: PROJECT SUMMARY AND SIDEBAR ACTIONS */}
        {/* 🔴 Added print:hidden so these panels never enter the printer stack */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* PROJECT SUMMARY PANEL */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-black text-gray-400 text-[10px] uppercase mb-6 tracking-widest">Project Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
                <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
              </div>
              {needsPump && (
                <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
                  <p className="text-[9px] text-cyan-600 font-bold uppercase tracking-tighter">Equipment Required</p>
                  <p className="text-[11px] font-black text-cyan-700 uppercase">Pumpcrete Service Included</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
                <p className="font-black text-xl text-[#064e3b]">
                  {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
                </p>
              </div>
            </div>
          </section>

          {/* WORKFLOW CONDITIONAL BOX 1: QUOTATION REVIEW ACTIONS */}
          {order.status === "Quotation Sent" && (
            <div className="bg-[#111827] p-6 rounded-2xl shadow-xl border border-gray-800">
              <p className="text-white text-xs font-bold mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" /> Action Required
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleDecision('approve')}
                  className="w-full bg-emerald-500 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all shadow-lg"
                >
                  Approve Quotation
                </button>
                <button 
                  onClick={() => handleDecision('reject')}
                  className="w-full bg-white/5 text-gray-400 py-3 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-3 h-3" /> Reject Quotation
                </button>
              </div>
            </div>
          )}

          {/* WORKFLOW CONDITIONAL BOX 2: ADVANCE PAYMENT PROOF UPLOADER */}
          {order.status === "For Payment Verification" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-amber-200/70 space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Upload className="w-4 h-4 shrink-0 animate-bounce" />
                <p className="text-[11px] font-black uppercase tracking-wider">Upload Payment</p>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Please attach your bank transfer receipt, deposit slip, or electronic transaction receipt screenshot to secure your pouring slot clearance.
              </p>
              
              <div className="relative border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <FileCheck className={`w-5 h-5 ${selectedFile ? 'text-emerald-600' : 'text-gray-400 group-hover:text-amber-600'} transition-colors`} />
                  <p className="text-[10px] font-bold text-gray-700 max-w-[150px] truncate">
                    {selectedFile ? selectedFile.name : "Choose receipt file..."}
                  </p>
                  <p className="text-[8px] text-gray-400 uppercase font-semibold">Images or PDF format</p>
                </div>
              </div>

              <button
                onClick={handleFileUpload}
                disabled={!selectedFile || uploading}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
                  selectedFile && !uploading
                    ? 'bg-[#064e3b] text-white hover:bg-[#053f30]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                  </>
                ) : (
                  "Submit Proof"
                )}
              </button>
            </div>
          )}
        </div>

        {/* DETAILS LAYOUT AND PRICE BLOCKS CANVAS */}
        {/* 🔴 print:w-full forces the quotation sheet to occupy the complete page landscape */}
        <div className="lg:col-span-3 print:w-full">
          {order.quotation ? (
            <QuotationView 
              data={order.quotation} 
              orderData={order} 
            />
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
              <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
                <AlertCircle className="text-amber-500 w-6 h-6" />
              </div>
              <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
              <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
                Admin is currently verifying distance and material costs for your site.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}