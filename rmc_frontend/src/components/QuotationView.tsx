// "use client";
// import React from 'react';

// interface QuotationProps {
//   data: any; 
//   orderData: any; 
// }

// export default function QuotationView({ data, orderData }: QuotationProps) {
//   // CRITICAL SAFETY CHECK: Prevent the "Cannot read properties of undefined" crash
//   if (!orderData || !data) {
//     return (
//       <div className="p-10 text-center bg-white border border-dashed rounded-sm">
//         <p className="font-mono text-[10px] animate-pulse text-gray-400">AUTHENTICATING DOCUMENT...</p>
//       </div>
//     );
//   }

//   const currentDate = new Date().toLocaleDateString('en-PH', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   // Safe Access to ID
//   const orderIdString = orderData?.id?.toString().padStart(4, '0') || "0000";
//   const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;

//   return (
//     <div className="bg-white p-12 shadow-2xl border border-gray-200 rounded-sm text-gray-800 font-serif max-w-[850px] mx-auto print:shadow-none print:p-0">
      
//       {/* HEADER */}
//       <div className="flex justify-between items-start mb-12">
//         <div>
//           <p className="font-bold text-[10px] uppercase text-gray-400">Date Issued</p>
//           <p className="font-bold text-sm border-b border-gray-800 pb-1">{currentDate}</p>
//         </div>
//         <div className="text-right">
//           <p className="font-bold text-[10px] uppercase text-gray-400">Control No.</p>
//           <p className="font-mono text-sm font-black text-[#064e3b]">{controlNumber}</p>
//         </div>
//       </div>

//       {/* RECIPIENT */}
//       <div className="mb-10 text-sm">
//         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Details:</p>
//         <p className="font-black text-xl uppercase tracking-tight">{orderData?.company_name || 'Individual Client'}</p>
//         <p className="text-gray-600">{orderData?.company_address || 'Project Location'}</p>
//         <p className="mt-4">Dear <span className="font-bold">{orderData?.contact_person}</span>,</p>
//       </div>

//       {/* SUBJECT */}
//       <div className="text-center mb-10">
//         <h2 className="font-black text-xl uppercase underline underline-offset-[12px] decoration-1 tracking-tight">
//           Subject: Final Price Quotation
//         </h2>
//       </div>

//       <p className="text-sm mb-8 leading-relaxed">
//         We are pleased to submit our Best and Final Price Quotation for the supply of Ready Mix Concrete for your project to wit:
//       </p>

//       {/* PROJECT DETAILS */}
//       <div className="bg-gray-50 p-6 rounded-lg mb-8 text-sm border-l-4 border-[#064e3b]">
//         <p className="mb-2"><span className="font-bold w-32 inline-block text-gray-400 uppercase text-[10px]">Project Name:</span> <span className="font-bold">{orderData?.project_name}</span></p>
//         <p><span className="font-bold w-32 inline-block text-gray-400 uppercase text-[10px]">Site Location:</span> {orderData?.project_location}</p>
//       </div>

//       {/* PRICING TABLE */}
//       <table className="w-full text-sm mb-12">
//         <thead>
//           <tr className="border-y-2 border-gray-900 text-[10px] uppercase font-bold text-gray-500">
//             <th className="py-3 text-left">Mix Design Description</th>
//             <th className="py-3 text-right">Unit Price</th>
//             <th className="py-3 text-center">Volume</th>
//             <th className="py-3 text-right">Amount</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//         {orderData.order_items?.map((item: any) => {
//           // Access the breakdown data using the design name as the key
//           const calc = data?.breakdown?.items?.[item.mix_design_name];

//           return (
//             <tr key={item.id} className="border-b">
//               <td className="py-5 font-bold text-gray-900">{item.mix_design_name}</td>
              
//               {/* Unit Price */}
//               <td className="py-5 text-right font-mono text-xs">
//                 ₱{(calc?.unit_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </td>

//               {/* Volume */}
//               <td className="py-5 text-center font-bold">
//                 {item.volume} m³
//               </td>

//               {/* Subtotal */}
//               <td className="py-5 text-right font-bold">
//                 ₱{(calc?.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </td>
//             </tr>
//           );
//         })}
        
//         {/* Delivery Fee Row */}
//         <tr className="italic text-gray-500 bg-gray-50/30">
//           <td className="py-4 px-2">Logistics & Delivery Surcharge</td>
//           <td className="py-4 text-right">---</td>
//           <td className="py-4 text-center">---</td>
//           <td className="py-4 text-right font-bold text-gray-700">
//             ₱{(data?.breakdown?.delivery_fee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//           </td>
//         </tr>
//       </tbody>
//         <tfoot>
//           <tr className="border-t-2 border-gray-900">
//             <td colSpan={3} className="py-6 text-right font-black uppercase text-[10px]">Grand Total Contract Amount:</td>
//             <td className="py-6 text-right font-black text-2xl text-[#064e3b] underline underline-offset-4 decoration-double">
//               ₱{data?.final_total?.toLocaleString()}
//             </td>
//           </tr>
//         </tfoot>
//       </table>

//       {/* FOOTER */}
//       <div className="mt-24 pt-8 border-t border-gray-100 text-[9px] text-gray-400 text-center uppercase tracking-[0.2em]">
//         Valid for 30 days | AERON RMC - Villasis Plant Operation Office
//       </div>
//     </div>
//   );
// }

// "use client";
// import React from "react";

// interface QuotationProps {
//   data: any;
//   orderData: any;
// }

// export default function QuotationView({ data, orderData }: QuotationProps) {
//   if (!orderData || !data) {
//     return (
//       <div className="p-10 text-center">
//         <p className="font-mono text-[10px] text-gray-400 animate-pulse uppercase tracking-[0.3em]">
//           Finalizing Document Structure...
//         </p>
//       </div>
//     );
//   }

//   const currentDate = new Date().toLocaleDateString("en-PH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const orderIdString = orderData?.id?.toString().padStart(4, "0") || "0000";
//   const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

//         @page {
//           size: A4;
//           margin: 0;
//         }

