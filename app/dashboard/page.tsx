// app/dashboard/page.tsx
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Easy Header */}
      <div className="bg-[#3B9CC5] text-white py-1 flex justify-center gap-4">
        <div className="w-17 h-17 bg-white rounded-full overflow-hidden shadow-sm">
          <img 
            src="headerpicture.png"
            alt="EJO Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl md:text-4xl py-3 font-instrument">
          EJO HEALTH MANAGEMENT
        </h1>
      </div>

      <div className="bg-teal-400 text-white py-4 px-15 text-center shadow-md">
        <p className="mt-2 text-xl font-medium text-left">
          Hello, Ellajoy! 👋
        </p>  
        <p className="text-lg mt-1 opacity-90 text-left">
          Stay Healthy Today
        </p>

        {/* Main Cards - 2x2 grid */}
        <div className="flex-2 p-10 grid grid-cols-2 gap-6">
          {/* Heart Rate */}
          <Link href="/heart-rate">
            <div className="bg-red-500 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-lg font-medium">Heart Rate</p>
              <p className="text-3xl font-bold mt-2">76 BPM</p>
            </div>
          </Link>

          {/* BP Rate */}
          <Link href="/bp-rate">
            <div className="bg-orange-400 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer">
              <div className="text-6xl mb-4">💉</div>
              <p className="text-lg font-medium">BP Rate</p>
              <p className="text-3xl font-bold mt-2">120/80</p>
            </div>
          </Link>

          {/* Sugar */}
          <Link href="/sugar">
            <div className="bg-yellow-400 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer">
              <div className="text-6xl mb-4">🩸</div>
              <p className="text-lg font-medium">Sugar</p>
              <p className="text-3xl font-bold mt-2">95 mg/dL</p>
            </div>
          </Link>

          {/* Steps */}
          <Link href="/steps">
            <div className="bg-blue-400 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer">
              <div className="text-6xl mb-4">👣</div>
              <p className="text-lg font-medium">Step</p>
              <p className="text-3xl font-bold mt-2">8,532</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-[#3B9CC5] text-white py-5 flex justify-around items-center">
        <Link href="dashboard">
          <div className="text-3xl cursor-pointer">🏠</div>
        </Link>

        <Link href="appointment">
          <div className="text-3xl cursor-pointer">📅</div>
        </Link>

        <Link href="/records">
          <div className="text-3xl cursor-pointer">📋</div>
        </Link>

        <Link href="/profile">
          <div className="text-3xl cursor-pointer">👤</div>
        </Link>
      </div>
    </div>
  );
}