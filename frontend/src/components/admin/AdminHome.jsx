import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchWithRefresh } from "../../utils/fetchUtil.js";

const AdminHome = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complains from backend
  useEffect(() => {
    const loadComplains = async () => {
      try {
        setLoading(true);

        const res = await fetchWithRefresh(
          "http://localhost:4000/api/v1/complain/"
        );
        const json = await res.json();

        if (!res.ok) {
          setError(json.message || "Failed to fetch complains.");
          return;
        }

        // Sort descending (newest first)
        const sorted = [...json.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProblems(sorted);
        setError("");

      } catch (err) {
        console.error("Error fetching complains:", err);
        setError("Network error. Failed to load complains.");
      } finally {
        setLoading(false);
      }
    };

    loadComplains();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title Section */}
      <div className="bg-amber-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">Manage accounts and monitor all grievances</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          
          {/* Left Column - All Grievances */}
          <div className="lg:col-span-2 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden border-t-4 border-amber-400 h-96 sm:h-[500px] md:h-[600px] flex flex-col">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-amber-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">All Grievances</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar">
              {loading && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading...</p>
                </div>
              )}

              {error && !loading && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-red-600 font-semibold text-center">{error}</p>
                </div>
              )}

              {!loading && !error && problems.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 text-center">No grievances found.</p>
                </div>
              )}

              {!loading && !error && (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {problems.map((p) => (
                    <div
                      key={p._id}
                      className="p-2 sm:p-3 md:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg hover:shadow-md transition-all duration-200 hover:border-amber-500"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 flex-1 text-xs sm:text-sm">{p.title}</h4>
                        <span
                          className={`badge badge-xs sm:badge-sm font-semibold text-white text-xs px-2 py-1 sm:px-3 sm:py-1 flex-shrink-0 ${
                            p.status === "pending"
                              ? "bg-yellow-500"
                              : p.status === "resolved"
                              ? "bg-emerald-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-2">{p.complain}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Admin Actions */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg overflow-hidden border-t-4 border-blue-400 h-fit flex flex-col">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-blue-200">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">Admin Actions</h2>
            </div>
            
            <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
              <Link 
                to="admin-create-account" 
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 block text-xs sm:text-sm"
              >
                Create Student Account
              </Link>
              <Link 
                to="admin-show-all-account" 
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 block text-xs sm:text-sm"
              >
                View All Accounts
              </Link>
              <Link 
                to="admin-create-chairman-account" 
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 block text-xs sm:text-sm"
              >
                Create Manegerial Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  );
};

export default AdminHome;