//         @media print {
//           .quotation-canvas {
//             box-shadow: none !important;
//             border: none !important;
//             margin: 0 !important;
//             width: 100% !important;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }

//         .serif-body {
//           font-family: 'Libre Baskerville', serif;
//         }
        
//         .heading-font {
//           font-family: 'Cinzel', serif;
//         }
//       `}</style>

//       <div className="quotation-canvas bg-white text-[#1a1a1a] serif-body mx-auto max-w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl border border-gray-200">
        
//         {/* SIDE DECORATION */}
//         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#064e3b] no-print"></div>

//         {/* HEADER SECTION */}
//         <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
//           <div>
//             <h1 className="heading-font text-2xl font-bold tracking-tight text-[#064e3b]">AERON RMC</h1>
//             <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-gray-500">
//               Ready-Mixed Concrete Specialist
//             </p>
//             <div className="mt-2 text-[10px] leading-tight text-gray-600 font-sans">
//               <p>Villasis Plant Operation Office, Pangasinan</p>
//               <p>Contact: +63 (0917) 000-0000</p>
//             </div>
//           </div>

//           <div className="text-right font-sans">
//             <h2 className="text-lg font-black text-gray-300 mb-1 uppercase tracking-tighter">Quotation</h2>
//             <div className="space-y-0.5">
//               <p className="text-[8px] text-gray-400 uppercase font-bold">Control Number</p>
//               <p className="font-mono font-bold text-xs bg-gray-50 px-2 py-0.5 rounded border">{controlNumber}</p>
//               <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Date</p>
//               <p className="text-xs font-bold">{currentDate}</p>
//             </div>
//           </div>
//         </div>

//         {/* RECIPIENT SECTION */}
//         <div className="mb-8 grid grid-cols-2 gap-8 text-[12px]">
//           <div>
//             <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Client Details:</h3>
//             <p className="font-bold text-md leading-tight">{orderData?.contact_person}</p>
//             <p className="uppercase text-[10px] font-bold text-gray-700">{orderData?.company_name}</p>
//             <p className="text-gray-600 italic mt-0.5">{orderData?.project_location}</p>
//           </div>
//           <div className="text-right">
//              <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Reference:</h3>
//              <p className="font-bold text-xs uppercase">{orderData?.project_name}</p>
//              <p className="text-[10px] text-gray-500 italic">Project Type: {orderData?.project_type}</p>
//           </div>
//         </div>

//         {/* FORMAL OPENING */}
//         <div className="mb-6">
//           <p className="text-[12px] leading-relaxed mb-2">
//             Dear <strong>{orderData?.contact_person}</strong>,
//           </p>
//           <p className="text-[12px] leading-relaxed text-justify">
//             We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.
//           </p>
//         </div>

//         {/* ITEM TABLE */}
//         <table className="w-full text-[12px] mb-6 border-t border-b border-black">
//           <thead>
//             <tr className="text-[9px] uppercase font-sans font-black bg-gray-50">
//               <th className="text-left py-2 px-2">Description of Material</th>
//               <th className="text-right py-2 px-2">Price/m³</th>
//               <th className="text-center py-2 px-2">Qty</th>
//               <th className="text-right py-2 px-2">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderData.order_items?.map((item: any) => {
//               const calc = data?.breakdown?.items?.[item.mix_design_name];
//               return (
//                 <tr key={item.id} className="border-b border-gray-100 italic">
//                   <td className="py-2 px-2">
//                     <span className="font-bold not-italic">{item.mix_design_name}</span>
//                   </td>
//                   <td className="text-right px-2 font-mono">₱{(calc?.unit_price || 0).toLocaleString()}</td>
//                   <td className="text-center px-2 font-mono">{item.volume}</td>
//                   <td className="text-right px-2 font-bold font-mono">₱{(calc?.subtotal || 0).toLocaleString()}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* FINANCIAL SUMMARY */}
//         <div className="flex justify-end mb-10">
//           <div className="w-64 font-sans">
//             <div className="space-y-1.5 text-[11px] border-b border-gray-200 pb-3">
//               {/* <div className="flex justify-between">
//                 <span className="text-gray-500 uppercase font-bold">Delivery Fee</span>
//                 <span className="font-mono font-bold">₱{(data?.breakdown?.delivery_fee || 0).toLocaleString()}</span>
//               </div> */}
              
//               {data?.breakdown?.pump_rental > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Pumpcrete Rental</span>
//                   <span className="font-mono font-bold">₱{data.breakdown.pump_rental.toLocaleString()}</span>
//                 </div>
//               )}

//               {data?.breakdown?.pump_mobilization > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Mobilization Fee</span>
//                   <span className="font-mono font-bold">₱{data.breakdown.pump_mobilization.toLocaleString()}</span>
//                 </div>
//               )}

//               {data?.breakdown?.discount > 0 && (
//                 <div className="flex justify-between text-red-700 font-bold">
//                   <span className="uppercase text-[10px]">Less: Discount</span>
//                   <span className="font-mono">- ₱{data.breakdown.discount.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center pt-3">
//               <span className="heading-font font-bold text-[10px] uppercase">Grand Total</span>
//               <div className="text-right">
//                 <span className="text-xl font-black text-[#064e3b] font-sans">
//                   ₱{Number(data?.final_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//                 <p className="text-[7px] text-gray-400 uppercase font-black tracking-widest">VAT Inclusive</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FINAL TERMS */}
//         <div className="grid grid-cols-2 gap-10 font-sans border-t pt-6">
//           <div className="text-[9px] space-y-1.5">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5">Terms & Validity</h4>
//             <p><strong>PAYMENT:</strong> {data?.payment_terms || "COD"}</p>
//             <p><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
//             <p className="italic text-gray-400 mt-2 leading-tight">Note: Price is subject to change based on actual site distance verification.</p>
//           </div>
//           <div className="text-[9px] space-y-1.5">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5">Customer Conforme</h4>
//             <p className="italic text-gray-400 mb-4 leading-tight text-justify">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
//             <div className="pt-2 border-t border-black mt-4">
//               <p className="font-bold uppercase tracking-widest text-center">Authorized Signature</p>
//             </div>
//           </div>
//         </div>

