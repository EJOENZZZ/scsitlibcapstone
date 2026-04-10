"use client";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const handleRegister = () => {
    alert("Registered Successfully!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-5">Register</h1>

        <input placeholder="Full Name" className="border p-2 w-full mb-2 rounded-lg" />
        <input placeholder="Email" className="border p-2 w-full mb-2 rounded-lg" />
        <input placeholder="Username" className="border p-2 w-full mb-2 rounded-lg" />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-3 rounded-lg" />

        <button
          onClick={handleRegister}
          className="bg-green-500 hover:bg-green-600 text-white w-full p-2 rounded-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
}