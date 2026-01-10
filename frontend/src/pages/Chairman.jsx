import React, { useState, useEffect } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js";
import { useNavigate } from "react-router";

export default function Chairman() {
  const navigate = useNavigate();

  // Data State
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Interaction State
  const [selectedComplain, setSelectedComplain] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [expanded, setExpanded] = useState(false);

  /* ================= INITIAL LOAD ================= */
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
        console.error("Initialization failed:", err);
      }
    };

    initData();
  }, []);

  /* ================= FETCH COMPLAINS ================= */
  const loadComplains = async (userId) => {
    setLoading(true);
    try {
      const publicRes = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      const publicJson = await publicRes.json();

      // Only Chairman-related public complains
      let combinedData = (publicJson.data || []).filter(
        (c) => c.assignedTo === "chairman"
      );

      console.log(publicJson.data); 

      if (userId) {
        const privateRes = await fetchWithRefresh(
          `http://localhost:4000/api/v1/complain/${userId}`
        );
        const privateJson = await privateRes.json();
        combinedData = [...combinedData, ...(privateJson.data || [])];
      }


      setComplains(combinedData);
    } catch (err) {
      console.error("Failed to load complains", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
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
        loadComplains(user?._id);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:4000/api/v1/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const openModal = (id, complain) => {
    setSelectedComplain(complain);
    setExpanded(false);
    setResponseText("");
    document.getElementById(id).showModal();
  };

  /* ================= FILTERS ================= */
  const pendingComplains = complains.filter((c) => c.status === "pending");
  const solvedComplains = complains.filter((c) =>
    ["resolved", "rejected"].includes(c.status)
  );

  return (
    <div className="bg-green-200 h-screen">
      {/* ================= NAVBAR ================= */}
      <div className="navbar bg-base-100 shadow-sm">
        <img
          className="h-16 w-16 rounded-full border"
          src="../src/assets/committee.jpg"
          alt="logo"
        />
        <h1 className="text-xl font-semibold ml-4">
          Chairman Decision Panel
        </h1>
        <button className="btn btn-neutral ml-auto" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="flex gap-4 p-2">
        {/* ================= PENDING ================= */}
        <div className="w-1/2 bg-base-100 rounded shadow p-2 overflow-y-auto">
          <h2 className="text-center text-2xl font-semibold">🔔 Pending</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : pendingComplains.length === 0 ? (
            <p className="text-center text-gray-500">No pending complaints</p>
          ) : (
            pendingComplains.map((c) => (
              <div key={c._id} className="card border mb-3">
                <div className="card-body">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="line-clamp-2">{c.complain}</p>

                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => openModal("solve_modal", c)}
                    >
                      Solve
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => openModal("reject_modal", c)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= SOLVED ================= */}
        <div className="w-1/2 bg-base-100 rounded shadow p-2 overflow-y-auto">
          <h2 className="text-center text-2xl font-semibold">✅ History</h2>

          {solvedComplains.map((c) => (
            <div key={c._id} className="card border mb-3">
              <div className="card-body">
                <h3>{c.title}</h3>
                <p className="line-clamp-2">{c.complain}</p>
                {c.response && (
                  <div className="bg-gray-100 p-2 rounded">
                    <strong>Decision:</strong> {c.response}
                  </div>
                )}
                <span
                  className={`badge ${
                    c.status === "resolved"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SOLVE MODAL ================= */}
      <dialog id="solve_modal" className="modal">
        <div className="modal-box">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Write solution..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <button
            className="btn btn-success w-full mt-2"
            onClick={() => handleUpdateStatus("resolved")}
          >
            Confirm Solve
          </button>
        </div>
      </dialog>

      {/* ================= REJECT MODAL ================= */}
      <dialog id="reject_modal" className="modal">
        <div className="modal-box">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Rejection reason..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <button
            className="btn btn-error w-full mt-2"
            onClick={() => handleUpdateStatus("rejected")}
          >
            Confirm Reject
          </button>
        </div>
      </dialog>
    </div>
  );
}