//         {/* SIGNATURE FOOTER */}
//         <div className="mt-12 flex justify-between font-sans">
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Olsen Aeron Paduit</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Technical & Accounting</p>
//           </div>
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Plant Manager</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Authorized Approver</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";
// import React from "react";

// interface QuotationProps {
//   data: any;
//   orderData: any;
// }

// export default function QuotationView({ data, orderData }: QuotationProps) {
//   if (!orderData || !data) {
//     return (
//       <div className="p-10 text-center">
//         <p className="font-mono text-[10px] text-gray-400 animate-pulse uppercase tracking-[0.3em]">
//           Finalizing Document Structure...
//         </p>
//       </div>
//     );
//   }

//   const currentDate = new Date().toLocaleDateString("en-PH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const orderIdString = orderData?.id?.toString().padStart(4, "0") || "0000";
//   const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;

//   // Print function
//   const handlePrint = () => {
//     if (typeof window !== "undefined") {
//       window.print();
//     }
//   };

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:ital,wght=0,400;0,700;1,400&display=swap');

//         @page {
//           size: A4;
//           margin: 0;
//         }

//         @media print {
//           body {
//             background-color: #ffffff !important;
//           }
//           .quotation-canvas {
//             box-shadow: none !important;
//             border: none !important;
//             margin: 0 !important;
//             padding: 0 !important;
//             width: 100% !important;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }

//         .serif-body {
//           font-family: 'Libre Baskerville', serif;
//         }
        
//         .heading-font {
//           font-family: 'Cinzel', serif;
//         }
//       `}</style>

//       {/* NO-PRINT ACTION CONTROLS */}
//       <div className="no-print max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm font-sans">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 bg-[#064e3b] hover:bg-[#043427] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded shadow transition-colors duration-150 cursor-pointer"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className="w-4 h-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.111.607-.409 1.144-1.022 1.144H7.137c-.613 0-1.133-.537-1.022-1.144L6.34 18m11.32 0h-11.32m9.9-10.114V5.25c0-.579-.47-1.05-1.05-1.05H8.814c-.58 0-1.05.471-1.05 1.05v2.636m7.136 0a41.003 41.003 0 0 1 3.383.457c.563.087.947.577.947 1.148v4.843c0 .53-.404.972-.931 1.013a41.13 41.13 0 0 1-1.922.127m-11.32 0a41.136 41.136 0 0 1-1.922-.127C3.064 14.122 2.66 13.68 2.66 13.15V8.307c0-.57.384-1.06.947-1.148 1.107-.17 2.238-.323 3.383-.457m0 0c.261-.031.522-.06.784-.087m7.38 0a41.719 41.719 0 0 0-.784-.087M9.166 11.25h5.669"
//             />
//           </svg>
//           Print / Download PDF
//         </button>
//       </div>

//       {/* MAIN DOCUMENT CANVAS */}
//       <div className="quotation-canvas bg-white text-[#1a1a1a] serif-body mx-auto max-w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl border border-gray-200">
        
//         {/* SIDE DECORATION */}
//         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#064e3b] no-print"></div>

//         {/* HEADER SECTION */}
//         <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
//           <div>
//             <h1 className="heading-font text-2xl font-bold tracking-tight text-[#064e3b]">AERON RMC</h1>
//             <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-gray-500">
//               Ready-Mixed Concrete Specialist
//             </p>
//             <div className="mt-2 text-[10px] leading-tight text-gray-600 font-sans">
//               <p>Villasis Plant Operation Office, Pangasinan</p>
//               <p>Contact: +63 (0917) 000-0000</p>
//             </div>
//           </div>

//           <div className="text-right font-sans">
//             <h2 className="text-lg font-black text-gray-300 mb-1 uppercase tracking-tighter">Quotation</h2>
//             <div className="space-y-0.5">
//               <p className="text-[8px] text-gray-400 uppercase font-bold">Control Number</p>
//               <p className="font-mono font-bold text-xs bg-gray-50 px-2 py-0.5 rounded border">{controlNumber}</p>
//               <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Date</p>
//               <p className="text-xs font-bold">{currentDate}</p>
//             </div>
//           </div>
//         </div>

//         {/* RECIPIENT SECTION (Project reference removed) */}
//         <div className="mb-8 text-[12px]">
//           <div>
//             <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Client Details:</h3>
//             <p className="font-bold text-md leading-tight">{orderData?.contact_person}</p>
//             <p className="uppercase text-[10px] font-bold text-gray-700">{orderData?.company_name}</p>
//             <p className="text-gray-600 italic mt-0.5">{orderData?.project_location}</p>
//           </div>
//         </div>

//         {/* FORMAL OPENING */}
//         <div className="mb-6">
//           <p className="text-[12px] leading-relaxed mb-2">
//             Dear <strong>{orderData?.contact_person}</strong>,
//           </p>
//           <p className="text-[12px] leading-relaxed text-justify">
//             We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.
//           </p>
//         </div>

//         {/* ITEM TABLE */}
//         <table className="w-full text-[12px] mb-6 border-t border-b border-black">
//           <thead>
//             <tr className="text-[9px] uppercase font-sans font-black bg-gray-50">
//               <th className="text-left py-2 px-2">Description of Material</th>
//               <th className="text-right py-2 px-2">Price/m³</th>
//               <th className="text-center py-2 px-2">Qty</th>
//               <th className="text-right py-2 px-2">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderData.order_items?.map((item: any) => {
//               const calc = data?.breakdown?.items?.[item.mix_design_name];
//               return (
//                 <tr key={item.id} className="border-b border-gray-100 italic">
//                   <td className="py-2 px-2">
//                     <span className="font-bold not-italic">{item.mix_design_name}</span>
//                   </td>
//                   <td className="text-right px-2 font-mono">₱{(calc?.unit_price || 0).toLocaleString()}</td>
//                   <td className="text-center px-2 font-mono">{item.volume}</td>
//                   <td className="text-right px-2 font-bold font-mono">₱{(calc?.subtotal || 0).toLocaleString()}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* FINANCIAL SUMMARY */}
//         <div className="flex justify-end mb-10">
//           <div className="w-64 font-sans">
//             <div className="space-y-1.5 text-[11px] border-b border-gray-200 pb-3">
//               {data?.breakdown?.pump_rental > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Pumpcrete Rental</span>
//                   <span className="font-mono font-bold">₱{data.breakdown.pump_rental.toLocaleString()}</span>
//                 </div>
//               )}

