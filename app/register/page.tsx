"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });

  const handleRegister = () => {
    if (!form.name || !form.email || !form.username || !form.password) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Account created successfully! Welcome to SCSIT Library 🎉");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/headerpicture.png" alt="bg" fill className="object-cover" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/headerpicture.png" alt="Logo" width={40} height={40} className="rounded-xl" />
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join thousands of<br />students reading smarter.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your free account and get instant access to our full catalog of books, journals, and academic resources.
          </p>
          <div className="mt-8 space-y-3">
            {["✅ Free access to 1,230+ books", "✅ Track your borrowing history", "✅ Get due date reminders"].map((f) => (
              <p key={f} className="text-sm text-slate-300">{f}</p>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-slate-600">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-slate-50 px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the SCSIT Library community today</p>
          </div>

          <div className="space-y-4">
            {[
              { key: "name", label: "Full Name", placeholder: "e.g. Ellajoy Orcine", type: "text" },
              { key: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
              { key: "username", label: "Username", placeholder: "Choose a username", type: "text" },
              { key: "password", label: "Password", placeholder: "Create a strong password", type: "password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm"
          >
            Create Account
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
