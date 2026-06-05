// "use client";
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/src/lib/api';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     first_name: '',
//     last_name: ''
//   });
//   const router = useRouter();

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post('/users/register/', formData);
//       alert("Registration successful! Please log in.");
//       router.push('/login');
//     } catch (err) {
//       alert("Registration failed. Try a different username.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh]">
//       <div className="insta-card w-full max-w-sm p-8 bg-white">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold text-[#064e3b]">AERON<span className="text-[#d4af37]">RMC</span></h1>
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
      // Note: Ensure the URL matches your backend route (e.g., /api/register/ or /api/users/register/)
      await api.post('/register/', formData); 
      Swal.fire({
      title: 'REGISTRATION SUCCESSFUL',
      text: 'Your Aeron Ops profile account has been established. Please log in with your credentials to access your dashboard overview panel.',
      icon: 'success',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#06b6d4', // Your signature Cyan branding
      customClass: {
        popup: 'rounded-3xl border border-slate-800 font-sans'
      }
    });
      router.push('/login');
    } catch (err: any) {
      // This will help you see the REAL error in the browser console
      console.error(err.response?.data); 
      const errorMsg = err.response?.data?.username ? "Username already taken." : "Registration failed. Please check all fields.";
      Swal.fire({
        title: 'REGISTRATION ERROR',
        text: errorMsg,
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="insta-card w-full max-w-sm p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#064e3b]">AERON<span className="text-[#d4af37]">RMC</span></h1>
          <p className="text-gray-400 text-sm font-semibold mt-2">Sign up to request concrete delivery</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <input 
            type="text"
            placeholder="Username"
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          
          {/* New Company Name Field */}
          <input 
            type="text"
            placeholder="Company Name"
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            required
          />

          {/* New Contact Number Field */}
          <input 
            type="text"
            placeholder="Contact Number"
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
            onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
            required
          />

          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="First Name"
              className="w-1/2 bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
            <input 
              type="text"
              placeholder="Last Name"
              className="w-1/2 bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            />
          </div>
          
          <input 
            type="email"
            placeholder="Email Address"
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          
          <input 
            type="password"
            placeholder="Password"
            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-sm p-2 text-xs outline-none focus:border-gray-400"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button type="submit" className="w-full btn-primary mt-2 text-sm">
            Sign Up
          </button>
        </form>
      </div>

      <div className="insta-card w-full max-w-sm p-4 text-center bg-white">
        <p className="text-sm">
          Have an account? <a href="/login" className="text-[#064e3b] font-bold hover:text-[#d4af37]">Log in</a>
        </p>
      </div>
    </div>
  );
}