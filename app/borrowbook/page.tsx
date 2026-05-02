"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; shelf?: string; copies?: number; description?: string; image?: string; };

function BorrowBookContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [selected, setSelected] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [existingBorrow, setExistingBorrow] = useState<{ book_title: string; status: string } | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const due = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
    setBorrowDate(today);
    setDueDate(due);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("username").eq("id", user.id).single().then(({ data }) => {
          setUsername(data?.username || user.user_metadata?.username || user.email?.split("@")[0] || "");
        });
        supabase.from("borrow_records").select("book_title, status").eq("user_id", user.id)
          .in("status", ["Pending", "Active", "Pending Return"]).limit(1).single()
          .then(({ data }) => { if (data) setExistingBorrow(data); });
      }
    });
    if (bookId) {
      supabase.from("books").select("*").eq("id", bookId).single().then(({ data }) => {
        if (data && data.available) setSelected(data);
      });
    }
  }, [bookId]);

  const handleBorrow = async () => {
    if (!selected) { setError("Please select a book."); return; }
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please log in first."); setLoading(false); return; }

    const { error: borrowError } = await supabase.from("borrow_records").insert({
      user_id: user.id,
      user_name: username,
      book_id: selected.id,
      book_title: selected.title,
      book_author: selected.author,
      borrow_date: borrowDate,
      due_date: dueDate,
      status: "Pending",
    });

    if (borrowError) { setError(borrowError.message); setLoading(false); return; }

    setLoading(false);
    window.location.href = "/dashboard?borrowed=1";
  };

  const handleSignOut = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("user_sessions").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <nav className="w-full bg-[#0f172a] py-3 px-10 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SCSIT Library</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Home</Link>
          <Link href="/borrowbook" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Borrow</Link>
          <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">About</Link>
          <Link href="/reviews" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Reviews</Link>
        </div>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
              {username.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden md:block text-slate-300 text-xs">{username}</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{username}</p>
                <p className="text-xs text-slate-400">Student</p>
              </div>
              <Link href={`/profile?user=${encodeURIComponent(username)}`}
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition w-full">
                &#128100; My Profile
              </Link>
              <button onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition w-full text-left">
                &#128682; Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Borrow a Book</h1>
          <p className="text-slate-400 text-sm mt-1">Submit your borrow request for admin approval.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          {existingBorrow ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">📚</div>
              <p className="font-bold text-slate-800 text-lg mb-2">You already have an active borrow</p>
              <p className="text-slate-500 text-sm mb-1">Book: <span className="font-semibold text-slate-700">&ldquo;{existingBorrow.book_title}&rdquo;</span></p>
              <p className="text-slate-500 text-sm mb-6">Status: <span className={`font-semibold ${
                existingBorrow.status === "Active" ? "text-emerald-600" :
                existingBorrow.status === "Pending Return" ? "text-amber-600" : "text-blue-600"
              }`}>{existingBorrow.status}</span></p>
              <p className="text-xs text-slate-400">Please return your current book before borrowing another one.</p>
            </div>
          ) : (
            <>
              {success && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-center py-3 rounded-xl mb-6 text-sm font-medium">
                  ⏳ Borrow request submitted! Waiting for admin approval.
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-center py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {/* BOOK PREVIEW CARD */}
                {selected && (
                  <div className="flex gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-2">
                    <img
                      src={selected.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop"}
                      alt={selected.title}
                      className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">{selected.genre}</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          selected.available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>{selected.available ? "✓ Available" : "✗ Unavailable"}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base leading-tight mt-1">{selected.title}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">by <span className="font-semibold text-slate-700">{selected.author}</span></p>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        {selected.shelf && (
                          <span className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-medium">📍 Shelf {selected.shelf}</span>
                        )}
                        {selected.copies !== undefined && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">📚 {selected.copies} {selected.copies === 1 ? "copy" : "copies"}</span>
                        )}
                      </div>
                      {selected.description && (
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">{selected.description}</p>
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Selected Book</label>
                  <div className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-slate-50 text-slate-600 min-h-[44px]">
                    {selected ? selected.title : <span className="text-slate-400">No book selected</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Author</label>
                  <div className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-slate-50 text-slate-600 min-h-[44px]">
                    {selected ? selected.author : <span className="text-slate-400">—</span>}
                  </div>
                </div>
                {selected?.shelf && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-xs text-blue-500 font-medium">Shelf Location</p>
                      <p className="text-sm font-bold text-blue-700">Shelf {selected.shelf}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Borrow Date</label>
                    <div className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-slate-50 text-slate-700 font-semibold">
                      {borrowDate}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Due Date</label>
                    <div className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-slate-50 text-slate-700 font-semibold">
                      {dueDate}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBorrow}
                disabled={loading || !selected}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm"
              >
                {loading ? "Processing..." : "Submit Borrow Request"}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">Please return the book by the due date to avoid penalties.</p>
            </>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}

export default function BorrowBook() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <BorrowBookContent />
    </Suspense>
  );
}
