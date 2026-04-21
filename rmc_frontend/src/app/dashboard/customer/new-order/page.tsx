"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';

export default function NewOrder() {
  const [formData, setFormData] = useState({
    project_name: '',
    delivery_address: '',
    volume_m3: '',
    mix_design: 'G-3000', // Default value
    delivery_date: '',
    special_instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('orders/', formData);
      alert("Order Request Submitted! We will generate a quotation shortly.");
      router.push('/dashboard/customer');
    } catch (err) {
      alert("Failed to submit order. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#064e3b] mb-6">New Concrete Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Project Name</label>
          <input 
            type="text" 
            placeholder="e.g. House Extension - Phase 1"
            className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
            onChange={(e) => setFormData({...formData, project_name: e.target.value})}
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Delivery Site Address</label>
          <textarea 
            placeholder="Street, Barangay, City/Municipality"
            className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
            onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Volume (m³)</label>
            <input 
              type="number" 
              step="0.5"
              placeholder="0.0"
              className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
              onChange={(e) => setFormData({...formData, volume_m3: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Mix Design</label>
            <select 
              className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b] bg-white"
              onChange={(e) => setFormData({...formData, mix_design: e.target.value})}
            >
              <option value="G-3000">G-3000 (Residential)</option>
              <option value="G-3500">G-3500 (Commercial)</option>
              <option value="G-4000">G-4000 (High-Rise)</option>
              <option value="Custom">Custom / Pumpcrete</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Requested Date</label>
          <input 
            type="date" 
            className="w-full border p-2.5 rounded-md text-sm outline-[#064e3b]"
            onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#064e3b] text-white font-bold py-3 rounded-md hover:bg-[#053f30] transition shadow-md disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Order Request"}
        </button>
      </form>
    </div>
  );
}