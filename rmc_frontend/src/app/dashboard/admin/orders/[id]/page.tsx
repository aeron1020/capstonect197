// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { Calculator, CheckCircle, Truck } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 



// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [distance, setDistance] = useState('');
//   const [pumpRental, setPumpRental] = useState(0);
//   const [pumpMobilization, setPumpMobilization] = useState(0); // Added Mobilization State
//   const [discount, setDiscount] = useState(0);
//   const [paymentTerms, setPaymentTerms] = useState("Cash on Delivery");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (orderId) {
//       api.get(`orders/${orderId}/`)
//         .then(res => {
//           setOrder(res.data);
//           if (res.data.distance_km) setDistance(res.data.distance_km);
          
//           if (res.data.quotation?.breakdown) {
//             const b = res.data.quotation.breakdown;
//             setPumpRental(b.pump_rental || 0);
//             setPumpMobilization(b.pump_mobilization || 0); // Load saved mobilization
//             setDiscount(b.discount || 0);
//             setPaymentTerms(b.payment_terms || "Cash on Delivery");
//           }
//         })
//     }
//   }, [orderId]);

//   const handleSubmitInspection = async () => {
//   try {
//     const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//       result: inspectionResult,
//       remarks: inspectionRemarks
//     });
//     alert(res.data.message);
//     onUpdate(); // This is crucial—it fetches the NEW status from the server
//   } catch (err) {
//     alert("Error saving inspection.");
//   }
// };

//   const handleSendQuote = async () => {
//     setLoading(true);
//     try {
//       await api.post(`orders/${orderId}/send_quotation/`, {
//         distance_km: distance,
//         pump_rental: pumpRental,
//         pump_mobilization: pumpMobilization, // Included in payload
//         discount: discount,
//         payment_terms: paymentTerms
//       });
//       alert("Quotation generated and sent!");
//       window.location.reload();
//     } catch (err) { 
//       console.error(err);
//       alert("Error sending quote"); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center">Loading Project...</div>;

//  return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6 bg-[#f9fafb] min-h-screen">
//       {/* HEADER SECTION - Minimalist Dark */}
//       <div className="bg-[#111827] text-white p-10 rounded-3xl flex justify-between items-end shadow-2xl relative overflow-hidden">
//         <div className="relative z-10">
//           <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-2">Project Overview</p>
//           <h1 className="text-4xl font-black uppercase tracking-tighter">{order.project_name}</h1>
//           <div className="flex gap-4 mt-4">
//              <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 uppercase">{order.project_type}</span>
//              <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/20 uppercase">{order.status}</span>
//           </div>
//         </div>
//         <div className="text-right relative z-10">
//            <p className="text-[10px] text-gray-500 font-black uppercase">Location</p>
//            <p className="text-sm font-medium text-gray-300">{order.project_location}</p>
//         </div>
//         {/* Subtle decorative circle */}
//         <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
//         {/* MAIN STAGE: 8 Columns for bigger visibility */}
//         <div className="lg:col-span-8 space-y-6">
//           {/* THE QUOTATION EDITOR (The logic handles switching between Details and Preview) */}
//           <QuotationEditor 
//             order={order} 
//             onUpdate={() => api.get(`orders/${orderId}/`).then(res => setOrder(res.data))} 
//           />
          
//           {/* Site Info - Secondary */}
//           <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
//             <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Order Requirements</h3>
//             <div className="grid grid-cols-2 gap-4">
//                {order.order_items?.map((item: any) => (
//                  <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
//                     <p className="text-[10px] font-bold text-gray-400 uppercase">{item.mix_design_name}</p>
//                     <p className="text-xl font-black text-gray-900">{item.volume} m³</p>
//                  </div>
//                ))}
//             </div>
//           </section>
//         </div>

//         {/* SIDEBAR: 4 Columns for Adjustments */}
//         <div className="lg:col-span-4 space-y-6">
//           {/* We'll move the input fields into a clean "Adjustment Card" inside QuotationEditor 
//               or pass them as children. For this fix, let's keep QuotationEditor as the controller. */}
//           <div className="sticky top-6">
//              {/* If Quotation Sent, show status card */}
//              {order.status === "Quotation Sent" && (
//                 <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg shadow-emerald-500/20 mb-6">
//                    <div className="flex items-center gap-3 mb-2">
//                       <CheckCircle className="w-5 h-5" />
//                       <span className="font-black uppercase text-xs tracking-widest">Live Quote</span>
//                    </div>
//                    <p className="text-xs opacity-90 leading-relaxed">The client can now view and approve this quotation from their portal.</p>
//                 </div>
//              )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState, use } from 'react'; 
// import api from '@/src/lib/api';
// import { Calculator, CheckCircle, Truck, ClipboardList, MapPin, AlertCircle } from 'lucide-react';
// import QuotationEditor from './QuotationEditor'; 

