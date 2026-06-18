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
//     // 🔴 print:p-0 ensures no extra margins cut off your document edges on paper
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 print:p-0 print:pb-0">
      
//             {/* 🔴 Parent container stays visible during printing, but switches to flex-end to push the badge to the right side on paper */}
//       <div className="flex justify-between items-center print:justify-end">
        
//         {/* 🔴 Link is hidden exclusively when printing */}
//         <Link 
//           href="/dashboard/customer" 
//           className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors print:hidden"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
        
//         {/* 🟢 Status Badge stays visible both on screen and on paper! */}
//         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//           order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
//           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
//           order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
//           'bg-emerald-100 text-emerald-700'
//         }`}>
//           {order.status}
//         </div>

//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        
//         {/* LEFT BAR: PROJECT SUMMARY AND SIDEBAR ACTIONS */}
//         {/* 🔴 Added print:hidden so these panels never enter the printer stack */}
//         <div className="lg:col-span-1 space-y-6 print:hidden">
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
//         {/* 🔴 print:w-full forces the quotation sheet to occupy the complete page landscape */}
//         <div className="lg:col-span-3 print:w-full">
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

// "use client";
// import { useEffect, useState, use } from 'react';
// import api from '@/src/lib/api';
// import QuotationView from '@/src/components/QuotationView';
// import { CheckCircle, AlertCircle, ArrowLeft, XCircle, Upload, FileCheck, Loader2, ClipboardCheck, FileText, Wallet, CalendarCheck } from 'lucide-react';
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

//   // Helper function to evaluate timeline step styling
//   const getStepStatus = (stepName: string) => {
//     const currentStatus = order?.status;
    
//     // Explicit global rejection checks
//     if (currentStatus === 'Rejected' || order?.inspection_status === 'Failed') {
//       return stepName === 'Pending' ? 'failed' : 'blocked';
//     }

//     const statusWeight: Record<string, number> = {
//       'Pending': 1,
//       'Quotation Sent': 2,
//       'For Payment Verification': 3,
//       'Approved': 4,
//       'Scheduled': 4,
//     };

//     const currentWeight = statusWeight[currentStatus] || 1;
//     const targetWeight = statusWeight[stepName] || 0;

//     if (currentWeight > targetWeight) return 'completed';
//     if (currentWeight === targetWeight) return 'active';
//     return 'upcoming';
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="font-mono text-xs animate-pulse tracking-[0.5em] text-gray-400">RETRIEVING DATA...</p>
//     </div>
//   );

//   if (!order) return <p className="p-10 text-center">Order not found.</p>;

//   // Detect if admin flagged the site logistics as unpassable during step 2 review
//   const isInspectionRejected = order.inspection_status === 'Failed' || order.status === 'Rejected';

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 print:p-0 print:pb-0">
      
//       <div className="flex justify-between items-center print:justify-end">
//         <Link 
//           href="/dashboard/customer" 
//           className="flex items-center text-xs font-bold text-gray-400 hover:text-[#064e3b] transition-colors print:hidden"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
        
//         <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//           isInspectionRejected ? 'bg-red-100 text-red-700 border border-red-200' : 
//           order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
//           order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
//           'bg-emerald-100 text-emerald-700'
//         }`}>
//           {isInspectionRejected ? 'REJECTED / DISAPPROVED' : order.status}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        
//         {/* LEFT BAR: PROJECT SUMMARY AND PIPELINE PROGRESS DETAILS */}
//         <div className="lg:col-span-1 space-y-6 print:hidden">
          
//           <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
//             <div>
//               <h2 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Project Summary</h2>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-[10px] text-gray-400 uppercase">Project Name</p>
//                   <p className="font-bold text-gray-800 leading-tight">{order.project_name}</p>
//                 </div>
//                 {needsPump && (
//                   <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-xl">
//                     <p className="text-[9px] text-cyan-600 font-bold uppercase tracking-tighter">Equipment Required</p>
//                     <p className="text-[11px] font-black text-cyan-700 uppercase">Pumpcrete Service Included</p>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-[10px] text-gray-400 uppercase">Total Volume</p>
//                   <p className="font-black text-xl text-[#064e3b]">
//                     {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <hr className="border-gray-100" />

