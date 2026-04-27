"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; available: boolean; image?: string; shelf?: string; };

const features = [
  { icon: "🔍", title: "Search & Browse", desc: "Easily search through our catalog of books across multiple genres." },
  { icon: "📅", title: "Easy Borrowing", desc: "Borrow books online and pick them up at the library — no queues." },
  { icon: "🔔", title: "Due Date Reminders", desc: "Get notified before your return date so you never miss a deadline." },
  { icon: "📊", title: "Track Your Reading", desc: "View your borrowing history and manage your active loans anytime." },
];

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalGenres, setTotalGenres] = useState(0);

  useEffect(() => {
    supabase.from("books").select("*").order("title").then(({ data }) => {
      if (data) {
        setBooks(data);
        setTotalBooks(data.length);
        setTotalGenres(new Set(data.map((b) => b.genre)).size);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm font-medium">Login</Link>
          <Link href="/register" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">Sign Up</Link>
          <Link href="/admin" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition text-sm font-medium">Admin</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center text-white h-[82vh] bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl px-6">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest border border-white/20">
            SCSIT Digital Library System
          </span>
          <h1 className="text-5xl font-bold mb-5 leading-tight tracking-tight">
            Your Gateway to<br />Knowledge & Learning
          </h1>
          <p className="text-lg mb-8 text-blue-200 max-w-xl mx-auto leading-relaxed">
            Browse, borrow, and manage books from the SCSIT Library — anytime, anywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="px-8 py-3 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition font-semibold text-sm shadow-lg">
              Get Started
            </Link>
            <Link href="/register" className="px-8 py-3 rounded-lg border border-white/40 hover:bg-white/10 transition font-semibold text-sm backdrop-blur-sm">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-10 text-center">
          {[
            { value: `${totalBooks}+`, label: "Books Available", icon: "📚" },
            { value: `${totalGenres}`, label: "Genres", icon: "🏷️" },
            { value: "98%", label: "User Satisfaction", icon: "⭐" },
          ].map((s) => (
            <div key={s.label} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-slate-50">
              <div className="text-3xl mb-2">{s.icon}</div>
              <h2 className="text-4xl font-bold text-blue-600">{s.value}</h2>
              <p className="text-slate-500 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4">Browse Books</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Sign in to borrow any of these books.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-3">
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
                    <p className="text-blue-200 text-xs mb-3">{book.author}</p>
                    <Link href="/login" className="w-full text-center bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition shadow-lg">
                      📚 Login to Borrow
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
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">📍 Shelf {book.shelf}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Why Use SCSIT Library?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Everything you need to manage your reading in one place.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800">{f.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-3">Ready to Start Reading?</h2>
        <p className="text-slate-400 mb-8 text-sm">Join SCSIT students already using the library system.</p>
        <Link href="/register" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm shadow-lg">
          Create Free Account
        </Link>
      </section>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
