import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

const AdminShowAllAccount = () => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin-edit-account/${id}`);
  };

  const accounts = [
    {
      id: 1,
      name: "Ariana Smith",
      department: "Computer Science",
      section: "A",
      session: "2022–2023",
      role: "Student",
    },
    {
      id: 2,
      name: "Michael Chen",
      department: "Electrical Engineering",
      section: "B",
      session: "2021–2022",
      role: "Student",
    },
    {
      id: 3,
      name: "Sophia Ahmed",
      department: "Business Administration",
      section: "C",
      session: "2023–2024",
      role: "Student",
    },
    {
      id: 4,
      name: "Ethan Johnson",
      department: "Mechanical Engineering",
      section: "D",
      session: "2022–2023",
      role: "Student",
    },
    {
      id: 5,
      name: "Isabella Garcia",
      department: "Architecture",
      section: "A",
      session: "2023–2024",
      role: "Student",
    },
    {
      id: 6,
      name: "Noah Brown",
      department: "Civil Engineering",
      section: "B",
      session: "2021–2022",
      role: "Student",
    },
    {
      id: 7,
      name: "Olivia Martinez",
      department: "Mathematics",
      section: "A",
      session: "2022–2023",
      role: "Student",
    },
    {
      id: 8,
      name: "William Davis",
      department: "Physics",
      section: "C",
      session: "2023–2024",
      role: "Student",
    },
    {
      id: 9,
      name: "Emma Wilson",
      department: "Software Engineering",
      section: "D",
      session: "2023–2024",
      role: "Student",
    },
    {
      id: 10,
      name: "Liam Taylor",
      department: "Computer Science",
      section: "A",
      session: "2022–2023",
      role: "Student",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen py-20 rounded-2xl">
      <ul className="list bg-base-100 rounded-box shadow-2xl">
        <li className="p-10 pb-2 text-2xl opacity-60 tracking-wide">
          All the students Accounts are given below:
        </li>

        {accounts.map((account, index) => (
          <li key={index} className="list-row">
            <div className="text-4xl font-thin opacity-40 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="list-col-grow">
              <div>{account.name}</div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {account.department}
              </div>
            </div>
            <button
              onClick={() => handleEdit(account.id)}
              className="btn btn-square btn-ghost"
            >
              <FaRegEdit />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminShowAllAccount;
