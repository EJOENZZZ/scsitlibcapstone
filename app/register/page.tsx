"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const courses = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED"];
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirmPassword: "", course: "", year: "", contact: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.username || !form.password || !form.confirmPassword || !form.course || !form.year) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.name, course: form.course, year: form.year } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: form.username,
        full_name: form.name,
        course: form.course,
        year: form.year,
        contact_number: form.contact,
      });
    }
    setLoading(false);
    setStep("otp");
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setVerifying(true);
    setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: form.email,
      token: otp,
      type: "signup",
    });
    if (verifyError) { setError(verifyError.message); setVerifying(false); return; }
    setVerifying(false);
    window.location.href = `/dashboard?user=${encodeURIComponent(form.username)}`;
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <img src="/scsitbuilding.jpg" alt="SCSIT Building" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-slate-900/90" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>

        <div className="relative z-10">
          <div className="text-7xl mb-6 select-none">🎓</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">Join thousands of<br />students reading smarter.</h2>
          <p className="text-blue-200 text-sm leading-relaxed">Create your free account and get instant access to our full catalog of books, journals, and academic resources.</p>
          <div className="mt-8 space-y-3">
            {["✅ Free access to books", "✅ Track your borrowing history", "✅ Get due date reminders"].map((f) => (
              <p key={f} className="text-sm text-blue-100">{f}</p>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-12 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-sm relative z-10">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          {step === "otp" ? (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📧</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Check your email</h1>
                <p className="text-slate-400 text-sm">We sent a 6-digit code to</p>
                <p className="text-blue-600 font-semibold text-sm mt-1">{form.email}</p>
              </div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Enter OTP Code</label>
              <input
                type="text" maxLength={6} placeholder="000000" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-center text-2xl tracking-widest font-bold"
              />
              <button onClick={handleVerify} disabled={verifying}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-4 text-sm shadow-lg">
                {verifying ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition mt-3">
                ← Back
              </button>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
                <p className="text-slate-400 text-sm mt-1">Join the SCSIT Library community today</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Full Name</label>
                  <input type="text" placeholder="e.g. Juan Dela Cruz"
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
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Confirm Password</label>
                  <input type="password" placeholder="Re-enter your password"
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Contact Number</label>
                  <input type="tel" placeholder="e.g. 09123456789"
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                </div>
              </div>
              <button onClick={handleRegister} disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-lg">
                {loading ? "Sending code..." : "Create Account"}
              </button>
              <p className="text-center text-sm text-slate-400 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
