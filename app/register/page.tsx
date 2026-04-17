"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const handleRegister = () => {
    alert("Registered Successfully!");
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-md py-4 px-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/headerpicture.png" alt="Library Logo" width={40} height={40} />
          <span className="text-xl font-bold text-blue-700">SCSIT Library</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">Login</Link>
          <Link href="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Sign Up</Link>
          <Link href="/admin" className="px-5 py-2 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition">Admin</Link>
        </div>
      </nav>

      {/* ================= REGISTER FORM ================= */}
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
          <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>
          <p className="text-center text-gray-500 text-sm mb-5">Create your SCSIT Library account</p>
          <input placeholder="Full Name" className="border p-2 w-full mb-2 rounded-lg" />
          <input placeholder="Email" className="border p-2 w-full mb-2 rounded-lg" />
          <input placeholder="Username" className="border p-2 w-full mb-2 rounded-lg" />
          <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded-lg" />
          <button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded-lg transition font-semibold"
          >
            Create Account
          </button>
          <p className="text-center text-blue-500 mt-3 cursor-pointer text-sm" onClick={() => router.push("/login")}>
            Already have an account? Login
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

    </div>
  );
}
