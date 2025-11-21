import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const AdminHome = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProblems = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/problems");
  //       const data = await res.json();
  //       setProblems(data);
  //     } catch (error) {
  //       console.error("Error fetching problems:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProblems();
  // }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const fakeBackendData = [
        {
          id: 1,
          title: "AC Problem",
          description: "AC not cooling properly in room 203.",
        },
        {
          id: 2,
          title: "AC Problem",
          description: "Water leaking from indoor unit.",
        },
        {
          id: 3,
          title: "AC Problem",
          description: "Outdoor unit making loud noise.",
        },
      ];

      setProblems(fakeBackendData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className=" flex gap-12 justify-center items-center min-h-screen  bg-gray-200">
      {/* problems dashboard */}
      <div className="w-[700px] shadow-2xl bg-white h-80 rounded-2xl p-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">All Problems</h2>

        {loading && <p>Loading...</p>}

        {!loading && problems.length === 0 && (
          <p className="text-red-500">No problems found.</p>
        )}

        {!loading &&
          problems.map((problem) => (
            <div
              key={problem.id}
              className="p-3 mb-6  rounded-lg shadow-sm bg-gray-100"
            >
              <p className="font-semibold mb-2">{problem.title}</p>
              <p className="text-sm text-gray-600 font-medium">
                {problem.description}
              </p>
            </div>
          ))}
      </div>

      {/* admin Actions */}
      <div className="bg-white flex flex-col items-center justify-center shadow-2xl p-20 gap-10 text-2xl font-bold rounded-2xl">
        <Link to="admin-create-account" className="btn btn-neutral">
          Create new Account
        </Link>
        <Link to="admin-show-all-account" className="btn btn-neutral">
          Show all Account
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
