"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Get the user from your local storage/cookies
    const userStr = localStorage.getItem('user'); // Or wherever you store user data
    if (!userStr) {
      router.push('/aeron-vault'); // Not logged in? Send to secret login
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      router.push('/dashboard/customer'); // Not an admin? Kick them back to customer area
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return <div className="h-screen flex items-center justify-center font-mono">AUTHENTICATING...</div>;

  return <>{children}</>;
}