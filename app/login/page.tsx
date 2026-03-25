// app/login/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login (in real app: call your API, set token/cookie)
    localStorage.setItem('isLoggedIn', 'true'); // temporary flag
    router.push('/dashboard'); // redirect to dashboard
  };

  return (
    <div className="min-h-screen bg-teal-500 flex flex-col items-center justify-center px-5 py-8 text-white">
      <div className="mb-12 text-center">
        <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4">
          <svg
            className="w-20 h-20 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          EJO HEALTH MANAGEMENT
        </h1>
      </div>

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-10">Log In</h2>

        <form onSubmit={handleLogin} className="space-y-7">
          <div>
            <label className="block text-base font-medium mb-2">Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3.5 rounded-lg bg-white/80 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium mb-2">Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3.5 rounded-lg bg-white/80 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition transform active:scale-95 mt-6"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-8 text-base">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold underline hover:text-blue-200">
            Register
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm opacity-80 hover:opacity-100">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}