import React, { useEffect, useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil.js";

const ChairmanHome = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [solutionInput, setSolutionInput] = useState("");

  const [error, setError] = useState("");

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await fetchWithRefresh("http://localhost:4000/api/v1/me");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch user");
      }
      const payload = await res.json();
      setCurrentUser(payload.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch user details");
    }
  };

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch complaints");
      }
      const payload = await res.json();
      const data = payload.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid complaint data received from server");
      }

      // Sort latest first
      const sorted = data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setProblems(sorted);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchComplaints();
  }, []);

  // Open modal
  const openModal = (problem) => {
    if (problem.status === "pending") {
      setSelectedProblem(problem);
      setSolutionInput(problem.response || "");
      setModalOpen(true);
      setError(""); 
    } else {
      setError("Cannot edit a resolved or rejected complaint.");
    }
  };

  // Submit solution to backend
  const submitSolution = async () => {
    if (!solutionInput.trim()) {
      setError("Response cannot be empty");
      return;
    }

    if (!currentUser?._id) {
      setError("Current user not loaded. Please refresh the page.");
      return;
    }

    const payload = {
      response: solutionInput,
      assignedTo: currentUser._id,
      status: "resolved",
    };

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${selectedProblem._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update complaint");
      }

      const updatedProblem = await res.json();

      // Update state
      fetchComplaints();

      // Reset modal
      setModalOpen(false);
      setSelectedProblem(null);
      setSolutionInput("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update complaint");
    }
  };

  return (
    <div className="flex gap-12 justify-center items-center min-h-screen bg-gray-200">
      <div className="w-[700px] shadow-2xl bg-white h-[500px] rounded-2xl p-10 list overflow-y-scroll">
        <h2 className="text-xl font-bold mb-4">All Problems</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {loading && <p>Loading complaints...</p>}

        {!loading && problems.length === 0 && (
          <p className="text-red-500">No complaints found.</p>
        )}

        {!loading &&
          problems.map((p) => (
            <div
              key={p._id}
              className={`p-3 mb-6 rounded-lg shadow-sm bg-gray-100 cursor-pointer hover:bg-gray-200 `}
              onClick={() => openModal(p)}
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

              <p className="text-sm text-gray-700 mb-2">{p.complain}</p>

              {p.response && (
                <p className="text-sm text-blue-700 mb-2">
                  <strong>Solution:</strong> {p.response}
                </p>
              )}

              {p.studentId && (
                <div className="text-sm text-gray-800 mb-1">
                  <p>
                    <strong>Dept:</strong> {p.studentId.dept}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {p.studentId.studId}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Updated:{" "}
                {new Date(p.updatedAt).toLocaleString([], {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}

        {/* Modal */}
        {modalOpen && selectedProblem && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-96 relative">
              <h3 className="text-lg font-bold mb-4">
                {selectedProblem.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {selectedProblem.complain}
              </p>
              {/* Error message inside modal */}
              {error && <p className="text-red-500 mb-2">{error}</p>}

              <label className="block mb-2 font-medium">Response:</label>
              <input
                type="text"
                className="input input-bordered w-full mb-4"
                value={solutionInput}
                onChange={(e) => setSolutionInput(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-error"
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedProblem(null);
                    setSolutionInput("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={submitSolution}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChairmanHome;
