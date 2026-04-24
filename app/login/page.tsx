"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalBooks, setTotalBooks] = useState(0);
  const [satisfaction, setSatisfaction] = useState(98);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: books } = await supabase.from("books").select("*", { count: "exact", head: true });
      setTotalBooks(books || 0);

      const { count: totalBorrows } = await supabase.from("reviews").select("*", { count: "exact", head: true });
      const { count: returned } = await supabase.from("reviews").select("*", { count: "exact", head: true }).gte("rating", 4);
      if (totalBorrows && totalBorrows > 0) {
        setSatisfaction(Math.round(((returned || 0) / totalBorrows) * 100));
      }

      const { count: users } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      setTotalUsers(users || 0);
    };
    fetchStats();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) { setError(authError.message); setLoading(false); return; }

    const username = data.user?.user_metadata?.username || email.split("@")[0];
    router.push(`/dashboard?user=${encodeURIComponent(username)}`);
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Background blur circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Floating books */}
        <div className="absolute top-16 right-10 text-8xl opacity-20 rotate-12 select-none">📖</div>
        <div className="absolute top-40 right-32 text-5xl opacity-15 -rotate-6 select-none">📚</div>
        <div className="absolute bottom-40 right-8 text-6xl opacity-20 rotate-6 select-none">📕</div>
        <div className="absolute bottom-20 right-28 text-4xl opacity-15 -rotate-12 select-none">📗</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 select-none">📚</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your gateway to<br />knowledge starts here.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Access thousands of books, manage your borrowing history, and stay on top of your reading — all in one place.
          </p>

          {/* REAL STATS - same as homepage */}
          <div className="flex gap-4 mt-8">
            {(
              [
                { value: `${totalBooks}+`, label: "Total Books" },
                { value: `${satisfaction}%`, label: "Satisfaction" },
                { value: `${totalUsers}`, label: "Registered Users" },
              ] as { value: string; label: string }[]
            ).map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-center flex-1">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-12 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-sm relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Sign in to your account</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back to SCSIT Library</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <input type="password" placeholder="Enter your password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
            </div>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-lg">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">Create one</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <Link href="/admin" className="text-xs text-slate-400 hover:text-slate-600 transition">Admin Portal →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
