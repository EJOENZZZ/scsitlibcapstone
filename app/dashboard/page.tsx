"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  copies: number;
};

type BorrowRecord = {
  id: string;
  book_title: string;
  book_author: string;
  borrow_date: string;
  due_date: string;
  status: string;
};

const quickActions = [
  { href: "/borrowbook", icon: "📚", label: "Borrow a Book", desc: "Browse and borrow from our collection", color: "bg-blue-600 hover:bg-blue-700" },
  { href: "/profile", icon: "👤", label: "My Profile", desc: "View and edit your account details", color: "bg-purple-500 hover:bg-purple-600" },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("user") || "Student";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: booksData } = await supabase.from("books").select("*").order("title");
      if (booksData) setBooks(booksData);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: borrowData } = await supabase
          .from("borrow_records")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (borrowData) setBorrows(borrowData);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const genres = ["All", ...Array.from(new Set(books.map((b) => b.genre)))];
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const activeCount = borrows.filter((b) => b.status === "Active").length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📚</div>
          <div>
            <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Student</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/dashboard" className="text-blue-600 font-semibold">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href={`/profile?user=${encodeURIComponent(username)}`} className="hover:text-blue-600 transition">Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Hello, <span className="font-semibold">{username}</span></span>
          <Link href="/login" className="px-5 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">Sign Out</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-1">Welcome back,</p>
          <h2 className="text-3xl font-bold text-slate-800">{username} 👋</h2>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-10">
          {[
            { label: "Books Borrowed", value: activeCount, icon: "📚", color: "bg-blue-50 text-blue-700" },
            { label: "Due This Week", value: activeCount, icon: "📅", color: "bg-amber-50 text-amber-700" },
            { label: "Books Returned", value: returnedCount, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
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

        {/* BOOK CATALOG */}
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Book Catalog</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
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

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-semibold text-slate-700">Available Books</h4>
            <span className="text-xs text-slate-400">{filteredBooks.length} books found</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center text-slate-400">Loading books...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Book Title", "Author", "Genre", "Status"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBooks.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No books found.</td></tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-800">{book.title}</td>
                        <td className="px-6 py-4 text-slate-500">{book.author}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">{book.genre}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                            {book.available ? "Available" : "Borrowed"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
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
              {borrows.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No borrowing activity yet.</td></tr>
              ) : (
                borrows.map((b) => (
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
      </main>

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
