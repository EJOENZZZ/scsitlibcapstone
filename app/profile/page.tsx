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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [userId, setUserId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
          setAvatarUrl(profile.avatar_url || "");
          setUsername(profile.username || user.user_metadata?.username || urlUsername);
          setNewNickname(profile.username || user.user_metadata?.username || urlUsername);
          setCourse(profile.course || user.user_metadata?.course || "");
          setYear(profile.year || user.user_metadata?.year || "");
          setContact(profile.contact_number || "");
        } else {
          setUsername(user.user_metadata?.username || urlUsername);
          setNewNickname(user.user_metadata?.username || urlUsername);
          setCourse(user.user_metadata?.course || "");
          setYear(user.user_metadata?.year || "");
        }

        const { data } = await supabase
          .from("borrow_records").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        if (data) setBorrows(data);
      }
      setLoading(false);
    };
    fetchData();
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

  const handleSaveNickname = async () => {
    if (!newNickname.trim() || !userId) return;
    setSaving(true);
    await supabase.from("profiles").upsert({ id: userId, username: newNickname.trim() });
    setUsername(newNickname.trim());
    setEditingNickname(false);
    setSaving(false);
    setSaveMsg("Username updated! ✅");
    setTimeout(() => setSaveMsg(""), 3000);
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
          <Link href="/profile" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSignOut} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition">Sign Out</button>
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

              {/* NICKNAME */}
              {editingNickname ? (
                <div className="mb-3">
                  <input
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="border border-blue-300 p-2 w-full rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter username"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSaveNickname} disabled={saving}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition">
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditingNickname(false)}
                      className="flex-1 py-1.5 border border-slate-200 text-slate-500 text-xs rounded-lg hover:bg-slate-50 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800">{username}</h2>
                  <button onClick={() => setEditingNickname(true)} className="text-slate-400 hover:text-blue-600 transition text-sm" title="Edit username">✏️</button>
                </div>
              )}

              <p className="text-slate-500 text-sm">{course} {year ? `— ${year}` : ""}</p>
              <span className="inline-block mt-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-md">Active Student</span>

              <div className="mt-8 space-y-4 text-left border-t border-slate-100 pt-6">
                {[
                  { icon: "📧", label: "Email", value: email },
                  { icon: "📱", label: "Contact", value: contact || "—" },
                  { icon: "👤", label: "Username", value: `@${username}` },
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Borrowed", value: borrows.length, color: "from-blue-500 to-blue-600", icon: "📚" },
                { label: "Active", value: activeCount, color: "from-emerald-500 to-emerald-600", icon: "📖" },
                { label: "Returned", value: returnedCount, color: "from-slate-500 to-slate-600", icon: "✅" },
                { label: "Overdue", value: overdueCount, color: "from-red-500 to-red-600", icon: "⏰" },
              ].map((s) => (
                <div key={s.label} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl mx-auto mb-3 shadow-md`}>{s.icon}</div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
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
                          return (
                          <tr key={b.id} className={`transition-colors ${isOverdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-blue-50/30"}`}>
                            <td className="px-8 py-5 font-semibold text-slate-800">{b.book_title}</td>
                            <td className="px-8 py-5 text-slate-600">{b.borrow_date}</td>
                            <td className={`px-8 py-5 font-medium ${isOverdue ? "text-red-600" : "text-slate-600"}`}>{b.due_date}</td>
                            <td className="px-8 py-5">
                              <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-sm ${
                                isOverdue ? "bg-red-100 text-red-700 border border-red-300" :
                                b.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                                "bg-slate-100 text-slate-600 border border-slate-300"
                              }`}>
                                {isOverdue ? "⚠️ Overdue" : b.status}
                              </span>
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
