// app/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center px-6 text-center text-white">
      
      {/* App Name */}
      <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-wide">
        EJO Booking System
      </h3>

      {/* ICON (Airplane) */}
      <div className="mb-10">
        <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto">
          <svg
            className="w-24 h-24 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.5 19l19-7-19-7v5l15 2-15 2v5z"
            />
          </svg>
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
        EJO ONLINE BOOKING
      </h1>

      {/* TAGLINE */}
      <p className="text-xl md:text-2xl font-medium mb-12">
        Book Your Trip Anytime, Anywhere
      </p>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
        
        <Link
          href="/login"
          className="bg-white text-blue-600 font-bold text-lg py-5 px-12 rounded-full shadow-xl hover:bg-gray-100 active:scale-95 transition transform"
        >
          Log In
        </Link>

        <Link
          href="/register"
          className="bg-blue-800 text-white font-bold text-lg py-5 px-12 rounded-full shadow-xl hover:bg-blue-900 active:scale-95 transition transform"
        >
          Register
        </Link>

      </div>

      {/* FOOTER TEXT */}
      <p className="mt-10 text-sm opacity-90">
        Book flights or ferry tickets بسهولة 🚢✈️
      </p>
    </div>
  );
}