// export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
//   const resolvedParams = use(params); 
//   const orderId = resolvedParams.id;

//   const [order, setOrder] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
  
//   // --- INSPECTION STATES ---
//   const [inspectionResult, setInspectionResult] = useState("Approved");
//   const [inspectionRemarks, setInspectionRemarks] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- FETCH DATA ---
//   const fetchOrderData = async () => {
//     try {
//       const res = await api.get(`orders/${orderId}/`);
//       setOrder(res.data);
//     } catch (err) {
//       console.error("Error fetching project:", err);
//     }
//   };

//   useEffect(() => {
//     if (orderId) {
//       fetchOrderData();
//     }
//   }, [orderId]);

//   // --- HANDLERS ---
//   const handleSubmitInspection = async () => {
//     if (!inspectionRemarks) return alert("Please provide inspection remarks.");
    
//     setIsSubmitting(true);
//     try {
//       const res = await api.post(`orders/${orderId}/submit_inspection/`, {
//         result: inspectionResult,
//         remarks: inspectionRemarks
//       });
//       alert(res.data.message);
//       fetchOrderData(); // Refreshes the UI with the new status
//       setInspectionRemarks(""); // Clear form
//     } catch (err: any) {
//       alert(err.response?.data?.error || "Error saving inspection.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!order) return <div className="p-10 text-center animate-pulse">Loading Project...</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      
//       {/* HEADER SECTION */}
//       <div className="bg-[#111827] text-white p-10 rounded-3xl flex justify-between items-end shadow-2xl relative overflow-hidden">
//         <div className="relative z-10">
//           <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.3em] mb-2">Project Overview</p>
//           <h1 className="text-4xl font-black uppercase tracking-tighter">{order.project_name}</h1>
//           <div className="flex gap-4 mt-4">
//              <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full border border-white/10 uppercase">{order.project_type}</span>
//              <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/20 uppercase">{order.status}</span>
//           </div>
//         </div>
//         <div className="text-right relative z-10">
//            <p className="text-[10px] text-gray-500 font-black uppercase">Location</p>
//            <p className="text-sm font-medium text-gray-300 flex items-center gap-2 justify-end">
//              <MapPin className="w-4 h-4 text-cyan-500" /> {order.project_location}
//            </p>
//         </div>
//         <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
//         {/* MAIN STAGE (LEFT) */}
//         <div className="lg:col-span-8 space-y-6">
          
//           {/* THE QUOTATION EDITOR */}
//           <QuotationEditor 
//             order={order} 
//             onUpdate={fetchOrderData} 
//           />
          
//           {/* SITE INSPECTION PANEL - Only shows when status is 'For Inspection' */}
//           {order.status === "For Inspection" && (
//             <section className="bg-white p-8 rounded-3xl border-2 border-cyan-100 shadow-xl overflow-hidden relative">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-3 bg-cyan-500 rounded-2xl text-white">
//                   <ClipboardList className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Site Inspection Report</h3>
//                   <p className="text-xs text-gray-500 font-medium">Evaluate site accessibility and finalize technical approval.</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Inspection Result</label>
//                   <select 
//                     value={inspectionResult}
//                     onChange={(e) => setInspectionResult(e.target.value)}
//                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
//                   >
//                     <option value="Approved">Approved (Proceed to Next Stage)</option>
//                     <option value="Rejected">Rejected (Project Terminated)</option>
//                     <option value="Re-inspection">For Re-inspection</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Technical Remarks</label>
//                   <textarea 
//                     value={inspectionRemarks}
//                     onChange={(e) => setInspectionRemarks(e.target.value)}
//                     placeholder="Describe road condition, pump reach, site hazards..."
//                     className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm min-h-[120px] focus:ring-2 focus:ring-cyan-500 outline-none"
//                   />
//                 </div>

//                 <button 
//                   onClick={handleSubmitInspection}
//                   disabled={isSubmitting}
//                   className="w-full bg-[#111827] text-white p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-cyan-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
//                 >
//                   {isSubmitting ? "Processing..." : "Submit Technical Report"}
//                 </button>
//               </div>
//             </section>
//           )}

