"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const courses = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED"];
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const departments = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED", "General Education", "Mathematics", "English", "Filipino", "NSTP"];
const staffPositions = ["Library Staff", "Administrative Staff", "Registrar", "Cashier", "Security", "Maintenance", "IT Staff", "Guidance", "Other"];

type Role = "student" | "faculty" | "staff";

const roleConfig: Record<Role, { emoji: string; label: string; color: string; btnActive: string; badge: string; idLabel: string; idPlaceholder: string; idHint: string; table: string; tableKey: string; heading: string; subtext: string }> = {
  student: {
    emoji: "🎓", label: "Student", color: "blue",
    btnActive: "text-blue-700", badge: "bg-blue-50 border-blue-100 text-blue-700",
    idLabel: "Student ID", idPlaceholder: "e.g. 2021-00001", idHint: "Must match the enrollment masterlist.",
    table: "enrolled_students", tableKey: "student_id",
    heading: "Join thousands of students reading smarter.",
    subtext: "Create your free account and get instant access to our full catalog of books and academic resources.",
  },
  faculty: {
    emoji: "👨‍🏫", label: "Faculty", color: "emerald",
    btnActive: "text-emerald-700", badge: "bg-emerald-50 border-emerald-100 text-emerald-700",
    idLabel: "Employee ID", idPlaceholder: "e.g. FAC-2024-001", idHint: "Must match the faculty masterlist.",
    table: "faculty_masterlist", tableKey: "employee_id",
    heading: "Welcome, Faculty Member.",
    subtext: "Create your faculty account to access the SCSIT Library system and manage your reading resources.",
  },
  staff: {
    emoji: "🏢", label: "Staff", color: "purple",
    btnActive: "text-purple-700", badge: "bg-purple-50 border-purple-100 text-purple-700",
    idLabel: "Staff ID", idPlaceholder: "e.g. STF-2024-001", idHint: "Must match the staff masterlist.",
    table: "staff_masterlist", tableKey: "staff_id",
    heading: "Welcome, Library Staff.",
    subtext: "Create your staff account to access the SCSIT Library system.",
  },
};

