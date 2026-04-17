import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-md py-4 px-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/headerpicture.png" alt="Library Logo" width={40} height={40} />
          <span className="text-xl font-bold text-blue-700">SCSIT Library</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Login</Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Sign Up</Link>
          <Link href="/admin" className="px-5 py-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition">Admin</Link>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative flex items-center justify-center text-center text-white h-[80vh]">
        <Image src="/headerpicture.png" alt="Library Background" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-5xl font-bold mb-6">Welcome to SCSIT Library</h1>
          <p className="text-lg mb-8 text-gray-200">
            Browse our collection and find the perfect book for your studies and leisure.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/dashboard" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition font-semibold">Get Started</Link>
            <Link href="/about" className="px-8 py-3 rounded-full border border-white hover:bg-white hover:text-black transition font-semibold">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-10">
          <div>
            <h2 className="text-4xl font-bold text-blue-600">1,230+</h2>
            <p className="text-gray-600 mt-2">Books Available</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600">12</h2>
            <p className="text-gray-600 mt-2">Genres</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600">98%</h2>
            <p className="text-gray-600 mt-2">User Satisfaction</p>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-blue-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Reading?</h2>
        <Link href="/register" className="px-8 py-3 rounded-full bg-white text-blue-600 font-semibold hover:bg-gray-200 transition">
          Create Account Now
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

    </div>
  );
}
