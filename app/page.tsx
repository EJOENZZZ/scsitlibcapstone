import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

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

const genres = [
  "Computer Science", "Software Engineering", "Web Development",
  "Database", "Networking", "Mathematics",
  "Data Science", "Cybersecurity", "Operating Systems",
  "Algorithms", "Artificial Intelligence", "Mobile Development",
];

const featuredBooks = [
  { title: "Introduction to Algorithms", author: "Cormen et al.", genre: "Computer Science", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop" },
  { title: "Clean Code", author: "Robert C. Martin", genre: "Software Engineering", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop" },
  { title: "Design Patterns", author: "Gang of Four", genre: "Computer Science", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop" },
  { title: "You Don't Know JS", author: "Kyle Simpson", genre: "Web Development", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop" },
  { title: "Operating System Concepts", author: "Silberschatz et al.", genre: "Computer Science", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop" },
  { title: "Computer Networks", author: "Andrew S. Tanenbaum", genre: "Networking", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop" },
  { title: "Artificial Intelligence", author: "Russell & Norvig", genre: "Artificial Intelligence", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=400&fit=crop" },
  { title: "Machine Learning", author: "Tom M. Mitchell", genre: "Machine Learning", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop" },
];

export default async function Home() {
  // Fetch real stats
  const { count: totalBooks } = await supabase.from("books").select("*", { count: "exact", head: true });
  const { count: totalBorrows } = await supabase.from("reviews").select("*", { count: "exact", head: true });
  const { count: returned } = await supabase.from("reviews").select("*", { count: "exact", head: true }).gte("rating", 4);
  const satisfactionPct = totalBorrows && totalBorrows > 0 ? Math.round(((returned || 0) / totalBorrows) * 100) : 98;

  // Fetch real reviews
  const { data: reviews } = await supabase.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(6);

  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* NAVBAR */}
      <nav className="w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/50 py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">📚</div>
          <div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">SCSIT Library</span>
            <span className="hidden sm:inline ml-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Digital System</span>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Home</Link>
          <Link href="#features" className="hover:text-slate-800 transition">Features</Link>
          <Link href="#books" className="hover:text-slate-800 transition">Books</Link>
          <Link href="#reviews" className="hover:text-slate-800 transition">Reviews</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Sign Up</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-lg">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center text-white min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute top-20 left-20 text-8xl opacity-10 rotate-12 select-none animate-pulse">📚</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 -rotate-12 select-none animate-pulse">📖</div>

        <div className="relative z-10 max-w-5xl px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest shadow-lg">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            SCSIT Digital Library System
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Knowledge at Your<br />
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Fingertips</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            The official digital library of SCSIT — browse, borrow, and manage books from anywhere.
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mt-10">
            {[
              { value: `${totalBooks || 0}+`, label: "Total Books", icon: "📚" },
              { value: `${totalUsers || 0}`, label: "Registered Users", icon: "👥" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-6 px-4 shadow-xl">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* TRUSTED BY */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 border-y border-slate-200/50 py-6">
        <div className="max-w-6xl mx-auto px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by students of</p>
          <div className="flex items-center gap-8 text-slate-600 text-sm font-semibold">
            {["BSIT", "BSCE", "BSCRIM", "BSHM", "BSBA", "BSN"].map((c, i, arr) => (
              <span key={c} className="flex items-center gap-8">
                {c}{i < arr.length - 1 && <span className="text-slate-300 ml-8">|</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400">School of Computer Studies & Information Technology</p>
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section id="books" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-5xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Featured Books</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Over <span className="font-bold text-blue-600">{totalBooks || 0}</span> books in our digital catalog.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {featuredBooks.map((book) => (
              <div key={book.title} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-3 cursor-pointer">
                <div className="relative overflow-hidden h-56">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">✓ Available</span>
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
                    <span className="text-xs text-emerald-600 font-semibold">Free to borrow</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="text-4xl">📚</div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-800">{totalBooks || 0}+ Books Available</p>
                <p className="text-sm text-slate-500">Across 12+ categories and genres</p>
              </div>
              <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg text-sm">
                Browse All Books →
              </Link>
            </div>
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

      {/* GENRES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-10 text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Browse Categories</span>
          <h2 className="text-5xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Book Genres</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {genres.map((g) => (
              <span key={g} className="px-6 py-3 rounded-full border-2 border-slate-200 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer font-semibold shadow-sm hover:shadow-md">{g}</span>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-lg">Browse full catalog →</Link>
          </div>
        </div>
      </section>

      {/* REAL STUDENT REVIEWS */}
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
              <p className="text-slate-400 text-sm mt-2">Be the first student to leave a review!</p>
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

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-8 left-16 text-8xl opacity-5 select-none rotate-12 animate-pulse">📚</div>
        <div className="absolute bottom-8 right-16 text-8xl opacity-5 select-none -rotate-12 animate-pulse">📖</div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">Ready to Start Reading?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">Join hundreds of SCSIT students already using the digital library system.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="px-10 py-4 rounded-xl bg-white text-slate-900 hover:bg-blue-50 transition font-bold text-lg shadow-2xl">Create Free Account</Link>
            <Link href="/login" className="px-10 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 text-white font-bold text-lg transition">Sign In →</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} SCSIT Library. All rights reserved.</p>
      </footer>

    </div>
  );
}
