import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js";
import { useNavigate } from "react-router";
import { FaFileAlt, FaClock, FaCheck, FaTimes, FaEye } from "react-icons/fa";

export default function Decision() {
  const navigate = useNavigate();

  // Data State
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Interaction State
  const [selectedComplain, setSelectedComplain] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [forwardRole, setForwardRole] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Initialization Effect (Fetch User -> Then Fetch Complains)
  useEffect(() => {
    const initData = async () => {
      try {
        // A. Fetch Current User first
        const userRes = await fetchWithRefresh(
          "http://localhost:4000/api/v1/me"
        );
        const userJson = await userRes.json();

        let currentUserId = null;
        if (userJson.success) {
          setUser(userJson.data);
          currentUserId = userJson.data._id;
        }

        // B. Fetch Complaints (Public + Private using the ID we just got)
        await loadComplains(currentUserId);
      } catch (err) {
        console.error("Failed to initialize data:", err);
      }
    };

    initData();
  }, []);

  // Unified Load Function (Public + Private Merge)
  const loadComplains = async (userId) => {
    setLoading(true);
    try {
      // Step 1: Fetch Public Complains
      const publicRes = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      const publicJson = await publicRes.json();

      // FILTER: only decision committee public complains
      let combinedData = (publicJson.data || []).filter(
        (c) => c.assignedTo === "decision committee"
      );

      // Step 2: Fetch Private Complains (Only if we have a User ID)
      if (userId) {
        try {
          const privateRes = await fetchWithRefresh(
            `http://localhost:4000/api/v1/complain/${userId}`
          );
          const privateJson = await privateRes.json();
          const privateData = privateJson.data || [];

          // Merge arrays
          combinedData = [...combinedData, ...privateData];
        } catch (privateErr) {
          console.error("Failed to fetch private complains", privateErr);
        }
      }

      const sorted = combinedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setComplains(sorted);
    } catch (err) {
      console.error("Failed to fetch complains", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Updates (Solve, Reject, Forward)
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedComplain) return;

    const roleToAssign = forwardRole || (user ? user.role : undefined);

    const body = {
      status: newStatus,
      ...(responseText && { response: responseText }),
      ...(roleToAssign && { assignedTo: roleToAssign }),
    };

    try {
      console.log(body);

      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${selectedComplain._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const response = await res.json();
      if (res.ok) {
        alert(`Complaint ${newStatus} successfully!`);

        // Close Modals
        document.getElementById("forward_modal").close();
        document.getElementById("resolve_modal").close();
        document.getElementById("reject_modal").close();

        // Reset State
        setResponseText("");
        setForwardRole("");

        // Refresh list
        loadComplains(user ? user._id : null);
      } else {
        alert(response.message || "Failed to update complaint");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong");
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

  // Helper to open modals with specific data
  const openModal = (modalId, complain) => {
    setSelectedComplain(complain);
    setResponseText("");
    setForwardRole("");
    setExpanded(false);
    document.getElementById(modalId).showModal();
  };

  const openDetailsModal = (complain) => {
    setSelectedComplain(complain);
    setExpanded(false);
    document.getElementById("details_modal").showModal();
  };

  // Filter Data for Columns
  const pendingComplains = complains.filter((c) => c.status === "pending");
  const solvedComplains = complains.filter(
    (c) =>
      c.status === "resolved" ||
      c.status === "rejected" ||
      c.status === "approved"
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v2H5v14h14V5h-4V3h6v18H3V3h6z" />
                  </svg>
                </div>
                <div className="border-l border-slate-600 pl-4">
                  <h1 className="text-xl font-bold text-white tracking-tight">Grievance Management</h1>
                  <p className="text-sm text-slate-300">Decision Committee Portal</p>
                </div>
              </div>

              {/* Right Section - User Profile & Logout */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">Decision Committee</span>
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
        <div className="bg-indigo-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Decision Panel</h2>
              <p className="text-gray-600 text-sm mt-1">Review and manage pending grievances</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Pending Grievances */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-amber-400 h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-amber-200">
                <h2 className="text-2xl font-bold text-amber-600 flex items-center gap-3">
                  <FaClock className="text-amber-500" />
                  Pending Grievances
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                ) : pendingComplains.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500 text-lg">No pending grievances.</p>
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
                          <span className={`badge badge-sm font-semibold text-white text-xs px-3 py-1 ${
                            c.view === "private" ? "bg-red-500" : "bg-emerald-500"
                          }`}>
                            {c.view === "private" ? "Private" : "Public"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{c.complain}</p>

                        {/* Student Details */}
                        {c.studentId && (
                          <div className="bg-gray-100 p-3 rounded-md border border-gray-200 text-xs text-gray-700 mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="font-semibold">{c.studentId.name}</span>
                              <span>ID: {c.studentId.studId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Dept: {c.studentId.dept} (Sec: {c.studentId.section})</span>
                              <span>Session: {c.studentId.session}</span>
                            </div>
                          </div>
                        )}

                        <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            className="btn btn-xs bg-blue-500 hover:bg-blue-600 text-white border-0 gap-1 font-medium"
                            onClick={() => openModal("forward_modal", c)}
                          >
                            Forward
                          </button>
                          <button
                            className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-0 gap-1 font-medium"
                            onClick={() => openModal("resolve_modal", c)}
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

            {/* Right Column - Decision History */}
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
                    <p className="text-gray-500 text-lg">No decision history yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {solvedComplains.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 rounded-lg hover:shadow-md transition-all duration-200" 
                        style={{borderLeftColor: c.status === "resolved" ? "#10b981" : c.status === "rejected" ? "#ef4444" : "#06b6d4"}}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 flex-1 text-sm line-clamp-1">{c.title}</h4>
                          <span className={`badge badge-sm font-semibold text-white text-xs px-3 py-1 whitespace-nowrap ml-2 ${
                            c.status === "resolved" ? "bg-emerald-500" : 
                            c.status === "rejected" ? "bg-red-500" :
                            "bg-cyan-500"
                          }`}>
                            {c.status === "approved" ? "Forwarded" : c.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{c.complain}</p>

                        {/* Student Details */}
                        {c.studentId && (
                          <div className="bg-gray-100 p-2 rounded-md border border-gray-200 text-xs text-gray-700 mb-2">
                            <span className="font-semibold">{c.studentId.name}</span> - ID: {c.studentId.studId}
                          </div>
                        )}

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

        {/* FORWARD MODAL */}
        <dialog id="forward_modal" className="modal">
          <div className="modal-box bg-white rounded-lg shadow-2xl max-w-2xl">
            <button 
              onClick={() => {
                document.getElementById("forward_modal").close();
                setResponseText("");
                setForwardRole("");
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-2xl mb-6 text-gray-900">
              Forward Grievance
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
                  Assign To
                </legend>
                <select
                  className="select w-full px-4 py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900"
                  value={forwardRole}
                  onChange={(e) => setForwardRole(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  <option value="chairman">Chairman</option>
                  <option value="deen">Deen</option>
                  <option value="vc">VC</option>
                </select>
              </fieldset>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    document.getElementById("forward_modal").close();
                    setResponseText("");
                    setForwardRole("");
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus("pending")}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 gap-2 flex items-center"
                >
                  Forward Grievance
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* RESOLVE MODAL */}
        <dialog id="resolve_modal" className="modal">
          <div className="modal-box bg-white rounded-lg shadow-2xl max-w-2xl">
            <button 
              onClick={() => {
                document.getElementById("resolve_modal").close();
                setResponseText("");
              }}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-2xl mb-6 text-gray-900">
              Resolve Grievance
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
                  placeholder="Provide your resolution or decision for this grievance..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </fieldset>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    document.getElementById("resolve_modal").close();
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
                  Mark as Resolved
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
              Reject Grievance
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
                  placeholder="Provide the reason for rejecting this grievance..."
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
                    selectedComplain.status === "resolved" ? "bg-emerald-600" : 
                    selectedComplain.status === "rejected" ? "bg-red-600" :
                    "bg-cyan-600"
                  }`}>
                    {selectedComplain.status === "approved" ? "Forwarded" : selectedComplain.status}
                  </span>
                  <span className={`badge font-semibold text-white border-0 text-xs px-3 py-2 ${selectedComplain.view === "private" ? "bg-red-600" : "bg-emerald-600"}`}>
                    {selectedComplain.view === "private" ? "Private" : "Public"}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Grievance Details:</h4>
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

                {/* Student Details */}
                {selectedComplain.studentId && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Student Information:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                      <div className="flex justify-between mb-2">
                        <span><strong>Name:</strong> {selectedComplain.studentId.name}</span>
                        <span><strong>ID:</strong> {selectedComplain.studentId.studId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span><strong>Dept:</strong> {selectedComplain.studentId.dept}</span>
                        <span><strong>Section:</strong> {selectedComplain.studentId.section}</span>
                        <span><strong>Session:</strong> {selectedComplain.studentId.session}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className={`font-bold text-lg mb-3 ${
                    selectedComplain.status === "rejected" ? "text-red-700" : "text-emerald-700"
                  }`}>
                    {selectedComplain.status === "rejected" ? "Rejection Reason" : "Decision/Resolution"}
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
