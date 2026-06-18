"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/src/lib/api';
import Navbar from '@/src/components/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('me/');
        setUser(res.data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50">Loading LCRMC...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main>
        {children}
      </main>
    </div>
  );
}