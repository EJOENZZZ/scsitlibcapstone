import Link from "next/link";

const features = [
  { icon: "🔍", title: "Smart Search", desc: "Find any book instantly by title, author, or genre across our entire catalog." },
  { icon: "📅", title: "Online Borrowing", desc: "Reserve and borrow books online — skip the queue and pick up at your convenience." },
  { icon: "🔔", title: "Due Date Alerts", desc: "Never miss a return date with automatic reminders sent before your deadline." },
  { icon: "📊", title: "Reading History", desc: "Track every book you've borrowed and manage your active loans in one place." },
  { icon: "🎓", title: "Academic Focus", desc: "Curated collection of textbooks, journals, and references for SCSIT students." },
  { icon: "🔒", title: "Secure Access", desc: "Your account and borrowing data are protected with secure authentication." },
];

const genres = [
  "Computer Science", "Software Engineering", "Web Development",
  "Database", "Networking", "Mathematics",
  "Data Science", "Cybersecurity", "Operating Systems",
  "Algorithms", "Artificial Intelligence", "Mobile Development",
];

const featuredBooks = [
  { 
    title: "Introduction to Algorithms", 
    author: "Cormen, Leiserson, Rivest, Stein", 
    genre: "Computer Science", 
    available: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Clean Code", 
    author: "Robert C. Martin", 
    genre: "Software Engineering", 
    available: true,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Design Patterns", 
    author: "Gang of Four", 
    genre: "Computer Science", 
    available: true,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "You Don't Know JS", 
    author: "Kyle Simpson", 
    genre: "Web Development", 
    available: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Operating System Concepts", 
    author: "Silberschatz, Galvin, Gagne", 
    genre: "Computer Science", 
    available: true,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Computer Networks", 
    author: "Andrew S. Tanenbaum", 
    genre: "Networking", 
    available: true,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Artificial Intelligence: A Modern Approach", 
    author: "Stuart Russell, Peter Norvig", 
    genre: "Artificial Intelligence", 
    available: true,
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "The Art of Computer Programming", 
    author: "Donald E. Knuth", 
    genre: "Computer Science", 
    available: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Machine Learning", 
    author: "Tom M. Mitchell", 
    genre: "Machine Learning", 
    available: true,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Data Structures and Algorithms in Java", 
    author: "Robert Lafore", 
    genre: "Computer Science", 
    available: true,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "Head First Design Patterns", 
    author: "Freeman, Robson, Bates, Sierra", 
    genre: "Software Engineering", 
    available: true,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&crop=center"
  },
  { 
    title: "JavaScript: The Good Parts", 
    author: "Douglas Crockford", 
    genre: "Web Development", 
    available: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center"
  },
];

const totalBooks = 1247; // Total books in library
const availableBooks = featuredBooks.filter(book => book.available).length;

