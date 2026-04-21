"use client";
import React from 'react';

interface QuotationProps {
  data: any; 
  orderData: any; 
}

export default function QuotationView({ data, orderData }: QuotationProps) {
  // CRITICAL SAFETY CHECK: Prevent the "Cannot read properties of undefined" crash
  if (!orderData || !data) {
    return (
      <div className="p-10 text-center bg-white border border-dashed rounded-sm">
        <p className="font-mono text-[10px] animate-pulse text-gray-400">AUTHENTICATING DOCUMENT...</p>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Safe Access to ID
  const orderIdString = orderData?.id?.toString().padStart(4, '0') || "0000";
  const controlNumber = `QRMC-${new Date().getFullYear()}-${orderIdString}`;

  return (
    <div className="bg-white p-12 shadow-2xl border border-gray-200 rounded-sm text-gray-800 font-serif max-w-[850px] mx-auto print:shadow-none print:p-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <p className="font-bold text-[10px] uppercase text-gray-400">Date Issued</p>
          <p className="font-bold text-sm border-b border-gray-800 pb-1">{currentDate}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-[10px] uppercase text-gray-400">Control No.</p>
          <p className="font-mono text-sm font-black text-[#064e3b]">{controlNumber}</p>
        </div>
      </div>

      {/* RECIPIENT */}
      <div className="mb-10 text-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Details:</p>
        <p className="font-black text-xl uppercase tracking-tight">{orderData?.company_name || 'Individual Client'}</p>
        <p className="text-gray-600">{orderData?.company_address || 'Project Location'}</p>
        <p className="mt-4">Dear <span className="font-bold">{orderData?.contact_person}</span>,</p>
      </div>

      {/* SUBJECT */}
      <div className="text-center mb-10">
        <h2 className="font-black text-xl uppercase underline underline-offset-[12px] decoration-1 tracking-tight">
          Subject: Final Price Quotation
        </h2>
      </div>

      <p className="text-sm mb-8 leading-relaxed">
        We are pleased to submit our Best and Final Price Quotation for the supply of Ready Mix Concrete for your project to wit:
      </p>

      {/* PROJECT DETAILS */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 text-sm border-l-4 border-[#064e3b]">
        <p className="mb-2"><span className="font-bold w-32 inline-block text-gray-400 uppercase text-[10px]">Project Name:</span> <span className="font-bold">{orderData?.project_name}</span></p>
        <p><span className="font-bold w-32 inline-block text-gray-400 uppercase text-[10px]">Site Location:</span> {orderData?.project_location}</p>
      </div>

      {/* PRICING TABLE */}
      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="border-y-2 border-gray-900 text-[10px] uppercase font-bold text-gray-500">
            <th className="py-3 text-left">Mix Design Description</th>
            <th className="py-3 text-right">Unit Price</th>
            <th className="py-3 text-center">Volume</th>
            <th className="py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {/* Map through breakdown items passed from pricing logic */}
          {Object.entries(data?.breakdown?.items || {}).map(([name, item]: any) => (
            <tr key={name} className="border-b">
              <td className="py-5 font-bold text-gray-900">{name}</td>
              <td className="py-5 text-right font-mono text-xs">
                ₱{(item.unit_price || 0).toLocaleString()}
              </td>
              <td className="py-5 text-center font-bold">{item.volume} m³</td>
              <td className="py-5 text-right font-bold">
                ₱{(item.subtotal || 0).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr className="italic text-gray-500 bg-gray-50/30">
            <td className="py-4">Logistics & Delivery Fee ({orderData?.distance_km || 0} KM)</td>
            <td className="py-4 text-right">---</td>
            <td className="py-4 text-center">---</td>
            <td className="py-4 text-right font-bold">₱{data?.breakdown?.delivery_fee?.toLocaleString()}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-900">
            <td colSpan={3} className="py-6 text-right font-black uppercase text-[10px]">Grand Total Contract Amount:</td>
            <td className="py-6 text-right font-black text-2xl text-[#064e3b] underline underline-offset-4 decoration-double">
              ₱{data?.final_total?.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* FOOTER */}
      <div className="mt-24 pt-8 border-t border-gray-100 text-[9px] text-gray-400 text-center uppercase tracking-[0.2em]">
        Valid for 30 days | AERON RMC - Villasis Plant Operation Office
      </div>
    </div>
  );
}