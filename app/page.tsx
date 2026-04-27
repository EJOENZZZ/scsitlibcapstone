import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Find any book instantly by title, author, or genre." },
  { icon: "📅", title: "Online Borrowing", desc: "Reserve and borrow books online — skip the queue." },
  { icon: "🔔", title: "Due Date Alerts", desc: "Never miss a return date with automatic reminders." },
  { icon: "📊", title: "Reading History", desc: "Track every book you've borrowed in one place." },
  { icon: "🎓", title: "Academic Focus", desc: "Curated collection of textbooks for SCSIT students." },
  { icon: "🔒", title: "Secure Access", desc: "Your account and data are protected with secure auth." },
];

export default async function Home() {
  noStore();
  const { data: books } = await supabase.from("books").select("*").order("title");
  const totalBooks = books?.length || 0;
  const totalGenres = new Set(books?.map((b) => b.genre) || []).size;
  const { data: reviews } = await supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* NAVBAR */}
      <nav className="w-full bg-[#0f172a] py-3 px-10 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SCSIT Library</span>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Home</Link>
          <Link href="#features" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Features</Link>
          <Link href="#reviews" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Reviews</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition">Sign Up</Link>
        </div>
      </nav>

      {/* FEATURED BOOKS */}
      <section id="books" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-5xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Featured Books</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Over <span className="font-bold text-blue-600">{totalBooks}</span> books across <span className="font-bold text-blue-600">{totalGenres}</span> genres.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {(books || []).map((book) => (
              <div key={book.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer">
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
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">{book.genre}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-800/80 to-blue-600/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                    <p className="text-white font-bold text-sm leading-tight mb-1">{book.title}</p>
                    <p className="text-blue-200 text-xs mb-4">{book.author}</p>
                    <Link href="/login" className="w-full text-center bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs py-2.5 rounded-xl transition shadow-lg">
                      📚 Borrow This Book
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
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg text-sm">
              Browse All Books →
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-5xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-8 rounded-3xl border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 bg-white transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-3xl mb-6 transition-all duration-500 shadow-lg">{f.icon}</div>
                <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Student Reviews</span>
            <h2 className="text-5xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">What Students Say</h2>
            <p className="text-slate-500">Real reviews from real SCSIT students. <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in to leave yours →</Link></p>
          </div>
          {!reviews || reviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-slate-500 text-lg">No reviews yet.</p>
              <Link href="/register" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
                Create Account & Review
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((r: { id: string; username: string; course: string; comment: string; rating: number }) => (
                <div key={r.id} className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < r.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6">&ldquo;{r.comment}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
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
          )}
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} SCSIT Library. All rights reserved.</p>
      </footer>
    </div>
  );
}
