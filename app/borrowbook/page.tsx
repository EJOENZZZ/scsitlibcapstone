"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; shelf?: string; };

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

    setSuccess(true);
    setSelected(null);
    setLoading(false);
    setTimeout(() => setSuccess(false), 4000);
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
                <input type="date" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Due Date</label>
                <input type="date" value={dueDate} readOnly
                  className="border border-slate-200 p-3 w-full rounded-xl text-base font-semibold text-slate-700 bg-slate-50 cursor-not-allowed tracking-wide" />
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
