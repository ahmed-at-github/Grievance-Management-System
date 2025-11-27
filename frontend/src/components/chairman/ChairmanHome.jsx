// import React, { useEffect, useState } from "react";
// import { fetchWithRefresh } from "../../utils/fetchUtil.js";

// const ChairmanHome = () => {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch complains from backend
//   //   useEffect(() => {
//   //     const loadComplains = async () => {
//   //       try {
//   //         setLoading(true);

//   //         const res = await fetchWithRefresh(
//   //           "http://localhost:4000/api/v1/complain/"
//   //         );
//   //         const json = await res.json();

//   //         if (!res.ok) {
//   //           setError(json.message || "Failed to fetch complains.");
//   //           return;
//   //         }

//   //         // Sort descending (newest first)
//   //         const sorted = [...json.data].sort(
//   //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   //         );

//   //         setProblems(sorted);
//   //         setError("");
//   //       } catch (err) {
//   //         console.error("Error fetching complains:", err);
//   //         setError("Network error. Failed to load complains.");
//   //       } finally {
//   //         setLoading(false);
//   //       }
//   //     };

//   //     loadComplains();
//   //   }, []);

//   useEffect(() => {
//     const loadComplains = async () => {
//       setLoading(true);

//       // 👉 TEST DATA (only for testing)
//       const testData = [
//         {
//           _id: "1",
//           title: "Broken Fan",
//           complain: "The fan in classroom 203 is not working.",
//           status: "pending",
//           createdAt: "2025-01-15T10:30:00Z",
//         },
//         {
//           _id: "2",
//           title: "Water Leakage",
//           complain: "There is a leak in the boys' washroom.",
//           status: "resolved",
//           createdAt: "2025-01-14T09:10:00Z",
//         },
//         {
//           _id: "3",
//           title: "Projector Issue",
//           complain: "Projector not turning on in room 105.",
//           status: "pending",
//           createdAt: "2025-01-16T08:45:00Z",
//         },
//       ];

//       const sorted = [...testData].sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setProblems(sorted);
//       setError("");
//       setLoading(false);
//     };

//     loadComplains();
//   }, []);

//   return (
//     <div className="flex gap-12 justify-center items-center min-h-screen bg-gray-200">
//       {/* All problems dashboard */}
//       <div className="w-[700px] shadow-2xl bg-white h-80 rounded-2xl p-10 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">All Problems</h2>

//         {loading && <p>Loading...</p>}

//         {error && !loading && (
//           <p className="text-red-600 font-semibold">{error}</p>
//         )}

//         {!loading && !error && problems.length === 0 && (
//           <p className="text-red-500">No problems found.</p>
//         )}

//         {!loading &&
//           !error &&
//           problems.map((p) => (
//             <div
//               key={p._id}
//               className="p-3 mb-6 rounded-lg shadow-sm bg-gray-100"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <p className="font-semibold">{p.title}</p>
//                 <span
//                   className={`text-sm px-2 py-1 rounded-full font-medium ${
//                     p.status === "pending"
//                       ? "bg-yellow-200 text-yellow-700"
//                       : p.status === "resolved"
//                       ? "bg-green-200 text-green-800"
//                       : "bg-gray-300 text-gray-700"
//                   }`}
//                 >
//                   {p.status}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-700">{p.complain}</p>

//               <p className="text-xs text-gray-500 mt-2">
//                 {new Date(p.createdAt).toLocaleString([], {
//                   dateStyle: "short",
//                   timeStyle: "short",
//                 })}
//               </p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default ChairmanHome;

import React, { useEffect, useState } from "react";

const ChairmanHome = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [solutionInput, setSolutionInput] = useState("");

  // Test data
  const testData = [
    {
      _id: "1",
      title: "Broken Fan",
      complain: "The fan in classroom 203 is not working.",
      status: "pending",
      createdAt: "2025-01-15T10:30:00Z",
    },
    {
      _id: "2",
      title: "Water Leakage",
      complain: "There is a leak in the boys' washroom.",
      status: "resolved",
      createdAt: "2025-01-14T09:10:00Z",
      solution: "Fixed the pipe and cleaned the area.",
    },
    {
      _id: "3",
      title: "Projector Issue",
      complain: "Projector not turning on in room 105.",
      status: "pending",
      createdAt: "2025-01-16T08:45:00Z",
    },
  ];

  // Load test data
  useEffect(() => {
    setLoading(true);
    const sorted = [...testData].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setProblems(sorted);
    setLoading(false);
  }, []);

  // Open modal with selected problem
  const openModal = (problem) => {
    if (problem.status === "pending") {
      setSelectedProblem(problem);
      setSolutionInput(problem.solution || "");
      setModalOpen(true);
    }
  };

  // Submit solution (update test data)
  const submitSolution = () => {
    setProblems((prev) =>
      prev.map((p) =>
        p._id === selectedProblem._id
          ? { ...p, solution: solutionInput, status: "resolved" }
          : p
      )
    );
    setModalOpen(false);
    setSelectedProblem(null);
    setSolutionInput("");
  };

  return (
    <div className="flex gap-12 justify-center items-center min-h-screen bg-gray-200">
      <div className="w-[700px] shadow-2xl bg-white h-auto rounded-2xl p-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">All Problems</h2>

        {loading && <p>Loading...</p>}

        {!loading && problems.length === 0 && (
          <p className="text-red-500">No problems found.</p>
        )}

        {!loading &&
          problems.map((p) => (
            <div
              key={p._id}
              className={`p-3 mb-6 rounded-lg shadow-sm bg-gray-100 cursor-pointer hover:bg-gray-200`}
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

              <p className="text-sm text-gray-700">{p.complain}</p>

              {p.solution && (
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Solution:</strong> {p.solution}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {new Date(p.createdAt).toLocaleString([], {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}

        {/* Modal */}
        {modalOpen && selectedProblem && (
          <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-96 relative">
              <h3 className="text-lg font-bold mb-4">
                {selectedProblem.title}
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                {selectedProblem.complain}
              </p>

              <label className="block mb-2 font-medium">Solution:</label>
              <input
                type="text"
                className="input input-bordered w-full mb-4"
                value={solutionInput}
                onChange={(e) => setSolutionInput(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="btn  btn-error"
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedProblem(null);
                    setSolutionInput("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn  btn-success" onClick={submitSolution}>
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
