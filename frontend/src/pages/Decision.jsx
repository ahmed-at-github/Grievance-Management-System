import React, { useState, useEffect } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js"; // Adjust path if needed
import { useNavigate } from "react-router";

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
  const [expanded, setExpanded] = useState(false); // For text inside modal

  // 1. Initialization Effect (Fetch User -> Then Fetch Complains)
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
          setUser(userJson.data); // Adjust based on whether backend sends 'data' or 'user'
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

  // 2. Unified Load Function (Public + Private Merge)
const loadComplains = async (userId) => {
  setLoading(true);
  try {
    // Step 1: Fetch Public Complains
    const publicRes = await fetchWithRefresh(
      "http://localhost:4000/api/v1/complain/"
    );
    const publicJson = await publicRes.json();

    // ✅ FILTER: only chairman public complains
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

    setComplains(combinedData);
  } catch (err) {
    console.error("Failed to fetch complains", err);
  } finally {
    setLoading(false);
  }
};


  // 3. Handle Updates (Solve, Reject, Forward)
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedComplain) return;

    const roleToAssign = forwardRole || (user ? user.role : undefined);

    // 2. Construct body using spread syntax
    const body = {
      status: newStatus,
      ...(responseText && { response: responseText }), // Only adds 'response' key if responseText exists
      ...(roleToAssign && { assignedTo: roleToAssign }), // Only adds 'assignedTo' key if a role exists
    };

    try {
      console.log(body);

      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/complain/${selectedComplain._id}`,
        {
          method: "PATCH", // Changed from PUT to PATCH as per standard, ensure backend matches
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const response = await res.json();
      if (res.ok) {
        alert(`Complaint ${newStatus} successfully!`);

        // Close Modals
        document.getElementById("my_modal_3").close();
        document.getElementById("my_modal_4").close();
        document.getElementById("my_modal_5").close();

        // Reset State
        setResponseText("");
        setForwardRole("");

        // Refresh list (pass user._id if available to keep private data visible)
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
        headers: { "Content-Type": "application/json" },
      });
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Helper to open modals with specific data
  const openModal = (modalId, complain) => {
    setSelectedComplain(complain);
    setResponseText("");
    setExpanded(false);
    document.getElementById(modalId).showModal();
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
    <div className="bg-green-200 h-[100vh]">
      {/* NavBar Section */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
              src="../src/assets/committee.jpg"
              alt="logo"
            />
            <h1 className="my-2 font-semibold text-xl">
              Decision Committee Panel
            </h1>
            <button className="btn btn-neutral" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-between">
        {/* ================= LEFT: New Messages (Pending) ================= */}
        <div className="m-2">
          <div className="card bg-base-100 w-[49vw] shadow-sm h-[77vh] p-2 overflow-scroll">
            <div className="card-body">
              <h1 className="text-center font-semibold mb-2 font-sans text-2xl">
                🔔 New Messages
              </h1>

              {loading ? (
                <p className="text-center">Loading...</p>
              ) : pendingComplains.length === 0 ? (
                <p className="text-center text-gray-500">
                  No pending messages.
                </p>
              ) : (
                pendingComplains.map((c) => (
                  <div
                    key={c._id}
                    className="card hover:bg-base-200 bg-base-100 w-[45vw] shadow-sm border mb-4"
                  >
                    <div className="card-body">
                      {/* --- Header: Title and Badge --- */}
                      <div className="flex gap-4 justify-between items-start">
                        <h2 className="card-title text-lg">{c.title}</h2>
                        <span
                          className={`badge font-semibold text-white shrink-0 ${
                            c.view === "private" ? "bg-red-400" : "bg-green-400"
                          }`}
                        >
                          {c.view === "private" ? "Private" : "Public"}
                        </span>
                      </div>

                      {/* --- Complaint Text --- */}
                      <p className="text-gray-700 font-sans m-2 line-clamp-2">
                        {c.complain}
                      </p>

                      {/* --- NEW: Student Details Section --- */}
                      {c.studentId && (
                        <div className="bg-gray-50 p-2 rounded-md border border-gray-100 text-xs text-gray-600 mt-1 mb-2 font-mono">
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-800">
                              {c.studentId.name}
                            </span>
                            <span>ID: {c.studentId.studId}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>
                              Dept: {c.studentId.dept} (Sec:{" "}
                              {c.studentId.section})
                            </span>
                            <span>Session: {c.studentId.session}</span>
                          </div>
                        </div>
                      )}

                      {/* --- Action Buttons --- */}
                      <div className="card-actions justify-end mt-2">
                        <button
                          className="btn btn-sm bg-cyan-600 hover:bg-cyan-500 text-white"
                          onClick={() => openModal("my_modal_3", c)}
                        >
                          Forward
                        </button>

                        <button
                          className="btn btn-sm bg-green-600 hover:bg-green-500 text-white"
                          onClick={() => openModal("my_modal_4", c)}
                        >
                          Solution
                        </button>

                        <button
                          className="btn btn-sm bg-red-600 hover:bg-red-500 text-white"
                          onClick={() => openModal("my_modal_5", c)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT: Solved Messages (Resolved/Rejected) ================= */}
        <div className="m-2">
          <div className="card bg-base-100 w-[47vw] shadow-sm p-2 h-[77vh] overflow-scroll">
            <div className="card-body">
              <h1 className="text-center font-semibold mb-2 font-sans text-2xl">
                ✅ Solved Messages
              </h1>

              {solvedComplains.length === 0 ? (
                <p className="text-center text-gray-500">
                  No solved history yet.
                </p>
              ) : (
                solvedComplains.map((c) => (
                  <div
                    key={c._id}
                    className="card bg-base-100 w-[43vw] shadow-sm border mb-4"
                  >
                    <div className="card-body">
                      <div className="flex gap-4">
                        <h2 className="card-title">{c.title}</h2>
                        {/* VIEW TAG */}
                        <span
                          className={`badge font-semibold text-white ${
                            c.view === "private" ? "bg-red-400" : "bg-green-400"
                          }`}
                        >
                          {c.view}
                        </span>
                      </div>

                      <p className="text-gray-700 font-sans m-2 line-clamp-2">
                        {c.complain}
                      </p>

                      {/* --- NEW: Student Details Section --- */}
                      {c.studentId && (
                        <div className="bg-gray-50 p-2 rounded-md border border-gray-100 text-xs text-gray-600 mt-1 mb-2 font-mono">
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-800">
                              {c.studentId.name}
                            </span>
                            <span>ID: {c.studentId.studId}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>
                              Dept: {c.studentId.dept} (Sec:{" "}
                              {c.studentId.section})
                            </span>
                            <span>Session: {c.studentId.session}</span>
                          </div>
                        </div>
                      )}

                      {c.response && (
                        <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
                          <strong>Decision:</strong> {c.response}
                        </div>
                      )}
                      <div className="card-actions justify-end">
                        {c.status === "resolved" && (
                          <span className="badge bg-green-500 p-3 text-white">
                            Solved
                          </span>
                        )}
                        {c.status === "rejected" && (
                          <span className="badge bg-red-500 p-3 text-white">
                            Rejected
                          </span>
                        )}
                        {c.status === "approved" && (
                          <span className="badge bg-cyan-500 p-3 text-white">
                            Forwarded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* MODAL 3: FORWARD */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">
              ✕
            </button>
          </form>

          {selectedComplain && (
            <>
              <div className="flex gap-4">
                <h2 className="card-title">{selectedComplain.title}</h2>
                <span
                  className={`badge font-semibold text-white ${
                    selectedComplain.view === "private"
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                >
                  {selectedComplain.view}
                </span>
              </div>

              <div className="flex-1 my-2">
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

              <div className="m-4">
                <label
                  htmlFor="role"
                  className="block mb-1 font-medium text-gray-700"
                >
                  Assign To:
                </label>
                <select
                  id="role"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={forwardRole}
                  onChange={(e) => setForwardRole(e.target.value)}
                >
                  <option value="">-- Select Role --</option>
                  <option value="chairman">Chairman</option>
                  <option value="deen">Deen</option>
                  <option value="vc">VC</option>
                </select>
              </div>

              <button
                onClick={() => handleUpdateStatus("pending")}
                className="flex items-center justify-center gap-2 bg-cyan-600 w-full py-2 hover:bg-cyan-500 rounded-full text-white font-semibold"
              >
                Forward Complaint
              </button>
            </>
          )}
        </div>
      </dialog>

      {/* MODAL 4: SOLUTION */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">
              ✕
            </button>
          </form>

          {selectedComplain && (
            <>
              <div className="flex gap-4">
                <h2 className="card-title">{selectedComplain.title}</h2>
              </div>

              <div className="flex-1 my-2">
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

              <fieldset className="fieldset rounded py-4 mb-2">
                <legend className="fieldset-legend text-[14px] font-sans">
                  Solution Comment
                </legend>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Write the resolution here..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </fieldset>

              <button
                onClick={() => handleUpdateStatus("resolved")}
                className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold"
              >
                Mark as Solved
              </button>
            </>
          )}
        </div>
      </dialog>

      {/* MODAL 5: REJECT */}
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 text-2xl top-2">
              ✕
            </button>
          </form>

          {selectedComplain && (
            <>
              <div className="flex gap-4">
                <h2 className="card-title text-red-600">
                  {selectedComplain.title}
                </h2>
              </div>

              <div className="flex-1 my-2">
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

              <fieldset className="fieldset rounded py-4 mb-2">
                <legend className="fieldset-legend text-[14px] font-sans">
                  Rejection Reason
                </legend>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Why is this being rejected?"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </fieldset>

              <button
                onClick={() => handleUpdateStatus("rejected")}
                className="flex items-center justify-center gap-2 bg-red-600 w-full py-2 hover:bg-red-500 rounded-full text-white font-semibold"
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
