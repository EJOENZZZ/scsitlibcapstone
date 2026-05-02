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
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    const username = data.user?.user_metadata?.username || email.split("@")[0];
    router.push(`/dashboard?user=${encodeURIComponent(username)}`);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) { setError("Please enter your email."); return; }
    if (cooldown > 0) return;
    setForgotLoading(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `https://scsitlibcapstone.vercel.app/reset-password`,
    });
    setForgotLoading(false);
    if (resetError) {
      if (resetError.message.toLowerCase().includes("rate limit") || resetError.message.toLowerCase().includes("too many")) {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(resetError.message);
      }
      return;
    }
    setForgotMsg("Password reset link sent! Check your email.");
    setCooldown(60);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
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
          <div className="text-7xl mb-6 select-none">📚</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Your gateway to<br />knowledge starts here.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Access thousands of books, manage your borrowing history, and stay on top of your reading — all in one place.
          </p>

        </div>

        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-12 relative overflow-hidden">
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

          {forgotMode ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email Address</label>
                <input type="email" placeholder="you@example.com" value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
              </div>
              {forgotMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{forgotMsg}</div>}
              <button onClick={handleForgotPassword} disabled={forgotLoading || cooldown > 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold text-sm shadow-lg">
                {forgotLoading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
              </button>
              <button onClick={() => { setForgotMode(false); setForgotMsg(""); setError(""); }}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition">
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <button onClick={() => { setForgotMode(true); setError(""); }} className="text-xs text-blue-600 hover:underline">Forgot password?</button>
                  </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
