"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; copies: number; image?: string; };
type BorrowRecord = { id: string; book_title: string; book_author: string; borrow_date: string; due_date: string; status: string; };

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Find any book instantly by title, author, or genre across our entire catalog." },
  { icon: "📅", title: "Online Borrowing", desc: "Reserve and borrow books online — skip the queue and pick up at your convenience." },
  { icon: "🔔", title: "Due Date Alerts", desc: "Never miss a return date with automatic reminders sent before your deadline." },
  { icon: "📊", title: "Reading History", desc: "Track every book you've borrowed and manage your active loans in one place." },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("user") || "Student";
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [satisfiedUsers, setSatisfiedUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch books
      const { data: booksData } = await supabase.from("books").select("*").order("title");
      if (booksData) setBooks(booksData);

      // Fetch user's borrow records
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: borrowData } = await supabase
          .from("borrow_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (borrowData) setBorrows(borrowData);
      }

      // Fetch total borrow records for satisfaction stats
      const { count: totalCount } = await supabase
        .from("borrow_records").select("*", { count: "exact", head: true });
      const { count: returnedCount } = await supabase
        .from("borrow_records").select("*", { count: "exact", head: true }).eq("status", "Returned");

      setTotalUsers(totalCount || 0);
      setSatisfiedUsers(returnedCount || 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const satisfactionPct = totalUsers > 0 ? Math.round((satisfiedUsers / totalUsers) * 100) : 98;

  const genres = ["All", ...Array.from(new Set(books.map((b) => b.genre)))];
  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const activeCount = borrows.filter((b) => b.status === "Active").length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* NAVBAR */}
      <nav className="w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/50 py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">📚</div>
          <div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">SCSIT Library</span>
            <span className="hidden sm:inline ml-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Student Portal</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <Link href="/dashboard" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Home</Link>
          <Link href="#books" className="hover:text-slate-800 transition">Books</Link>
          <Link href="/borrowbook" className="hover:text-slate-800 transition">Borrow</Link>
          <Link href={`/profile?user=${encodeURIComponent(username)}`} className="hover:text-slate-800 transition">Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Hello, <span className="font-semibold text-slate-800">{username}</span> 👋</span>
          <Link href="/login" className="px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">Sign Out</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center text-white min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute top-20 left-20 text-8xl opacity-10 rotate-12 select-none animate-pulse">📚</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 -rotate-12 select-none animate-pulse">📖</div>

        <div className="relative z-10 max-w-4xl px-6 py-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Welcome back, {username}!
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
            Your Library,<br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Your Knowledge</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Browse, borrow, and manage books from the SCSIT Library — all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/borrowbook" className="px-8 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition font-bold text-sm shadow-2xl">
              Borrow a Book
            </Link>
            <Link href={`/profile?user=${encodeURIComponent(username)}`} className="px-8 py-3 rounded-xl border-2 border-white/30 hover:bg-white/10 transition font-semibold text-sm">
              My Profile →
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            {[
              { value: loading ? "..." : `${totalBooks}+`, label: "Total Books", icon: "📚" },
              { value: loading ? "..." : `${availableBooks}`, label: "Available Now", icon: "✅" },
              { value: loading ? "..." : `${satisfactionPct}%`, label: "Satisfaction", icon: "⭐" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-6 px-4 shadow-xl">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MY ACTIVITY */}
      <section className="py-10 bg-slate-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-10">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">My Activity</h3>
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: "Books Borrowed", value: activeCount, icon: "📚", color: "bg-blue-50 text-blue-700" },
              { label: "Books Returned", value: returnedCount, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
              { label: "Total Records", value: borrows.length, icon: "📋", color: "bg-purple-50 text-purple-700" },
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
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section id="books" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4">Book Catalog</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Browse all available books. Click a book to borrow it.</p>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                placeholder="Search books or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading books...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {filteredBooks.map((book) => (
                <div key={book.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer">
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop"}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg ${book.available ? "bg-emerald-500" : "bg-red-500"}`}>
                        {book.available ? "✓ Available" : "✗ Borrowed"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow">
                        {book.genre}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-800/80 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <p className="text-white font-bold text-sm leading-tight mb-1">{book.title}</p>
                      <p className="text-blue-200 text-xs mb-4">{book.author}</p>
                      <Link href="/borrowbook" className="w-full text-center bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition shadow-lg">
                        📚 Borrow This Book
                      </Link>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{book.title}</h3>
                    <p className="text-slate-400 text-xs">{book.author}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-400">📖 {book.genre}</span>
                      <span className={`text-xs font-semibold ${book.available ? "text-emerald-600" : "text-red-500"}`}>
                        {book.available ? "Free to borrow" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-3xl border border-slate-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-500 bg-white transform hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-2xl mb-4 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-10">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">My Recent Borrowing</h3>
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
                {borrows.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No borrowing activity yet. <Link href="/borrowbook" className="text-blue-600 font-medium hover:underline">Borrow a book →</Link></td></tr>
                ) : (
                  borrows.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{b.book_title}</td>
                      <td className="px-6 py-4 text-slate-500">{b.book_author}</td>
                      <td className="px-6 py-4 text-slate-500">{b.due_date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
