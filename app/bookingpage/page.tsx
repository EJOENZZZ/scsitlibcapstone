"use client";
import { useState } from "react";

export default function Booking() {
  const [type, setType] = useState("Airplane");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow w-96">
        <h1 className="text-2xl font-bold mb-5 text-center">Book Ticket</h1>

        <select
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) => setType(e.target.value)}
        >
          <option>Airplane</option>
          <option>Ferry</option>
        </select>

        <input placeholder="From" className="border p-2 w-full mb-2 rounded" />
        <input placeholder="To" className="border p-2 w-full mb-2 rounded" />
        <input type="date" className="border p-2 w-full mb-3 rounded" />

        <button
          onClick={() => alert("Booking Confirmed!")}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}