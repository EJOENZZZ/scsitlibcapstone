"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { supabase } from "@/lib/supabase";

type BorrowRecord = {
  id: string;
  book_title: string;
  book_author: string;
  borrow_date: string;
  due_date: string;
  status: string;
  returned_date?: string;
};

const calcFine = (due_date: string, status: string) => {
  if (status === "Returned") return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(due_date);
  due.setHours(0, 0, 0, 0);
  const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
  return days > 0 ? days : 0;
};

function ProfileContent() {
  const searchParams = useSearchParams();
  const urlUsername = searchParams.get("user") || "Student";

  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [userId, setUserId] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // edit form state
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editEmail, setEditEmail] = useState("");
  // email change
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const borrowsRef = useRef<BorrowRecord[]>([]);
  const userIdRef = useRef("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userIdRef.current = user.id;
        setUserId(user.id);
        setEmail(user.email || "");

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
          setAvatarUrl(profile.avatar_url || "");
          setUsername(profile.username || user.user_metadata?.username || urlUsername);
          setFullName(profile.full_name || "");
          setCourse(profile.course || user.user_metadata?.course || "");
          setYear(profile.year || user.user_metadata?.year || "");
          setContact(profile.contact_number || "");
        } else {
          setUsername(user.user_metadata?.username || urlUsername);
          setCourse(user.user_metadata?.course || "");
          setYear(user.user_metadata?.year || "");
        }

        const { data } = await supabase
          .from("borrow_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (data) {
          setBorrows([...data]);
          borrowsRef.current = data;
        }
      }
      setLoading(false);
    };
    fetchData();

    const channel = supabase.channel(`profile-borrows-${Date.now()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "borrow_records" }, async () => {
        const uid = userIdRef.current;
        if (!uid) return;
        const { data } = await supabase
          .from("borrow_records").select("*").eq("user_id", uid).order("created_at", { ascending: false });
        if (data) { setBorrows([...data]); borrowsRef.current = data; }
      })
      .subscribe();

    const poll = setInterval(async () => {
      const uid = userIdRef.current;
      if (!uid) return;
      const hasPending = borrowsRef.current.some(b => b.status === "Early Return" || b.status === "Pending" || b.status === "Pending Return");
      if (!hasPending) return;
      const { data } = await supabase
        .from("borrow_records").select("*").eq("user_id", uid).order("created_at", { ascending: false });
      if (data) { setBorrows([...data]); borrowsRef.current = data; }
    }, 2000);

    return () => { supabase.removeChannel(channel); clearInterval(poll); };
  }, [urlUsername]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}.${fileExt}`;

    // Convert to base64 and store as data URL if storage fails
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Try Supabase storage first
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      let finalUrl = dataUrl;

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
        finalUrl = publicUrl;
      }

      // Save to profiles table
      await supabase.from("profiles").upsert({ id: userId, avatar_url: finalUrl });
      setAvatarUrl(finalUrl);
      setUploading(false);
      setSaveMsg("Profile picture updated! ✅");
      setTimeout(() => setSaveMsg(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  const openEdit = () => {
    setEditName(fullName);
    setEditUsername(username);
    setEditContact(contact);
    setEditCourse(course);
    setEditYear(year);
    setEditEmail(email);
    setOtpSent(false);
    setOtpError("");
    setEditOpen(true);
  };

  const handleRequestEmailChange = async () => {
    if (!editEmail.trim() || editEmail === email) return;
    setOtpLoading(true);
    setOtpError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setOtpError("Session expired. Please sign out and sign in again."); setOtpLoading(false); return; }
    const { error } = await supabase.auth.updateUser(
      { email: editEmail.trim() },
      { emailRedirectTo: "https://scsitlibcapstone.vercel.app/auth-callback" }
    );
    if (error) { setOtpError(error.message); setOtpLoading(false); return; }
    setOtpSent(true);
    setOtpLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    setSaveErr("");
    await supabase.from("profiles").upsert({
      id: userId,
      username: editUsername.trim(),
      full_name: editName.trim(),
      contact_number: editContact.trim(),
      course: editCourse.trim(),
      year: editYear.trim(),
    });
    setUsername(editUsername.trim());
    setFullName(editName.trim());
    setContact(editContact.trim());
    setCourse(editCourse.trim());
    setYear(editYear.trim());
    setSaving(false);
    setEditOpen(false);
    setSaveMsg("Profile updated! ✅");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleRequestEarlyReturn = async (id: string) => {
    await supabase.from("borrow_records").update({ status: "Early Return" }).eq("id", id);
    setBorrows((prev) => prev.map((b) => b.id === id ? { ...b, status: "Early Return" } : b));
  };

  const activeCount = borrows.filter((b) => b.status === "Active").length;
  const returnedCount = borrows.filter((b) => b.status === "Returned").length;
  const overdueCount = borrows.filter((b) => b.status !== "Returned" && calcFine(b.due_date, b.status) > 0).length;
  const totalFine = borrows.reduce((sum, b) => sum + calcFine(b.due_date, b.status), 0);

  const handleSignOut = async () => {
    await supabase.from("user_sessions").delete().eq("user_id", userId);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="w-full bg-[#0f172a] py-3 px-10 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SCSIT Library</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Home</Link>
          <Link href="/borrowbook" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Borrow</Link>
          <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">About</Link>
          <Link href="/reviews" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Reviews</Link>
        </div>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-white text-xs">{username}</span>
            <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500 text-sm mt-2">Manage your account and view your borrowing history.</p>
        </div>

        {saveMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{saveMsg}</div>
        )}
        {saveErr && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{saveErr}</div>
        )}

        {totalFine > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">You have an overdue fine of ₱{totalFine}.00</p>
              <p className="text-xs text-red-500 mt-0.5">Fine accumulates ₱1.00 per day after due date. Please return the book and pay at the library.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 text-center">

              {/* PROFILE PICTURE */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-5xl shadow-lg border-4 border-white">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition text-sm"
                  title="Change photo"
                >
                  {uploading ? "⏳" : "📷"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>

              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-800">{username}</h2>
              </div>

              <p className="text-slate-500 text-sm">{course} {year ? `— ${year}` : ""}</p>
              <span className="inline-block mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-md">Active Student</span>

              <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-6">
                {[
                  { icon: "📧", label: "Email", value: email },
                  { icon: "📱", label: "Contact", value: contact || "—" },
                  { icon: "👤", label: "Username", value: `@${username}` },
                  { icon: "🙍", label: "Full Name", value: fullName || "—" },
                  { icon: "🎓", label: "Course", value: course || "—" },
                  { icon: "📅", label: "Year Level", value: year || "—" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-slate-700 font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={openEdit}
                className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm">
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100/50 bg-gradient-to-r from-slate-50 to-blue-50">
                <h3 className="text-xl font-bold text-slate-800">Borrowing History</h3>
                <p className="text-sm text-slate-500 mt-1">{borrows.length} records found</p>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="py-12 text-center text-slate-400">Loading history...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                {["Book Title", "Borrowed", "Due Date", "Status", "Fine"].map((h) => (
                          <th key={h} className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {borrows.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400">No borrowing history yet.</td></tr>
                      ) : (
                        borrows.map((b) => {
                          const fine = calcFine(b.due_date, b.status);
                          const isOverdue = fine > 0 && b.status !== "Returned";
                          const isEarlyReturn = b.status === "Returned" && !!b.returned_date && b.returned_date < b.due_date;
                          const isEarlyReturnPending = b.status === "Early Return";
                          return (
                          <tr key={b.id} className={`transition-colors ${isOverdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-blue-50/30"}`}>
                            <td className="px-8 py-5 font-semibold text-slate-800">{b.book_title}</td>
                            <td className="px-8 py-5 text-slate-600 whitespace-nowrap">{new Date(b.borrow_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                            <td className={`px-8 py-5 font-semibold whitespace-nowrap ${isOverdue ? "text-red-600" : "text-slate-700"}`}>{new Date(b.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-2">
                                <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-sm w-fit ${
                                  isOverdue ? "bg-red-100 text-red-700 border border-red-300" :
                                  isEarlyReturn ? "bg-blue-100 text-blue-700 border border-blue-300" :
                                  isEarlyReturnPending ? "bg-purple-100 text-purple-700 border border-purple-300" :
                                  b.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                                  "bg-slate-100 text-slate-600 border border-slate-300"
                                }`}>
                                  {isOverdue ? "Overdue" : isEarlyReturn ? "Returned Early" : isEarlyReturnPending ? "Return Requested" : b.status}
                                </span>
                                {isEarlyReturnPending && (
                                  <span className="text-xs text-purple-500">Awaiting librarian confirmation</span>
                                )}
                                {b.status === "Active" && !isOverdue && !isEarlyReturnPending && (
                                  <button onClick={() => handleRequestEarlyReturn(b.id)}
                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition w-fit">
                                    ↩ Request Early Return
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              {fine > 0 && b.status !== "Returned" ? (
                                <span className="text-sm font-bold text-red-600">₱{fine}.00</span>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 text-center py-6 text-slate-500 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-800 mb-1">Edit Profile</h2>
            <p className="text-xs text-slate-400 mb-4">Update your personal information below.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Full Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full name"
                  className="border border-slate-200 px-3 py-2 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Username</label>
                <input value={editUsername} onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Your username"
                  className="border border-slate-200 px-3 py-2 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Contact Number</label>
                <input value={editContact} onChange={(e) => setEditContact(e.target.value)}
                  placeholder="e.g. 09XXXXXXXXX"
                  className="border border-slate-200 px-3 py-2 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Course</label>
                  <select value={editCourse} onChange={(e) => setEditCourse(e.target.value)}
                    className="border border-slate-200 px-3 py-2 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white">
                    {["", "BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM"].map((c) => (
                      <option key={c} value={c}>{c || "Select course"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Year Level</label>
                  <select value={editYear} onChange={(e) => setEditYear(e.target.value)}
                    className="border border-slate-200 px-3 py-2 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white">
                    {["", "1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                      <option key={y} value={y}>{y || "Select year"}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* EMAIL CHANGE */}
              <div className="border-t border-slate-100 pt-3">
                <label className="text-xs font-medium text-slate-600 mb-1 block">Change Email Address</label>
                <div className="flex gap-2">
                  <input value={editEmail} onChange={(e) => { setEditEmail(e.target.value); setOtpSent(false); setOtpError(""); }}
                    placeholder="New email address"
                    className="border border-slate-200 px-3 py-2 flex-1 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                  {editEmail !== email && editEmail.trim() && !otpSent && (
                    <button onClick={handleRequestEmailChange} disabled={otpLoading}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl transition whitespace-nowrap">
                      {otpLoading ? "Sending..." : "Send Confirmation"}
                    </button>
                  )}
                </div>
                {editEmail === email && <p className="text-xs text-slate-400 mt-1">Type a new email to change it.</p>}
                {otpSent && (
                  <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                    <p className="text-xs text-emerald-700 font-medium">✅ Confirmation sent to <span className="font-bold">{email}</span>.</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Check your current email and click the link to confirm the change to {editEmail}.</p>
                  </div>
                )}
                {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleSaveProfile} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
