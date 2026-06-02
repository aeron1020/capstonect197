// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';

// interface MixDesign {
//   id: number;
//   design_name: string;
// }

// export default function NewOrder() {
//   const [mixes, setMixes] = useState<MixDesign[]>([]);
//   const [formData, setFormData] = useState({
//     project_name: '',
//     project_location: '', // Matches backend
//     project_type: 'Commercial', // Matches backend choices
//     volume_m3: '',
//     mix_design_id: '', // We will send the ID to the backend
//     proposed_schedule: '', // Matches backend
//   });
  
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Fetch real mix designs from your database
//   useEffect(() => {
//     api.get('mix-designs/')
//       .then(res => setMixes(res.data))
//       .catch(err => console.error("Error fetching mixes:", err));
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     // Format the data to match OrderSerializer (Nested order_items)
//     const payload = {
//       project_name: formData.project_name,
//       project_location: formData.project_location,
//       project_type: formData.project_type,
//       volume_m3: formData.volume_m3,
//       proposed_schedule: formData.proposed_schedule,
//       order_items: [
//         {
//           mix_design: formData.mix_design_id,
//           volume: formData.volume_m3
//         }
//       ]
//     };

//     try {
//       await api.post('orders/', payload);
//       alert("Order Request Submitted! Admin will review and set the distance shortly.");
//       router.push('/dashboard/customer');
//     } catch (err: any) {
//       console.error(err.response?.data);
//       alert("Failed to submit order. Please check all fields.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
//       <h2 className="text-2xl font-bold text-[#064e3b] mb-6">New Concrete Request</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Project Name */}
//         <div>
//           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Name</label>
//           <input 
//             type="text" 
//             className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
//             onChange={(e) => setFormData({...formData, project_name: e.target.value})}
//             required 
//           />
//         </div>

//         {/* Project Type - CRITICAL FOR PRICING */}
//         <div>
//           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Category</label>
//           <select 
//             className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b] bg-white"
//             onChange={(e) => setFormData({...formData, project_type: e.target.value})}
//             value={formData.project_type}
//           >
//             <option value="Commercial">Private / Commercial</option>
//             <option value="Government">Government Project (DPWH/LGU)</option>
//           </select>
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Site Address</label>
//           <textarea 
//             className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
//             onChange={(e) => setFormData({...formData, project_location: e.target.value})}
//             required 
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           {/* Volume */}
//           <div>
//             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Volume (m³)</label>
//             <input 
//               type="number" 
//               step="0.5"
//               className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
//               onChange={(e) => setFormData({...formData, volume_m3: e.target.value})}
//               required 
//             />
//           </div>
          
//           {/* Dynamic Mix Selection */}
//           <div>
//             <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mix Design</label>
//             <select 
//               className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b] bg-white"
//               onChange={(e) => setFormData({...formData, mix_design_id: e.target.value})}
//               required
//             >
//               <option value="">Select Mix...</option>
//               {mixes.map(mix => (
//                 <option key={mix.id} value={mix.id}>{mix.design_name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Target Pouring Date</label>
//           <input 
//             type="date" 
//             className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
//             onChange={(e) => setFormData({...formData, proposed_schedule: e.target.value})}
//             required 
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className="w-full bg-[#064e3b] text-white font-bold py-3 rounded-md hover:bg-[#053f30] transition shadow-md disabled:bg-gray-400 mt-4"
//         >
//           {loading ? "Processing..." : "Submit Order Request"}
//         </button>
//       </form>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import { PlusCircle, Trash2 } from 'lucide-react'; // Optional icons

// interface MixDesign {
//   id: number;
//   design_name: string;
// }

// export default function NewOrder() {
//   const [mixes, setMixes] = useState<MixDesign[]>([]);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // 1. General Project Data
//   const [projectData, setProjectData] = useState({
//     project_name: '',
//     project_location: '',
//     project_type: 'Commercial',
//     proposed_schedule: '',
//   });

//   // 2. Dynamic Order Items (The "Add More" logic)
//   const [selectedItems, setSelectedItems] = useState([
//     { mix_design: '', volume: '' }
//   ]);

