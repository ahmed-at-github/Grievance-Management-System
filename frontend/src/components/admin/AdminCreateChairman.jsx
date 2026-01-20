import React, { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil.js";

const AdminCreateChairman = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and Email are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      role: "chairman",
      password: "",
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
        setError(data.message || data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Page Title Section */}
      <div className="bg-purple-50 border-b border-gray-100 mb-8">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Chairman Account</h2>
          <p className="text-gray-600 text-sm mt-1">Add a new chairman to the system</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-400 space-y-6"
        >
          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium">
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
              ✕ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              placeholder="Dr. John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              placeholder="chairman@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 text-gray-900"
              required
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Create Chairman Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateChairman;
