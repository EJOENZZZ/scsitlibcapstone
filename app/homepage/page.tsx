// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  if (typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') !== 'true') {
    return null;
  }

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-wide">EJO HEALTH MANAGEMENT</h1>
        </div>
        <span className="text-sm opacity-90">Home</span>
      </header>

      {/* Greeting + Cards (insert your images here) */}
      <main className="flex-1 p-5 pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Hello, Ellajoy 👋
          </h2>
          <p className="text-gray-600 mt-1">Stay Healthy Today</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Heart Rate - insert picture */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-blue-400">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {/* <Image src="/your-heart-rate.jpg" alt="Heart" fill className="object-cover" /> */}
              <p className="text-gray-500 text-sm">Heart Rate Photo</p>
            </div>
            <div className="p-3 text-center">
              <p className="font-semibold">Heart Rate</p>
              <p className="text-xl font-bold text-blue-600">76 BPM</p>
            </div>
          </div>

          {/* BP Rate, Sugar, Step - pareho ra, insert your own pictures */}
          {/* ... copy-paste the other 3 cards ... */}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-teal-600 text-white fixed bottom-0 left-0 right-0 shadow-lg">
        {/* ... your bottom nav code ... */}
      </nav>
    </div>
  );
}