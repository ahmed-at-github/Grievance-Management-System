import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js"; // adjust path
import { useNavigate } from "react-router";

export default function Student() {
  const [title, setTitle] = useState("");
  const [complainText, setComplainText] = useState("");
  const [complains, setComplains] = useState([]);
  const navigate = useNavigate();

  // ===== Fetch all complains =====
  const loadComplains = async () => {
    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/"
      );
      const response = await res.json();

      // Sort by createdAt ascending (oldest first)
      const sortedComplains = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      console.log(sortedComplains);

      setComplains(sortedComplains);
    } catch (err) {
      console.error("Failed to fetch complains:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadComplains();
    };
    init();
  }, []);

  // ===== Create complain (POST) =====
  const handleSend = async () => {
    if (!title || !complainText) return alert("Please fill all fields");

    const body = {
      title,
      complain: complainText,
    };

    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/complain/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        console.log(res);

        alert(response.message || "Failed to submit complain");
        return;
      }

      setTitle("");
      setComplainText("");
      loadComplains();

      alert("Complain submitted successfully!");
    } catch (err) {
      console.error("Error sending complain:", err);
      alert("Failed to send complain");
    }
  };

  const handleLogout = async () => {
    const loginRes = await fetch("http://localhost:4000/api/v1/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    let msg = await loginRes.json();
    console.log(msg);

    localStorage.removeItem("accessToken");
    navigate("/");
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

      <div className="m-4">
        <div className="flex flex-wrap items-center m-4 gap-6">
          <div className="flex items-center gap-4">
            <img
              className="h-20 w-20 rounded-full object-cover border-2 border-blue-200"
              src="../src/assets/cartoon-illustration-scholar-academic_272293-4645.jpeg"
            />
            <h1 className="my-2 font-semibold text-xl">Student Panel</h1>
            <button className="btn btn-neutral" onClick={handleLogout}>
              Logout{" "}
            </button>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold">Navbar</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Complains */}
          <div className="flex-1 min-w-[300px]">
            <div className="card bg-base-100 shadow-sm p-4">
              <h2 className="card-title text-2xl font-bold mb-4">
                Previous Messages
              </h2>

              {complains.length === 0 ? (
                <p className="text-gray-500">No complains yet.</p>
              ) : (
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                  {complains.map((c) => (
                    <div
                      key={c._id}
                      className="border rounded-lg p-4 shadow hover:shadow-md transition duration-150"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{c.title}</h4>
                        <span
                          className={`px-2 py-1 text-sm font-semibold rounded-full ${
                            c.status === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : c.status === "resolved"
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">{c.complain}</p>

                      <div className="flex justify-between text-sm text-gray-500">
                        <span className="italic">{c.category}</span>
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

          {/* Right: Input */}
          <div className="flex-1 min-w-[300px]">
            <fieldset className="fieldset rounded py-4 mb-4">
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

            <fieldset className="fieldset w-full mb-4">
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

            <button
              onClick={handleSend}
              className="flex items-center justify-center gap-2 bg-green-500 w-full py-2 hover:bg-green-400 rounded-full text-white font-semibold transition duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M3.4 20.4 22 12 3.4 3.6 3 10l12 2-12 2z" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
