import Link from "next/link";

const features = [
  { icon: "🔍", title: "Search & Browse", desc: "Easily search through our catalog of 1,230+ books across 12 genres." },
  { icon: "📅", title: "Easy Borrowing", desc: "Borrow books online and pick them up at the library — no queues." },
  { icon: "🔔", title: "Due Date Reminders", desc: "Get notified before your return date so you never miss a deadline." },
  { icon: "📊", title: "Track Your Reading", desc: "View your borrowing history and manage your active loans anytime." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-slate-200 py-4 px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">📚</div>
          <span className="text-lg font-bold text-slate-800">SCSIT Library</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-500 text-sm">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm font-medium">Login</Link>
          <Link href="/register" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">Sign Up</Link>
          <Link href="/admin" className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition text-sm font-medium">Admin</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-center justify-center text-center text-white h-[82vh]">
        <Image src="/headerpicture.png" alt="Library Background" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/40"></div>
        <div className="relative z-10 max-w-3xl px-6">
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            SCSIT Digital Library System
          </span>
          <h1 className="text-5xl font-bold mb-5 leading-tight tracking-tight">
            Your Gateway to<br />Knowledge & Learning
          </h1>
          <p className="text-lg mb-8 text-slate-300 max-w-xl mx-auto leading-relaxed">
            Browse, borrow, and manage books from the SCSIT Library — anytime, anywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold text-sm shadow-lg">
              Get Started
            </Link>
            <Link href="/about" className="px-8 py-3 rounded-lg border border-white/40 hover:bg-white/10 transition font-semibold text-sm backdrop-blur-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 px-10 text-center">
          {[
            { value: "1,230+", label: "Books Available", icon: "📚" },
            { value: "12", label: "Genres", icon: "🏷️" },
            { value: "98%", label: "User Satisfaction", icon: "⭐" },
          ].map((s) => (
            <div key={s.label} className="p-6 rounded-2xl border border-slate-100 shadow-sm bg-slate-50">
              <div className="text-3xl mb-2">{s.icon}</div>
              <h2 className="text-4xl font-bold text-blue-600">{s.value}</h2>
              <p className="text-slate-500 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Why Use SCSIT Library?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Everything you need to manage your reading in one place.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-800">{f.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white text-center py-20">
        <h2 className="text-3xl font-bold mb-3">Ready to Start Reading?</h2>
        <p className="text-slate-400 mb-8 text-sm">Join hundreds of SCSIT students already using the library system.</p>
        <Link href="/register" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition text-sm shadow-lg">
          Create Free Account
        </Link>
      </section>

      <footer className="bg-white border-t border-slate-200 text-center py-5 text-slate-400 text-xs">
        © {new Date().getFullYear()} SCSIT Library. All rights reserved.
      </footer>
    </div>
  );
}
