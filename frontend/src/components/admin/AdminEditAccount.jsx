import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

const AdminEditAccount = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchedData = {
      id,
      name: "Ariana Smith",
      email: "ariana.smith@example.com",
      department: "Computer Science",
      section: "A",
      session: "2022–2023",
      role: "Student",
    };
    setAccount(fetchedData);
  }, [id]);

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    console.log("Updated Account:", account);
    setMessage(`Account for ${account.name} updated successfully!`);
  };

  if (!account)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Page Title Section */}
      <div className="bg-indigo-50 border-b border-gray-100 mb-8">
        <div className="max-w-2xl mx-auto px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900">Edit Account</h2>
          <p className="text-gray-600 text-sm mt-1">ID: {id}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-400"
        >
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium">
              ✓ {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
              ✕ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={account.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={account.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={account.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
              <input
                type="text"
                name="section"
                value={account.section}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Session</label>
              <input
                type="text"
                name="session"
                value={account.session}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={account.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 text-gray-900"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditAccount;
