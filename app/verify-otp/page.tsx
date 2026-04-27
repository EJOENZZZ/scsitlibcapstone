"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const username = searchParams.get("user") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleVerify = async () => {
    if (!otp || otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setLoading(true);
    setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "signup",
    });
    setLoading(false);
    if (verifyError) { setError(verifyError.message); return; }
    router.push(`/dashboard?user=${encodeURIComponent(username)}`);
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    await supabase.auth.resend({ type: "signup", email });
    setResending(false);
    setResendMsg("Code resent! Check your email.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📧</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Verify your email</h1>
          <p className="text-slate-400 text-sm">We sent a 6-digit code to</p>
          <p className="text-blue-600 font-semibold text-sm mt-1">{email}</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}
        {resendMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5">{resendMsg}</div>}

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Enter OTP Code</label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-center text-2xl tracking-widest font-bold"
          />
        </div>

        <button onClick={handleVerify} disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-4 text-sm shadow-lg">
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <button onClick={handleResend} disabled={resending}
          className="w-full text-center text-sm text-slate-400 hover:text-blue-600 transition mt-4">
          {resending ? "Resending..." : "Didn't receive a code? Resend"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
