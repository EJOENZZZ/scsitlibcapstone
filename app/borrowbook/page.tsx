"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BorrowBook() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-md py-4 px-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/headerpicture.png" alt="Library Logo" width={40} height={40} />
          <span className="text-xl font-bold text-blue-700">SCSIT Library</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link href="/dashboard" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/borrowbook" className="hover:text-blue-600 transition">Borrow Book</Link>
          <Link href="/profile" className="hover:text-blue-600 transition">Profile</Link>
        </div>
        <Link href="/login" className="px-5 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
          Log Out
        </Link>
      </nav>

      {/* ================= BORROW FORM ================= */}
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          <h1 className="text-2xl font-bold text-center mb-2">Borrow a Book</h1>
          <p className="text-center text-gray-500 text-sm mb-6">Fill in the details to borrow a book</p>

          {submitted && (
            <div className="bg-green-100 text-green-700 text-center py-2 rounded-lg mb-4 text-sm font-medium">
              Book borrowed successfully! ✅
            </div>
          )}

          <input placeholder="Your Full Name" className="border p-2 w-full mb-3 rounded-lg" />
          <input placeholder="Book Title" className="border p-2 w-full mb-3 rounded-lg" />
          <input placeholder="Author" className="border p-2 w-full mb-3 rounded-lg" />

          <label className="text-sm text-gray-600 mb-1 block">Borrow Date</label>
          <input type="date" className="border p-2 w-full mb-3 rounded-lg" />

          <label className="text-sm text-gray-600 mb-1 block">Return Date</label>
          <input type="date" className="border p-2 w-full mb-5 rounded-lg" />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded-lg transition font-semibold"
          >
            Borrow Book
          </button>
          <p className="text-center text-sm text-gray-400 mt-4">Make sure to return the book on time 📚</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

    </div>
  );
}
