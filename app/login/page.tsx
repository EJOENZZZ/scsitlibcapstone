"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "123456") {
      router.push("/dashboard?admin=true");
    } else {
      router.push("/dashboard");
    }
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

      {/* ================= LOGIN FORM ================= */}
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
          <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
          <p className="text-center text-gray-500 text-sm mb-5">Welcome back to SCSIT Library</p>
          <input
            placeholder="Username"
            className="border p-2 w-full mb-3 rounded-lg"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded-lg transition font-semibold"
          >
            Login
          </button>
          <p className="text-center text-blue-500 mt-3 cursor-pointer text-sm" onClick={() => router.push("/register")}>
            Don&apos;t have an account? Sign Up
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
