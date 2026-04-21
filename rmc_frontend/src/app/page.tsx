import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-bold text-[#064e3b]">
          AERON<span className="text-[#d4af37]">RMC</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-semibold hover:text-[#064e3b]">Log in</Link>
          <Link href="/register" className="bg-[#064e3b] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#053f30] transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Premium Ready-Mixed <br /> 
          <span className="text-[#064e3b]">Concrete Solutions</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mb-10">
          Streamline your construction projects with our automated ordering and 
          real-time quotation system. Reliability built in every cubic meter.
        </p>
        
        <div className="flex gap-4">
          <Link href="/register" className="bg-[#064e3b] text-white px-8 py-3 rounded-md font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
            Request a Quote
          </Link>
          <Link href="/docs" className="border border-gray-300 px-8 py-3 rounded-md font-bold hover:bg-gray-50 transition-all">
            Learn More
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            { title: "Fast Quotation", desc: "Get instant pricing based on your project distance and mix design." },
            { title: "Order Tracking", desc: "Monitor your delivery status from batching plant to project site." },
            { title: "Quality Mix", desc: "Standardized mix designs compliant with national building codes." }
          ].map((feature, i) => (
            <div key={i} className="p-8 border border-gray-100 rounded-2xl bg-gray-50/50">
              <h3 className="font-bold text-[#064e3b] mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}