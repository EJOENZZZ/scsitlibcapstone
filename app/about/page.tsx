import Link from "next/link";

export default function AboutPage() {
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
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Home</Link>
          <Link href="/#features" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Features</Link>
          <Link href="/about" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">About</Link>
          <Link href="/#reviews" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Reviews</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition">Sign In</Link>
          <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition">Sign Up</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-20 bg-gradient-to-br from-[#0f172a] to-slate-800 text-white text-center">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Who We Are</span>
        <h1 className="text-5xl font-bold mt-3 mb-4 tracking-tight">About Us</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          The SCSIT Library is dedicated to supporting the academic growth and intellectual development of every student in the School of Computer Studies and Information Technology.
        </p>
      </section>

      {/* ABOUT CARDS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200/50 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl mb-6 shadow-lg">🏛️</div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">Our Library</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                The SCSIT Library serves as the academic resource center of the School of Computer Studies and Information Technology. It provides students and faculty with access to a wide collection of books, references, and academic materials that support learning and research.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl p-8 border border-emerald-200/50 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-2xl mb-6 shadow-lg">🎯</div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                To provide accessible, organized, and efficient library services that support the academic and research needs of SCSIT students and faculty — fostering a culture of reading, learning, and intellectual growth through the use of modern technology.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200/50 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-2xl mb-6 shadow-lg">🔭</div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                To be a leading digital library that empowers every SCSIT student with the knowledge and resources they need to excel academically — a library that is modern, inclusive, and responsive to the evolving needs of the academic community.
              </p>
            </div>
          </div>

          {/* CORE VALUES */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 text-white">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">What We Stand For</span>
              <h3 className="text-3xl font-bold text-white mt-3">Our Core Values</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "📖", title: "Accessibility", desc: "Every student deserves equal access to academic resources regardless of their background or year level." },
                { icon: "🤝", title: "Service", desc: "We are committed to providing prompt, courteous, and helpful library services to all members of the SCSIT community." },
                { icon: "💡", title: "Innovation", desc: "We embrace technology to continuously improve and modernize the library experience for students and faculty." },
                { icon: "🔒", title: "Integrity", desc: "We uphold honesty, accountability, and responsibility in all library transactions and operations." },
              ].map((v) => (
                <div key={v.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition">
                  <div className="text-3xl mb-4">{v.icon}</div>
                  <h4 className="font-bold text-white text-lg mb-2">{v.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LIBRARIAN */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 border border-blue-100 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
              👩💼
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Meet Our Librarian</span>
              <h3 className="text-2xl font-bold text-slate-800 mt-1 mb-2">Miss Edith Laborte</h3>
              <p className="text-slate-600 leading-relaxed">
                Miss Edith Laborte is the dedicated librarian of the SCSIT Library. She oversees the day-to-day operations of the library, manages the book collection, and ensures that every student has a positive and productive library experience. Her commitment to service and her passion for supporting student learning are the driving forces behind this digital library system.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-6 text-center">
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} SCSIT Library. All rights reserved.</p>
      </footer>
    </div>
  );
}