//               {data?.breakdown?.pump_mobilization > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Mobilization Fee</span>
//                   <span className="font-mono font-bold">₱{data.breakdown.pump_mobilization.toLocaleString()}</span>
//                 </div>
//               )}

//               {data?.breakdown?.discount > 0 && (
//                 <div className="flex justify-between text-red-700 font-bold">
//                   <span className="uppercase text-[10px]">Less: Discount</span>
//                   <span className="font-mono">- ₱{data.breakdown.discount.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center pt-3">
//               <span className="heading-font font-bold text-[10px] uppercase">Grand Total</span>
//               <div className="text-right">
//                 <span className="text-xl font-black text-[#064e3b] font-sans">
//                   ₱{Number(data?.final_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//                 <p className="text-[7px] text-gray-400 uppercase font-black tracking-widest">VAT Inclusive</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FINAL TERMS */}
//         <div className="grid grid-cols-2 gap-10 font-sans border-t pt-6">
//           <div className="text-[9px] space-y-1.5">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5">Terms & Validity</h4>
//             <p><strong>PAYMENT:</strong> {data?.payment_terms || "COD"}</p>
//             <p><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
//             <p className="italic text-gray-400 mt-2 leading-tight">Note: Price is subject to change based on actual site distance verification.</p>
//           </div>
//           <div className="text-[9px] space-y-1.5">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5">Customer Conforme</h4>
//             <p className="italic text-gray-400 mb-4 leading-tight text-justify">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
//             <div className="pt-2 border-t border-black mt-4">
//               <p className="font-bold uppercase tracking-widest text-center">Authorized Signature</p>
//             </div>
//           </div>
//         </div>

//         {/* SIGNATURE FOOTER */}
//         <div className="mt-12 flex justify-between font-sans">
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Olsen Aeron Paduit</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Technical & Accounting</p>
//           </div>
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Plant Manager</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Authorized Approver</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";
// import React from "react";

// interface QuotationProps {
//   data: any;
//   orderData: any;
// }

// export default function QuotationView({ data, orderData }: QuotationProps) {
//   if (!orderData || !data) {
//     return (
//       <div className="p-10 text-center">
//         <p className="font-mono text-[10px] text-gray-400 animate-pulse uppercase tracking-[0.3em]">
//           Finalizing Document Structure...
//         </p>
//       </div>
//     );
//   }

//   // Normalize data payloads seamlessly if nested under a breakdown object or flat response
//   const breakdownSource = data?.breakdown ? data.breakdown : data;
  
//   const currentDate = new Date().toLocaleDateString("en-PH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const orderIdString = orderData?.id?.toString().padStart(4, "0") || "0000";
//   const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;

//   // Human-readable labels for payment terms selection display mapping exactly to the editor
//   const getTermsLabel = (term: string) => {
//     const labels: Record<string, string> = {
//       COD: "Cash on Delivery (COD)",
//       Terms: "Credit Terms (30 Days)",
//       Advance: "Full Advance Payment",
//       DP: "Percentage Downpayment",
//     };
//     return labels[term] || term;
//   };

//   const handlePrint = () => {
//     if (typeof window !== "undefined") {
//       window.print();
//     }
//   };

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');

//         @page {
//           size: A4;
//           margin: 0;
//         }

//         @media print {
//           body {
//             background-color: #ffffff !important;
//             color: #1a1a1a !important;
//           }
//           .quotation-canvas {
//             box-shadow: none !important;
//             border: none !important;
//             margin: 0 !important;
//             padding: 15mm !important;
//             width: 210mm !important;
//             min-height: 297mm !important;
//             box-sizing: border-box !important;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }

//         .serif-body {
//           font-family: 'Libre Baskerville', serif;
//         }
        
//         .heading-font {
//           font-family: 'Cinzel', serif;
//         }
//       `}</style>

//       {/* NO-PRINT ACTION CONTROLS */}
//       <div className="no-print max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm font-sans">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 bg-[#064e3b] hover:bg-[#043427] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded shadow transition-colors duration-150 cursor-pointer"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className="w-4 h-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.111.607-.409 1.144-1.022 1.144H7.137c-.613 0-1.133-.537-1.022-1.144L6.34 18m11.32 0h-11.32m9.9-10.114V5.25c0-.579-.47-1.05-1.05-1.05H8.814c-.58 0-1.05.471-1.05 1.05v2.636m7.136 0a41.003 41.003 0 0 1 3.383.457c.563.087.947.577.947 1.148v4.843c0 .53-.404.972-.931 1.013a41.13 41.13 0 0 1-1.922.127m-11.32 0a41.136 41.136 0 0 1-1.922-.127C3.064 14.122 2.66 13.68 2.66 13.15V8.307c0-.57.384-1.06.947-1.148 1.107-.17 2.238-.323 3.383-.457m0 0c.261-.031.522-.06.784-.087m7.38 0a41.719 41.719 0 0 0-.784-.087M9.166 11.25h5.669"
//             />
//           </svg>
//           Print / Download PDF
//         </button>
//       </div>

//       {/* MAIN DOCUMENT CANVAS */}
//       <div className="quotation-canvas bg-white text-[#1a1a1a] serif-body mx-auto w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl border border-gray-200 box-border">
        
//         {/* SIDE DECORATION */}
//         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#064e3b] no-print"></div>

//         {/* HEADER SECTION */}
//         <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
//           <div>
//             <h1 className="heading-font text-2xl font-bold tracking-tight text-[#064e3b]">AERON RMC</h1>
//             <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-gray-500">
//               Ready-Mixed Concrete Specialist
//             </p>
//             <div className="mt-2 text-[10px] leading-tight text-gray-600 font-sans">
//               <p>Villasis Plant Operation Office, Pangasinan</p>
//               <p>Contact: +63 (0917) 000-0000</p>
//             </div>
//           </div>

