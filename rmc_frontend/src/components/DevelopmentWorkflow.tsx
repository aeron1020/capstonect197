"use client";
import React, { useState } from 'react';
import { Layers, MapPin, CreditCard, Truck, ChevronRight, Activity, ShieldCheck, Clock, FileCheck } from 'lucide-react';

export default function DeploymentWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      id: 0,
      phase: "STAGE 01",
      title: "Order Placement & Quotation Validation",
      shortDesc: "Customer ingestion to administrative pricing review.",
      icon: <Layers className="w-5 h-5" />,
      color: "from-amber-500 to-amber-600",
      activeBg: "bg-amber-500/5 border-amber-500/20",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      technicalDetails: [
        "Customer authenticates via Login/Registration portal and transmits a structured web-form order.",
        "System pathways route the request to Admin reviewers who evaluate specs and generate an official Quotation.",
        "The customer reviews the document; if rejected, the proposal enters a Revision loop or drops to a Terminal state."
      ]
    },
    {
      id: 1,
      phase: "STAGE 02",
      title: "Field Logistics & Site Inspection Auditing",
      shortDesc: "Physical accessibility validation and conditional routing.",
      icon: <MapPin className="w-5 h-5" />,
      color: "from-blue-600 to-indigo-600",
      activeBg: "bg-blue-500/5 border-blue-500/20",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      technicalDetails: [
        "Upon quotation acceptance, an official Site Inspection is scheduled and conducted at the construction jobsite.",
        "Inspection results route dynamically: Approved parameters advance to billing, Rejected states terminate transactions instantly.",
        "Conditional Re-inspection paths log specific operational remarks and route the state machine cleanly back to stage execution."
      ]
    },
    {
      id: 2,
      phase: "STAGE 03",
      title: "Fiscal Clearance & Payment Review Framework",
      shortDesc: "Processing of Advance payments vs. COD/Terms rules.",
      icon: <CreditCard className="w-5 h-5" />,
      color: "from-purple-600 to-fuchsia-600",
      activeBg: "bg-purple-500/5 border-purple-500/20",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      technicalDetails: [
        "System evaluates designated Payment Terms: COD and credit Agreement profiles pass forward directly to scheduling.",
        "Advance payment accounts upload digital transaction receipts securely via client dashboard components.",
        "Admin auditors review proof sheets; invalid items force a loop back to upload, while approved sheets trigger a validation token."
      ]
    },
    {
      id: 3,
      phase: "STAGE 04",
      title: "Production Dispatch & Delivery Lifecycle",
      shortDesc: "Final dispatch scheduling and telemetry tracking.",
      icon: <Truck className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-600",
      activeBg: "bg-emerald-500/5 border-emerald-500/20",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      technicalDetails: [
        "Orders clear through the scheduling pipeline to lock in the target pouring date metrics.",
        "The physical batching plant initiates the concrete delivery process, sending mixers out to site coordinates.",
        "Real-time state monitors alter system tokens to 'Update Status', providing transparent records until a definitive Transaction End."
      ]
    }
  ];

  return (
    <section id="workflow" className="w-full bg-white text-slate-800 rounded-3xl p-5 md:p-12 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden backdrop-blur-md">
      {/* Background Subtle Themed Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#064e3b]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-6 mb-8 md:mb-12 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">
            <Activity className="w-3 h-3 text-[#064e3b] animate-pulse" /> Operational System Blueprint
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-slate-900">
            The Order Pipeline Framework
          </h2>
        </div>
        <p className="text-slate-500 text-xs font-medium max-w-sm leading-relaxed">
          Interactive workflow visualization mapping operations from raw concrete procurement proposals down to automated field batching logistics.
        </p>
      </div>

      {/* Interactive Layout Matrix */}
      <div className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">
        
        {/* Left Hand: Interactive Navigation Tabs (Stacks on Mobile) */}
        <div className="lg:col-span-5 space-y-3 order-1">
          {workflowSteps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group relative ${
                  isSelected 
                    ? `bg-white border-slate-300 shadow-md ${step.activeBg}` 
                    : 'bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-white'
                }`}
              >
                {/* Accent Selected Line indicator */}
                {isSelected && (
                  <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-gradient-to-b ${step.color}`} />
                )}

                <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${
                  isSelected 
                    ? `bg-gradient-to-br ${step.color} text-white shadow-sm` 
                    : 'bg-slate-200 text-slate-500 group-hover:text-slate-800'
                }`}>
                  {step.icon}
                </div>

                <div className="space-y-0.5 pr-4 min-w-0">
                  <span className={`text-[9px] font-black tracking-widest block uppercase ${
                    isSelected ? 'text-[#064e3b]' : 'text-slate-400'
                  }`}>
                    {step.phase}
                  </span>
                  <h3 className={`font-bold text-xs md:text-sm uppercase tracking-wide transition-colors truncate ${
                    isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-normal truncate">
                    {step.shortDesc}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 ml-auto self-center text-slate-400 transition-transform shrink-0 ${
                  isSelected ? 'translate-x-1 text-[#064e3b]' : 'group-hover:text-slate-600'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right Hand: Deep Dive Informative Container */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 md:p-8 relative overflow-hidden shadow-sm min-h-[340px] flex flex-col justify-between order-2">
          <div className="space-y-5">
            
            {/* Context Badge Row */}
            <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border uppercase tracking-wider ${workflowSteps[activeStep].badgeColor}`}>
                {workflowSteps[activeStep].phase} Live Parameter Metrics
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#064e3b]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              </div>
            </div>

            {/* Core Segment Info */}
            <div className="space-y-1">
              <h4 className="text-lg font-black tracking-tight text-slate-900 uppercase italic">
                {workflowSteps[activeStep].title}
              </h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                System Process Action Logs
              </p>
            </div>

            {/* Technical Bullet Checklists */}
            <ul className="space-y-3 pt-1">
              {workflowSteps[activeStep].technicalDetails.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 group text-xs text-slate-600 font-medium leading-relaxed">
                  <div className="mt-0.5 p-0.5 rounded-full bg-slate-50 border border-slate-200 text-[#064e3b] shrink-0 group-hover:scale-105 transition-transform">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Security / Assurance Footnote */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between text-[10px] text-slate-400 font-bold tracking-wider uppercase">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" /> LCRMCC Central Audit Control
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" /> SYSTEM_MUTATION_SYNC: OK
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}