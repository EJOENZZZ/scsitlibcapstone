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
  { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", genre: "Computer Science", available: true },
  { title: "Clean Code", author: "Robert C. Martin", genre: "Software Engineering", available: true },
  { title: "Design Patterns", author: "Gang of Four", genre: "Computer Science", available: true },
  { title: "You Don't Know JS", author: "Kyle Simpson", genre: "Web Development", available: true },
  { title: "Operating System Concepts", author: "Silberschatz, Galvin, Gagne", genre: "Computer Science", available: true },
  { title: "Computer Networks", author: "Andrew S. Tanenbaum", genre: "Networking", available: true },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell, Peter Norvig", genre: "Artificial Intelligence", available: true },
  { title: "The Art of Computer Programming", author: "Donald E. Knuth", genre: "Computer Science", available: true },
  { title: "Machine Learning", author: "Tom M. Mitchell", genre: "Machine Learning", available: true },
  { title: "Data Structures and Algorithms in Java", author: "Robert Lafore", genre: "Computer Science", available: true },
  { title: "Head First Design Patterns", author: "Freeman, Robson, Bates, Sierra", genre: "Software Engineering", available: true },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", genre: "Web Development", available: true },
  { title: "Python Crash Course", author: "Eric Matthes", genre: "Programming", available: true },
  { title: "Learning React", author: "Alex Banks, Eve Porcello", genre: "Web Development", available: true },
  { title: "Pro Git", author: "Scott Chacon, Ben Straub", genre: "Software Engineering", available: true },
  { title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", genre: "Software Engineering", available: true },
  { title: "Code Complete", author: "Steve McConnell", genre: "Software Engineering", available: true },
  { title: "Refactoring", author: "Martin Fowler", genre: "Software Engineering", available: true },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", genre: "Programming", available: true },
  { title: "Elements of Programming Interviews", author: "Aziz, Lee, Prakash", genre: "Programming", available: true },
];

const testimonials = [
  { name: "Maria Santos", course: "BSIT — 3rd Year", text: "The SCSIT Library system made it so easy to find and borrow books for my thesis. Highly recommended!", avatar: "👩🎓" },
  { name: "Carlo Reyes", course: "BSCS — 2nd Year", text: "I love how I can check book availability online before going to the library. Saves so much time.", avatar: "👨💻" },
  { name: "Ana Dela Cruz", course: "BSIT — 4th Year", text: "The due date reminders are a lifesaver. I've never returned a book late since I started using this.", avatar: "👩💻" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">

      {/* ── NAVBAR ── */}
      <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📚</div>
          <div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">SCSIT Library</span>
            <span className="hidden sm:inline ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Digital System</span>
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="text-blue-600 font-semibold">Home</Link>
          <Link href="#features" className="hover:text-slate-800 transition">Features</Link>
          <Link href="#books" className="hover:text-slate-800 transition">Books</Link>
          <Link href="#testimonials" className="hover:text-slate-800 transition">Reviews</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            Get Started
          </Link>
          <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
            Admin
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center text-center text-white min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 text-8xl opacity-10 rotate-12 select-none">📚</div>
        <div className="absolute bottom-20 right-20 text-8xl opacity-10 -rotate-12 select-none">📖</div>
        <div className="absolute top-1/2 left-10 text-6xl opacity-5 rotate-6 select-none">📕</div>
        <div className="absolute top-1/2 right-10 text-6xl opacity-5 -rotate-6 select-none">📗</div>

        <div className="relative z-10 max-w-4xl px-6 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            SCSIT Digital Library System
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Knowledge at Your<br />
            <span className="text-blue-400">Fingertips</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            The official digital library of SCSIT — browse, borrow, and manage books from anywhere.
            Built for students, powered by technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/register" className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold text-sm shadow-lg shadow-blue-900/30">
              Create Free Account
            </Link>
            <Link href="/login" className="px-8 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 backdrop-blur-sm transition font-semibold text-sm">
              Sign In →
            </Link>
          </div>

          {/* HERO STATS */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "1,230+", label: "Books" },
              { value: "12", label: "Genres" },
              { value: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl py-4 px-3">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 text-xs">
          <span>Scroll</span>
          <div className="w-px h-8 bg-white/20" />
        </div>
      </section>

      {/* ── TRUSTED BY BANNER ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-5">
        <div className="max-w-5xl mx-auto px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Trusted by students of</p>
          <div className="flex items-center gap-8 text-slate-500 text-sm font-semibold">
            <span>BSIT</span>
            <span className="text-slate-200">|</span>
            <span>BSCE</span>
            <span className="text-slate-200">|</span>
            <span>BSCRIM</span>
            <span className="text-slate-200">|</span>
            <span>BSHM</span>
            <span className="text-slate-200">|</span>
            <span>BSBA</span>
            <span className="text-slate-200">|</span>
            <span>BSN</span>
          </div>
          <p className="text-xs text-slate-400">School of Computer Studies & Information Technology</p>
        </div>
      </section>

      {/* ── FEATURED BOOKS ── */}
      <section id="books" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Our Collection</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Featured Books</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              Explore some of our most popular books available for borrowing right now.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {featuredBooks.slice(0, 12).map((book) => (
              <div key={book.title} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium group-hover:bg-blue-100 transition">
                    {book.genre}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    Available
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2 leading-tight">{book.title}</h3>
                <p className="text-slate-500 text-xs mb-4">{book.author}</p>
                <Link href="/login" className="text-xs text-blue-600 font-medium hover:underline">
                  Sign in to borrow →
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition text-sm">
              View All {featuredBooks.length}+ Books →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Everything You Need</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              A complete library management experience designed specifically for SCSIT students and faculty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white">
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-2xl mb-5 transition">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">How It Works</h2>
            <p className="text-slate-400 text-sm">Get started in just three easy steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "📝", title: "Create an Account", desc: "Sign up for free using your student email and set up your library profile in minutes." },
              { step: "02", icon: "🔍", title: "Browse the Catalog", desc: "Search through 1,230+ books by title, author, or genre and check real-time availability." },
              { step: "03", icon: "📚", title: "Borrow & Read", desc: "Submit your borrow request online, pick up at the library, and return before the due date." },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="text-xs font-bold text-blue-200 tracking-widest mb-4">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-3xl mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRES ── */}
      <section id="genres" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-10">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Browse Categories</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">Book Genres</h2>
            <p className="text-slate-400 text-sm">12 curated categories covering everything in your curriculum and beyond.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {genres.map((g) => (
              <span key={g} className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer font-medium">
                {g}
              </span>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline">
              Browse full catalog → 
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-10">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Student Reviews</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-3 mb-4 tracking-tight">What Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-8 left-16 text-7xl opacity-5 select-none rotate-12">📚</div>
        <div className="absolute bottom-8 right-16 text-7xl opacity-5 select-none -rotate-12">📖</div>
        <div className="absolute top-1/2 left-8 text-5xl opacity-5 select-none">📕</div>
        <div className="absolute top-1/2 right-8 text-5xl opacity-5 select-none">📗</div>

        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <span className="inline-block text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Get Started Today</span>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Ready to Start Reading?</h2>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            Join hundreds of SCSIT students already using the digital library system. Free to sign up, easy to use.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-900/40">
              Create Free Account
            </Link>
            <Link href="/login" className="px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-sm transition">
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-100 py-10 px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">📚</div>
            <div>
              <p className="font-bold text-slate-800 text-sm">SCSIT Library</p>
              <p className="text-xs text-slate-400">Digital Library Management System</p>
            </div>
          </div>

          <div className="flex gap-8 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-700 transition">Home</Link>
            <Link href="/login" className="hover:text-slate-700 transition">Sign In</Link>
            <Link href="/register" className="hover:text-slate-700 transition">Sign Up</Link>
            <Link href="/admin" className="hover:text-slate-700 transition">Admin</Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SCSIT Library. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}