//           <div className="text-right font-sans">
//             <h2 className="text-lg font-black text-gray-300 mb-1 uppercase tracking-tighter">Quotation</h2>
//             <div className="space-y-0.5">
//               <p className="text-[8px] text-gray-400 uppercase font-bold">Control Number</p>
//               <p className="font-mono font-bold text-xs bg-gray-50 px-2 py-0.5 rounded border">{controlNumber}</p>
//               <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Date</p>
//               <p className="text-xs font-bold">{currentDate}</p>
//             </div>
//           </div>
//         </div>

//         {/* RECIPIENT SECTION */}
//         <div className="mb-8 text-[12px]">
//           <div>
//             <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Client Details:</h3>
//             <p className="font-bold text-md leading-tight">{orderData?.contact_person || "Valued Client"}</p>
//             <p className="uppercase text-[10px] font-bold text-gray-700">{orderData?.company_name || ""}</p>
//             <p className="text-gray-600 italic mt-0.5">{orderData?.project_location || ""}</p>
//           </div>
//         </div>

//         {/* FORMAL OPENING */}
//         <div className="mb-6">
//           <p className="text-[12px] leading-relaxed mb-2">
//             Dear <strong>{orderData?.contact_person || "Sir/Madam"}</strong>,
//           </p>
//           <p className="text-[12px] leading-relaxed text-justify">
//             We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.
//           </p>
//         </div>

//         {/* ITEM TABLE */}
//         <table className="w-full text-[12px] mb-6 border-t border-b border-black">
//           <thead>
//             <tr className="text-[9px] uppercase font-sans font-black bg-gray-50">
//               <th className="text-left py-2 px-2">Description of Material</th>
//               <th className="text-right py-2 px-2">Price/m³</th>
//               <th className="text-center py-2 px-2">Qty</th>
//               <th className="text-right py-2 px-2">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderData.order_items?.map((item: any) => {
//               // Resolves data matching directly from raw structure or nested items maps safely
//               const calc = breakdownSource?.items?.[item.mix_design_name];
//               const displayVolume = item.volume || orderData?.volume || 0;
              
//               return (
//                 <tr key={item.id || item.mix_design_name} className="border-b border-gray-100 italic">
//                   <td className="py-2 px-2">
//                     <span className="font-bold not-italic">{item.mix_design_name}</span>
//                   </td>
//                   <td className="text-right px-2 font-mono">₱{(calc?.unit_price || 0).toLocaleString()}</td>
//                   <td className="text-center px-2 font-mono">{displayVolume}</td>
//                   <td className="text-right px-2 font-bold font-mono">₱{(calc?.subtotal || 0).toLocaleString()}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* FINANCIAL SUMMARY */}
//         <div className="flex justify-end mb-10">
//           <div className="w-64 font-sans">
//             <div className="space-y-1.5 text-[11px] border-b border-gray-200 pb-3">
//               {breakdownSource?.pump_rental > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Pumpcrete Rental</span>
//                   <span className="font-mono font-bold">₱{breakdownSource.pump_rental.toLocaleString()}</span>
//                 </div>
//               )}

//               {breakdownSource?.pump_mobilization > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Mobilization Fee</span>
//                   <span className="font-mono font-bold">₱{breakdownSource.pump_mobilization.toLocaleString()}</span>
//                 </div>
//               )}

//               {breakdownSource?.discount > 0 && (
//                 <div className="flex justify-between text-red-700 font-bold">
//                   <span className="uppercase text-[10px]">Less: Discount</span>
//                   <span className="font-mono">- ₱{breakdownSource.discount.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center pt-3">
//               <span className="heading-font font-bold text-[10px] uppercase">Grand Total</span>
//               <div className="text-right">
//                 <span className="text-xl font-black text-[#064e3b] font-sans">
//                   ₱{Number(data?.final_total || data?.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//                 <p className="text-[7px] text-gray-400 uppercase font-black tracking-widest">VAT Inclusive</p>
//               </div>
//             </div>
//           </div>
//         </div>

//             {/* FINAL TERMS */}
//       <div className="font-sans border-t pt-6 text-[9px] space-y-6">
//         {/* First Section: Terms & Validity */}
//         <div className="space-y-1">
//           <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Terms & Validity</h4>
//           <p className="m-0"><strong>PAYMENT:</strong> {getTermsLabel(data?.payment_terms || data?.payment_term || "COD")}</p>
//           <p className="m-0"><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
//           <p className="italic text-gray-400 mt-1 leading-tight m-0">Note: Price is subject to change based on actual site distance verification.</p>
//         </div>
        
//         {/* Second Section: Customer Conforme (Stacked directly underneath) */}
//         <div className=" space-y-1 max-w-[320px]">
//           <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Customer Conforme</h4>
//           <p className="italic text-gray-400 text-justify leading-tight m-0 mb-6">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
//           <div className="pt-1 border-t border-black mt-6">
//             <p className="font-bold uppercase tracking-widest text-center m-0">Authorized Signature</p>
//           </div>
//         </div>
//       </div>

//         {/* SIGNATURE FOOTER */}
//         <div className="mt-24 flex justify-between font-sans">
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Olsen Aeron Paduit</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Technical & Accounting</p>
//           </div>
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Plant Manager</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Authorized Approver</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";
// import React from "react";

// interface QuotationProps {
//   data: any;
//   orderData: any;
// }

// export default function QuotationView({ data, orderData }: QuotationProps) {
//   if (!orderData || !data) {
//     return (
//       <div className="p-10 text-center">
//         <p className="font-mono text-[10px] text-gray-400 animate-pulse uppercase tracking-[0.3em]">
//           Finalizing Document Structure...
//         </p>
//       </div>
//     );
//   }

//   // Normalize data payloads seamlessly if nested under a breakdown object or flat response
//   const breakdownSource = data?.breakdown ? data.breakdown : data;
  
