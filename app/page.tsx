import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const departments = [
  { code: "BSIT", name: "Information Technology" },
  { code: "BSCS", name: "Computer Science" },
  { code: "BSCE", name: "Civil Engineering" },
  { code: "BSBA", name: "Business Administration" },
  { code: "BSN", name: "Nursing" },
  { code: "BSHM", name: "Hospitality Management" },
  { code: "BSCRIM", name: "Criminology" },
  { code: "BSED", name: "Education" },
];

export default async function Home() {
  noStore();
  const { data: books } = await supabase.from("books").select("*").order("title");
  const totalBooks = books?.length || 0;
  const totalGenres = new Set(books?.map((b) => b.genre) || []).size;
  const availableBooks = books?.filter((b) => b.available).length || 0;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* NAVBAR */}
      <nav className="w-full bg-[#0f172a] py-3 px-10 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11">
            <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SCSIT Library</p>
            <p className="text-slate-400 text-xs">School of Computer Studies & IT</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 bg-slate-800 rounded-xl p-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Home</Link>
          <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">About</Link>
          <Link href="/reviews" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Reviews</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition">Sign Up</Link>
        </div>
      </nav>

      {/* HERO + DEPARTMENTS */}
      <section className="bg-[#0f172a] pt-16 pb-0">
        <div className="max-w-7xl mx-auto px-10">
          {/* HERO TEXT */}
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-blue-500/30">
              SCSIT Digital Library System
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5 tracking-tight">
              Your Academic Resources,<br />
              <span className="text-blue-400">All in One Place.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
              Browse, borrow, and manage library books online. Available to all enrolled students and faculty of SCSIT.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/register" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-900/40">
                Get Started
              </Link>
              <Link href="/login" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition border border-white/10">
                Sign In
              </Link>
            </div>
          </div>

          {/* DEPARTMENT STRIP */}
          <div className="border-t border-slate-700/60 py-6">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest text-center mb-4">Serving all departments</p>
            <div className="flex flex-wrap justify-center gap-2">
              {departments.map((d) => (
                <div key={d.code} className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-blue-500/50 hover:bg-slate-700/80 transition cursor-default">
                  <span className="text-blue-400 font-bold text-xs">{d.code}</span>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-slate-400 text-xs">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS */}
      <section id="books" className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Featured Books</h2>
              <p className="text-slate-500 text-sm mt-1">
                <span className="font-semibold text-slate-700">{totalBooks}</span> books across <span className="font-semibold text-slate-700">{totalGenres}</span> genres
              </p>
            </div>
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm hidden md:block">
              Browse All Books →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {(books || []).map((book) => (
              <div key={book.id} className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
                <div className="relative overflow-hidden h-52">
                  <img
                    src={book.image || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-white text-xs px-2.5 py-1 rounded-full font-bold shadow ${book.available ? "bg-emerald-500" : "bg-red-500"}`}>
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
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                  <p className="text-slate-400 text-xs">{book.author}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">{book.genre}</span>
                    <span className={`text-xs font-semibold ${book.available ? "text-emerald-600" : "text-red-500"}`}>
                      {book.available ? "Free to borrow" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link href="/login" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg text-sm">
              Browse All Books →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f172a] border-t border-slate-800 py-8 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8">
              <img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">SCSIT Library</p>
              <p className="text-slate-500 text-xs">School of Computer Studies & Information Technology</p>
            </div>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} SCSIT Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
