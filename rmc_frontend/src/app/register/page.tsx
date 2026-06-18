// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';
// import Swal from 'sweetalert2';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     first_name: '',
//     last_name: '',
//     company_name: '',   
//     contact_number: ''   
//   });
//   const router = useRouter();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // Note: Ensure the URL matches your backend route (e.g., /api/register/ or /api/users/register/)
//       await api.post('/register/', formData); 
//       Swal.fire({
//       title: 'REGISTRATION SUCCESSFUL',
//       text: 'Your LCRMCC Ops profile account has been established. Please log in with your credentials to access your dashboard overview panel.',
//       icon: 'success',
//       background: '#0f172a',
//       color: '#f8fafc',
//       confirmButtonColor: '#06b6d4', // Your signature Cyan branding
//       customClass: {
//         popup: 'rounded-3xl border border-slate-800 font-sans'
//       }
//     });
//       router.push('/login');
//     } catch (err: any) {
//       // This will help you see the REAL error in the browser console
//       console.error(err.response?.data); 
//       const errorMsg = err.response?.data?.username ? "Username already taken." : "Registration failed. Please check all fields.";
//       Swal.fire({
//         title: 'REGISTRATION ERROR',
//         text: errorMsg,
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

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh]">
//       <div className="insta-card w-full max-w-sm p-8 bg-white">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-[#064e3b]">LC<span className="text-[#d4af37]">RMC</span>C</h1>
//           <p className="text-gray-400 text-sm font-semibold mt-2">Sign up to request concrete delivery</p>
//         </div>

//         <form onSubmit={handleRegister} className="space-y-3">
//           <input 
//             type="text"
//             placeholder="Username"
//             className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//             onChange={(e) => setFormData({...formData, username: e.target.value})}
//             required
//           />
          
//           {/* New Company Name Field */}
//           <input 
//             type="text"
//             placeholder="Company Name"
//             className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//             onChange={(e) => setFormData({...formData, company_name: e.target.value})}
//             required
//           />

//           {/* New Contact Number Field */}
//           <input 
//             type="text"
//             placeholder="Contact Number"
//             className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//             onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
//             required
//           />

//           <div className="flex gap-2">
//             <input 
//               type="text"
//               placeholder="First Name"
//               className="w-1/2 bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//               onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//             />
//             <input 
//               type="text"
//               placeholder="Last Name"
//               className="w-1/2 bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//               onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//             />
//           </div>
          
//           <input 
//             type="email"
//             placeholder="Email Address"
//             className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//             onChange={(e) => setFormData({...formData, email: e.target.value})}
//           />
          
//           <input 
//             type="password"
//             placeholder="Password"
//             className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
//             onChange={(e) => setFormData({...formData, password: e.target.value})}
//             required
//           />
          
//           <button type="submit" className="w-full btn-primary mt-2 text-sm">
//             Sign Up
//           </button>
//         </form>
//       </div>

//       <div className="insta-card w-full max-w-sm p-4 text-center bg-white">
//         <p className="text-sm">
//           Have an account? <a href="/login" className="text-[#064e3b] font-bold hover:text-[#d4af37]">Log in</a>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from '@/src/lib/api';
import Swal from 'sweetalert2';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company_name: '',   
    contact_number: ''   
  });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register/', formData); 
      
      Swal.fire({
        title: 'REGISTRATION SUCCESSFUL',
        text: 'Your LCRMCC Ops profile account has been established. Please log in with your credentials to access your dashboard overview panel.',
        icon: 'success',
        background: '#ffffff',
        color: '#1e293b',
        confirmButtonColor: '#064e3b', // Brand Signature Green
        customClass: {
          popup: 'rounded-2xl border border-slate-100 font-sans'
        }
      });
      router.push('/login');
    } catch (err: any) {
      console.error(err.response?.data); 
      const errorMsg = err.response?.data?.username ? "Username already taken." : "Registration failed. Please check all fields.";
      
      Swal.fire({
        title: 'REGISTRATION ERROR',
        text: errorMsg,
        icon: 'error',
        background: '#ffffff',
        color: '#1e293b',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl border border-slate-100 font-sans'
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative px-4 antialiased">
      
      {/* Premium Floating Back Button */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#064e3b] transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Main Registration Card Wrapper */}
      <div className="w-full max-w-sm p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
        
        {/* Header Block */}
        <div className="text-center">
          <h1 className="text-3xl font-black italic tracking-tighter text-[#064e3b]">
            LC<span className="text-[#d4af37]">RMC</span>C
          </h1>
          <p className="text-slate-400 text-[9px] font-black mt-1.5 uppercase tracking-widest">
            Sign up to request concrete delivery
          </p>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleRegister} className="space-y-3">
          <input 
            type="text"
            placeholder="Username"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          
          <input 
            type="text"
            placeholder="Company Name"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            required
          />

          <input 
            type="text"
            placeholder="Contact Number"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
            required
          />

          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="First Name"
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
            <input 
              type="text"
              placeholder="Last Name"
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>
          
          <input 
            type="email"
            placeholder="Email Address"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <input 
            type="password"
            placeholder="Password"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:border-slate-400 focus:bg-white outline-none transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button 
            type="submit" 
            className="w-full bg-[#064e3b] hover:bg-[#053f30] text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-sm active:scale-[0.98] mt-2"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Alternate Onboarding Flow Routing Block */}
      <div className="w-full max-w-sm p-5 text-center bg-white border border-slate-200 rounded-2xl shadow-sm mt-3">
        <p className="text-xs font-semibold text-slate-500">
          Have an account?{' '}
          <Link href="/login" className="text-[#d4af37] font-black uppercase tracking-wider hover:text-[#064e3b] transition-colors ml-1">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}