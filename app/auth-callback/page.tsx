"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
        return;
      }
      // Update email in profiles table to match new auth email
      await supabase.from("profiles").update({ email: user.email }).eq("id", user.id);
      setStatus("success");
      setMessage(user.email || "");
    };
    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-slate-100">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⏳</div>
            <h2 className="text-xl font-bold text-slate-800">Confirming your email...</h2>
            <p className="text-slate-400 text-sm mt-2">Please wait a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Email Changed Successfully!</h2>
            <p className="text-slate-500 text-sm mb-1">Your email has been updated to:</p>
            <p className="font-bold text-blue-600 text-base mb-6">{message}</p>
            <Link href="/profile"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition shadow-sm">
              Go to My Profile
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">❌</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Confirmation Failed</h2>
            <p className="text-slate-500 text-sm mb-6">{message}</p>
            <Link href="/profile"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
              Back to Profile
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