//             {/* LIVE STEP-BY-STEP FLOW TRACKER */}
//             <div>
//               <h3 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Order Progress</h3>
//               <div className="space-y-5 relative before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-[2px] before:bg-gray-100">
                
//                 {/* STEP 1: SITE INSPECTION ASSESSMENT */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     order.inspection_status === 'Passed' ? 'bg-emerald-500 text-white' :
//                     order.inspection_status === 'Failed' ? 'bg-red-500 text-white ring-4 ring-red-100' :
//                     order.status === 'Pending' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-emerald-500 text-white'
//                   }`}>
//                     <ClipboardCheck className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col flex-1">
//                     <div className="flex items-center justify-between">
//                       <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                         order.inspection_status === 'Failed' ? 'text-red-600' : 
//                         order.status === 'Pending' ? 'text-amber-600' : 'text-gray-700'
//                       }`}>
//                         1. Site Inspection
//                       </p>
//                       {order.inspection_status && (
//                         <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded-md tracking-wide ${
//                           order.inspection_status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
//                         }`}>
//                           {order.inspection_status}
//                         </span>
//                       )}
//                     </div>
                    
//                     <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
//                       {order.inspection_status === 'Passed' && "Site accessibility cleared for heavy transit mixers."}
//                       {order.inspection_status === 'Failed' && "Site access rejected by dispatch management."}
//                       {!order.inspection_status && "Awaiting engineering field inspection assessment."}
//                     </p>

//                     {/* Dynamic Administrative Inspection Remarks Field */}
//                     {order.inspection_remarks && (
//                       <div className={`text-[10px] mt-2 p-2 rounded-xl border font-sans leading-relaxed ${
//                         order.inspection_status === 'Failed' 
//                           ? 'bg-red-50/70 border-red-100 text-red-800' 
//                           : 'bg-gray-50 border-gray-100 text-gray-600'
//                       }`}>
//                         <span className="font-bold uppercase text-[8px] block tracking-wider opacity-70">Admin Evaluation Notes:</span>
//                         "{order.inspection_remarks}"
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* STEP 2: COMMERCIAL QUOTATION GENERATION */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     getStepStatus('Quotation Sent') === 'completed' ? 'bg-emerald-500 text-white' :
//                     getStepStatus('Quotation Sent') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 
//                     getStepStatus('Quotation Sent') === 'blocked' ? 'bg-gray-100 text-gray-300 lines-through' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <FileText className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       getStepStatus('Quotation Sent') === 'active' ? 'text-amber-600' : 'text-gray-700'
//                     } ${getStepStatus('Quotation Sent') === 'blocked' ? 'line-through text-gray-300' : ''}`}>
//                       2. Commercial Pricing
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight">
//                       {order.status === 'Pending' ? 'Awaiting step 1 logistics approval.' : 'Quotation dispatched for client evaluation.'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* STEP 3: ADVANCE PAYMENT VERIFICATION */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     getStepStatus('For Payment Verification') === 'completed' ? 'bg-emerald-500 text-white' :
//                     getStepStatus('For Payment Verification') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <Wallet className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       getStepStatus('For Payment Verification') === 'active' ? 'text-amber-600' : 'text-gray-700'
//                     } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
//                       3. Payment Verification
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight">
//                       Requires deposit slip upload to clear operations block.
//                     </p>
//                   </div>
//                 </div>

