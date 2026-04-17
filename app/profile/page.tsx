import Image from "next/image";
import Link from "next/link";

export default function Profile() {
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
        <Link href="/login" className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
          Log Out
        </Link>
      </nav>

      {/* ================= PROFILE SECTION ================= */}
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-4">My Profile</h1>
          <p className="mb-2 text-gray-700">Name: Sample User</p>
          <p className="mb-2 text-gray-700">Email: user@email.com</p>
          <p className="text-gray-700">Books Borrowed: 3</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

    </div>
  );
}
