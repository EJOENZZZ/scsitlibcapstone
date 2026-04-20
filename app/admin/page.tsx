"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  copies: number;
  available: boolean;
};

const initialBooks: Book[] = [
  { id: 1, title: "Introduction to Algorithms", author: "Cormen et al.", genre: "Computer Science", copies: 5, available: true },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", genre: "Software Engineering", copies: 3, available: true },
  { id: 3, title: "The Pragmatic Programmer", author: "Hunt & Thomas", genre: "Software Engineering", copies: 2, available: false },
  { id: 4, title: "Design Patterns", author: "Gang of Four", genre: "Computer Science", copies: 4, available: true },
  { id: 5, title: "You Don't Know JS", author: "Kyle Simpson", genre: "Web Development", copies: 6, available: true },
  { id: 6, title: "Database System Concepts", author: "Silberschatz et al.", genre: "Database", copies: 3, available: false },
  { id: 7, title: "Operating System Concepts", author: "Silberschatz et al.", genre: "Computer Science", copies: 4, available: true },
  { id: 8, title: "Computer Networks", author: "Tanenbaum", genre: "Networking", copies: 2, available: true },
];

const emptyForm = { title: "", author: "", genre: "", copies: 1, available: true };

const borrowers = [
  { name: "Ellajoy Orcine", book: "Clean Code", borrowed: "Dec 10, 2025", due: "Dec 24, 2025", status: "Active" },
  { name: "Juan dela Cruz", book: "Design Patterns", borrowed: "Dec 5, 2025", due: "Dec 19, 2025", status: "Overdue" },
  { name: "Maria Santos", book: "Computer Networks", borrowed: "Dec 12, 2025", due: "Dec 26, 2025", status: "Active" },
  { name: "Carlo Reyes", book: "Database System Concepts", borrowed: "Nov 28, 2025", due: "Dec 12, 2025", status: "Returned" },
];

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState<"books" | "borrowers">("books");

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (b: Book) => { setSelected(b); setForm({ title: b.title, author: b.author, genre: b.genre, copies: b.copies, available: b.available }); setModal("edit"); };
  const openDelete = (b: Book) => { setSelected(b); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleAdd = () => {
    if (!form.title || !form.author || !form.genre) return;
    setBooks([...books, { ...form, id: Date.now() }]);
    closeModal();
  };

  const handleEdit = () => {
    if (!selected) return;
    setBooks(books.map((b) => (b.id === selected.id ? { ...b, ...form } : b)));
    closeModal();
  };

  const handleDelete = () => {
    if (!selected) return;
    setBooks(books.filter((b) => b.id !== selected.id));
    closeModal();
  };

  const stats = [
    { label: "Total Books", value: books.length, icon: "📚", color: "bg-blue-50 text-blue-700" },
    { label: "Available", value: books.filter((b) => b.available).length, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
    { label: "Unavailable", value: books.filter((b) => !b.available).length, icon: "🔒", color: "bg-red-50 text-red-600" },
    { label: "Total Copies", value: books.reduce((s, b) => s + b.copies, 0), icon: "🗂️", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-slate-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        <div className="px-6 py-6 border-b border-slate-700 flex items-center gap-3">
          <Image src="/headerpicture.png" alt="Logo" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="font-bold text-sm">SCSIT Library</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "📚", label: "Books", active: false },
            { icon: "👥", label: "Borrowers", active: false },
            { icon: "📊", label: "Reports", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                item.active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-6 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">A</div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-slate-400">admin@scsit.edu</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition">
            <span>🚪</span> Sign Out
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="ml-64 flex-1 flex flex-col">

        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Library Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage books, borrowers, and library records</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">● System Online</span>
            <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 transition border border-slate-200 px-4 py-2 rounded-lg">
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">

          {/* STATS */}
          <div className="grid grid-cols-4 gap-5 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
            {(["books", "borrowers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "books" ? "📚 Books" : "👥 Borrowers"}
              </button>
            ))}
          </div>

          {/* BOOKS TAB */}
          {activeTab === "books" && (
            <>
              <div className="flex justify-between items-center mb-5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input
                    placeholder="Search books, authors, genres..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <button
                  onClick={openAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm"
                >
                  + Add New Book
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Book Title", "Author", "Genre", "Copies", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No books found.</td></tr>
                    ) : (
                      filtered.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-semibold text-slate-800">{book.title}</td>
                          <td className="px-6 py-4 text-slate-500">{book.author}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">{book.genre}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{book.copies}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${book.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                              {book.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(book)} className="px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                                Edit
                              </button>
                              <button onClick={() => openDelete(book)} className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
                  Showing {filtered.length} of {books.length} books
                </div>
              </div>
            </>
          )}

          {/* BORROWERS TAB */}
          {activeTab === "borrowers" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Borrower Records</h3>
                <span className="text-xs text-slate-400">{borrowers.length} records</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Borrower", "Book Title", "Borrowed Date", "Due Date", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {borrowers.map((b) => (
                    <tr key={b.name + b.book} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{b.name}</td>
                      <td className="px-6 py-4 text-slate-500">{b.book}</td>
                      <td className="px-6 py-4 text-slate-500">{b.borrowed}</td>
                      <td className="px-6 py-4 text-slate-500">{b.due}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          b.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                          b.status === "Overdue" ? "bg-red-50 text-red-600" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-1">{modal === "add" ? "Add New Book" : "Edit Book"}</h2>
            <p className="text-sm text-slate-400 mb-6">
              {modal === "add" ? "Fill in the details to add a book to the catalog." : "Update the book information below."}
            </p>

            <div className="space-y-4">
              {[
                { key: "title", label: "Book Title", placeholder: "e.g. Introduction to Algorithms" },
                { key: "author", label: "Author", placeholder: "e.g. Thomas H. Cormen" },
                { key: "genre", label: "Genre", placeholder: "e.g. Computer Science" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    value={(form as Record<string, string | number | boolean>)[f.key] as string}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Copies</label>
                  <input
                    type="number"
                    min={1}
                    value={form.copies}
                    onChange={(e) => setForm({ ...form, copies: Number(e.target.value) })}
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Status</label>
                  <select
                    value={form.available ? "true" : "false"}
                    onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                    className="border border-slate-200 p-3 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={modal === "add" ? handleAdd : handleEdit}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
              >
                {modal === "add" ? "Add Book" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal === "delete" && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Book</h2>
            <p className="text-sm text-slate-500 mb-1">Are you sure you want to delete</p>
            <p className="font-semibold text-slate-800 mb-2">&quot;{selected.title}&quot;?</p>
            <p className="text-xs text-red-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