//           {/* ORDER ITEMS LIST */}
//           <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
//             <h3 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Order Requirements</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                {order.order_items?.map((item: any) => (
//                  <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
//                     <div>
//                       <p className="text-[10px] font-bold text-gray-400 uppercase">{item.mix_design_name}</p>
//                       <p className="text-xl font-black text-gray-900">{item.volume} m³</p>
//                     </div>
//                     <Truck className="w-8 h-8 text-gray-200" />
//                  </div>
//                ))}
//             </div>
//           </section>
//         </div>

//         {/* SIDEBAR (RIGHT) */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="sticky top-6">
//              {/* STATUS MESSAGES */}
//              {order.status === "Quotation Sent" && (
//                 <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg shadow-emerald-500/20">
//                    <div className="flex items-center gap-3 mb-2">
//                       <CheckCircle className="w-5 h-5" />
//                       <span className="font-black uppercase text-xs tracking-widest">Live Quote</span>
//                    </div>
//                    <p className="text-xs opacity-90 leading-relaxed">Wait for client approval before proceeding to inspection.</p>
//                 </div>
//              )}

//              {order.status === "Ready for Pouring" && (
//                 <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-500/20">
//                    <div className="flex items-center gap-3 mb-2">
//                       <Truck className="w-5 h-5" />
//                       <span className="font-black uppercase text-xs tracking-widest">Confirmed Order</span>
//                    </div>
//                    <p className="text-xs opacity-90 leading-relaxed">This order is approved and ready for dispatch scheduling.</p>
//                 </div>
//              )}

