// app/appointments/page.tsx
import Link from "next/link";

export default function AppointmentsPage() {
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


      {/* Content */}
      <div className="bg-teal-400 text-white py-10 px-10 text-left shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Profile</h2>

        {/* Appointment Card 1 */}
        <div className="bg-[#2F7F99] text-white rounded-xl p-4 mb-4 w-72">
          <p className="font-semibold">Dr. Cruz</p>
          <p>General Checkup</p>
          <p className="text-sm">March 10 • 10:00 AM</p>
          <p className="text-green-300 text-sm mt-1">● Upcoming</p>
          <Link href="/appointment/1" className="text-sm underline">
            [ View Details ]
          </Link>
        </div>

        {/* Appointment Card 2 */}
        <div className="bg-[#2F7F99] text-white rounded-xl p-4 mb-6 w-72">
          <p className="font-semibold">Dr. Reyes</p>
          <p>Dental Cleaning</p>
          <p className="text-sm">February 10 • 1:30 PM</p>
          <p className="text-green-300 text-sm mt-1">✔ Completed</p>
          <Link href="/appointment/2" className="text-sm underline">
            [ View Details ]
          </Link>
        </div>

        {/* Book Appointment */}
        <Link href="/book">
          <div className="flex items-center gap-2 text-black cursor-pointer">
            <span className="text-2xl text-black">＋</span>
            <p className="text-lg ">Book Appointment</p>
          </div>
        </Link>
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

        <Link href="profile">
          <div className="text-3xl cursor-pointer">👤</div>
        </Link>
      </div>
    </div>
  );
}