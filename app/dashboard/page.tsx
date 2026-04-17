import Image from "next/image";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-md py-4 px-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/headerpicture.png" alt="Library Logo" width={40} height={40} />
          <span className="text-xl font-bold text-blue-700">SCSIT Library</span>
        </div>

        <div className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>

        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
            Log Out
          </Link>
        </div>
      </nav>

      {/* ================= GREETING ================= */}
      <section className="px-10 py-8">
        <h2 className="text-3xl font-bold text-gray-800">Hello, Ellajoy! 👋</h2>
        <p className="text-gray-600 mt-1">What would you like to read today?</p>
      </section>

      {/* ================= BOOK CARDS ================= */}
      <section className="px-10 pb-10 grid md:grid-cols-2 gap-6 flex-1">

        <Link href="/borrowbook">
          <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-700 transition">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-lg font-medium">Borrow a Book</p>
            <p className="text-sm mt-2 opacity-90">Browse and borrow from our collection</p>
          </div>
        </Link>

        <Link href="/mybooks">
          <div className="bg-green-500 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-600 transition">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-lg font-medium">My Borrowed Books</p>
            <p className="text-sm mt-2 opacity-90">View your currently borrowed books</p>
          </div>
        </Link>

        <Link href="/returnbook">
          <div className="bg-orange-400 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-orange-500 transition">
            <div className="text-6xl mb-4">🔄</div>
            <p className="text-lg font-medium">Return a Book</p>
            <p className="text-sm mt-2 opacity-90">Return books before the due date</p>
          </div>
        </Link>

        <Link href="/profile">
          <div className="bg-purple-500 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-purple-600 transition">
            <div className="text-6xl mb-4">👤</div>
            <p className="text-lg font-medium">My Profile</p>
            <p className="text-sm mt-2 opacity-90">View and edit your account details</p>
          </div>
        </Link>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

    </div>
  );
}
