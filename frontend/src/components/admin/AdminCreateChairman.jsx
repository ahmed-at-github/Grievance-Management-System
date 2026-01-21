import React, { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil.js";
import { toast } from "react-toastify";

const AdminCreateChairman = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!name.trim() || !email.trim() || !role) {
      setError("Name, Email, and Role are required.");
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      role: role,
      password: "",
    };

    try {
      const response = await fetchWithRefresh(
        "http://localhost:4000/api/v1/create-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
         toast.success("Account created successfully!", {
                          theme: "light",
                        });
        setMessage("Account created successfully!");
        setName("");
        setEmail("");
        setRole("");
      } else {
        setError(data.message || data.error || "Something went wrong!");
      }
    } catch (err) {
       toast.error("Account creation unsuccessfully!", {
                        theme: "light",
                      });
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      {/* Page Title */}
      <div className="bg-purple-50 border-b border-gray-100 mb-6 md:mb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Managerial Account
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Add a new account to the system
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-400 space-y-5"
        >
          {message && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ✕ {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Dr. John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              placeholder="accnt@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              required
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm"
              required
            >
              <option value="">Select role</option>
              <option value="chairman">Chairman</option>
              <option value="decision committee">Decision Committee</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateChairman;
