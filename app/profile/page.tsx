import Link from "next/link";

const borrowHistory = [
  { title: "Introduction to Algorithms", borrowed: "Dec 1, 2025", returned: "Dec 15, 2025", status: "Returned" },
  { title: "Clean Code", borrowed: "Dec 10, 2025", returned: "—", status: "Active" },
  { title: "The Pragmatic Programmer", borrowed: "Nov 20, 2025", returned: "Dec 5, 2025", status: "Returned" },
];

export default function Profile() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📚</div>
          <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href="/profile" className="text-blue-600 font-semibold">Profile</Link>
        </div>
        <Link href="/login" className="px-5 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">
          Sign Out
        </Link>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account and view your borrowing history.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* PROFILE CARD */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl mx-auto mb-4">👤</div>
              <h2 className="text-lg font-bold text-slate-800">Ellajoy Orcine</h2>
              <p className="text-slate-400 text-xs mt-1">BSIT — 3rd Year</p>
              <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">Student</span>

              <div className="mt-6 space-y-3 text-left border-t border-slate-100 pt-5">
                {[
                  { icon: "📧", value: "ellajoy@scsit.edu" },
                  { icon: "👤", value: "@ellajoy" },
                  { icon: "🎓", value: "SCSIT — College of IT" },
                ].map((item) => (
                  <div key={item.value} className="flex items-center gap-3 text-sm text-slate-500">
                    <span>{item.icon}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">
                Edit Profile
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Borrowed", value: "8", color: "text-blue-600" },
                { label: "Active", value: "1", color: "text-emerald-600" },
                { label: "Returned", value: "7", color: "text-slate-600" },
                { label: "Overdue", value: "0", color: "text-red-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700">Borrowing History</h3>
                <p className="text-xs text-slate-400 mt-0.5">{borrowHistory.length} records found</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Book Title", "Borrowed", "Returned", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {borrowHistory.map((b) => (
                    <tr key={b.title} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{b.title}</td>
                      <td className="px-6 py-4 text-slate-500">{b.borrowed}</td>
                      <td className="px-6 py-4 text-slate-500">{b.returned}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
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
      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
