import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router";
import { fetchWithRefresh } from "../../utils/fetchUtil";

const AdminShowAllAccount = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/admin/users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // If your API requires authorization, uncomment below:
            // "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const { data } = await res.json();
      console.log(data);

      // Assuming your API returns an array in data.users
      setAccounts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this account? This action cannot be undone."
    );

    if (!confirmed) return; // user canceled

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/admin/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // If your API requires authorization:
            // "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      alert("Account deleted successfully!");
      // Optional: remove the deleted account from state so UI updates
      fetchAccounts();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the account.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-20 rounded-2xl">
      <ul className="list bg-base-100 rounded-box shadow-2xl">
        <li className="p-10 pb-2 text-2xl opacity-60 tracking-wide">
          All the students Accounts are given below:
        </li>

        {accounts.map((account, index) => (
          <li key={account._id} className="list-row">
            <div className="text-4xl font-thin opacity-40 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="list-col-grow">
              <div>{account.name}</div>
              <div className="text-xs font-semibold opacity-60">
                {account.email}
              </div>
              <div className="text-xs uppercase font-semibold opacity-60">
                {account.role}
              </div>
            </div>
            <button
              onClick={() => handleDelete(account._id)}
              className="btn btn-square btn-ghost"
            >
              <MdOutlineDeleteOutline />
            </button>
            <button
              onClick={() => handleEdit(account._id)}
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