//                 {/* STEP 4: DELIVERED & SCHEDULED SLOTS */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     (order.status === 'Approved' || order.status === 'Scheduled') ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <CalendarCheck className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       (order.status === 'Approved' || order.status === 'Scheduled') ? 'text-emerald-700' : 'text-gray-700'
//                     } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
//                       4. Order Dispatched
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight">
//                       Batching plant activation and mixer delivery assignment.
//                     </p>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* ENTIRE TRANSACTION CANCELLATION BOX */}
//             {isInspectionRejected && (
//               <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
//                 <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-[10px] font-black text-red-700 uppercase tracking-tight">Pipeline Cancelled</p>
//                   <p className="text-[10px] text-red-600 leading-snug mt-0.5">
//                     {order.rejection_remarks || "This RMC order pipeline has been closed due to failed operational criteria."}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* WORKFLOW CONDITIONAL BOX 1: QUOTATION REVIEW ACTIONS */}
//           {order.status === "Quotation Sent" && !isInspectionRejected && (
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
//           {order.status === "For Payment Verification" && !isInspectionRejected && (
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
//         <div className="lg:col-span-3 print:w-full">
//           {isInspectionRejected ? (
//             <div className="bg-white border-2 border-red-100 p-16 rounded-3xl text-center max-w-2xl mx-auto shadow-sm">
//               <div className="inline-flex p-4 bg-red-50 rounded-full mb-4 text-red-500">
//                 <XCircle className="w-8 h-8" />
//               </div>
//               <h3 className="text-gray-900 font-black text-base uppercase tracking-tight">Transaction Dropped</h3>
//               <p className="text-gray-500 text-xs mt-3 leading-relaxed max-w-md mx-auto">
//                 This transaction has been flagged as unfeasible due to site inspection restrictions. If logistics parameters change, please open a fresh ordering request pipeline.
//               </p>
//             </div>
//           ) : order.quotation ? (
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

// "use client";
// import { useEffect, useState, use } from 'react';
// import api from '@/src/lib/api';
// import QuotationView from '@/src/components/QuotationView';
// import { CheckCircle, AlertCircle, ArrowLeft, XCircle, Upload, FileCheck, Loader2, ClipboardCheck, FileText, Wallet, CalendarCheck, Ban } from 'lucide-react';
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

//   // Helper function to evaluate timeline step styling maps
//   const getStepStatus = (stepName: string) => {
//     const currentStatus = order?.status;
    
//     // Explicit system validation drop locks
//     if (currentStatus === 'Rejected' || currentStatus === 'Inspection Rejected') {
//       return 'failed';
//     }

//     const statusWeight: Record<string, number> = {
//       'Pending': 1,
//       'Quotation Sent': 2,
//       'For Inspection': 3,
//       'For Re-inspection': 3,
//       'For Payment Verification': 4,
//       'Ready for Pouring': 5,
//       'Delivered': 6,
//     };

//     const currentWeight = statusWeight[currentStatus] || 1;
//     const targetWeight = statusWeight[stepName] || 0;

//     if (currentWeight > targetWeight) return 'completed';
//     if (currentWeight === targetWeight) return 'active';
//     return 'upcoming';
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="font-mono text-slate-400 text-xs animate-pulse tracking-[0.5em]">RETRIEVING DATA...</p>
//     </div>
//   );

//   if (!order) return <p className="p-10 text-center font-medium text-gray-500">Order context row not located.</p>;

//   // Synchronized variables pointing downstream to your nested relations map
//   const inspection = order.site_inspection; 
//   const isInspectionRejected = order.status === 'Inspection Rejected' || order.status === 'Rejected';
//   const isReinspectionNeeded = order.status === 'For Re-inspection';

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 print:p-0 print:pb-0">
      
//       <div className="flex justify-between items-center print:justify-end">
//         <Link 
//           href="/dashboard/customer" 
//           className="flex items-center text-xs font-black text-gray-400 hover:text-emerald-800 transition-colors print:hidden tracking-wider"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
//         </Link>
        
