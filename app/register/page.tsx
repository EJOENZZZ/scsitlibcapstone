"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const courses = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED"];
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", course: "", year: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.username || !form.password || !form.course || !form.year) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.name, course: form.course, year: form.year } },
    });

    if (authError) { setError(authError.message); setLoading(false); return; }

    // Insert into profiles table
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        username: form.username,
        full_name: form.name,
        course: form.course,
        year: form.year,
      });
    }

    router.push(`/dashboard?user=${encodeURIComponent(form.username)}`);
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Animated background circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl" />

        {/* Floating book emojis */}
        <div className="absolute top-16 right-10 text-8xl opacity-20 rotate-12 select-none">📖</div>
        <div className="absolute top-40 right-32 text-5xl opacity-15 -rotate-6 select-none">📚</div>
        <div className="absolute bottom-40 right-8 text-6xl opacity-20 rotate-6 select-none">📕</div>
        <div className="absolute bottom-20 right-28 text-4xl opacity-15 -rotate-12 select-none">📗</div>
        <div className="absolute top-1/2 left-6 text-5xl opacity-10 rotate-3 select-none">📘</div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-base">SCSIT Library</span>
        </div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 select-none">🎓</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join thousands of<br />students reading smarter.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Create your free account and get instant access to our full catalog of books, journals, and academic resources.
          </p>
          <div className="mt-8 space-y-3">
            {["✅ Free access to 1,230+ books", "✅ Track your borrowing history", "✅ Get due date reminders"].map((f) => (
              <p key={f} className="text-sm text-blue-100">{f}</p>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-10">
            {[["1,230+", "Books"], ["8", "Courses"], ["98%", "Satisfaction"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <p className="text-xl font-bold text-white">{v}</p>
                <p className="text-xs text-blue-300">{l}</p>
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
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
              <input type="email" placeholder="you@example.com"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Username</label>
              <input type="text" placeholder="Choose a username"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            {/* Course & Year side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
                <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm">
                  <option value="">Select course</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Year Level</label>
                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm">
                  <option value="">Select year</option>
                  {yearLevels.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <input type="password" placeholder="Create a strong password"
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button onClick={handleRegister} disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-lg">
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
