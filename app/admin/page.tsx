"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Book = { id: string; title: string; author: string; genre: string; copies: number; available: boolean; image?: string; shelf?: string; };
type Borrower = { id: string; user_name: string; book_title: string; borrow_date: string; due_date: string; status: string; book_id: string; };
type Review = { id: string; username: string; course: string; comment: string; rating: number; approved: boolean; created_at: string; };
type UserProfile = { id: string; username: string; full_name: string; course: string; year: string; created_at: string; };
const emptyForm = { title: "", author: "", genre: "", copies: 1, available: true, image: "", shelf: "" };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<UserProfile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState<"books" | "borrowers" | "reviews" | "users">("books");
  const [loading, setLoading] = useState(false);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("book-covers").upload(fileName, file, { upsert: true });
    if (error) { alert("Upload failed: " + error.message); setImageUploading(false); return; }
    const { data } = supabase.storage.from("book-covers").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setImageUploading(false);
  };

  useEffect(() => {
    const session = sessionStorage.getItem("adminAuthed");
    if (session === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) {
      sessionStorage.setItem("adminAuthed", "1");
      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [authed]);

  const fetchData = async () => {
    const { data: booksData } = await supabase.from("books").select("*").order("title");
    if (booksData) setBooks(booksData);
    const { data: borrowData } = await supabase.from("borrow_records").select("*").order("created_at", { ascending: false });
    if (borrowData) setBorrowers(borrowData);
    const { data: reviewData } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (reviewData) setReviews(reviewData);
    const { data: userData } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (userData) setUsers(userData);
  };

  const handleAdminLogin = () => {
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "1234";
    if (loginForm.username === adminUser && loginForm.password === adminPass) {
      sessionStorage.setItem("adminAuthed", "1");
      setAuthed(true); setLoginError("");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const openAdd = () => { setForm(emptyForm); setModal("add"); };
  const openEdit = (b: Book) => { setSelected(b); setForm({ title: b.title, author: b.author, genre: b.genre, copies: b.copies, available: b.available, image: b.image || "", shelf: b.shelf || "" }); setModal("edit"); };
  const openDelete = (b: Book) => { setSelected(b); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleAdd = async () => {
    if (!form.title || !form.author || !form.genre) return;
    setLoading(true);
    const { error } = await supabase.from("books").insert(form);
    if (error) { alert("Failed to add book: " + error.message); setLoading(false); return; }
    await fetchData();
    setLoading(false);
    closeModal();
  };

  const handleEdit = async () => {
    if (!selected) return;
    setLoading(true);
    await supabase.from("books").update(form).eq("id", selected.id);
    await fetchData();
    setLoading(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (!selected) return;
    setLoading(true);
    // Delete related borrow records first, then delete book
    await supabase.from("borrow_records").update({ book_id: null }).eq("book_id", selected.id);
    await supabase.from("books").delete().eq("id", selected.id);
    await fetchData();
    setLoading(false);
    closeModal();
  };

  const handleReturn = async (b: Borrower) => {
    setReturningId(b.id);
    if (b.book_id) {
      const { error: bookErr } = await supabase.from("books").update({ available: true }).eq("id", b.book_id);
      if (bookErr) { alert("Book update failed: " + bookErr.message); setReturningId(null); return; }
    }
    const { error: updateErr } = await supabase.from("borrow_records").update({ status: "Returned" }).eq("id", b.id);
    if (updateErr) { alert("Update failed: " + updateErr.message); setReturningId(null); return; }
    await fetchData();
    setReturningId(null);
  };

  const handleRemoveBorrowRecord = async (id: string) => {
    await supabase.from("borrow_records").delete().eq("id", id);
    await fetchData();
  };

  const handleApproveReview = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) { alert("Failed to update review: " + error.message); return; }
    await fetchData();
  };

  const handleDeleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { alert("Failed to delete review: " + error.message); return; }
    await fetchData();
  };

  const handleDeleteUser = async () => {
    if (!deleteUserTarget) return;
    setLoading(true);
    await supabase.from("borrow_records").delete().eq("user_id", deleteUserTarget.id);
    await supabase.from("reviews").delete().eq("user_id", deleteUserTarget.id);
    await supabase.from("user_sessions").delete().eq("user_id", deleteUserTarget.id);
    await supabase.from("profiles").delete().eq("id", deleteUserTarget.id);
    setDeleteUserTarget(null);
    setLoading(false);
    await fetchData();
  };

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Books", value: books.length, icon: "📚", color: "bg-blue-50 text-blue-700" },
    { label: "Available", value: books.filter((b) => b.available).length, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
    { label: "Borrowers", value: borrowers.length, icon: "👥", color: "bg-purple-50 text-purple-700" },
    { label: "Users", value: users.length, icon: "👤", color: "bg-amber-50 text-amber-700" },
  ];

  if (!authed) {
    return (
      <div className="flex min-h-screen font-sans">
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-black flex-col justify-between p-12 relative overflow-hidden">
          <div className="absolute top-16 right-10 text-8xl opacity-10 rotate-12 select-none">🔐</div>
          <div className="absolute bottom-32 right-20 text-6xl opacity-10 -rotate-6 select-none">📊</div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12">
              <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold text-lg">SCSIT Library</span>
          </div>
          <div className="relative z-10">
            <div className="text-6xl mb-6 select-none">🛡️</div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">Admin Portal<br />Access Only.</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Restricted to authorized library administrators only.</p>

          </div>
          <p className="relative z-10 text-xs text-slate-600">© {new Date().getFullYear()} SCSIT Library</p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center bg-slate-50 px-8 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Restricted Access</span>
              <h1 className="text-2xl font-bold text-slate-800">Admin Sign In</h1>
              <p className="text-slate-400 text-sm mt-1">Enter your admin credentials to continue</p>
            </div>
            {loginError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{loginError}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Username</label>
                <input placeholder="Enter admin username" value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
                <input type="password" placeholder="Enter admin password" value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 transition" />
              </div>
            </div>
            <button onClick={handleAdminLogin} className="bg-slate-900 hover:bg-slate-700 text-white w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-sm">
              Sign In to Admin Panel
            </button>
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600 transition">← Go to User Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        <div className="px-6 py-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-bold text-sm">SCSIT Library</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { icon: "📚", label: "Books" },
            { icon: "👥", label: "Borrowers" },
            { icon: "💬", label: "Reviews" },
            { icon: "👤", label: "Users" },
          ].map((item) => (
            <button key={item.label}
              onClick={() => setActiveTab(item.label.toLowerCase() as "books" | "borrowers" | "reviews" | "users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left ${
                activeTab === item.label.toLowerCase() ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-slate-700">
          <button onClick={() => { sessionStorage.removeItem("adminAuthed"); setAuthed(false); setLoginForm({ username: "", password: "" }); window.location.href = "/login"; }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition w-full">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="ml-64 flex-1 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Library Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage books, borrowers, and library records</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">● System Online</span>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          {borrowers.filter(b => b.status === "Pending Return").length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📬</span>
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    {borrowers.filter(b => b.status === "Pending Return").length} return request{borrowers.filter(b => b.status === "Pending Return").length > 1 ? "s" : ""} waiting for your confirmation
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">Go to Borrowers tab to confirm.</p>
                </div>
              </div>
              <button onClick={() => setActiveTab("borrowers")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition">
                View Requests
              </button>
            </div>
          )}
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

          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
            {(["books", "borrowers", "reviews", "users"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  activeTab === tab ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}>
                {tab === "books" ? "📚 Books" : tab === "borrowers" ? (
                  <span className="flex items-center gap-2">
                    👥 Borrowers
                    {borrowers.filter(b => b.status === "Pending Return").length > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {borrowers.filter(b => b.status === "Pending Return").length}
                      </span>
                    )}
                  </span>
                ) : tab === "reviews" ? "💬 Reviews" : "👤 Users"}
              </button>
            ))}
          </div>

          {activeTab === "books" && (
            <>
              <div className="flex justify-between items-center mb-5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                  <input placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
                </div>
                <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm">
                  + Add New Book
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Book Title", "Author", "Genre", "Shelf", "Copies", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No books found.</td></tr>
                    ) : (
                      filtered.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-semibold text-slate-800">{book.title}</td>
                          <td className="px-6 py-4 text-slate-500">{book.author}</td>
                          <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">{book.genre}</span></td>
                          <td className="px-6 py-4 text-slate-600 text-xs">{book.shelf || "—"}</td>
                          <td className="px-6 py-4 text-slate-600 font-medium">{book.copies}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${book.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                              {book.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(book)} className="px-3 py-1.5 text-xs font-medium border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition">Edit</button>
                              <button onClick={() => openDelete(book)} className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">Delete</button>
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

          {activeTab === "borrowers" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Borrower Records</h3>
                <div className="flex items-center gap-3">
                  {borrowers.filter(b => b.status === "Pending Return").length > 0 && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                      ⏳ {borrowers.filter(b => b.status === "Pending Return").length} pending return{borrowers.filter(b => b.status === "Pending Return").length > 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{borrowers.length} records</span>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Borrower", "Book Title", "Borrowed Date", "Due Date", "Status", "Action"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {borrowers.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No borrow records yet.</td></tr>
                  ) : (
                    borrowers.map((b) => (
                      <tr key={b.id} className={`transition ${b.status === "Pending Return" ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-slate-50"}`}>
                        <td className="px-6 py-4 font-semibold text-slate-800">{b.user_name}</td>
                        <td className="px-6 py-4 text-slate-500">{b.book_title}</td>
                        <td className="px-6 py-4 text-slate-500">{b.borrow_date}</td>
                        <td className="px-6 py-4 text-slate-500">{b.due_date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            b.status === "Active" ? "bg-emerald-50 text-emerald-700" :
                            b.status === "Pending Return" ? "bg-amber-50 text-amber-600" :
                            b.status === "Overdue" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                          }`}>{b.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {b.status === "Pending Return" && (
                              <button onClick={() => handleReturn(b)} disabled={returningId === b.id}
                                className="px-3 py-1.5 text-xs font-medium border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50">
                                {returningId === b.id ? "Processing..." : "✅ Confirm Return"}
                              </button>
                            )}
                            {b.status === "Active" && (
                              <span className="text-xs text-slate-400">Waiting for user</span>
                            )}
                            {b.status === "Returned" && (
                              <button onClick={() => handleRemoveBorrowRecord(b.id)}
                                className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Registered Users</h3>
                <span className="text-xs text-slate-400">{users.length} users</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Username", "Full Name", "Course", "Year", "Joined", "Action"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No registered users yet.</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-800">{u.username}</td>
                        <td className="px-6 py-4 text-slate-600">{u.full_name}</td>
                        <td className="px-6 py-4 text-slate-500">{u.course}</td>
                        <td className="px-6 py-4 text-slate-500">{u.year}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => setDeleteUserTarget(u)}
                            className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Student Reviews</h3>
                <span className="text-xs text-slate-400">{reviews.length} reviews · {reviews.filter(r => r.approved).length} approved</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Student", "Course", "Rating", "Comment", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reviews.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No reviews yet.</td></tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-semibold text-slate-800">{r.username}</td>
                        <td className="px-6 py-4 text-slate-500">{r.course}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < r.rating ? "text-amber-400" : "text-slate-200"}>★</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs">
                          <p className="truncate">&ldquo;{r.comment}&rdquo;</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            r.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"
                          }`}>
                            {r.approved ? "✅ Approved" : "⏳ Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {!r.approved ? (
                              <button onClick={() => handleApproveReview(r.id, true)}
                                className="px-3 py-1.5 text-xs font-medium border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition">
                                Approve
                              </button>
                            ) : (
                              <button onClick={() => handleApproveReview(r.id, false)}
                                className="px-3 py-1.5 text-xs font-medium border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 transition">
                                Hide
                              </button>
                            )}
                            <button onClick={() => handleDeleteReview(r.id)}
                              className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-800 mb-0.5">{modal === "add" ? "Add New Book" : "Edit Book"}</h2>
            <p className="text-xs text-slate-400 mb-4">{modal === "add" ? "Fill in the details to add a book." : "Update the book information below."}</p>
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: "title", label: "Book Title", placeholder: "e.g. Introduction to Algorithms" },
                  { key: "author", label: "Author", placeholder: "e.g. Thomas H. Cormen" },
                  { key: "genre", label: "Genre", placeholder: "e.g. Computer Science" },
                  { key: "shelf", label: "Shelf Location", placeholder: "e.g. A1, B2, C3" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">{f.label}</label>
                    <input placeholder={f.placeholder} value={(form as Record<string, string | number | boolean>)[f.key] as string}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="border border-slate-200 px-3 py-2 w-full rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Book Cover Image</label>
                <input type="file" accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                  className="border border-slate-200 px-3 py-2 w-full rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white" />
                {imageUploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Copies</label>
                  <input type="number" min={1} value={form.copies} onChange={(e) => setForm({ ...form, copies: Number(e.target.value) })}
                    className="border border-slate-200 px-3 py-2 w-full rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Status</label>
                  <select value={form.available ? "true" : "false"} onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                    className="border border-slate-200 px-3 py-2 w-full rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white">
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
              </div>
              {(form as Record<string, string | number | boolean>)["image"] && (
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Image Preview</label>
                  <img src={(form as Record<string, string | number | boolean>)["image"] as string} alt="preview"
                    className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={modal === "add" ? handleAdd : handleEdit} disabled={loading}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold transition">
                {loading ? "Saving..." : modal === "add" ? "Add Book" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteUserTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Remove User</h2>
            <p className="text-sm text-slate-500 mb-1">Are you sure you want to remove</p>
            <p className="font-semibold text-slate-800 mb-2">{deleteUserTarget.username}</p>
            <p className="text-xs text-red-400 mb-6">This will delete all their records and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteUserTarget(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleDeleteUser} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition">
                {loading ? "Removing..." : "Remove User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Book</h2>
            <p className="text-sm text-slate-500 mb-1">Are you sure you want to delete</p>
            <p className="font-semibold text-slate-800 mb-2">&quot;{selected.title}&quot;?</p>
            <p className="text-xs text-red-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition">
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

