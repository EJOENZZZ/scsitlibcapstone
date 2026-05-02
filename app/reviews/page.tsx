"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type Review = { id: string; username: string; course: string; comment: string; rating: number; created_at: string; };

function ReviewForm({ username, onSubmit }: { username: string; onSubmit: () => void }) {
  const [comment, setComment] = useState("");
  const [course, setCourse] = useState("BSIT");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setLoading(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please log in first."); setLoading(false); return; }

    const { error: insertError } = await supabase.from("reviews").insert({
      user_id: user.id,
      username,
      course,
      comment,
      rating,
      satisfied: rating >= 4,
      approved: false,
    });

    if (insertError) { setError(insertError.message); setLoading(false); return; }
    setSuccess(true);
    setComment("");
    setLoading(false);
    setTimeout(() => { setSuccess(false); onSubmit(); }, 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 mb-10 max-w-2xl mx-auto">
      <h3 className="font-bold text-slate-800 text-lg mb-5">Leave a Review</h3>
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">Review submitted! It will appear once approved by the admin.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}
              className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
              {["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Rating</label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}
                  className={`text-2xl transition ${star <= rating ? "text-amber-400" : "text-slate-200"}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1.5 block">Your Comment</label>
          <textarea
            placeholder="Share your experience with the SCSIT Library..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

function ReviewsList({ refreshKey }: { refreshKey: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setReviews(data); setLoading(false); });
  }, [refreshKey]);

  if (loading) return <div className="text-center py-8 text-slate-400">Loading reviews...</div>;
  if (reviews.length === 0) return (
    <div className="text-center py-8 text-slate-400">No reviews yet. Be the first to leave one!</div>
  );

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((r) => (
        <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < r.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed mb-6 text-sm">&ldquo;{r.comment}&rdquo;</p>
          <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-lg font-bold text-blue-600">
              {r.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{r.username}</p>
              <p className="text-xs text-slate-500">{r.course}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [username, setUsername] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("username").eq("id", user.id).single().then(({ data }) => {
          setUsername(data?.username || user.user_metadata?.username || user.email?.split("@")[0] || "");
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await supabase.from("user_sessions").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
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
          <Link href="/reviews" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Reviews</Link>
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

      <section className="py-16 bg-gradient-to-b from-slate-50 to-blue-50 flex-1">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Share Your Experience</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-2">What Students Say</h2>
            <p className="text-slate-500 text-sm">Leave a review and help other students know about the library!</p>
          </div>
          <ReviewForm username={username} onSubmit={() => setRefreshKey((k) => k + 1)} />
          <ReviewsList refreshKey={refreshKey} />
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