//         <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
//           isInspectionRejected ? 'bg-red-50 text-red-700 border-red-200' : 
//           isReinspectionNeeded ? 'bg-amber-50 text-amber-700 border-amber-200' :
//           order.status === 'Pending' ? 'bg-slate-100 text-slate-700 border-slate-200' : 
//           order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border-amber-200' :
//           'bg-emerald-100 text-emerald-700 border-emerald-200'
//         }`}>
//           {order.status}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        
//         {/* LEFT BAR: PROJECT SUMMARY AND PIPELINE PROGRESS DETAILS */}
//         <div className="lg:col-span-1 space-y-6 print:hidden">
          
//           <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
//             <div>
//               <h2 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Project Summary</h2>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Project Name</p>
//                   <p className="font-bold text-gray-800 leading-tight mt-0.5">{order.project_name}</p>
//                 </div>
//                 {needsPump && (
//                   <div className="p-3 bg-cyan-50/70 border border-cyan-100 rounded-2xl">
//                     <p className="text-[9px] text-cyan-600 font-black uppercase tracking-wider">Equipment Required</p>
//                     <p className="text-[11px] font-black text-cyan-800 uppercase mt-0.5">Pumpcrete Service Active</p>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Volume</p>
//                   <p className="font-black text-xl text-emerald-900 mt-0.5">
//                     {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <hr className="border-gray-100" />

//             {/* LIVE STEP-BY-STEP FLOW TRACKER */}
//             <div>
//               <h3 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Order Progress</h3>
//               <div className="space-y-5 relative before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-[2px] before:bg-gray-100">
                
//                 {/* STEP 1: LOGISTICS DISPATCH INSPECTION */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     inspection?.result === 'Approved' ? 'bg-emerald-500 text-white' :
//                     inspection?.result === 'Rejected' ? 'bg-red-500 text-white ring-4 ring-red-100' :
//                     isReinspectionNeeded ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
//                     order.status === 'For Inspection' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <ClipboardCheck className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col flex-1">
//                     <div className="flex items-center justify-between gap-1">
//                       <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                         inspection?.result === 'Rejected' ? 'text-red-600' : 
//                         order.status === 'For Inspection' || isReinspectionNeeded ? 'text-amber-600' : 'text-gray-700'
//                       }`}>
//                         1. Site Inspection
//                       </p>
//                       {inspection?.result && (
//                         <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wide shrink-0 ${
//                           inspection.result === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
//                           inspection.result === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
//                         }`}>
//                           {inspection.result}
//                         </span>
//                       )}
//                     </div>
                    
//                     <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
//                       {inspection?.result === 'Approved' && "Site path assessment cleared completely."}
//                       {inspection?.result === 'Rejected' && "Accessibility rejected by engineer diagnostics."}
//                       {isReinspectionNeeded && "Follow-up verification check scheduled."}
//                       {!inspection?.result && "Awaiting engineering field assessment deployment."}
//                     </p>

//                     {/* Integrated dynamic remarks box reading directly from your site inspection model snapshots */}
//                     {inspection?.remarks && (
//                       <div className={`text-[10px] mt-2 p-2 rounded-xl border leading-relaxed font-sans ${
//                         inspection.result === 'Rejected' 
//                           ? 'bg-red-50/70 border-red-100 text-red-800' 
//                           : 'bg-gray-50 border-gray-100 text-gray-600'
//                       }`}>
//                         <span className="font-bold uppercase text-[8px] block tracking-wider opacity-70">Inspector Notes:</span>
//                         "{inspection.remarks}"
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* STEP 2: PRICING QUOTATION EVALUATION */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     getStepStatus('Quotation Sent') === 'completed' ? 'bg-emerald-500 text-white' :
//                     getStepStatus('Quotation Sent') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 
//                     getStepStatus('Quotation Sent') === 'failed' ? 'bg-gray-100 text-gray-300' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <FileText className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       getStepStatus('Quotation Sent') === 'active' ? 'text-amber-600' : 'text-gray-700'
//                     } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
//                       2. Commercial Pricing
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
//                       {order.status === 'Pending' ? 'Awaiting base system initialization.' : 'Quotation structural summary loaded.'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* STEP 3: ADVANCE PAYMENT PROOF CHECKS */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     getStepStatus('For Payment Verification') === 'completed' ? 'bg-emerald-500 text-white' :
//                     getStepStatus('For Payment Verification') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <Wallet className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       getStepStatus('For Payment Verification') === 'active' ? 'text-amber-600' : 'text-gray-700'
//                     } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
//                       3. Payment Verification
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
//                       Snapshot upload required to satisfy balance control blocks.
//                     </p>
//                   </div>
//                 </div>

