"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const courses = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED"];
const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const departments = ["BSIT", "BSCS", "BSCE", "BSBA", "BSN", "BSHM", "BSCRIM", "BSED", "General Education", "Mathematics", "English", "Filipino", "NSTP"];

export default function Register() {
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [form, setForm] = useState({
    name: "", email: "", username: "", password: "", confirmPassword: "",
    course: "", year: "", contact: "", studentId: "",
    employeeId: "", department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  const f = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleRegister = async () => {
    const baseValid = form.name && form.email && form.username && form.password && form.confirmPassword && form.contact;
    const studentValid = role === "student" ? (form.studentId && form.course && form.year) : true;
    const facultyValid = role === "faculty" ? (form.employeeId && form.department) : true;

    if (!baseValid || !studentValid || !facultyValid) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }

    setLoading(true);
    setError("");

    if (role === "student") {
      const { data: enrolled, error: enrollErr } = await supabase
        .from("enrolled_students").select("id").eq("student_id", form.studentId.trim()).single();
      if (enrollErr || !enrolled) {
        setError("Student ID not found in the enrollment masterlist. Please contact the librarian.");
        setLoading(false); return;
      }
    } else {
      const { data: faculty, error: facErr } = await supabase
        .from("faculty_masterlist").select("id").eq("employee_id", form.employeeId.trim()).single();
      if (facErr || !faculty) {
        setError("Employee ID not found in the faculty masterlist. Please contact the librarian.");
        setLoading(false); return;
      }
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { username: form.username, full_name: form.name, role } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: form.username,
        full_name: form.name,
        course: role === "student" ? form.course : null,
        year: role === "student" ? form.year : null,
        contact_number: form.contact,
        student_id: role === "student" ? form.studentId : null,
        employee_id: role === "faculty" ? form.employeeId : null,
        department: role === "faculty" ? form.department : null,
        role,
      });
    }
    setLoading(false);
    setStep("otp");
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setVerifying(true);
    setError("");
    const { error: verifyError } = await supabase.auth.verifyOtp({ email: form.email, token: otp, type: "signup" });
    if (verifyError) { setError(verifyError.message); setVerifying(false); return; }
    setVerifying(false);
    window.location.href = `/dashboard?user=${encodeURIComponent(form.username)}`;
  };

  const inputCls = "border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm";
  const labelCls = "text-sm font-medium text-slate-700 mb-1.5 block";

  return (
    <div className="flex min-h-screen font-sans">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 relative overflow-hidden">
        <img src="/scsitbuilding.jpg" alt="SCSIT Building" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/85 via-blue-900/75 to-slate-900/95" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11"><img src="/scsitlogo.png" alt="SCSIT Logo" className="w-full h-full object-contain" /></div>
          <span className="text-white font-bold text-lg">SCSIT Library</span>
        </div>
        <div className="relative z-10">
          <div className="text-6xl mb-6 select-none">{role === "faculty" ? "👨‍🏫" : "🎓"}</div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            {role === "faculty" ? "Welcome,\nFaculty Member." : "Join thousands of\nstudents reading smarter."}
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            {role === "faculty"
              ? "Create your faculty account to access the SCSIT Library system and manage your reading resources."
              : "Create your free account and get instant access to our full catalog of books, journals, and academic resources."}
          </p>
          <div className="mt-8 space-y-3">
            {(role === "faculty"
              ? ["✅ Access the full book catalog", "✅ Borrow up to 3 books at a time", "✅ Track your borrowing history"]
              : ["✅ Free access to books", "✅ Track your borrowing history", "✅ Get due date reminders"]
            ).map((f) => <p key={f} className="text-sm text-blue-100">{f}</p>)}
          </div>
        </div>
        <p className="relative z-10 text-xs text-blue-400">© {new Date().getFullYear()} SCSIT Library</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-10 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md relative z-10">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>}

          {step === "otp" ? (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📧</div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Check your email</h1>
                <p className="text-slate-400 text-sm">We sent a 6-digit code to</p>
                <p className="text-blue-600 font-semibold text-sm mt-1">{form.email}</p>
              </div>
              <label className={labelCls}>Enter OTP Code</label>
              <input type="text" maxLength={6} placeholder="000000" value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="border border-slate-200 p-3 w-full rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm text-center text-2xl tracking-widest font-bold" />
              <button onClick={handleVerify} disabled={verifying}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white w-full py-3 rounded-xl transition font-semibold mt-4 text-sm shadow-lg">
                {verifying ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition mt-3">
                ← Back
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
                <p className="text-slate-400 text-sm mt-1">Join the SCSIT Library community today</p>
              </div>

              {/* ROLE TOGGLE */}
              <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                <button onClick={() => setRole("student")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${role === "student" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  🎓 Student
                </button>
                <button onClick={() => setRole("faculty")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition ${role === "faculty" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  👨‍🏫 Faculty
                </button>
              </div>

              {/* ROLE BADGE */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 text-xs font-medium border ${
                role === "student" ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}>
                <span>{role === "student" ? "🎓" : "👨‍🏫"}</span>
                <span>
                  {role === "student"
                    ? "Student registration requires a valid Student ID from the enrollment masterlist."
                    : "Faculty registration requires a valid Employee ID from the faculty masterlist."}
                </span>
              </div>

              <div className="space-y-4">
                {/* VERIFICATION ID */}
                {role === "student" ? (
                  <div>
                    <label className={labelCls}>Student ID <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="e.g. 2021-00001" value={form.studentId}
                      onChange={(e) => f("studentId", e.target.value)} className={inputCls} />
                    <p className="text-xs text-slate-400 mt-1">Must match the enrollment masterlist.</p>
                  </div>
                ) : (
                  <div>
                    <label className={labelCls}>Employee ID <span className="text-red-400">*</span></label>
                    <input type="text" placeholder="e.g. FAC-2024-001" value={form.employeeId}
                      onChange={(e) => f("employeeId", e.target.value)} className={inputCls} />
                    <p className="text-xs text-slate-400 mt-1">Must match the faculty masterlist.</p>
                  </div>
                )}

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

                {/* STUDENT: Course + Year | FACULTY: Department */}
                {role === "student" ? (
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
                ) : (
                  <div>
                    <label className={labelCls}>Department <span className="text-red-400">*</span></label>
                    <select value={form.department} onChange={(e) => f("department", e.target.value)} className={inputCls}>
                      <option value="">Select department</option>
                      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
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
                className={`w-full py-3 rounded-xl transition font-semibold mt-6 text-sm shadow-lg text-white disabled:opacity-60 ${
                  role === "student"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                }`}>
                {loading ? "Verifying & sending code..." : `Create ${role === "faculty" ? "Faculty" : "Student"} Account`}
              </button>

              <p className="text-center text-sm text-slate-400 mt-5">
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
