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

"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import { PlusCircle, Trash2 } from 'lucide-react'; // Optional icons

interface MixDesign {
  id: number;
  design_name: string;
}

export default function NewOrder() {
  const [mixes, setMixes] = useState<MixDesign[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. General Project Data
  const [projectData, setProjectData] = useState({
    project_name: '',
    project_location: '',
    project_type: 'Commercial',
    proposed_schedule: '',
  });

  // 2. Dynamic Order Items (The "Add More" logic)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare Payload
    const payload = {
      ...projectData,
      order_items: selectedItems.map(item => ({
        mix_design: parseInt(item.mix_design),
        volume: parseFloat(item.volume)
      }))
    };

    try {
      await api.post('orders/', payload);
      alert("Order Submitted with multiple designs!");
      router.push('/dashboard/customer');
    } catch (err) {
      alert("Submission failed. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-black text-[#064e3b] mb-8 uppercase tracking-tight">Concrete Request Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PROJECT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Project Name</label>
            <input type="text" required className="w-full border-b-2 border-gray-100 p-2 focus:border-[#064e3b] outline-none transition-all" 
              onChange={e => setProjectData({...projectData, project_name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Project Type</label>
            <select className="w-full border-b-2 border-gray-100 p-2 outline-none"
              onChange={e => setProjectData({...projectData, project_type: e.target.value})}>
              <option value="Commercial">Commercial</option>
              <option value="Government">Government</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-gray-400">Target Pouring Date</label>
            <input type="date" required className="w-full border-b-2 border-gray-100 p-2 outline-none"
              onChange={e => setProjectData({...projectData, proposed_schedule: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Site Location</label>
            <textarea required className="w-full border-b-2 border-gray-100 p-2 outline-none"
              onChange={e => setProjectData({...projectData, project_location: e.target.value})} />
          </div>
        </div>

        <hr className="border-gray-50" />

        {/* SECTION 2: DYNAMIC MIX ITEMS */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase">Concrete Mix Details</h3>
            <button type="button" onClick={handleAddItem} className="text-[#064e3b] flex items-center text-xs font-bold hover:underline">
              <PlusCircle className="w-4 h-4 mr-1" /> Add Another Mix
            </button>
          </div>

          {selectedItems.map((item, index) => (
            <div key={index} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg mb-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex-1">
                <label className="text-[9px] font-bold uppercase text-gray-400">Mix Design</label>
                <select required value={item.mix_design} className="w-full bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
                  onChange={e => handleItemChange(index, 'mix_design', e.target.value)}>
                  <option value="">Select Mix...</option>
                  {mixes.map(m => <option key={m.id} value={m.id}>{m.design_name}</option>)}
                </select>
              </div>
              <div className="w-32">
                <label className="text-[9px] font-bold uppercase text-gray-400">Volume (m³)</label>
                <input type="number" step="0.5" required value={item.volume} className="w-full bg-transparent border-b border-gray-300 p-1 text-sm outline-none"
                  onChange={e => handleItemChange(index, 'volume', e.target.value)} />
              </div>
              {selectedItems.length > 1 && (
                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 mb-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#064e3b] text-white font-bold py-4 rounded-xl shadow-xl hover:bg-[#053f30] disabled:bg-gray-300 transition-all uppercase tracking-widest text-sm">
          {loading ? "Processing Order..." : "Finalize Request"}
        </button>
      </form>
    </div>
  );
}