//   useEffect(() => {
//     api.get('mix-designs/')
//       .then(res => setMixes(res.data))
//       .catch(err => console.error("Error fetching mixes:", err));
//   }, []);

//   const handleAddItem = () => {
//     setSelectedItems([...selectedItems, { mix_design: '', volume: '' }]);
//   };

//   const handleRemoveItem = (index: number) => {
//     const list = [...selectedItems];
//     list.splice(index, 1);
//     setSelectedItems(list);
//   };

//   const handleItemChange = (index: number, field: string, value: string) => {
//     const list = [...selectedItems];
//     (list[index] as any)[field] = value;
//     setSelectedItems(list);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     // Prepare Payload
//     const payload = {
//       ...projectData,
//       order_items: selectedItems.map(item => ({
//         mix_design: parseInt(item.mix_design),
//         volume: parseFloat(item.volume)
//       }))
//     };

//     try {
//       await api.post('orders/', payload);
//       alert("Order Submitted with multiple designs!");
//       router.push('/dashboard/customer');
//     } catch (err) {
//       alert("Submission failed. Check your inputs.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
//       <h2 className="text-2xl font-black text-[#064e3b] mb-8 uppercase tracking-tight">Concrete Request Form</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* SECTION 1: PROJECT INFO */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="col-span-2">
//             <label className="text-[10px] font-bold uppercase text-gray-400">Project Name</label>
//             <input type="text" required className="w-full border-b-2 border-gray-100 p-2 focus:border-[#064e3b] outline-none transition-all" 
//               onChange={e => setProjectData({...projectData, project_name: e.target.value})} />
//           </div>
//           <div>
//             <label className="text-[10px] font-bold uppercase text-gray-400">Project Type</label>
//             <select className="w-full border-b-2 border-gray-100 p-2 outline-none"
//               onChange={e => setProjectData({...projectData, project_type: e.target.value})}>
//               <option value="Commercial">Commercial</option>
//               <option value="Government">Government</option>
//             </select>
//           </div>
//           <div>
//             <label className="text-[10px] font-bold uppercase text-gray-400">Target Pouring Date</label>
//             <input type="date" required className="w-full border-b-2 border-gray-100 p-2 outline-none"
//               onChange={e => setProjectData({...projectData, proposed_schedule: e.target.value})} />
//           </div>
//           <div className="col-span-2">
//             <label className="text-[10px] font-bold uppercase text-gray-400">Site Location</label>
//             <textarea required className="w-full border-b-2 border-gray-100 p-2 outline-none"
//               onChange={e => setProjectData({...projectData, project_location: e.target.value})} />
//           </div>
//         </div>

//         <hr className="border-gray-50" />

//         {/* SECTION 2: DYNAMIC MIX ITEMS */}
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-sm font-bold text-gray-800 uppercase">Concrete Mix Details</h3>
//             <button type="button" onClick={handleAddItem} className="text-[#064e3b] flex items-center text-xs font-bold hover:underline">
//               <PlusCircle className="w-4 h-4 mr-1" /> Add Another Mix
//             </button>
//           </div>

//           {selectedItems.map((item, index) => (
//             <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg mb-3 animate-in fade-in slide-in-from-top-1">
//               <div className="flex-1">
//                 <label className="text-[9px] font-bold uppercase text-gray-400">Mix Design</label>
//                 <select required value={item.mix_design} className="w-full bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
//                   onChange={e => handleItemChange(index, 'mix_design', e.target.value)}>
//                   <option value="">Select Mix...</option>
//                   {mixes.map(m => <option key={m.id} value={m.id}>{m.design_name}</option>)}
//                 </select>
//               </div>
//               <div className="w-32">
//                 <label className="text-[9px] font-bold uppercase text-gray-400">Volume (m³)</label>
//                 <input type="number" step="0.5" required value={item.volume} className="w-full bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
//                   onChange={e => handleItemChange(index, 'volume', e.target.value)} />
//               </div>
//               {selectedItems.length > 1 && (
//                 <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 mb-2">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         <button type="submit" disabled={loading} className="w-full bg-[#064e3b] text-white font-bold py-4 rounded-xl shadow-xl hover:bg-[#053f30] disabled:bg-gray-300 transition-all uppercase tracking-widest text-sm">
//           {loading ? "Processing Order..." : "Finalize Request"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import { PlusCircle, Trash2, ArrowLeft, Info, HelpCircle, CheckSquare } from 'lucide-react';

