"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const courses = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED", "BSPSYCH"];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", course: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.username || !form.password || !form.course) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.name, course: form.course } },
    });

    if (authError) { setError(authError.message); setLoading(false); return; }
    router.push(`/dashboard?user=${encodeURIComponent(form.username)}`);
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 grid grid-cols-6 gap-2 p-4">
          {Array.from({ length: 48 }).map((_, i) => <div key={i} className="bg-white rounded h-full" />)}
        </div>
        <div className="absolute top-16 right-10 text-8xl opacity-20 rotate-12 select-none">📖</div>
        <div className="absolute top-40 right-32 text-5xl opacity-15 -rotate-6 select-none">📚</div>
        <div className="absolute bottom-40 right-8 text-6xl opacity-20 rotate-6 select-none">📕</div>
        <div className="absolute bottom-20 right-28 text-4xl opacity-15 -rotate-12 select-none">📗</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">📚</div>
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 select-none">🎓</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Join thousands of<br />students reading smarter.</h2>
          <p className="text-blue-200 text-sm leading-relaxed">Create your free account and get instant access to our full catalog of books, journals, and academic resources.</p>
          <div className="mt-8 space-y-3">
            {["✅ Free access to 1,230+ books", "✅ Track your borrowing history", "✅ Get due date reminders"].map((f) => (
              <p key={f} className="text-sm text-blue-100">{f}</p>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-slate-50 px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the SCSIT Library community today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
              <input type="text" placeholder="e.g. Ellajoy Orcine"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
              <input type="email" placeholder="you@example.com"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Username</label>
              <input type="text" placeholder="Choose a username"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select your course</option>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <input type="password" placeholder="Create a strong password"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button onClick={handleRegister} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm">
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
