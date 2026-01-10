import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js"; // adjust path
import { useNavigate } from "react-router";

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
        `}
      </style>

      <div className="bg-green-200 h-[100vh]">
        {/* NavBar Section */}
        <div className="navbar bg-base-100 shadow-sm mb-8">
          <div className="flex flex-wrap items-center gap-6 w-full px-4">
            <div className="flex items-center gap-4">
              <img
                className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
                src="../src/assets/cartoon-illustration-scholar-academic_272293-4645.jpeg"
                alt="avatar"
              />
              <h1 className="my-2 font-semibold text-xl">Student Panel</h1>
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold">Navbar</h1>
            </div>
            <button className="btn btn-neutral" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="m-2 flex justify-between gap-4">
          {/* ================= LEFT: Public Feed (All Students) ================= */}
          <div className="">
            <div className="card bg-base-100 w-[49vw] shadow-sm h-[77vh] p-4 overflow-scroll">
              <h2 className="text-2xl font-bold text-center">
                📩 General Message Feed
              </h2>

              {publicComplains.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  No public complains yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4 mt-4">
                  {publicComplains.map((c) => (
                    <div
                      key={c._id}
                      className="border rounded-lg p-4 shadow hover:shadow-md transition duration-150"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{c.title}</h4>
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-full ${
                            c.status === "resolved"
                              ? "bg-green-200 text-green-800"
                              : c.status === "rejected"
                              ? "bg-red-200 text-red-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{c.complain}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span className="italic badge badge-ghost">
                          {c.category}
                        </span>
                        <span>
                          {new Date(c.createdAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: My Messages (Public + Private) ================= */}
          <div className="card bg-base-100 w-[49vw] shadow-sm h-[77vh] p-4 overflow-scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">🔒 My Messages</h2>

              <button
                className="btn bg-green-500 hover:bg-green-400 text-white font-semibold"
                onClick={openCreateModal} // Changed to custom handler
              >
                <span className="text-2xl">+</span> Create New Problem
              </button>
            </div>

            {/* CREATE / EDIT MODAL */}
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                {/* Manual Close Button to ensure state reset */}
                <button 
                  onClick={closeModal}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 font-extrabold top-2"
                >
                  ✕
                </button>
                
                <div>
                  <h3 className="font-bold text-lg mb-4">
                    {editingId ? "Edit Problem" : "Create New Problem"}
                  </h3>

                  <fieldset className="fieldset rounded py-4 mb-2">
                    <legend className="fieldset-legend text-[14px] font-sans">
                      Problem Title
                    </legend>
                    <input
                      type="text"
                      className="input w-full px-3 py-3 border rounded"
                      placeholder="Enter problem title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </fieldset>

                  <fieldset className="fieldset w-full mb-2">
                    <legend className="fieldset-legend text-[14px]">
                      Description
                    </legend>
                    <textarea
                      className="input w-full px-3 py-4 rounded resize-none h-40"
                      placeholder="Describe your problem in detail"
                      value={complainText}
                      onChange={(e) => setComplainText(e.target.value)}
                    />
                  </fieldset>

                  {/* Hide Visibility Option during Edit */}
                  {!editingId && (
                    <>
                      <legend className="fieldset-legend text-[14px] font-sans mb-2">
                        Visibility
                      </legend>
                      <div className="flex gap-x-6 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="viewType"
                            className="radio radio-success"
                            checked={viewType === "public"}
                            onChange={() => setViewType("public")}
                          />
                          <span>Public</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="viewType"
                            className="radio radio-error"
                            checked={viewType === "private"}
                            onChange={() => setViewType("private")}
                          />
                          <span>Private</span>
                        </label>
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleSubmit} // Using unified handler
                    className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold transition duration-150"
                  >
                    {editingId ? "Update" : "Send"}
                  </button>
                </div>
              </div>
            </dialog>

            {/* MY MESSAGES LIST (Combined) */}
            <div className="flex flex-col gap-4">
              {myCombinedComplains.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">
                  You haven't posted any messages yet.
                </p>
              ) : (
                myCombinedComplains.map((c) => (
                  <div
                    key={c._id}
                    className="card bg-base-100 border shadow-sm"
                  >
                    <div className="card-body">
                      {/* --- Header Section --- */}
                      <div className="flex justify-between items-start">
                        <h2 className="card-title text-lg w-2/3">{c.title}</h2>

                        {/* Right Side Badges Container */}
                        <div className="flex flex-col items-end gap-2">
                          
                          {/* Row 1: Status Badge */}
                          <span
                            className={`px-2 py-1 text-sm font-semibold rounded-full ${
                              c.status === "resolved"
                                ? "bg-green-200 text-green-800"
                                : c.status === "rejected"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {c.status}
                          </span>

                          {/* Row 2: Metadata Tags */}
                          <div className="flex flex-wrap justify-end gap-1">
                            {/* Assigned To Tag */}
                            {c.assignedTo && (
                              <span className="badge badge-sm h-auto bg-blue-100 text-blue-800 border-blue-200 capitalize">
                                {c.assignedTo}
                              </span>
                            )}
                             {/* Private/Public Tag */}
                            <span className={`badge badge-sm font-semibold text-white border-none ${c.view === 'private' ? 'bg-red-400' : 'bg-green-400'}`}>
                                {c.view === 'private' ? 'Private' : 'Public'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* --- Body --- */}
                      <p className="text-gray-700 font-sans m-2 line-clamp-2">
                        {c.complain}
                      </p>

                      {/* --- Footer / Actions --- */}
                      <div className="card-actions justify-end items-center gap-2 mt-2">
                        
                        {/* EDIT BUTTON (Only if Pending) */}
                        {c.status === "pending" && (
                           <button
                             className="btn text-white font-semibold btn-sm bg-orange-400 hover:bg-orange-300"
                             onClick={() => openEditModal(c)}
                           >
                             Edit
                           </button>
                        )}

                        {/* DELETE BUTTON */}
                        <button
                          className={`btn text-white font-semibold btn-sm ${
                            (c.status === 'resolved' || c.status === 'rejected')
                              ? "bg-blue-500 hover:bg-blue-400"
                              : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                          }`}
                          onClick={() => handleDelete(c._id, c.status)}
                        >
                          Delete
                        </button>

                        {/* VIEW RESPONSE BUTTON */}
                        {(c.status === "resolved" ||
                          c.status === "rejected") && (
                          <button
                            className="btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black"
                            onClick={() => openDetailsModal(c)}
                          >
                            View Response
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SHARED DETAILS MODAL (Read Only) */}
            <dialog id="details_modal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">
                    ✕
                  </button>
                </form>

                {selectedComplain && (
                  <>
                    <div className="flex gap-4 mb-2">
                      <h2 className="card-title">{selectedComplain.title}</h2>
                      <span className={`badge font-semibold text-white ${selectedComplain.view === 'private' ? 'bg-red-400' : 'bg-green-400'}`}>
                        {selectedComplain.view === 'private' ? 'Private' : 'Public'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p
                        className={`text-gray-700 font-sans m-1 ${
                          !expanded ? "line-clamp-2" : ""
                        }`}
                      >
                        {selectedComplain.complain}
                      </p>
                      <button
                        className="text-blue-500 hover:underline m-2 text-sm"
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? "See less" : "See more"}
                      </button>
                    </div>

                    <div className="mt-4">
                      <div
                        className={`border p-4 rounded-lg ${
                          selectedComplain.status === "rejected"
                            ? "bg-red-50 border-red-300"
                            : "bg-green-50 border-green-300"
                        }`}
                      >
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {selectedComplain.status === "rejected"
                            ? "Rejection Reason"
                            : "Solution Comment"}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedComplain.response ||
                            "No additional comments provided by admin."}
                        </p>
                      </div>

                      <p className="text-right text-sm text-gray-600 mt-3">
                        Updated on:{" "}
                        {new Date(
                          selectedComplain.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </>
  );
}