interface MixDesign {
  id: number;
  design_name: string;
}

export default function NewOrder() {
  const [mixes, setMixes] = useState<MixDesign[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [projectData, setProjectData] = useState({
    project_name: '',
    project_location: '',
    project_type: 'Commercial',
    proposed_schedule: '',
  });

  const [selectedItems, setSelectedItems] = useState([
    { mix_design: '', volume: '' }
  ]);

  useEffect(() => {
    api.get('mix-designs/')
      .then(res => setMixes(res.data))
      .catch(err => console.error("Error fetching mixes:", err));
  }, []);

  const handleAddItem = () => {
    setSelectedItems([...selectedItems, { mix_design: '', volume: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    const list = [...selectedItems];
    list.splice(index, 1);
    setSelectedItems(list);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const list = [...selectedItems];
    (list[index] as any)[field] = value;
    setSelectedItems(list);
  };

  // UI Running Metrics Engine
  const totalVolumeCalculated = selectedItems.reduce((acc, item) => {
    const val = parseFloat(item.volume);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // Form Validation Engine
  const isFormValid = 
    projectData.project_name.trim() !== '' &&
    projectData.project_location.trim() !== '' &&
    projectData.proposed_schedule !== '' &&
    selectedItems.every(item => item.mix_design !== '' && parseFloat(item.volume) > 0);

  // Check for configuration row duplicates
  const hasDuplicateMixes = new Set(selectedItems.map(i => i.mix_design).filter(Boolean)).size !== selectedItems.map(i => i.mix_design).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if (hasDuplicateMixes) {
      alert("Please combine rows sharing identical Concrete Mix Designs before finalizing dispatch layout.");
      return;
    }
    
    setLoading(true);

    const payload = {
      ...projectData,
      order_items: selectedItems.map(item => ({
        mix_design: parseInt(item.mix_design),
        volume: parseFloat(item.volume)
      }))
    };

    try {
      await api.post('orders/', payload);
      router.push('/dashboard/customer');
    } catch (err) {
      alert("Submission failed. Ensure your connection is stable and input criteria fields match requirements.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Breadcrumb Navigation Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.push('/dashboard/customer')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back To Dashboard
          </button>
          <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-widest">
            Form ID: RMC-REQ-2026
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: THE OPERATIONAL DATA FORMS */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight leading-none">Concrete Request Form</h2>
            <p className="text-gray-400 text-xs mt-2">Configure structural specifications and delivery coordinates for plant dispatch.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: PROJECT LOCATION & INFO PROFILES */}
            <div className="space-y-5">
              <div className="border-l-2 border-[#064e3b] pl-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">01. Project Metadata</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Project Name / Reference Tag</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g., San Nicolas Commercial Complex - Phase 2 Slab"
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#064e3b] focus:bg-white transition-all text-gray-800" 
                    onChange={e => setProjectData({...projectData, project_name: e.target.value})} 
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Project Sector Classification</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#064e3b] focus:bg-white transition-all text-gray-800"
                    onChange={e => setProjectData({...projectData, project_type: e.target.value})}
                  >
                    <option value="Commercial">Commercial Infrastructure</option>
                    <option value="Government">Government / Public Works</option>
                    <option value="Residential">Private Residential Development</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Requested Target Pouring Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#064e3b] focus:bg-white transition-all text-gray-800"
                    onChange={e => setProjectData({...projectData, proposed_schedule: e.target.value})} 
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Precise Jobsite Delivery Coordinates / Address</label>
                  <textarea 
                    required 
                    rows={3}
                    placeholder="Provide full site boundaries, barangay details, and specific local landmarks or drop-off guidelines for transit trucks..."
                    className="w-full bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#064e3b] focus:bg-white transition-all text-gray-800 resize-none"
                    onChange={e => setProjectData({...projectData, project_location: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* SECTION 2: DYNAMIC CONCRETE MIX SPECIFICATION BATCHES */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-l-2 border-[#064e3b] pl-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">02. Structural Formula Composition</h3>
                <button 
                  type="button" 
                  onClick={handleAddItem} 
                  className="text-[#064e3b] bg-[#064e3b]/5 hover:bg-[#064e3b]/10 px-3 py-1.5 rounded-lg flex items-center text-[10px] font-black uppercase tracking-wider transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Formulation Row
                </button>
              </div>

              {hasDuplicateMixes && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <Info className="w-4 h-4 shrink-0 text-amber-600" />
                  Warning: You have picked duplicate mix types in separate lines. Please merge their target structural volumes.
                </div>
              )}

              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50/70 border border-gray-100 p-4 rounded-2xl transition-all relative group">
                    
                    <div className="w-full sm:flex-1">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1">Target Mix Strength Profile Specification</label>
                      <select 
                        required 
                        value={item.mix_design} 
                        className="w-full bg-white border border-gray-200/80 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-[#064e3b] text-gray-800 shadow-sm"
                        onChange={e => handleItemChange(index, 'mix_design', e.target.value)}
                      >
                        <option value="">Select Mix Profile Formula...</option>
                        {mixes.map(m => <option key={m.id} value={m.id}>{m.design_name}</option>)}
                      </select>
                    </div>
                    
                    <div className="w-full sm:w-36">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider block mb-1">Volume ($m^3$)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0.1"
                        required 
                        placeholder="0.00"
                        value={item.volume} 
                        className="w-full bg-white border border-gray-200/80 rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#064e3b] text-gray-800 shadow-sm"
                        onChange={e => handleItemChange(index, 'volume', e.target.value)} 
                      />
                    </div>
                    
                    {selectedItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(index)} 
                        className="bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-200 p-2.5 rounded-xl transition-all shadow-sm mb-[1px]"
                        title="Remove dynamic item line"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Action Anchor Panel */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || !isFormValid || hasDuplicateMixes} 
                className="w-full bg-[#064e3b] hover:bg-[#053f30] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
              >
                {loading ? "Processing Logistics System Data..." : "Finalize and Transmit Request"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: STICKY CONTEXTUAL USER INSTRUCTIONS & BILL SUMMARY */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Component Card 1: Batch Calculation Telemetry */}
          <div className="bg-[#111827] text-white p-6 rounded-3xl shadow-md border border-gray-800">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#d4af37]" /> Telemetry Estimation Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b border-gray-800 pb-3">
                <span className="text-xs text-gray-400 font-medium">Distinct Class Formulations:</span>
                <span className="font-mono text-sm font-bold">{selectedItems.filter(i => i.mix_design).length} types</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs text-gray-400 font-medium">Accumulated Cumulative Volume:</span>
                <span className="font-mono text-2xl font-black text-[#d4af37]">
                  {totalVolumeCalculated.toFixed(2)} $m^3$
                </span>
              </div>
            </div>
          </div>

          {/* Component Card 2: Interactive Operational Engineering Guide */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#064e3b]" /> Standard Operating Guidelines
            </h4>
            
            <ul className="space-y-3.5 text-xs text-gray-500 font-medium list-none pl-0">
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Ensure your requested <strong>Target Pouring Date</strong> accounts for concrete curing timelines and weather windows.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Verify that structural site drop-off zones permit continuous transit clearings for heavy 3-to-4 axle mixing trucks.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#064e3b] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Double-check volumetric assessments ($m^3$) using precise geometric formwork calculations to reduce concrete shortfalls or surplus material overhead.</span>
              </li>
            </ul>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-400 leading-normal">
                Once submitted, plant personnel draft a quotation detailing logistics premiums, technical testing procedures, and tax adjustments for your approval signature.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}