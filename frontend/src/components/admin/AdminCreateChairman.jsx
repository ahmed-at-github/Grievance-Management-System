import React, { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil.js";

const AdminCreateChairman = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(""); // Success or error
  const [error, setError] = useState(""); // Validation errors

  const handleSubmit = async () => {
    // Clear previous messages
    setMessage("");
    setError("");

    // --- Client-side validation ---
    if (!name.trim() || !email.trim()) {
      setError("Name and Email are required.");
      return;
    }

   

    const payload = {
      name: name.trim(),
      email: email.trim(),
      role: "chairman",
      password: "", // optional password
    };

    try {
      const response = await fetchWithRefresh(
        "http://localhost:4000/api/v1/create-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Chairman account created successfully!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // Server error message
        setError(data.message || data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-5 w-[400px]">
        <h2 className="text-xl font-bold text-center mb-4">Create Chairman</h2>

        {/* Error / validation message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-600 text-center">{message}</p>}

        <label className="label">Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="label">Email</label>
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  );
};

export default AdminCreateChairman;
