import React, { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil";

const AdminCreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studId: "",
    password: "",
    section: "",
    dept: "",
    session: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log(formData);

    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/create-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setMessage("Account created successfully!");
        setFormData({
          name: "",
          email: "",
          studId: "",
          section: "",
          password: "",
          dept: "",
          session: "",
          role: "",
        });
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error("Error: ", err);
      setError("Something went wrong. Check your server connection");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      {/* Page Title Section */}
      <div className="bg-blue-50 border-b border-gray-100 mb-6 md:mb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Student Account</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Add a new student to the system</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border-t-4 border-blue-400"
        >
          {message && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium text-xs sm:text-sm">
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium text-xs sm:text-sm">
              ✕ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Student ID *</label>
              <input
                type="text"
                name="studId"
                value={formData.studId}
                onChange={handleChange}
                placeholder="STU001"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (optional)"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                placeholder="Computer Science"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Section *</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="A"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Session *</label>
              <input
                type="text"
                name="session"
                value={formData.session}
                onChange={handleChange}
                placeholder="2023-2024"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="student"
                required
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
            <button
              type="submit"
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-sm"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateAccount;
