import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js";
import { useNavigate } from "react-router";
import { FaFileAlt, FaClock, FaCheck, FaTimes, FaEye } from "react-icons/fa";

export default function Chairman() {
  const [user, setUser] = useState(null);

  // Data State
  const [complains, setComplains] = useState([]);

  // Modal & UI State
  const [expanded, setExpanded] = useState(false);
  const [selectedComplain, setSelectedComplain] = useState(null);
  const [responseText, setResponseText] = useState("");

  const navigate = useNavigate();

  // ===== API Calls =====

  const loadComplains = async (userId) => {
    try {
      const publicRes = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      const publicJson = await publicRes.json();

      // Only Chairman-related public complains
      let combinedData = (publicJson.data || []).filter(
        (c) => c.assignedTo === "chairman"
      );

      if (userId) {
        const privateRes = await fetchWithRefresh(
          `http://localhost:4000/api/v1/complain/${userId}`
        );
        const privateJson = await privateRes.json();
        combinedData = [...combinedData, ...(privateJson.data || [])];
      }

      const sorted = combinedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComplains(sorted);
    } catch (err) {
      console.error("Failed to load complains", err);
    }
  };

  // ===== Data Loading Logic =====

  useEffect(() => {
    const initData = async () => {
      try {
        const userRes = await fetchWithRefresh(
          "http://localhost:4000/api/v1/me"
        );
        const userJson = await userRes.json();

        if (userJson.success) {
          setUser(userJson.data);
          await loadComplains(userJson.data._id);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    initData();
  }, []);

  // ===== Update Status =====
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedComplain) return;

    const body = {
      status: newStatus,
      ...(responseText && { response: responseText }),
    };

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${selectedComplain._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(`Complaint ${newStatus} successfully`);
        document.getElementById("solve_modal").close();
        document.getElementById("reject_modal").close();

        setResponseText("");
        await loadComplains(user?._id);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/v1/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const openDetailsModal = (complain) => {
    setSelectedComplain(complain);
    setExpanded(false);
    document.getElementById("details_modal").showModal();
  };

  const openModal = (id, complain) => {
    setSelectedComplain(complain);
    setExpanded(false);
    setResponseText("");
    document.getElementById(id).showModal();
  };

  // ===== Filters =====
  const pendingComplains = complains.filter((c) => c.status === "pending");
  const solvedComplains = complains.filter((c) =>
    ["resolved", "rejected"].includes(c.status)
  );

  return (
    <>
      <style>
        {`
          .fieldset:focus-within .fieldset-legend {
            font-size: 1rem !important;
            transform: none !important;
          }
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

      <div className="min-h-screen bg-gray-50">
        {/* Professional Header - Modern Gradient */}
        <header className="bg-gradient-to-r from-slate-700 to-slate-900 border-b border-slate-700 shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              {/* Left Section - Logo & Title */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v2H5v14h14V5h-4V3h6v18H3V3h6z" />
                  </svg>
                </div>
                <div className="border-l border-slate-600 pl-4">
                  <h1 className="text-xl font-bold text-white tracking-tight">Grievance Management</h1>
                  <p className="text-sm text-slate-300">Chairman Portal</p>
                </div>
              </div>

              {/* Right Section - User Profile & Logout */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Chairman</span>
                </div>
                <button 
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-purple-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Chairman Panel</h2>
              <p className="text-gray-600 text-sm mt-1">Review and manage pending grievances</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Pending Complaints */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-amber-400 h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-amber-200">
                <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-3">
                  <FaClock className="text-amber-500" />
                  Pending Complaints
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {pendingComplains.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500 text-lg">No pending complaints.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingComplains.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-lg hover:shadow-md transition-all duration-200 hover:border-amber-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 flex-1 text-sm">{c.title}</h4>
                          <span className="badge badge-sm font-semibold text-white text-xs px-3 py-1 bg-amber-500">
                            pending
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{c.complain}</p>
                        <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-0 gap-1 font-medium"
                            onClick={() => openModal("solve_modal", c)}
                          >
                            <FaCheck className="text-xs" />
                            Resolve
                          </button>
                          <button
                            className="btn btn-xs bg-red-500 hover:bg-red-600 text-white border-0 gap-1 font-medium"
                            onClick={() => openModal("reject_modal", c)}
                          >
                            <FaTimes className="text-xs" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Resolved/Rejected History */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-cyan-400 h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-6 border-b border-cyan-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-cyan-600 flex items-center gap-3">
                  <FaFileAlt className="text-cyan-500" />
                  Decision History
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {solvedComplains.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500 text-lg">No resolved or rejected complaints yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solvedComplains.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 rounded-lg hover:shadow-md transition-all duration-200" 
                        style={{borderLeftColor: c.status === "resolved" ? "#10b981" : "#ef4444"}}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 flex-1 text-sm line-clamp-1">{c.title}</h4>
                          <span className={`badge badge-sm font-semibold text-white text-xs px-3 py-1 whitespace-nowrap ml-2 ${
                            c.status === "resolved" ? "bg-emerald-500" : "bg-red-500"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{c.complain}</p>

                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>

                        <button
                          className="btn btn-xs bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-1 font-medium"
                          onClick={() => openDetailsModal(c)}
                        >
                          <FaEye className="text-xs" />
                          View Decision
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* RESOLVE MODAL */}
        <dialog id="solve_modal" className="modal">
          <div className="modal-box bg-white rounded-lg shadow-2xl max-w-2xl">
            <button 
              onClick={() => {
                document.getElementById("solve_modal").close();
                setResponseText("");
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-2xl mb-6 text-gray-900">
              Resolve Complaint
            </h3>

            <div className="space-y-6">
              {selectedComplain && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">{selectedComplain.title}</h4>
                  <p className="text-gray-600 text-sm">{selectedComplain.complain}</p>
                </div>
              )}

              <fieldset className="fieldset border border-gray-300 rounded-lg p-4 bg-gray-50">
                <legend className="fieldset-legend text-sm font-semibold text-gray-700 px-2">
                  Resolution/Decision
                </legend>
                <textarea
                  className="input w-full px-4 py-3 border border-gray-300 rounded-md focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none h-40 text-gray-900"
                  placeholder="Provide your resolution or decision for this complaint..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </fieldset>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    document.getElementById("solve_modal").close();
                    setResponseText("");
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus("resolved")}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 gap-2 flex items-center"
                >
                  <FaCheck className="text-sm" />
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* REJECT MODAL */}
        <dialog id="reject_modal" className="modal">
          <div className="modal-box bg-white rounded-lg shadow-2xl max-w-2xl">
            <button 
              onClick={() => {
                document.getElementById("reject_modal").close();
                setResponseText("");
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-2xl mb-6 text-gray-900">
              Reject Complaint
            </h3>

            <div className="space-y-6">
              {selectedComplain && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">{selectedComplain.title}</h4>
                  <p className="text-gray-600 text-sm">{selectedComplain.complain}</p>
                </div>
              )}

              <fieldset className="fieldset border border-gray-300 rounded-lg p-4 bg-gray-50">
                <legend className="fieldset-legend text-sm font-semibold text-gray-700 px-2">
                  Rejection Reason
                </legend>
                <textarea
                  className="input w-full px-4 py-3 border border-gray-300 rounded-md focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 resize-none h-40 text-gray-900"
                  placeholder="Provide the reason for rejecting this complaint..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </fieldset>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    document.getElementById("reject_modal").close();
                    setResponseText("");
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 gap-2 flex items-center"
                >
                  <FaTimes className="text-sm" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* DETAILS MODAL */}
        <dialog id="details_modal" className="modal">
          <div className="modal-box bg-white rounded-lg shadow-2xl max-w-3xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600">
                ✕
              </button>
            </form>

            {selectedComplain && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedComplain.title}</h2>
                <div className="flex gap-3 mb-6">
                  <span className={`badge font-semibold text-white text-xs px-3 py-2 ${
                    selectedComplain.status === "resolved" ? "bg-emerald-600" : "bg-red-600"
                  }`}>
                    {selectedComplain.status}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Complaint Details:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className={`text-gray-800 leading-relaxed ${!expanded ? "line-clamp-4" : ""}`}>
                      {selectedComplain.complain}
                    </p>
                    <button
                      className="text-blue-600 hover:text-blue-700 hover:underline mt-3 text-sm font-medium"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className={`font-bold text-lg mb-3 ${
                    selectedComplain.status === "rejected" ? "text-red-700" : "text-emerald-700"
                  }`}>
                    {selectedComplain.status === "rejected" ? "Rejection Reason" : "Resolution"}
                  </h4>
                  <div className={`p-5 rounded-lg border-l-4 ${
                    selectedComplain.status === "rejected"
                      ? "bg-red-50 border-l-red-600"
                      : "bg-emerald-50 border-l-emerald-600"
                  }`}>
                    <p className={selectedComplain.status === "rejected" ? "text-red-900" : "text-emerald-900"}>
                      {selectedComplain.response || "No additional comments provided."}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    Last updated: {new Date(selectedComplain.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </dialog>
      </div>
    </>
  );
}