export default function Register() {
  const [role, setRole] = useState<Role>("student");
  const [form, setForm] = useState({
    name: "", email: "", username: "", password: "", confirmPassword: "",
    course: "", year: "", contact: "", verifyId: "", department: "", position: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  const f = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));
  const cfg = roleConfig[role];

  const handleRegister = async () => {
    const baseValid = form.name && form.email && form.username && form.password && form.confirmPassword && form.contact && form.verifyId;
    const studentValid = role === "student" ? (form.course && form.year) : true;
    const facultyValid = role === "faculty" ? form.department : true;
    const staffValid = role === "staff" ? form.position : true;

    if (!baseValid || !studentValid || !facultyValid || !staffValid) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");

    // Check username uniqueness
    const { data: existingUser } = await supabase
      .from("profiles").select("id").eq("username", form.username.trim()).single();
    if (existingUser) {
      setError("Username is already taken. Please choose a different one.");
      setLoading(false); return;
    }

    const { data: verified, error: verifyErr } = await supabase
      .from(cfg.table).select("id").eq(cfg.tableKey, form.verifyId.trim()).single();
    if (verifyErr || !verified) {
      setError(`${cfg.idLabel} not found in the ${cfg.label.toLowerCase()} masterlist. Please contact the librarian.`);
      setLoading(false); return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { username: form.username, full_name: form.name, role } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: form.username,
        full_name: form.name,
        contact_number: form.contact,
        role,
        course: role === "student" ? form.course : null,
        year: role === "student" ? form.year : null,
        student_id: role === "student" ? form.verifyId : null,
        employee_id: role === "faculty" ? form.verifyId : null,
        department: role === "faculty" ? form.department : null,
        staff_id: role === "staff" ? form.verifyId : null,
        position: role === "staff" ? form.position : null,
      });
    }
    // Sign out immediately so user can't access dashboard before OTP verification
    await supabase.auth.signOut();
    setLoading(false);
    setStep("otp");
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setVerifying(true); setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: form.email, token: otp, type: "signup" });
    if (verifyError) { setError(verifyError.message); setVerifying(false); return; }
    setVerifying(false);
    window.location.href = `/dashboard?user=${encodeURIComponent(form.username)}`;
  };

  const inputCls = "border border-slate-200 p-2.5 w-full rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm";
  const labelCls = "text-xs font-medium text-slate-700 mb-1 block";

  const btnColor: Record<Role, string> = {
    student: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    faculty: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
    staff: "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 relative overflow-hidden">
        <img src="/scsitbuilding.jpg" alt="SCSIT Building" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/70 to-slate-900/90" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11"><img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" /></div>
          <span className="text-white font-bold text-base">SCSIT Library</span>
        </div>
        <div className="relative z-10">
          <div className="text-5xl mb-4 select-none">{cfg.emoji}</div>
          <h2 className="text-2xl font-bold text-white leading-snug mb-3">{cfg.heading}</h2>
          <p className="text-blue-200 text-xs leading-relaxed">{cfg.subtext}</p>
          <div className="mt-6 space-y-2">
            {["✅ Access the full book catalog", "✅ Borrow up to 3 books at a time", "✅ Track your borrowing history"].map((item) => (
              <p key={item} className="text-xs text-blue-100">{item}</p>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-10 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md relative z-10">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-4">{error}</div>}

          {step === "otp" ? (
            <>
              <div className="text-center mb-5">
                <div className="text-3xl mb-2">📧</div>
                <h1 className="text-xl font-bold text-slate-800 mb-1">Check your email</h1>
                <p className="text-slate-400 text-xs">We sent a 6-digit code to</p>
                <p className="text-blue-600 font-semibold text-xs mt-1">{form.email}</p>
              </div>
              <label className={labelCls}>Enter OTP Code</label>
              <input type="text" maxLength={6} placeholder="000000" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-center text-2xl tracking-widest font-bold" />
              <button onClick={handleVerify} disabled={verifying}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-2.5 rounded-xl transition font-semibold mt-3 text-xs shadow-lg">
                {verifying ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition mt-2">
                ← Back
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h1 className="text-xl font-bold text-slate-800">Create your account</h1>
                <p className="text-slate-400 text-xs mt-1">Join the SCSIT Library community today</p>
              </div>

              {/* ROLE TOGGLE */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-4">
                {(["student", "faculty", "staff"] as Role[]).map((r) => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition ${role === r ? `bg-white shadow-sm ${roleConfig[r].btnActive}` : "text-slate-500 hover:text-slate-700"}`}>
                    {roleConfig[r].emoji} {roleConfig[r].label}
                  </button>
                ))}
              </div>

              {/* ROLE BADGE */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-xs font-medium border ${cfg.badge}`}>
                <span>{cfg.emoji}</span>
                <span>{cfg.label} registration requires a valid {cfg.idLabel} from the {cfg.label.toLowerCase()} masterlist.</span>
              </div>

              <div className="space-y-3">
                {/* VERIFY ID */}
                <div>
                  <label className={labelCls}>{cfg.idLabel} <span className="text-red-400">*</span></label>
                  <input type="text" placeholder={cfg.idPlaceholder} value={form.verifyId}
                    onChange={(e) => f("verifyId", e.target.value)} className={inputCls} />
                  <p className="text-xs text-slate-400 mt-1">{cfg.idHint}</p>
                </div>

                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="e.g. Juan Dela Cruz" value={form.name}
                    onChange={(e) => f("name", e.target.value)} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => f("email", e.target.value)} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Username <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Choose a username" value={form.username}
                    onChange={(e) => f("username", e.target.value)} className={inputCls} />
                </div>

                {/* ROLE-SPECIFIC FIELDS */}
                {role === "student" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Course <span className="text-red-400">*</span></label>
                      <select value={form.course} onChange={(e) => f("course", e.target.value)} className={inputCls}>
                        <option value="">Select course</option>
                        {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Year Level <span className="text-red-400">*</span></label>
                      <select value={form.year} onChange={(e) => f("year", e.target.value)} className={inputCls}>
                        <option value="">Select year</option>
                        {yearLevels.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                {role === "faculty" && (
                  <div>
                    <label className={labelCls}>Department <span className="text-red-400">*</span></label>
                    <select value={form.department} onChange={(e) => f("department", e.target.value)} className={inputCls}>
                      <option value="">Select department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                {role === "staff" && (
                  <div>
                    <label className={labelCls}>Position <span className="text-red-400">*</span></label>
                    <select value={form.position} onChange={(e) => f("position", e.target.value)} className={inputCls}>
                      <option value="">Select position</option>
                      {staffPositions.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className={labelCls}>Contact Number <span className="text-red-400">*</span></label>
                  <input type="tel" placeholder="e.g. 09123456789" value={form.contact}
                    onChange={(e) => f("contact", e.target.value)} className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Password <span className="text-red-400">*</span></label>
                    <input type="password" placeholder="Min. 6 characters" value={form.password}
                      onChange={(e) => f("password", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm Password <span className="text-red-400">*</span></label>
                    <input type="password" placeholder="Re-enter password" value={form.confirmPassword}
                      onChange={(e) => f("confirmPassword", e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              <button onClick={handleRegister} disabled={loading}
                className={`w-full py-2.5 rounded-xl transition font-semibold mt-4 text-xs shadow-lg text-white disabled:opacity-60 ${btnColor[role]}`}>
                {loading ? "Verifying & sending code..." : `Create ${cfg.label} Account`}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
