import Image from "next/image";
import Link from "next/link";

const quickActions = [
  { href: "/borrowbook", icon: "📚", label: "Borrow a Book", desc: "Browse and borrow from our collection", color: "bg-blue-600 hover:bg-blue-700" },
  { href: "/mybooks", icon: "📖", label: "My Borrowed Books", desc: "View your currently borrowed books", color: "bg-emerald-500 hover:bg-emerald-600" },
  { href: "/returnbook", icon: "🔄", label: "Return a Book", desc: "Return books before the due date", color: "bg-orange-400 hover:bg-orange-500" },
  { href: "/profile", icon: "👤", label: "My Profile", desc: "View and edit your account details", color: "bg-purple-500 hover:bg-purple-600" },
];

const recentBooks = [
  { title: "Introduction to Algorithms", author: "Cormen et al.", due: "Dec 30, 2025", status: "Active" },
  { title: "Clean Code", author: "Robert C. Martin", due: "Jan 5, 2026", status: "Active" },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", due: "Returned", status: "Returned" },
];

export default function DashboardHome() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/headerpicture.png" alt="Library Logo" width={38} height={38} className="rounded-lg" />
          <div>
            <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Student</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/dashboard" className="text-blue-600 font-semibold">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>
        <Link href="/login" className="px-5 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">
          Sign Out
        </Link>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">

        {/* GREETING */}
        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-1">Welcome back,</p>
          <h2 className="text-3xl font-bold text-slate-800">Ellajoy Orcine 👋</h2>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { label: "Books Borrowed", value: "2", icon: "📚", color: "bg-blue-50 text-blue-700" },
            { label: "Due This Week", value: "1", icon: "📅", color: "bg-amber-50 text-amber-700" },
            { label: "Books Returned", value: "5", icon: "✅", color: "bg-emerald-50 text-emerald-700" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {quickActions.map((a) => (
            <Link key={a.href} href={a.href}>
              <div className={`${a.color} text-white rounded-2xl p-5 shadow-sm flex items-center gap-5 cursor-pointer transition`}>
                <span className="text-4xl">{a.icon}</span>
                <div>
                  <p className="font-semibold">{a.label}</p>
                  <p className="text-sm opacity-80 mt-0.5">{a.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* RECENT ACTIVITY */}
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Recent Activity</h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Book Title", "Author", "Due Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBooks.map((b) => (
                <tr key={b.title} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-800">{b.title}</td>
                  <td className="px-6 py-4 text-slate-500">{b.author}</td>
                  <td className="px-6 py-4 text-slate-500">{b.due}</td>
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

      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