//   const currentDate = new Date().toLocaleDateString("en-PH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // Calculate Revision-aware Control Number
//   const orderIdString = orderData?.id?.toString().padStart(4, "0") || "0000";
//   const baseControlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;
//   const revNo = data?.revision_number || 0;
//   const controlNumber = revNo > 0 ? `${baseControlNumber}-R${revNo}` : baseControlNumber;

//   // Human-readable labels for payment terms selection display mapping exactly to the editor
//   const getTermsLabel = (term: string) => {
//     const labels: Record<string, string> = {
//       COD: "Cash on Delivery (COD)",
//       Terms: "Credit Terms (30 Days)",
//       Advance: "Full Advance Payment",
//       DP: "Percentage Downpayment",
//     };
//     return labels[term] || term;
//   };

//   const handlePrint = () => {
//     if (typeof window !== "undefined") {
//       window.print();
//     }
//   };

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');

//         @page {
//           size: A4;
//           margin: 0;
//         }

//         @media print {
//           body {
//             background-color: #ffffff !important;
//             color: #1a1a1a !important;
//           }
//           .quotation-canvas {
//             box-shadow: none !important;
//             border: none !important;
//             margin: 0 !important;
//             padding: 15mm !important;
//             width: 210mm !important;
//             min-height: 297mm !important;
//             box-sizing: border-box !important;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }

//         .serif-body {
//           font-family: 'Libre Baskerville', serif;
//         }
        
//         .heading-font {
//           font-family: 'Cinzel', serif;
//         }
//       `}</style>

