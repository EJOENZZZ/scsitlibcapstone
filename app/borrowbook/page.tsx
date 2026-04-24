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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const due = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    setBorrowDate(today);
    setDueDate(due);
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

    const username = user.user_metadata?.username || user.email?.split("@")[0];

    const { error: borrowError } = await supabase.from("borrow_records").insert({
      user_id: user.id,
      user_name: username,
      book_id: selected.id,
      book_title: selected.title,
      book_author: selected.author,
      borrow_date: borrowDate,
      due_date: dueDate,
      status: "Active",
    });

    if (borrowError) { setError(borrowError.message); setLoading(false); return; }

    await supabase.from("books").update({ available: false }).eq("id", selected.id);
    setSuccess(true);
    setSelected(null);
    setLoading(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <nav className="w-full bg-[#0f172a] border-b border-slate-700 py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">SCSIT Library</span>
            <span className="hidden sm:inline ml-2 text-xs bg-blue-800 text-blue-200 px-3 py-1 rounded-full font-medium">Student Portal</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-sm">
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition border-b-2 border-transparent pb-1">Home</Link>
          <Link href="/borrowbook" className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-1">Borrow Book</Link>
          <Link href="/profile" className="text-slate-300 hover:text-white transition border-b-2 border-transparent pb-1">Profile</Link>
        </div>
        <Link href="/login" className="min-w-[80px] text-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition text-sm font-medium shadow-md">Sign Out</Link>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Borrow a Book</h1>
          <p className="text-slate-400 text-sm mt-1">Confirm your borrow request below.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-center py-3 rounded-xl mb-6 text-sm font-medium">
              ✅ Book borrowed successfully!
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
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
            </div>
          </div>

          <button
            onClick={handleBorrow}
            disabled={loading || !selected}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm"
          >
            {loading ? "Processing..." : "Confirm Borrow"}
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
