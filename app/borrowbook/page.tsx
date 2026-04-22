"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; };

export default function BorrowBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selected, setSelected] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("books").select("*").order("title").then(({ data }) => {
      if (data) setBooks(data);
    });
    const today = new Date().toISOString().split("T")[0];
    const due = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    setBorrowDate(today);
    setDueDate(due);
  }, []);

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

    // Mark book as unavailable
    await supabase.from("books").update({ available: false }).eq("id", selected.id);
    setBooks((prev) => prev.map((b) => b.id === selected.id ? { ...b, available: false } : b));

    setSuccess(true);
    setSelected(null);
    setLoading(false);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📚</div>
          <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/borrowbook" className="text-blue-600 font-semibold">Borrow Book</Link>
          <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>
        <Link href="/login" className="px-5 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">Sign Out</Link>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Borrow a Book</h1>
          <p className="text-slate-400 text-sm mt-1">Select a title from the catalog, then confirm your borrow request.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* CATALOG */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Book Catalog</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => book.available && setSelected(book)}
                  className={`bg-white rounded-2xl p-4 border-2 transition shadow-sm
                    ${!book.available ? "opacity-50 cursor-not-allowed border-slate-100" :
                      selected?.id === book.id ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-blue-300 cursor-pointer"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{book.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{book.author} · {book.genre}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ml-3 ${book.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                      {book.available ? "Available" : "Borrowed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Borrow Form</h2>
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
                    {selected ? selected.title : <span className="text-slate-400">Click a book from the catalog</span>}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Author</label>
                  <div className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-slate-50 text-slate-600 min-h-[44px]">
                    {selected ? selected.author : <span className="text-slate-400">—</span>}
                  </div>
                </div>
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
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
