// app/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-teal-500 flex flex-col items-center justify-center px-6 text-center text-white">
      {/* App Name at top (small) */}
      <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-wide">
        Health Management
      </h3>

      {/* Blue circle icon with hands + heart (placeholder SVG — replace if you have your own) */}
      <div className="mb-10">
        <div className="w-40 h-40 md:w-48 md:h-48 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
          <svg
            className="w-32 h-32 md:w-40 md:h-40 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Heart + simple hands outline — customize as needed */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v7m-3-4l3 3 3-3"
            />
          </svg>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
        EJO HEALTH MANAGEMENT
      </h1>

      {/* Tagline */}
      <p className="text-xl md:text-2xl font-medium mb-12">
        Your Health, Your Care
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
        <Link
          href="/login"
          className="bg-white text-teal-600 font-bold text-lg py-5 px-12 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition transform"
        >
          Log In
        </Link>

        <Link
          href="/register"
          className="bg-blue-700 text-white font-bold text-lg py-5 px-12 rounded-full shadow-xl hover:bg-blue-800 active:scale-95 transition transform"
        >
          Register
        </Link>
      </div>

      {/* Small text at bottom */}
      <p className="mt-10 text-sm opacity-90">
        Already had an account?
      </p>
    </div>
  );
}