//              {order.status === "For Payment Verification" && (
//                 <div className="bg-orange-500 text-white p-6 rounded-3xl shadow-lg shadow-orange-500/20">
//                    <div className="flex items-center gap-3 mb-2">
//                       <AlertCircle className="w-5 h-5" />
//                       <span className="font-black uppercase text-xs tracking-widest">Awaiting Payment</span>
//                    </div>
//                    <p className="text-xs opacity-90 leading-relaxed">Inspection approved! Waiting for customer to upload proof of payment.</p>
//                 </div>
//              )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, use } from 'react'; 
import api from '@/src/lib/api';
import { 
  Calculator, CheckCircle, Truck, ClipboardList, 
  MapPin, AlertCircle, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import QuotationEditor from './QuotationEditor'; 
import Swal from 'sweetalert2';

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); 
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [openSection, setOpenSection] = useState<string | null>("quotation"); // Controls collapse state
  
  // Inspection Form States
  const [inspectionResult, setInspectionResult] = useState("Approved");
  const [inspectionRemarks, setInspectionRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const fetchOrderData = async () => {
  try {
    const res = await api.get(`orders/${orderId}/`);
    setOrder(res.data);
    setRescheduleDate(res.data.proposed_schedule); 
    if (res.data.status === "For Inspection") setOpenSection("inspection");
  } catch (err) { console.error(err); }
  };

  const handleVerifyPayment = async (paymentId: number, decision: 'approve' | 'reject') => {
  try {
    const res = await api.post(`payments/${paymentId}/verify_payment/`, {
      decision: decision
    });
    Swal.fire({
    title: 'SYSTEM UPDATE',
    text: res.data.message || 'Operation executed successfully.',
    icon: 'success', // Displays a clean checkmark, or change to 'info' if preferred
    background: '#0f172a',
    color: '#f8fafc',
    confirmButtonColor: '#06b6d4', // Aeron Ops Signature Cyan
    customClass: {
      popup: 'rounded-3xl border border-slate-800 font-sans'
    }
  });
    fetchOrderData(); // This will move the order to "Ready for Pouring"
  } catch (err) {
    Swal.fire({
      title: 'SYSTEM ERROR',
      text: "Error verifying payment.",
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

  useEffect(() => { if (orderId) fetchOrderData(); }, [orderId]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubmitInspection = async () => {
    if (!inspectionRemarks) return Swal.fire({
      title: 'INPUT REQUIRED',
      text: "Please provide inspection remarks.",
      icon: 'warning',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#06b6d4',
      customClass: {
        popup: 'rounded-3xl border border-slate-800 font-sans'
      }
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
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#06b6d4',
        customClass: {
          popup: 'rounded-3xl border border-slate-800 font-sans'
        }
      });
      fetchOrderData(); 
      setOpenSection("payment"); 
    } catch (err: any) {
      Swal.fire({
        title: 'SYSTEM ERROR',
        text: err.response?.data?.error || "Error saving inspection.",
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-3xl border border-slate-800 font-sans'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return <div className="p-10 text-center animate-pulse font-black text-gray-400">LOADING PROJECT ENGINE...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans">
      
      {/* 1. COMPACT HEADER */}
      <header className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
              order.status.includes('Approved') ? 'bg-green-100 text-green-700' : 'bg-cyan-100 text-cyan-700'
            }`}>
              {order.status}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{order.id}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{order.project_name}</h1>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" /> {order.project_location}
          </p>
        </div>
        
        <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
           <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase">Total Volume</p>
             <p className="text-xl font-black text-gray-900">
               {order.order_items?.reduce((acc: number, item: any) => acc + parseFloat(item.volume), 0)} m³
             </p>
           </div>
        </div>
      </header>

      <main className="space-y-4">
        
        {/* 2. QUOTATION SECTION (COLLAPSIBLE) */}
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

        {/* 3. INSPECTION SECTION (COLLAPSIBLE) */}
        <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all ${
          order.status === "For Inspection" ? "ring-2 ring-cyan-500 ring-offset-2" : ""
        }`}>
          <button 
            onClick={() => toggleSection("inspection")}
            disabled={order.status === "Pending"} // Disable until quote is sent
            className={`w-full p-6 flex justify-between items-center transition-colors ${
              order.status === "Pending" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${order.status === "Ready for Pouring" ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
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
            <div className="p-8 pt-0 border-t border-gray-50 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Site Verdict</label>
                    <select 
                      value={inspectionResult}
                      onChange={(e) => setInspectionResult(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold"
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
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm min-h-[100px]"
                      placeholder="Enter site findings here..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Confirmed Pouring Date
                    </label>
                    <input 
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                    <p className="text-[10px] text-orange-500 font-bold mt-1 uppercase italic">
                      * Change this only if the site isn't ready for the original date.
                    </p>
                  </div>
                  <button 
                    onClick={handleSubmitInspection}
                    disabled={isSubmitting}
                    className="w-full bg-[#111827] text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Submit Inspection"}
                  </button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Workflow Alert</h4>
                   <div className="flex gap-3">
                      <Info className="w-5 h-5 text-cyan-500 shrink-0" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Approving this inspection will automatically transition the order to 
                        <span className="font-bold text-gray-900"> {order.payment_term === 'COD' ? 'Ready for Pouring' : 'Payment Verification'}</span>.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. PAYMENT VERIFICATION (COLLAPSIBLE) */}
        <section className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${
          order.status === "For Payment Verification" ? "ring-2 ring-orange-500 ring-offset-2" : ""
        }`}>
          <button 
            onClick={() => toggleSection("payment")}
            disabled={order.status !== "For Payment Verification"}
            className={`w-full p-6 flex justify-between items-center transition-colors ${
              order.status !== "For Payment Verification" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${order.payment_status === "Paid" ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-sm uppercase tracking-tight">Step 3: Payment Verification</h3>
                <p className="text-xs text-gray-400">Review uploaded bank receipts or check payments.</p>
              </div>
            </div>
            {openSection === "payment" ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>

          {openSection === "payment" && (
            <div className="p-8 pt-0 border-t border-gray-50 bg-white">
              {/* Assuming you'll have a Payment list in the order response */}
              {order.payments?.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {order.payments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          <img src={payment.proof_file} alt="Proof" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Proof of Payment</p>
                          <p className="text-[10px] text-gray-500 uppercase">{payment.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleVerifyPayment(payment.id, 'approve')}
                          className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleVerifyPayment(payment.id, 'reject')}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold uppercase"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 p-10 text-center border-2 border-dashed rounded-3xl">
                  <p className="text-sm text-gray-400 font-medium">Awaiting customer upload...</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 4. LOGISTICS SECTION (LOCKED UNTIL READY) */}
        <section className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between ${
          order.status !== "Ready for Pouring" ? "opacity-40" : "opacity-100"
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 text-gray-500 rounded-2xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight text-gray-400">Step 3: Dispatch & Scheduling</h3>
              <p className="text-xs text-gray-400 italic">Locked until site inspection is approved.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-gray-300 border border-gray-100 px-3 py-1 rounded-full uppercase">Locked</span>
        </section>
      </main>
    </div>
  );
}