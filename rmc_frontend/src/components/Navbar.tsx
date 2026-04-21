"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  user: {
    full_name: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <nav className="bg-[#064e3b] text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tighter">
            AERON<span className="text-[#d4af37]">RMC</span>
          </h1>
          
          {/* Role-Based Links */}
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-[#d4af37] transition">Home</Link>
            
            {/* Customer Only */}
            {user?.role === 'customer' && (
              <>
                <Link href="/dashboard/customer/orders" className="hover:text-[#d4af37] transition">My Orders</Link>
                <Link href="/dashboard/customer/new-order" className="hover:text-[#d4af37] transition">Request Concrete</Link>
              </>
            )}

            {/* Admin & Dispatcher */}
            {(user?.role === 'admin' || user?.role === 'dispatcher') && (
              <>
                <Link href="/dashboard/admin/orders" className="hover:text-[#d4af37] transition">Manage Orders</Link>
                <Link href="/dashboard/admin/quotations" className="hover:text-[#d4af37] transition">Quotations</Link>
                <Link href="/dashboard/admin/inventory" className="hover:text-[#d4af37] transition">Mix Designs</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold leading-none">{user?.full_name}</p>
            <p className="text-[10px] text-[#d4af37] uppercase tracking-widest">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-200 text-xs py-1.5 px-3 rounded border border-red-500/20 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}