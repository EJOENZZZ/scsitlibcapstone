"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const borrowHistory = [
  { title: "Introduction to Algorithms", borrowed: "Dec 1, 2025", returned: "Dec 15, 2025", status: "Returned" },
  { title: "Clean Code", borrowed: "Dec 10, 2025", returned: "—", status: "Active" },
  { title: "The Pragmatic Programmer", borrowed: "Nov 20, 2025", returned: "Dec 5, 2025", status: "Returned" },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("user") || "Student";

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">📚</div>
          <div>
            <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Student Portal</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href="/profile" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Hello, <span className="font-semibold text-slate-800">{username}</span></span>
          <Link href="/login" className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition text-sm font-medium shadow-md">
            Sign Out
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-2">Manage your account and view your borrowing history.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg">👤</div>
              <h2 className="text-2xl font-bold text-slate-800">{username}</h2>
              <p className="text-slate-500 text-sm mt-1">BSIT — 3rd Year</p>
              <span className="inline-block mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-md">
                Active Student
              </span>
              <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-6">
                {[
                  { icon: "📧", label: "Email", value: `${username.toLowerCase()}@scsit.edu` },
                  { icon: "👤", label: "Username", value: `@${username.toLowerCase()}` },
                  { icon: "🎓", label: "Department", value: "SCSIT — College of IT" },
                  { icon: "📅", label: "Member Since", value: "September 2024" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-slate-700 font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Borrowed", value: "8", color: "from-blue-500 to-blue-600", icon: "📚" },
                { label: "Active", value: "1", color: "from-emerald-500 to-emerald-600", icon: "📖" },
                { label: "Returned", value: "7", color: "from-slate-500 to-slate-600", icon: "✅" },
                { label: "Overdue", value: "0", color: "from-red-500 to-red-600", icon: "⏰" },
              ].map((s) => (
                <div key={s.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mx-auto mb-3 shadow-md`}>
                    {s.icon}
                  </div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100/50 bg-gradient-to-r from-slate-50 to-blue-50">
                <h3 className="text-xl font-bold text-slate-800">Borrowing History</h3>
                <p className="text-sm text-slate-500 mt-1">{borrowHistory.length} records found</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                      {["Book Title", "Borrowed", "Returned", "Status"].map((h) => (
                        <th key={h} className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {borrowHistory.map((b) => (
                      <tr key={b.title} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-5 font-semibold text-slate-800">{b.title}</td>
                        <td className="px-8 py-5 text-slate-600">{b.borrowed}</td>
                        <td className="px-8 py-5 text-slate-600">{b.returned}</td>
                        <td className="px-8 py-5">
                          <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-sm ${
                            b.status === "Active"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-slate-100 text-slate-600 border border-slate-300"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 text-center py-6 text-slate-500 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
