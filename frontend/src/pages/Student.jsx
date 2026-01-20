import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js"; // adjust path
import { useNavigate } from "react-router";
import { FaFileAlt, FaPlus, FaClock, FaCheck, FaTimes, FaEye } from "react-icons/fa";

export default function Student() {
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [complainText, setComplainText] = useState("");
  const [viewType, setViewType] = useState("public");
  
  // Edit State (New)
  const [editingId, setEditingId] = useState(null); // If null, we are creating. If set, we are editing.

  // Data State
  const [publicComplains, setPublicComplains] = useState([]);
  const [privateComplains, setPrivateComplains] = useState([]);
  const [myCombinedComplains, setMyCombinedComplains] = useState([]);

  // Modal & UI State
  const [expanded, setExpanded] = useState(false);
  const [selectedComplain, setSelectedComplain] = useState(null);

  const navigate = useNavigate();

  // ===== API Calls =====

  const loadPublicComplains = async () => {
    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      const response = await res.json();
      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPublicComplains(sorted);
    } catch (err) {
      console.error("Failed to fetch public complains:", err);
    }
  };

  const loadPrivateComplains = async (userId) => {
    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${userId}`
      );
      const response = await res.json();
      return response.data || [];
    } catch (err) {
      console.error("Failed to fetch private complains:", err);
      return [];
    }
  };

  // ===== Delete Function =====
  const handleDelete = async (id, status) => {
    if (status !== "resolved" && status !== "rejected") {
      alert("You can only delete complaints that are resolved or rejected.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${id}`,
        { method: "DELETE" }
      );

      const response = await res.json();

      if (res.ok) {
        alert("Complaint deleted successfully");
        await refreshAllData();
      } else {
        alert(response.message || "Failed to delete complaint");
      }
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Failed to delete complaint");
    }
  };

  // ===== Data Loading Logic =====

  useEffect(() => {
    const initData = async () => {
      await loadPublicComplains();

      try {
        const res = await fetchWithRefresh("http://localhost:4000/api/v1/me");
        const response = await res.json();
        if (response.success) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const mergeMyComplains = async () => {
      if (!user?._id) return;

      const myPrivates = await loadPrivateComplains(user._id);
      setPrivateComplains(myPrivates);

      const myPublics = publicComplains.filter((c) => {
        const cStudentId = c.studentId?._id || c.studentId; 
        return cStudentId === user._id;
      });

      const combined = [...myPrivates, ...myPublics];
      const uniqueCombined = Array.from(new Map(combined.map(item => [item._id, item])).values());

      uniqueCombined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMyCombinedComplains(uniqueCombined);
    };

    mergeMyComplains();
  }, [user, publicComplains]);

  const refreshAllData = async () => {
    await loadPublicComplains();
  };

  // ===== Form Handlers (Create & Edit) =====

  // 1. Reset Form Helper
  const resetForm = () => {
    setTitle("");
    setComplainText("");
    setViewType("public");
    setEditingId(null);
  };

  // 2. Open Modal for Create
  const openCreateModal = () => {
    resetForm();
    document.getElementById("my_modal_3").showModal();
  };

  // 3. Open Modal for Edit
  const openEditModal = (complain) => {
    setEditingId(complain._id);
    setTitle(complain.title);
    setComplainText(complain.complain);
    setViewType(complain.view); // Set strictly for UI state, though we won't send it in PATCH
    document.getElementById("my_modal_3").showModal();
  };

  // 4. Close Modal Wrapper
  const closeModal = () => {
    document.getElementById("my_modal_3").close();
    resetForm();
  };

  // 5. Unified Submit Handler
  const handleSubmit = async () => {
    if (!title || !complainText) return alert("Please fill all fields");

    try {
      let url = "";
      let method = "";
      let body = {};

      if (editingId) {
        // --- EDIT MODE (PATCH) ---
        url = `http://localhost:4000/api/v1/complain/${editingId}`;
        method = "PATCH";
        // Only sending title and body as requested
        body = {
          title,
          complain: complainText,
        };
      } else {
        // --- CREATE MODE (POST) ---
        url = "http://localhost:4000/api/v1/complain/create";
        method = "POST";
        body = {
          title,
          complain: complainText,
          view: viewType,
          category: "other",
          assignedTo: "decision committee",
        };
      }

      const res = await fetchWithRefresh(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const response = await res.json();

      if (!res.ok) {
        alert(response.message || "Operation failed");
        return;
      }

      closeModal(); // Close and reset form
      await refreshAllData(); // Refresh list

      alert(editingId ? "Complaint updated successfully!" : "Complaint submitted successfully!");

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit");
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Left Section - Logo & Title */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 3v2H5v14h14V5h-4V3h6v18H3V3h6z" />
                  </svg>
                </div>
                <div className="border-l border-slate-600 pl-2 sm:pl-4 min-w-0">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">Grievance Management</h1>
                  <p className="text-xs sm:text-sm text-slate-300 hidden sm:block">Student Portal</p>
                </div>
              </div>

              {/* Right Section - User Profile & Logout */}
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
                {/* User Profile - Visible on SM and up */}
                <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all duration-200">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">Student</span>
                </div>
                {/* User Icon - Visible only on Mobile */}
                <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <button 
                  className="px-3 sm:px-6 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-blue-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">Grievance Dashboard</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">Track and manage your grievances</p>
            </div>
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 flex-shrink-0"
              onClick={openCreateModal}
            >
              <FaPlus className="text-xs sm:text-sm" />
              Submit Grievance
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* Left Column - Community Feed */}
            <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden border-t-4 border-cyan-400 h-96 sm:h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-cyan-200">
                <h2 className="text-lg sm:text-2xl font-bold text-cyan-600 flex items-center gap-2 sm:gap-3">
                  <FaFileAlt className="text-cyan-500 text-sm sm:text-base" />
                  Community Feed
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                {publicComplains.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500 text-lg">No public grievances yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publicComplains.map((c) => (
                      <div
                        key={c._id}
                        className="p-3 sm:p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-400 rounded-lg hover:shadow-md transition-all duration-200 hover:border-cyan-500"
                      >
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-bold text-gray-900 flex-1 text-xs sm:text-sm line-clamp-2">{c.title}</h4>
                          <span className={`badge badge-sm font-semibold text-white text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-shrink-0 ${
                            c.status === "resolved" ? "bg-emerald-500" :
                            c.status === "rejected" ? "bg-red-500" :
                            c.status === "in-progress" ? "bg-blue-500" :
                            "bg-amber-500"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">{c.complain}</p>
                        <div className="mb-2 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                          <p className="text-xs font-semibold text-blue-700">
                            Assigned to: <span className="font-bold text-blue-900">{c.assignedTo || "Pending Assignment"}</span>
                          </p>
                        </div>
                        <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - My Grievances */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-cyan-400 h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-6 border-b border-cyan-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-cyan-600 flex items-center gap-3">
                  <FaFileAlt className="text-cyan-500" />
                  My Grievances
                </h2>
             
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {myCombinedComplains.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-gray-500 text-lg">You haven't posted any grievances yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myCombinedComplains.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 rounded-lg hover:shadow-md transition-all duration-200" style={{borderLeftColor: c.status === "resolved" ? "#10b981" : c.status === "rejected" ? "#ef4444" : c.status === "in-progress" ? "#3b82f6" : "#f59e0b"}}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 flex-1 text-sm line-clamp-1">{c.title}</h4>
                          <span className={`badge badge-sm font-semibold text-white text-xs px-3 py-1 whitespace-nowrap ml-2 ${
                            c.status === "resolved" ? "bg-emerald-500" :
                            c.status === "rejected" ? "bg-red-500" :
                            c.status === "in-progress" ? "bg-blue-500" :
                            "bg-amber-500"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{c.complain}</p>

                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          <span className={`badge badge-outline badge-xs ${c.view === "private" ? "border-red-400 text-red-600" : "border-emerald-400 text-emerald-600"}`}>
                            {c.view === "private" ? "Private" : "Public"}
                          </span>
                        </div>

                        <div className="mb-3 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                          <p className="text-xs font-semibold text-blue-700">
                            Assigned to: <span className="font-bold text-blue-900">{c.assignedTo || "Pending Assignment"}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {c.status === "pending" && (
                            <button
                              className="btn btn-xs bg-orange-500 hover:bg-orange-600 text-white border-0 gap-1 font-medium"
                              onClick={() => openEditModal(c)}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className={`btn btn-xs border-0 text-white gap-1 font-medium ${
                              (c.status === "resolved" || c.status === "rejected")
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => handleDelete(c._id, c.status)}
                          >
                            Delete
                          </button>
                          {(c.status === "resolved" || c.status === "rejected") && (
                            <button
                              className="btn btn-xs bg-cyan-500 hover:bg-cyan-600 text-white border-0 gap-1 ml-auto font-medium"
                              onClick={() => openDetailsModal(c)}
                            >
                              <FaEye className="text-xs" />
                              Response
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* CREATE / EDIT MODAL */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box bg-white rounded-lg sm:rounded-lg shadow-2xl max-w-xs sm:max-w-md md:max-w-2xl p-4 sm:p-6 md:p-8">
            <button 
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-600"
            >
              ✕
            </button>
            
            <h3 className="font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-gray-900">
              {editingId ? "Edit Grievance" : "Submit New Grievance"}
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <fieldset className="fieldset border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                <legend className="fieldset-legend text-xs sm:text-sm font-semibold text-gray-700 px-2">
                  Grievance Title
                </legend>
                <input
                  type="text"
                  className="input w-full px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
                  placeholder="Enter a clear title for your grievance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                <legend className="fieldset-legend text-xs sm:text-sm font-semibold text-gray-700 px-2">
                  Detailed Description
                </legend>
                <textarea
                  className="input w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none h-32 sm:h-40 text-gray-900 text-sm"
                  placeholder="Provide detailed information about your grievance..."
                  value={complainText}
                  onChange={(e) => setComplainText(e.target.value)}
                />
              </fieldset>

              {!editingId && (
                <fieldset className="fieldset border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50">
                  <legend className="fieldset-legend text-xs sm:text-sm font-semibold text-gray-700 px-2">
                    Visibility Setting
                  </legend>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="viewType" className="radio radio-sm border-blue-400  checked:text-blue-500" checked={viewType === "public"}
                        onChange={() => setViewType("public")}
                      />
                      <span className="font-medium text-gray-700 text-sm">Public (visible to all)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="viewType"
                        className="radio radio-sm border-blue-400  checked:text-blue-500" 
                      checked={viewType === "private"}
                        onChange={() => setViewType("private")}
                      />
                      <span className="font-medium text-gray-700 text-sm">Private (only visible to admin)</span>
                    </label>
                  </div>
                </fieldset>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 sm:px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 gap-2 flex items-center justify-center text-sm"
                >
                  <FaPlus className="text-sm" />
                  {editingId ? "Update Grievance" : "Submit Grievance"}
                </button>
              </div>
            </div>
          </div>
        </dialog>

        {/* DETAILS MODAL */}
        <dialog id="details_modal" className="modal">
          <div className="modal-box bg-white rounded-lg sm:rounded-lg shadow-2xl max-w-xs sm:max-w-md md:max-w-3xl p-4 sm:p-6 md:p-8">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-600">
                ✕
              </button>
            </form>

            {selectedComplain && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{selectedComplain.title}</h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                  <span className={`badge font-semibold text-white text-xs px-2 sm:px-3 py-2 ${
                    selectedComplain.status === "resolved" ? "bg-emerald-600" :
                    selectedComplain.status === "rejected" ? "bg-red-600" :
                    "bg-blue-600"
                  }`}>
                    {selectedComplain.status}
                  </span>
                  <span className={`badge font-semibold text-white border-0 text-xs px-2 sm:px-3 py-2 ${selectedComplain.view === "private" ? "bg-red-600" : "bg-emerald-600"}`}>
                    {selectedComplain.view === "private" ? "Private" : "Public"}
                  </span>
                  <span className="badge font-semibold text-white border-0 text-xs px-2 sm:px-3 py-2 bg-purple-600">
                    Assigned: {selectedComplain.assignedTo || "Pending"}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Your Grievance:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className={`text-gray-800 leading-relaxed text-sm ${!expanded ? "line-clamp-4" : ""}`}>
                      {selectedComplain.complain}
                    </p>
                    <button
                      className="text-blue-600 hover:text-blue-700 hover:underline mt-3 text-xs sm:text-sm font-medium"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className={`font-bold text-base sm:text-lg mb-3 ${
                    selectedComplain.status === "rejected" ? "text-red-700" : "text-emerald-700"
                  }`}>
                    {selectedComplain.status === "rejected" ? "Rejection Reason" : "Resolution/Response"}
                  </h4>
                  <div className={`p-4 sm:p-5 rounded-lg border-l-4 ${
                    selectedComplain.status === "rejected"
                      ? "bg-red-50 border-l-red-600"
                      : "bg-emerald-50 border-l-emerald-600"
                  }`}>
                    <p className={`text-sm sm:text-base ${selectedComplain.status === "rejected" ? "text-red-900" : "text-emerald-900"}`}>
                      {selectedComplain.response || "No additional comments provided."}
                    </p>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mt-4">
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