"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHero() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main admin page with hero view
    router.push('/admin');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the admin panel.</p>
      </div>
    </div>
  );
}