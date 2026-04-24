"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; copies: number; image?: string; shelf?: string; };
type BorrowRecord = { id: string; book_title: string; book_author: string; borrow_date: string; due_date: string; status: string; book_id: string; };
type Review = { id: string; username: string; course: string; comment: string; rating: number; created_at: string; };

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Find any book instantly by title, author, or genre across our entire catalog." },
  { icon: "📅", title: "Online Borrowing", desc: "Reserve and borrow books online — skip the queue and pick up at your convenience." },
  { icon: "🔔", title: "Due Date Alerts", desc: "Never miss a return date with automatic reminders sent before your deadline." },
  { icon: "📊", title: "Reading History", desc: "Track every book you've borrowed and manage your active loans in one place." },
];

function ReviewForm({ username, onSubmit }: { username: string; onSubmit: () => void }) {
  const [comment, setComment] = useState("");
  const [course, setCourse] = useState("BSIT");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setLoading(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please log in first."); setLoading(false); return; }

    const { error: insertError } = await supabase.from("reviews").insert({
      user_id: user.id,
      username,
      course,
      comment,
      rating,
      satisfied: rating >= 4,
      approved: false,
    });

    if (insertError) { setError(insertError.message); setLoading(false); return; }
    setSuccess(true);
    setComment("");
    setLoading(false);
    setTimeout(() => { setSuccess(false); onSubmit(); }, 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 mb-10 max-w-2xl mx-auto">
      <h3 className="font-bold text-slate-800 text-lg mb-5">✍️ Leave a Review</h3>
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">✅ Review submitted! It will appear once approved by the admin.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}
              className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              {["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Rating</label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}
                  className={`text-2xl transition ${star <= rating ? "text-amber-400" : "text-slate-200"}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Your Comment</label>
          <textarea
            placeholder="Share your experience with the SCSIT Library..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setReviews(data); setLoading(false); });
  }, []);

  if (loading) return <div className="text-center py-8 text-slate-400">Loading reviews...</div>;
  if (reviews.length === 0) return (
    <div className="text-center py-8 text-slate-400">No reviews yet. Be the first to leave one! 😊</div>
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((r) => (
        <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < r.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm">&ldquo;{r.comment}&rdquo;</p>
          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-lg font-bold text-blue-600">
              {r.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{r.username}</p>
              <p className="text-xs text-slate-500">{r.course}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const urlUsername = searchParams.get("user") || "";
  const [username, setUsername] = useState(urlUsername);
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [satisfiedUsers, setSatisfiedUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: booksData } = await supabase.from("books").select("*").order("title");
      if (booksData) setBooks(booksData);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        if (profile?.username) setUsername(profile.username);
        else if (user.user_metadata?.username) setUsername(user.user_metadata.username);

        const { data: borrowData } = await supabase
          .from("borrow_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (borrowData) setBorrows(borrowData);

        // Mark user as online
        const { data: existing } = await supabase
          .from("user_sessions").select("id").eq("user_id", user.id).single();

        if (existing) {
          await supabase.from("user_sessions").update({ last_seen: new Date().toISOString() }).eq("user_id", user.id);
        } else {
          await supabase.from("user_sessions").insert({ user_id: user.id, username, last_seen: new Date().toISOString() });
        }
      }

      // Count users online in last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count: onlineCount } = await supabase
        .from("user_sessions").select("*", { count: "exact", head: true })
        .gte("last_seen", tenMinutesAgo);

      setTotalUsers(onlineCount || 0);

      // Satisfaction based on reviews with rating >= 4
      const { count: totalReviews } = await supabase.from("reviews").select("*", { count: "exact", head: true });
      const { count: satisfiedCount } = await supabase.from("reviews").select("*", { count: "exact", head: true }).gte("rating", 4);
      const pct = totalReviews && totalReviews > 0 ? Math.round(((satisfiedCount || 0) / totalReviews) * 100) : 98;
      setSatisfiedUsers(pct);
      setLoading(false);
    };
    fetchData();

    // Realtime subscription for new books
    const channel = supabase.channel("books-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "books" }, () => {
        fetchData();
      })
      .subscribe();

    // Update last_seen every 2 minutes to keep user online
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("user_sessions").update({ last_seen: new Date().toISOString() }).eq("user_id", user.id);
      }
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [username]);

  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available).length;
  const satisfactionPct = satisfiedUsers;

  const genres = ["All", ...Array.from(new Set(books.map((b) => b.genre)))];
  const filteredBooks = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || b.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const activeCount = borrows.filter((b) => b.status === "Active").length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;

  const handleRequestReturn = async (b: BorrowRecord) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("borrow_records").update({ status: "Pending Return" }).eq("id", b.id).select();
    if (error) { alert("Failed to request return: " + error.message); return; }
    if (user) {
      const { data: borrowData } = await supabase.from("borrow_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (borrowData) setBorrows(borrowData);
    }
  };

  const handleSignOut = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_sessions").delete().eq("user_id", user.id);
    }
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      <nav className="w-full bg-[#0f172a] py-3 px-10 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">SCSIT Library</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Home</Link>
          <Link href="/borrowbook" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Borrow</Link>
          <Link href={`/profile?user=${encodeURIComponent(username)}`} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">{username.charAt(0).toUpperCase()}</div>
            <span className="text-sm font-medium text-white">{username}</span>
          </div>
          <button onClick={handleSignOut} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition">Sign Out</button>
        </div>
      </nav>


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
                      <p className="text-blue-200 text-xs mb-1">{book.author}</p>
                      {book.shelf && <p className="text-amber-300 text-xs mb-3">📍 Shelf {book.shelf}</p>}
                      <Link href={`/borrowbook?bookId=${book.id}`} className="w-full text-center bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition shadow-lg">
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
                    {book.shelf && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">📍 Shelf {book.shelf}</span>
                      </div>
                    )}
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

      {/* LEAVE A REVIEW */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Share Your Experience</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-2">What Students Say</h2>
            <p className="text-slate-500 text-sm">Leave a review and help other students know about the library!</p>
          </div>

          {/* REVIEW FORM */}
          <ReviewForm username={username} onSubmit={() => window.location.reload()} />

          {/* REVIEWS LIST */}
          <ReviewsList />
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
                  {["Book Title", "Author", "Due Date", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {borrows.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No borrowing activity yet. <Link href="/borrowbook" className="text-blue-600 font-medium hover:underline">Borrow a book →</Link></td></tr>
                ) : (
                  borrows.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{b.book_title}</td>
                      <td className="px-6 py-4 text-slate-500">{b.book_author}</td>
                      <td className="px-6 py-4 text-slate-500">{b.due_date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          b.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                          b.status === "Pending Return" ? "bg-amber-50 text-amber-600" :
                          b.status === "Returned" ? "bg-blue-50 text-blue-600" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {b.status === "Returned" ? "✅ Returned" : b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {b.status === "Active" && (
                          <button onClick={() => handleRequestReturn(b)}
                            className="px-3 py-1.5 text-xs font-medium border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 transition">
                            Request Return
                          </button>
                        )}
                        {b.status === "Pending Return" && (
                          <span className="text-xs text-amber-500">⏳ Awaiting admin confirmation</span>
                        )}
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
