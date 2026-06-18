import Link from "next/link";
import { ShieldCheck, ChevronRight, CheckCircle } from "lucide-react";
import DevelopmentWorkflow from "../components/DevelopmentWorkflow";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-[#064e3b]/10 selection:text-[#064e3b]">
      
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 transition-all">
        <div className="p-5 flex justify-between items-center max-w-6xl mx-auto">
          <div className="text-2xl font-black italic tracking-tighter text-[#064e3b]">
            LC<span className="text-[#d4af37]">RMC</span>C
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-[#064e3b] transition"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="bg-[#064e3b] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#053f30] shadow-sm hover:shadow transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Canvas Container */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 space-y-28">
        
        {/* Hero Copy Presentation Section */}
        <section className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#064e3b] border border-emerald-200/60 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO Standardized Ready-Mixed Concrete
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tight">
            Automated Commercial <br /> 
            <span className="text-[#064e3b]">Concrete Solutions</span>
          </h1>
          
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            LCRMCC streamlines your structure's project requirements. Request mix validation, 
            receive pricing models based on haul parameters, clear down balances, and track 
            delivery workflows seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto z-10">
            <Link 
              href="/register" 
              className="bg-[#064e3b] text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-[#053f30] shadow-emerald-900/10 hover:shadow-xl transition-all active:scale-95 text-center flex items-center justify-center gap-2"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#workflow" 
              className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all text-center"
            >
              View Deployment Workflow
            </Link>
          </div>
        </section>

        {/* Sophisticated Interactive Workflow Blueprint Component Wrapper */}
        <div className="w-full pt-4">
          <DevelopmentWorkflow />
        </div>

        {/* High-Value Operations Features Grid Layout */}
        <section className="grid md:grid-cols-3 gap-8 w-full">
          {[
            { 
              title: "Dynamic Estimation Models", 
              desc: "Our API measures dispatch point matrices to output accurate quotations based on distance weight coefficients." 
            },
            { 
              title: "Quality Assurance Frameworks", 
              desc: "Every mixture profile conforms stringently to national building codes and statistical quality control tolerances." 
            },
            { 
              title: "Real-Time Tracking Status", 
              desc: "Customers keep structural control logs updated via transparent dashboard timeline pipelines." 
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-8 border border-slate-200/80 rounded-2xl bg-white shadow-sm flex gap-4 transition-all hover:shadow-md hover:border-slate-300/60"
            >
              <CheckCircle className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}