const testimonials = [
  { name: "Maria Santos", course: "BSIT — 3rd Year", text: "The SCSIT Library system made it so easy to find and borrow books for my thesis. Highly recommended!", avatar: "👩🎓" },
  { name: "Carlo Reyes", course: "BSCS — 2nd Year", text: "I love how I can check book availability online before going to the library. Saves so much time.", avatar: "👨💻" },
  { name: "Ana Dela Cruz", course: "BSIT — 4th Year", text: "The due date reminders are a lifesaver. I've never returned a book late since I started using this.", avatar: "👩💻" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* ── NAVBAR ── */}
      <nav className="w-full bg-white/95 backdrop-blur-lg border-b border-slate-200/50 py-4 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">📚</div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">SCSIT Library</span>
            <span className="hidden sm:inline ml-2 text-xs bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-3 py-1 rounded-full font-medium shadow-sm">Digital System</span>
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">Home</Link>
          <Link href="#features" className="hover:text-slate-800 transition">Features</Link>
          <Link href="#books" className="hover:text-slate-800 transition">Books</Link>
          <Link href="#testimonials" className="hover:text-slate-800 transition">Reviews</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-lg">
            Get Started
          </Link>
          <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
            Admin
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center text-center text-white min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-20 text-8xl opacity-10 rotate-12 select-none animate-pulse">📚</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 -rotate-12 select-none animate-pulse delay-1000">📖</div>
        <div className="absolute top-1/2 left-10 text-6xl opacity-5 rotate-6 select-none animate-bounce">📕</div>
        <div className="absolute top-1/2 right-10 text-6xl opacity-5 -rotate-6 select-none animate-bounce delay-500">📗</div>

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
            Built for students, powered by technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/register" className="px-8 py-4 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition font-bold text-sm shadow-2xl">
              Create Free Account
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition font-semibold text-sm">
              Sign In →
            </Link>
          </div>

          {/* HERO STATS */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { value: `${totalBooks.toLocaleString()}+`, label: "Total Books", icon: "📚" },
              { value: `${availableBooks}`, label: "Available Now", icon: "✅" },
              { value: "98%", label: "Satisfaction", icon: "⭐" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-6 px-4 shadow-xl">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-blue-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-white/30" />
        </div>
      </section>

      {/* ── TRUSTED BY BANNER ── */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 border-y border-slate-200/50 py-6">
        <div className="max-w-6xl mx-auto px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by students of</p>
          <div className="flex items-center gap-8 text-slate-600 text-sm font-semibold">
            <span>BSIT</span>
            <span className="text-slate-300">|</span>
            <span>BSCE</span>
            <span className="text-slate-300">|</span>
            <span>BSCRIM</span>
            <span className="text-slate-300">|</span>
            <span>BSHM</span>
            <span className="text-slate-300">|</span>
            <span>BSBA</span>
            <span className="text-slate-300">|</span>
            <span>BSN</span>
          </div>
          <p className="text-xs text-slate-400">School of Computer Studies & Information Technology</p>
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section id="books" className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-3 mb-4 tracking-tight">Featured Books</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our most popular books available for borrowing. Over <span className="font-bold text-blue-600">{totalBooks.toLocaleString()}</span> books in our digital catalog.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {featuredBooks.map((book) => (
              <div key={book.title} className="group bg-white rounded-3xl p-6 border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                      Available
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold">
                    {book.genre}
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                  <p className="text-slate-500 text-xs">{book.author}</p>
                  <Link href="/login" className="inline-flex items-center gap-2 text-xs text-blue-600 font-semibold hover:text-blue-700 transition group-hover:underline">
                    Sign in to borrow →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="text-4xl">📚</div>
              <div className="text-left">
                <p className="text-2xl font-bold text-slate-800">{totalBooks.toLocaleString()}+ Books Available</p>
                <p className="text-sm text-slate-500">Across 12+ categories and genres</p>
              </div>
              <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition shadow-lg text-sm">
                Browse All Books →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-3 mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
              A complete library management experience designed specifically for SCSIT students and faculty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-8 rounded-3xl border border-slate-200/50 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 bg-white transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-500 group-hover:to-blue-600 flex items-center justify-center text-3xl mb-6 transition-all duration-500 shadow-lg group-hover:text-white">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-xl mb-3 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-3 mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-lg">Get started in just three easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "📝", title: "Create an Account", desc: "Sign up for free using your student email and set up your library profile in minutes." },
              { step: "02", icon: "🔍", title: "Browse the Catalog", desc: "Search through 1,230+ books by title, author, or genre and check real-time availability." },
              { step: "03", icon: "📚", title: "Borrow & Read", desc: "Submit your borrow request online, pick up at the library, and return before the due date." },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="text-sm font-bold text-blue-300 tracking-widest mb-6">{item.step}</div>
                <div className="w-20 h-20 rounded-3xl bg-white border-2 border-blue-200 shadow-xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-xl mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRES ── */}
      <section id="genres" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Browse Categories</span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-3 mb-4 tracking-tight">Book Genres</h2>
            <p className="text-slate-500 text-lg">12 curated categories covering everything in your curriculum and beyond.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {genres.map((g) => (
              <span key={g} className="px-6 py-3 rounded-full border-2 border-slate-200 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer font-semibold shadow-sm hover:shadow-md">
                {g}
              </span>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/login" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline text-lg">
              Browse full catalog → 
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Student Reviews</span>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-3 mb-4 tracking-tight">What Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8 text-lg">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-800">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-8 left-16 text-8xl opacity-5 select-none rotate-12 animate-pulse">📚</div>
        <div className="absolute bottom-8 right-16 text-8xl opacity-5 select-none -rotate-12 animate-pulse delay-1000">📖</div>
        <div className="absolute top-1/2 left-8 text-6xl opacity-5 select-none animate-bounce">📕</div>
        <div className="absolute top-1/2 right-8 text-6xl opacity-5 select-none animate-bounce delay-500">📗</div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <span className="inline-block text-xs font-bold text-blue-300 uppercase tracking-widest mb-6">Get Started Today</span>
          <h2 className="text-5xl font-bold mb-6 tracking-tight">Ready to Start Reading?</h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join hundreds of SCSIT students already using the digital library system. Free to sign up, easy to use.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="px-10 py-4 rounded-xl bg-white text-slate-900 hover:bg-blue-50 transition font-bold text-lg shadow-2xl">
              Create Free Account
            </Link>
            <Link href="/login" className="px-10 py-4 rounded-xl border-2 border-white/30 hover:bg-white/10 text-white font-bold text-lg transition">
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200 py-12 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">📚</div>
            <div>
              <p className="font-bold text-slate-800 text-lg">SCSIT Library</p>
              <p className="text-sm text-slate-500">Digital Library Management System</p>
            </div>
          </div>

          <div className="flex gap-8 text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition font-medium">Home</Link>
            <Link href="/login" className="hover:text-slate-800 transition font-medium">Sign In</Link>
            <Link href="/register" className="hover:text-slate-800 transition font-medium">Sign Up</Link>
            <Link href="/admin" className="hover:text-slate-800 transition font-medium">Admin</Link>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SCSIT Library. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}