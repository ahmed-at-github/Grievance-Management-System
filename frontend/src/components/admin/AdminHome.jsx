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
    <div className="flex gap-12 justify-center items-center min-h-screen bg-gray-200">
      
      {/* Complains Dashboard */}
      <div className="w-[700px] shadow-2xl bg-white h-80 rounded-2xl p-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">All Problems</h2>

        {loading && <p>Loading...</p>}

        {error && !loading && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}

        {!loading && !error && problems.length === 0 && (
          <p className="text-red-500">No problems found.</p>
        )}

        {!loading &&
          !error &&
          problems.map((p) => (
            <div
              key={p._id}
              className="p-3 mb-6 rounded-lg shadow-sm bg-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{p.title}</p>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-medium ${
                    p.status === "pending"
                      ? "bg-yellow-200 text-yellow-700"
                      : p.status === "resolved"
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-sm text-gray-700">{p.complain}</p>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(p.createdAt).toLocaleString([], {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
      </div>

      {/* Admin actions */}
      <div className="bg-white flex flex-col items-center justify-center shadow-2xl p-20 gap-10 text-2xl font-bold rounded-2xl">
        <Link to="admin-create-account" className="btn btn-neutral">
          Create new Account
        </Link>
        <Link to="admin-show-all-account" className="btn btn-neutral">
          Show all Account
        </Link>
        <Link to="admin-create-chairman-account" className="btn btn-neutral">
          Create chairman Account
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