//                 {/* STEP 4: DELIVERED / READY SLOT DISPATCH */}
//                 <div className="flex gap-3 relative items-start">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
//                     order.status === 'Ready for Pouring' || order.status === 'Delivered' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-100 text-gray-400'
//                   }`}>
//                     <CalendarCheck className="w-3 h-3" />
//                   </div>
//                   <div className="flex flex-col">
//                     <p className={`text-[11px] font-bold uppercase tracking-tight ${
//                       order.status === 'Ready for Pouring' || order.status === 'Delivered' ? 'text-emerald-700' : 'text-gray-700'
//                     } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
//                       4. Order Dispatched
//                     </p>
//                     <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
//                       Batching plant activation and automated structural pouring.
//                     </p>
//                   </div>
//                 </div>

//               </div>
//             </div>

//             {/* PIPELINE DISAPPROVAL LOG WARNING PANEL */}
//             {isInspectionRejected && (
//               <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
//                 <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-[10px] font-black text-red-700 uppercase tracking-tight">Pipeline Cancelled</p>
//                   <p className="text-[10px] text-red-600 leading-snug mt-0.5">
//                     {inspection?.remarks || "This RMC transactional workflow has been formally closed due to failed operational criteria."}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* WORKFLOW CONDITIONAL BOX 1: QUOTATION REVIEW ACTIONS */}
//           {order.status === "Quotation Sent" && !isInspectionRejected && (
//             <div className="bg-[#111827] p-6 rounded-3xl shadow-xl border border-gray-800">
//               <p className="text-white text-xs font-bold mb-4 flex items-center tracking-wide">
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
//           {order.status === "For Payment Verification" && !isInspectionRejected && (
//             <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-amber-200/70 space-y-4">
//               <div className="flex items-center gap-2 text-amber-800">
//                 <Upload className="w-4 h-4 shrink-0 animate-bounce" />
//                 <p className="text-[11px] font-black uppercase tracking-wider">Upload Payment</p>
//               </div>
//               <p className="text-gray-500 text-[11px] leading-relaxed">
//                 Please attach your bank transfer receipt, deposit slip, or electronic transaction receipt screenshot to secure your pouring slot clearance.
//               </p>
              
//               <div className="relative border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
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
//                     ? 'bg-emerald-950 text-white hover:bg-emerald-900' 
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
//         <div className="lg:col-span-3 print:w-full space-y-6">
          
