"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setError("");
    router.push(username === "admin" && password === "123456" ? "/dashboard?admin=true" : "/dashboard");
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Decorative book grid background */}
        <div className="absolute inset-0 opacity-5 grid grid-cols-6 gap-2 p-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="bg-white rounded h-full" />
          ))}
        </div>

        {/* Floating book illustrations */}
        <div className="absolute top-16 right-10 text-8xl opacity-20 rotate-12 select-none">📖</div>
        <div className="absolute top-40 right-32 text-5xl opacity-15 -rotate-6 select-none">📚</div>
        <div className="absolute bottom-40 right-8 text-6xl opacity-20 rotate-6 select-none">📕</div>
        <div className="absolute bottom-20 right-28 text-4xl opacity-15 -rotate-12 select-none">📗</div>
        <div className="absolute top-1/2 left-6 text-5xl opacity-10 rotate-3 select-none">📘</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">📚</div>
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>

        <div className="relative z-10">
          {/* Big book icon */}
          <div className="text-7xl mb-6 select-none">📚</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your gateway to<br />knowledge starts here.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Access thousands of books, manage your borrowing history, and stay on top of your reading — all in one place.
          </p>
          <div className="flex gap-6 mt-8">
            {[["1,230+", "Books"], ["12", "Genres"], ["98%", "Satisfaction"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-white">{v}</p>
                <p className="text-xs text-blue-300">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-slate-50 px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Sign in to your account</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back to SCSIT Library</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Username</label>
              <input
                placeholder="Enter your username"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">Forgot password?</span>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition">
              Admin Portal →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
