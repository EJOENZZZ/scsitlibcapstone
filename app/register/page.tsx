// app/register/page.tsx
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-teal-500 flex flex-col items-center justify-center px-5 py-8 text-white">
      {/* Header / Logo Section */}
      <div className="mb-10 text-center">
        <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center shadow-xl mx-auto mb-4">
          {/* Placeholder icon – replace with your actual logo if you have one */}
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

      {/* Form Container */}
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-8">Register</h2>

        <form className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-base font-medium mb-2">Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-lg bg-white/80 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-base font-medium mb-2">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-white/80 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium mb-2">Password:</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-lg bg-white/80 border border-white/30 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Gender Radio Buttons */}
          <div>
            <label className="block text-base font-medium mb-3">Gender:</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="w-5 h-5 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-base">Female</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="w-5 h-5 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-base">Male</span>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="prefer-not-to-say"
                  className="w-5 h-5 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
                  defaultChecked
                />
                <span className="ml-3 text-base">Prefer not to say</span>
              </label>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition transform active:scale-95 mt-4"
          >
            Register
          </button>
        </form>

        {/* Link back to login */}
        <p className="text-center mt-6 text-base">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold underline hover:text-blue-200">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}