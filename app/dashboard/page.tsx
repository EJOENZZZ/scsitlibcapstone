"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

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

const allBooks = [
  { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", genre: "Computer Science", available: true },
  { title: "Clean Code", author: "Robert C. Martin", genre: "Software Engineering", available: true },
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", genre: "Software Engineering", available: false },
  { title: "Design Patterns", author: "Gang of Four", genre: "Computer Science", available: true },
  { title: "You Don't Know JS", author: "Kyle Simpson", genre: "Web Development", available: true },
  { title: "Database System Concepts", author: "Silberschatz, Galvin, Gagne", genre: "Database", available: false },
  { title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", genre: "Computer Science", available: true },
  { title: "Computer Networks", author: "Andrew S. Tanenbaum", genre: "Networking", available: true },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", genre: "Artificial Intelligence", available: true },
  { title: "The Art of Computer Programming", author: "Donald E. Knuth", genre: "Computer Science", available: true },
  { title: "Structure and Interpretation of Computer Programs", author: "Abelson & Sussman", genre: "Computer Science", available: true },
  { title: "Compilers: Principles, Techniques, and Tools", author: "Aho, Sethi, Ullman", genre: "Computer Science", available: false },
  { title: "Computer Graphics: Principles and Practice", author: "Hughes, van Dam, McGuire", genre: "Computer Graphics", available: true },
  { title: "Machine Learning", author: "Tom M. Mitchell", genre: "Machine Learning", available: true },
  { title: "Data Structures and Algorithms in Java", author: "Robert Lafore", genre: "Computer Science", available: true },
  { title: "Head First Design Patterns", author: "Freeman, Robson, Bates, Sierra", genre: "Software Engineering", available: true },
  { title: "Effective Java", author: "Joshua Bloch", genre: "Programming", available: false },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", genre: "Web Development", available: true },
  { title: "Python Crash Course", author: "Eric Matthes", genre: "Programming", available: true },
  { title: "Learning React", author: "Alex Banks, Eve Porcello", genre: "Web Development", available: true },
  { title: "Node.js Design Patterns", author: "Mario Casciaro", genre: "Web Development", available: false },
  { title: "Pro Git", author: "Scott Chacon, Ben Straub", genre: "Software Engineering", available: true },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", genre: "Software Engineering", available: true },
  { title: "Code Complete", author: "Steve McConnell", genre: "Software Engineering", available: true },
  { title: "Refactoring", author: "Martin Fowler", genre: "Software Engineering", available: true },
  { title: "System Design Interview", author: "Alex Xu", genre: "Software Engineering", available: false },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", genre: "Programming", available: true },
  { title: "Elements of Programming Interviews", author: "Aziz, Lee, Prakash", genre: "Programming", available: true },
  { title: "Deep Learning", author: "Ian Goodfellow, Yoshua Bengio", genre: "Machine Learning", available: true },
  { title: "Pattern Recognition and Machine Learning", author: "Christopher Bishop", genre: "Machine Learning", available: false },
  { title: "Information Theory, Inference and Learning", author: "David MacKay", genre: "Mathematics", available: true },
  { title: "Linear Algebra and Its Applications", author: "Gilbert Strang", genre: "Mathematics", available: true },
  { title: "Discrete Mathematics and Its Applications", author: "Kenneth Rosen", genre: "Mathematics", available: true },
  { title: "Calculus: Early Transcendentals", author: "James Stewart", genre: "Mathematics", available: true },
  { title: "Statistics for Engineers and Scientists", author: "William Navidi", genre: "Statistics", available: false },
  { title: "The Elements of Statistical Learning", author: "Hastie, Tibshirani, Friedman", genre: "Statistics", available: true },
  { title: "Introduction to Statistical Learning", author: "James, Witten, Hastie, Tibshirani", genre: "Statistics", available: true },
  { title: "Computer Security: Principles and Practice", author: "Stallings & Brown", genre: "Cybersecurity", available: true },
  { title: "Network Security Essentials", author: "William Stallings", genre: "Cybersecurity", available: true },
  { title: "Cryptography and Network Security", author: "William Stallings", genre: "Cybersecurity", available: false },
  { title: "Web Application Security", author: "Andrew Hoffman", genre: "Cybersecurity", available: true },
  { title: "The Web Application Hacker's Handbook", author: "Stuttard & Pinto", genre: "Cybersecurity", available: true },
  { title: "iOS Programming: The Big Nerd Ranch Guide", author: "Christian Keur, Aaron Hillegass", genre: "Mobile Development", available: true },
  { title: "Android Programming: The Big Nerd Ranch Guide", author: "Phillips, Stewart, Hardy", genre: "Mobile Development", available: false },
  { title: "React Native in Action", author: "Nader Dabit", genre: "Mobile Development", available: true },
  { title: "Flutter in Action", author: "Eric Windmill", genre: "Mobile Development", available: true },
];

export default function DashboardHome() {
  const searchParams = useSearchParams();
  const username = searchParams.get('user') || 'Student';
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = ["All", ...Array.from(new Set(allBooks.map(book => book.genre)))];
  
  const filteredBooks = allBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">

      {/* NAVBAR */}
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
          <Link href="/login" className="px-5 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm font-medium">
            Sign Out
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* GREETING */}
        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-1">Welcome back,</p>
          <h2 className="text-3xl font-bold text-slate-800">{username} 👋</h2>
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

        {/* BOOK CATALOG */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Book Catalog</h3>
          
          {/* SEARCH & FILTER */}
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
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-semibold text-slate-700">Available Books</h4>
            <span className="text-xs text-slate-400">{filteredBooks.length} books found</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
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
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No books found matching your search.</td>
                  </tr>
                ) : (
                  filteredBooks.map((book, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
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