//           {/* EMPHASIS BANNER: Showed strictly on inspection rejection alongside the quotation view downstream */}
//           {isInspectionRejected && (
//             <div className="bg-gradient-to-r from-red-500 to-red-600 border border-red-400 p-6 rounded-3xl text-white shadow-md print:bg-white print:text-black print:border-gray-300">
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-white/10 rounded-2xl shrink-0 backdrop-blur-sm print:border print:border-gray-200">
//                   <Ban className="w-6 h-6 text-white print:text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-black text-sm uppercase tracking-wider">Transaction Cancelled via Inspection</h3>
//                   <p className="text-red-100 text-xs mt-1 leading-relaxed max-w-xl print:text-gray-600">
//                     This order proposal is currently flagged as **unfeasible** based on strict site logistics and roadway clear-path verification metrics. The architectural structural calculations are provided below for reference records only.
//                   </p>
//                   {inspection?.remarks && (
//                     <div className="mt-3 text-[11px] bg-black/10 border border-white/5 p-3 rounded-xl font-mono text-red-50">
//                       <span className="font-bold uppercase tracking-wider block text-[9px] text-white/70 mb-1">Engineering Assessment Field Log:</span>
//                       "{inspection.remarks}"
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* CANVAS CONTENT DETERMINATION */}
//           {order.quotation ? (
//             <div className={isInspectionRejected ? "opacity-65 grayscale-[30%] select-none pointer-events-none print:opacity-100 print:grayscale-0" : ""}>
//               <QuotationView 
//                 data={order.quotation} 
//                 orderData={order} 
//               />
//             </div>
//           ) : (
//             <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
//               <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
//                 <AlertCircle className="text-amber-500 w-6 h-6" />
//               </div>
//               <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
//               <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
//                 Admin is currently verifying distance, road safety clear paths, and material formulation matrix parameters.
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
import { CheckCircle, AlertCircle, ArrowLeft, XCircle, Upload, FileCheck, Loader2, ClipboardCheck, FileText, Wallet, CalendarCheck, Ban } from 'lucide-react';
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

  // Helper function to evaluate timeline step styling maps matching the new structural sequence
  const getStepStatus = (stepName: string) => {
    const currentStatus = order?.status;
    
    if (currentStatus === 'Rejected' || currentStatus === 'Inspection Rejected') {
      return 'failed';
    }

    const statusWeight: Record<string, number> = {
      'Pending': 1,
      'Quotation Sent': 1, // Step 1 Context
      'For Inspection': 2, // Step 2 Context
      'For Re-inspection': 2,
      'For Payment Verification': 3, // Step 3 Context
      'Ready for Pouring': 4, // Step 4 Context
      'Delivered': 5,
    };

    const currentWeight = statusWeight[currentStatus] || 1;
    const targetWeight = statusWeight[stepName] || 0;

    if (currentWeight > targetWeight) return 'completed';
    if (currentWeight === targetWeight) return 'active';
    return 'upcoming';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="font-mono text-slate-400 text-xs animate-pulse tracking-[0.5em]">RETRIEVING DATA...</p>
    </div>
  );

  if (!order) return <p className="p-10 text-center font-medium text-gray-500">Order context row not located.</p>;

  // Synchronized variables pointing downstream to your nested relations map
  const inspection = order.site_inspection; 
  const isInspectionRejected = order.status === 'Inspection Rejected' || order.status === 'Rejected';
  const isReinspectionNeeded = order.status === 'For Re-inspection';
  
  // Dynamic Payment Term flags based on backend values (e.g., 'COD', 'Cash on Delivery', 'Advance')
  const isCOD = order.payment_terms?.toUpperCase().includes('COD') || order.payment_method?.toUpperCase().includes('COD') || order.payment_terms?.toUpperCase().includes('CASH ON DELIVERY');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20 print:p-0 print:pb-0">
      
      <div className="flex justify-between items-center print:justify-end">
        <Link 
          href="/dashboard/customer" 
          className="flex items-center text-xs font-black text-gray-400 hover:text-emerald-800 transition-colors print:hidden tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> BACK TO DASHBOARD
        </Link>
        
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          isInspectionRejected ? 'bg-red-50 text-red-700 border-red-200' : 
          isReinspectionNeeded ? 'bg-amber-50 text-amber-700 border-amber-200' :
          order.status === 'Pending' ? 'bg-slate-100 text-slate-700 border-slate-200' : 
          order.status === 'For Payment Verification' ? 'bg-amber-100 text-amber-800 border-amber-200' :
          'bg-emerald-100 text-emerald-700 border-emerald-200'
        }`}>
          {order.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        
        {/* LEFT BAR: PROJECT SUMMARY AND PIPELINE PROGRESS DETAILS */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Project Summary</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Project Name</p>
                  <p className="font-bold text-gray-800 leading-tight mt-0.5">{order.project_name}</p>
                </div>
                {needsPump && (
                  <div className="p-3 bg-cyan-50/70 border border-cyan-100 rounded-2xl">
                    <p className="text-[9px] text-cyan-600 font-black uppercase tracking-wider">Equipment Required</p>
                    <p className="text-[11px] font-black text-cyan-800 uppercase mt-0.5">Pumpcrete Service Active</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Volume</p>
                  <p className="font-black text-xl text-emerald-900 mt-0.5">
                    {order.order_items?.reduce((acc: number, item: any) => acc + Number(item.volume), 0)} m³
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* LIVE STEP-BY-STEP FLOW TRACKER (NEW SEQUENCE) */}
            <div>
              <h3 className="font-black text-gray-400 text-[10px] uppercase mb-4 tracking-widest">Order Progress</h3>
              <div className="space-y-5 relative before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-[2px] before:bg-gray-100">
                
                {/* NEW STEP 1: COMMERCIAL PRICING EVALUATION */}
                <div className="flex gap-3 relative items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                    getStepStatus('Quotation Sent') === 'completed' ? 'bg-emerald-500 text-white' :
                    getStepStatus('Quotation Sent') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 
                    getStepStatus('Quotation Sent') === 'failed' ? 'bg-gray-100 text-gray-300' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <FileText className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[11px] font-bold uppercase tracking-tight ${
                      getStepStatus('Quotation Sent') === 'active' ? 'text-amber-600' : 'text-gray-700'
                    }`}>
                      1. Commercial Pricing
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                      {order.status === 'Quotation Sent' ? 'Awaiting your action to approve or reject.' : 'Pricing structure calculated.'}
                    </p>
                  </div>
                </div>

                {/* NEW STEP 2: LOGISTICS DISPATCH INSPECTION */}
                <div className="flex gap-3 relative items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                    inspection?.result === 'Approved' ? 'bg-emerald-500 text-white' :
                    inspection?.result === 'Rejected' ? 'bg-red-500 text-white ring-4 ring-red-100' :
                    isReinspectionNeeded ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
                    order.status === 'For Inspection' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <ClipboardCheck className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[11px] font-bold uppercase tracking-tight ${
                        inspection?.result === 'Rejected' ? 'text-red-600' : 
                        order.status === 'For Inspection' || isReinspectionNeeded ? 'text-amber-600' : 'text-gray-700'
                      }`}>
                        2. Site Inspection
                      </p>
                      {inspection?.result && (
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wide shrink-0 ${
                          inspection.result === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                          inspection.result === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {inspection.result}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                      {inspection?.result === 'Approved' && "Site path assessment cleared completely."}
                      {inspection?.result === 'Rejected' && "Accessibility rejected by engineer diagnostics."}
                      {isReinspectionNeeded && "Follow-up verification check scheduled."}
                      {!inspection?.result && "Awaiting engineering field assessment deployment."}
                    </p>

                    {inspection?.remarks && (
                      <div className={`text-[10px] mt-2 p-2 rounded-xl border leading-relaxed font-sans ${
                        inspection.result === 'Rejected' ? 'bg-red-50/70 border-red-100 text-red-800' : 'bg-gray-50 border-gray-100 text-gray-600'
                      }`}>
                        <span className="font-bold uppercase text-[8px] block tracking-wider opacity-70">Inspector Notes:</span>
                        "{inspection.remarks}"
                      </div>
                    )}
                  </div>
                </div>

                {/* NEW STEP 3: PAYMENT VERIFICATION (BASED ON TERMS) */}
                <div className="flex gap-3 relative items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                    getStepStatus('For Payment Verification') === 'completed' ? 'bg-emerald-500 text-white' :
                    getStepStatus('For Payment Verification') === 'active' ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Wallet className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[11px] font-bold uppercase tracking-tight ${
                      getStepStatus('For Payment Verification') === 'active' ? 'text-amber-600' : 'text-gray-700'
                    } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
                      3. Payment Verification
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                      {isCOD 
                        ? "Terms set to Cash on Delivery. Verification cleared for dispatch." 
                        : "Advance remittance validation required via recipe attachments."}
                    </p>
                  </div>
                </div>

                {/* NEW STEP 4: DELIVERED / DISPATCH SLOT */}
                <div className="flex gap-3 relative items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                    order.status === 'Ready for Pouring' || order.status === 'Delivered' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <CalendarCheck className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[11px] font-bold uppercase tracking-tight ${
                      order.status === 'Ready for Pouring' || order.status === 'Delivered' ? 'text-emerald-700' : 'text-gray-700'
                    } ${isInspectionRejected ? 'line-through text-gray-300' : ''}`}>
                      4. Delivery
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                      Batching plant activation and automated structural pouring.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* PIPELINE DISAPPROVAL LOG WARNING PANEL */}
            {isInspectionRejected && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-red-700 uppercase tracking-tight">Pipeline Cancelled</p>
                  <p className="text-[10px] text-red-600 leading-snug mt-0.5">
                    {inspection?.remarks || "This RMC transactional workflow has been formally closed due to failed operational criteria."}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* WORKFLOW CONDITIONAL BOX 1: QUOTATION REVIEW ACTIONS */}
          {order.status === "Quotation Sent" && !isInspectionRejected && (
            <div className="bg-[#111827] p-6 rounded-3xl shadow-xl border border-gray-800">
              <p className="text-white text-xs font-bold mb-4 flex items-center tracking-wide">
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

          {/* WORKFLOW CONDITIONAL BOX 2: ADVANCE PAYMENT PROOF UPLOADER (HIDDEN FOR COD) */}
          {order.status === "For Payment Verification" && !isInspectionRejected && !isCOD && (
            <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-amber-200/70 space-y-4">
              <div className="flex items-center gap-2 text-amber-800">
                <Upload className="w-4 h-4 shrink-0 animate-bounce" />
                <p className="text-[11px] font-black uppercase tracking-wider">Upload Payment</p>
              </div>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Please attach your bank transfer receipt, deposit slip, or electronic transaction receipt screenshot to secure your pouring slot clearance.
              </p>
              
              <div className="relative border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
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
                    ? 'bg-emerald-950 text-white hover:bg-emerald-900' 
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
        <div className="lg:col-span-3 print:w-full space-y-6">
          
          {isInspectionRejected && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 border border-red-400 p-6 rounded-3xl text-white shadow-md print:bg-white print:text-black print:border-gray-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl shrink-0 backdrop-blur-sm print:border print:border-gray-200">
                  <Ban className="w-6 h-6 text-white print:text-red-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider">Transaction Cancelled via Inspection</h3>
                  <p className="text-red-100 text-xs mt-1 leading-relaxed max-w-xl print:text-gray-600">
                    This order proposal is currently flagged as **unfeasible** based on site logistics parameters. The commercial calculation layouts are kept below for your documentation.
                  </p>
                  {inspection?.remarks && (
                    <div className="mt-3 text-[11px] bg-black/10 border border-white/5 p-3 rounded-xl font-mono text-red-50">
                      <span className="font-bold uppercase tracking-wider block text-[9px] text-white/70 mb-1">Engineering Assessment Field Log:</span>
                      "{inspection.remarks}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {order.quotation ? (
            <div className={isInspectionRejected ? "opacity-65 grayscale-[30%] select-none pointer-events-none print:opacity-100 print:grayscale-0" : ""}>
              <QuotationView 
                data={order.quotation} 
                orderData={order} 
                
              />
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-gray-200 p-20 rounded-3xl text-center">
              <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
                <AlertCircle className="text-amber-500 w-6 h-6" />
              </div>
              <p className="text-gray-900 font-bold text-sm uppercase tracking-tight">Price Calculation in Progress</p>
              <p className="text-gray-400 text-[10px] uppercase mt-2 leading-relaxed max-w-xs mx-auto">
                Admin is currently verifying distance, road safety clear paths, and material formulation matrix parameters.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}