//       {/* NO-PRINT ACTION CONTROLS */}
//       <div className="no-print max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm font-sans">
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 bg-[#064e3b] hover:bg-[#043427] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded shadow transition-colors duration-150 cursor-pointer"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2}
//             stroke="currentColor"
//             className="w-4 h-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.111.607-.409 1.144-1.022 1.144H7.137c-.613 0-1.133-.537-1.022-1.144L6.34 18m11.32 0h-11.32m9.9-10.114V5.25c0-.579-.47-1.05-1.05-1.05H8.814c-.58 0-1.05.471-1.05 1.05v2.636m7.136 0a41.003 41.003 0 0 1 3.383.457c.563.087.947.577.947 1.148v4.843c0 .53-.404.972-.931 1.013a41.13 41.13 0 0 1-1.922.127m-11.32 0a41.136 41.136 0 0 1-1.922-.127C3.064 14.122 2.66 13.68 2.66 13.15V8.307c0-.57.384-1.06.947-1.148 1.107-.17 2.238-.323 3.383-.457m0 0c.261-.031.522-.06.784-.087m7.38 0a41.719 41.719 0 0 0-.784-.087M9.166 11.25h5.669"
//             />
//           </svg>
//           Print / Download PDF
//         </button>
//       </div>

//       {/* MAIN DOCUMENT CANVAS */}
//       <div className="quotation-canvas bg-white text-[#1a1a1a] serif-body mx-auto w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl border border-gray-200 box-border">
        
//         {/* SIDE DECORATION */}
//         <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#064e3b] no-print"></div>

//         {/* HEADER SECTION */}
//         <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
//           <div>
//             <h1 className="heading-font text-2xl font-bold tracking-tight text-[#064e3b]">AERON RMC</h1>
//             <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-gray-500">
//               Ready-Mixed Concrete Specialist
//             </p>
//             <div className="mt-2 text-[10px] leading-tight text-gray-600 font-sans">
//               <p>Villasis Plant Operation Office, Pangasinan</p>
//               <p>Contact: +63 (0917) 000-0000</p>
//             </div>
//           </div>

//           <div className="text-right font-sans">
//             <h2 className="text-lg font-black text-gray-300 mb-1 uppercase tracking-tighter">Quotation</h2>
//             <div className="space-y-0.5">
//               <p className="text-[8px] text-gray-400 uppercase font-bold">Control Number</p>
//               <p className="font-mono font-bold text-xs bg-gray-50 px-2 py-0.5 rounded border">{controlNumber}</p>
//               <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Date</p>
//               <p className="text-xs font-bold">{currentDate}</p>
//             </div>
//           </div>
//         </div>

//         {/* RECIPIENT SECTION */}
//         <div className="mb-8 text-[12px]">
//           <div>
//             <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Client Details:</h3>
//             <p className="font-bold text-md leading-tight">{orderData?.contact_person || "Valued Client"}</p>
//             <p className="uppercase text-[10px] font-bold text-gray-700">{orderData?.company_name || ""}</p>
//             <p className="text-gray-600 italic mt-0.5">{orderData?.project_location || ""}</p>
//           </div>
//         </div>

//         {/* FORMAL OPENING */}
//         <div className="mb-6">
//           <p className="text-[12px] leading-relaxed mb-2">
//             Dear <strong>{orderData?.contact_person || "Sir/Madam"}</strong>,
//           </p>
//           <p className="text-[12px] leading-relaxed text-justify">
//             We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.
//           </p>
//         </div>

//         {/* ITEM TABLE */}
//         <table className="w-full text-[12px] mb-6 border-t border-b border-black">
//           <thead>
//             <tr className="text-[9px] uppercase font-sans font-black bg-gray-50">
//               <th className="text-left py-2 px-2">Description of Material</th>
//               <th className="text-right py-2 px-2">Price/m³</th>
//               <th className="text-center py-2 px-2">Qty</th>
//               <th className="text-right py-2 px-2">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orderData.order_items?.map((item: any) => {
//               // Resolves data matching directly from raw structure or nested items maps safely
//               const calc = breakdownSource?.items?.[item.mix_design_name];
//               const displayVolume = item.volume || orderData?.volume || 0;
              
//               return (
//                 <tr key={item.id || item.mix_design_name} className="border-b border-gray-100 italic">
//                   <td className="py-2 px-2">
//                     <span className="font-bold not-italic">{item.mix_design_name}</span>
//                   </td>
//                   <td className="text-right px-2 font-mono">₱{(calc?.unit_price || 0).toLocaleString()}</td>
//                   <td className="text-center px-2 font-mono">{displayVolume}</td>
//                   <td className="text-right px-2 font-bold font-mono">₱{(calc?.subtotal || 0).toLocaleString()}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* FINANCIAL SUMMARY */}
//         <div className="flex justify-end mb-10">
//           <div className="w-64 font-sans">
//             <div className="space-y-1.5 text-[11px] border-b border-gray-200 pb-3">
//               {breakdownSource?.pump_rental > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Pumpcrete Rental</span>
//                   <span className="font-mono font-bold">₱{breakdownSource.pump_rental.toLocaleString()}</span>
//                 </div>
//               )}

//               {breakdownSource?.pump_mobilization > 0 && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-500 uppercase font-bold text-[10px]">Mobilization Fee</span>
//                   <span className="font-mono font-bold">₱{breakdownSource.pump_mobilization.toLocaleString()}</span>
//                 </div>
//               )}

//               {breakdownSource?.discount > 0 && (
//                 <div className="flex justify-between text-red-700 font-bold">
//                   <span className="uppercase text-[10px]">Less: Discount</span>
//                   <span className="font-mono">- ₱{breakdownSource.discount.toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-between items-center pt-3">
//               <span className="heading-font font-bold text-[10px] uppercase">Grand Total</span>
//               <div className="text-right">
//                 <span className="text-xl font-black text-[#064e3b] font-sans">
//                   ₱{Number(data?.final_total || data?.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </span>
//                 <p className="text-[7px] text-gray-400 uppercase font-black tracking-widest">VAT Inclusive</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* FINAL TERMS */}
//         <div className="font-sans border-t pt-6 text-[9px] space-y-6">
//           {/* First Section: Terms & Validity */}
//           <div className="space-y-1">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Terms & Validity</h4>
//             <p className="m-0"><strong>PAYMENT:</strong> {getTermsLabel(data?.payment_terms || data?.payment_term || "COD")}</p>
//             <p className="m-0"><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
//             <p className="italic text-gray-400 mt-1 leading-tight m-0">Note: Price is subject to change based on actual site distance verification.</p>
//           </div>
          
//           {/* Second Section: Customer Conforme (Stacked directly underneath) */}
//           <div className=" space-y-1 max-w-[320px]">
//             <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Customer Conforme</h4>
//             <p className="italic text-gray-400 text-justify leading-tight m-0 mb-6">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
//             <div className="pt-1 border-t border-black mt-6">
//               <p className="font-bold uppercase tracking-widest text-center m-0">Authorized Signature</p>
//             </div>
//           </div>
//         </div>

//         {/* SIGNATURE FOOTER */}
//         <div className="mt-24 flex justify-between font-sans">
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Olsen Aeron Paduit</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Technical & Accounting</p>
//           </div>
//           <div>
//             <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Plant Manager</p>
//             <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Authorized Approver</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import React from "react";

interface QuotationProps {
  data: any;
  orderData: any;
}

export default function QuotationView({ data, orderData }: QuotationProps) {
  if (!orderData || !data) {
    return (
      <div className="p-10 text-center">
        <p className="font-mono text-[10px] text-gray-400 animate-pulse uppercase tracking-[0.3em]">
          Finalizing Document Structure...
        </p>
      </div>
    );
  }

  // Normalize data payloads seamlessly if nested under a breakdown object or flat response
  const breakdownSource = data?.breakdown ? data.breakdown : data;
  
  const currentDate = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate Revision-aware Control Number
  const orderIdString = orderData?.id?.toString().padStart(4, "0") || "0000";
  const baseControlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;
  const revNo = data?.revision_number || 0;
  const controlNumber = revNo > 0 ? `${baseControlNumber}-R${revNo}` : baseControlNumber;

  // Human-readable labels for payment terms selection display mapping exactly to the editor
  const getTermsLabel = (term: string) => {
    if (!term) return "Cash on Delivery (COD)";

    // Convert string to lower case to eliminate any case mismatch bugs (e.g. "Terms" vs "terms")
    const normalized = term.trim().toLowerCase();

    const labels: Record<string, string> = {
      cod: "Cash on Delivery (COD)",
      terms: "Credit Terms (30 Days)",
      advance: "Full Advance Payment",
      dp: "Percentage Downpayment",
    };

    return labels[normalized] || term;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;700&display=swap');

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          body {
            background-color: #ffffff !important;
            color: #1a1a1a !important;
          }
          .quotation-canvas {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 15mm !important;
            width: 210mm !important;
            min-height: 297mm !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
        }

        .serif-body {
          font-family: 'Libre Baskerville', serif;
        }
        
        .heading-font {
          font-family: 'Cinzel', serif;
        }
      `}</style>

      {/* NO-PRINT ACTION CONTROLS */}
      <div className="no-print max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm font-sans">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#064e3b] hover:bg-[#043427] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded shadow transition-colors duration-150 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 1.252c.111.607-.409 1.144-1.022 1.144H7.137c-.613 0-1.133-.537-1.022-1.144L6.34 18m11.32 0h-11.32m9.9-10.114V5.25c0-.579-.47-1.05-1.05-1.05H8.814c-.58 0-1.05.471-1.05 1.05v2.636m7.136 0a41.003 41.003 0 0 1 3.383.457c.563.087.947.577.947 1.148v4.843c0 .53-.404.972-.931 1.013a41.13 41.13 0 0 1-1.922.127m-11.32 0a41.136 41.136 0 0 1-1.922-.127C3.064 14.122 2.66 13.68 2.66 13.15V8.307c0-.57.384-1.06.947-1.148 1.107-.17 2.238-.323 3.383-.457m0 0c.261-.031.522-.06.784-.087m7.38 0a41.719 41.719 0 0 0-.784-.087M9.166 11.25h5.669"
            />
          </svg>
          Print / Download PDF
        </button>
      </div>

      {/* MAIN DOCUMENT CANVAS */}
      <div className="quotation-canvas bg-white text-[#1a1a1a] serif-body mx-auto w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl border border-gray-200 box-border">
        
        {/* SIDE DECORATION */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#064e3b] no-print"></div>

        {/* HEADER SECTION */}
        <div className="flex justify-between items-start mb-8 border-b border-black pb-4">
          <div>
            <h1 className="heading-font text-2xl font-bold tracking-tight text-[#064e3b]">AERON RMC</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-gray-500">
              Ready-Mixed Concrete Specialist
            </p>
            <div className="mt-2 text-[10px] leading-tight text-gray-600 font-sans">
              <p>Villasis Plant Operation Office, Pangasinan</p>
              <p>Contact: +63 (0917) 000-0000</p>
            </div>
          </div>

          <div className="text-right font-sans">
            <h2 className="text-lg font-black text-gray-300 mb-1 uppercase tracking-tighter">Quotation</h2>
            <div className="space-y-0.5">
              <p className="text-[8px] text-gray-400 uppercase font-bold">Control Number</p>
              <p className="font-mono font-bold text-xs bg-gray-50 px-2 py-0.5 rounded border">{controlNumber}</p>
              <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Date</p>
              <p className="text-xs font-bold">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* RECIPIENT SECTION */}
        <div className="mb-8 text-[12px]">
          <div>
            <h3 className="text-[9px] font-sans font-black uppercase text-gray-400 mb-1 tracking-widest">Client Details:</h3>
            <p className="font-bold text-md leading-tight">{orderData?.contact_person || "Valued Client"}</p>
            <p className="uppercase text-[10px] font-bold text-gray-700">{orderData?.company_name || ""}</p>
            <p className="text-gray-600 italic mt-0.5">{orderData?.project_location || ""}</p>
          </div>
        </div>

        {/* FORMAL OPENING */}
        <div className="mb-6">
          <p className="text-[12px] leading-relaxed mb-2">
            Dear <strong>{orderData?.contact_person || "Sir/Madam"}</strong>,
          </p>
          <p className="text-[12px] leading-relaxed text-justify">
            We are pleased to submit our formal quotation for the supply and delivery of high-quality Ready-Mixed Concrete. Our commitment to structural integrity ensures that all materials provided meet the required industry standards for your project requirements.
          </p>
        </div>

        {/* ITEM TABLE */}
        <table className="w-full text-[12px] mb-6 border-t border-b border-black">
          <thead>
            <tr className="text-[9px] uppercase font-sans font-black bg-gray-50">
              <th className="text-left py-2 px-2">Description of Material</th>
              <th className="text-right py-2 px-2">Price/m³</th>
              <th className="text-center py-2 px-2">Qty</th>
              <th className="text-right py-2 px-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderData.order_items?.map((item: any) => {
              // Resolves data matching directly from raw structure or nested items maps safely
              const calc = breakdownSource?.items?.[item.mix_design_name];
              const displayVolume = item.volume || orderData?.volume || 0;
              
              return (
                <tr key={item.id || item.mix_design_name} className="border-b border-gray-100 italic">
                  <td className="py-2 px-2">
                    <span className="font-bold not-italic">{item.mix_design_name}</span>
                  </td>
                  <td className="text-right px-2 font-mono">₱{(calc?.unit_price || 0).toLocaleString()}</td>
                  <td className="text-center px-2 font-mono">{displayVolume}</td>
                  <td className="text-right px-2 font-bold font-mono">₱{(calc?.subtotal || 0).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FINANCIAL SUMMARY */}
        <div className="flex justify-end mb-10">
          <div className="w-64 font-sans">
            <div className="space-y-1.5 text-[11px] border-b border-gray-200 pb-3">
              {breakdownSource?.pump_rental > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase font-bold text-[10px]">Pumpcrete Rental</span>
                  <span className="font-mono font-bold">₱{breakdownSource.pump_rental.toLocaleString()}</span>
                </div>
              )}

              {breakdownSource?.pump_mobilization > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase font-bold text-[10px]">Mobilization Fee</span>
                  <span className="font-mono font-bold">₱{breakdownSource.pump_mobilization.toLocaleString()}</span>
                </div>
              )}

              {breakdownSource?.discount > 0 && (
                <div className="flex justify-between text-red-700 font-bold">
                  <span className="uppercase text-[10px]">Less: Discount</span>
                  <span className="font-mono">- ₱{breakdownSource.discount.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="heading-font font-bold text-[10px] uppercase">Grand Total</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#064e3b] font-sans">
                  ₱{Number(data?.final_total || data?.grand_total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <p className="text-[7px] text-gray-400 uppercase font-black tracking-widest">VAT Inclusive</p>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL TERMS */}
        <div className="font-sans border-t pt-6 text-[9px] space-y-6">
          {/* First Section: Terms & Validity */}
          <div className="space-y-1">
            <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Terms & Validity</h4>
            <p className="m-0">
              <strong>PAYMENT:</strong> {
                getTermsLabel(
                  data?.payment_terms || 
                  data?.payment_term || 
                  orderData?.payment_term || 
                  "COD"
                )
              }
            </p>
            <p className="m-0"><strong>VALIDITY:</strong> 30 Days from date of issue.</p>
            <p className="italic text-gray-400 mt-1 leading-tight m-0">Note: Price is subject to change based on actual site distance verification.</p>
          </div>
          
          {/* Second Section: Customer Conforme (Stacked directly underneath) */}
          <div className=" space-y-1 max-w-[320px]">
            <h4 className="font-black uppercase border-b border-gray-100 pb-0.5 m-0 mb-1.5">Customer Conforme</h4>
            <p className="italic text-gray-400 text-justify leading-tight m-0 mb-6">By signing, the client accepts the terms and prices provided above for immediate project scheduling.</p>
            <div className="pt-1 border-t border-black mt-6">
              <p className="font-bold uppercase tracking-widest text-center m-0">Authorized Signature</p>
            </div>
          </div>
        </div>

        {/* SIGNATURE FOOTER */}
        <div className="mt-24 flex justify-between font-sans">
          <div>
            <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Olsen Aeron Paduit</p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Technical & Accounting</p>
          </div>
          <div>
            <p className="font-bold text-[10px] uppercase border-b border-black w-40 text-center pb-0.5">Plant Manager</p>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest text-center mt-1">Authorized Approver</p>
          </div>
        </div>
      </div>
    </>
  );
}