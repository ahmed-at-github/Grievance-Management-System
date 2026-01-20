import React, { useEffect, useState } from "react";
import { FaRegEdit, FaTrash } from "react-icons/fa";
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
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const { data } = await res.json();
      console.log(data);
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

    if (!confirmed) return;

    try {
      const res = await fetchWithRefresh(
        `http://localhost:4000/api/v1/admin/user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete account");
      }

      alert("Account deleted successfully!");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Page Title Section */}
      <div className="bg-indigo-50 border-b border-gray-100 mb-8">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h2 className="text-3xl font-bold text-gray-900">All Accounts</h2>
          <p className="text-gray-600 text-sm mt-1">Manage student and staff accounts</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-indigo-400">
          {accounts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No accounts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr key={account._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="font-semibold text-gray-900">{account.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{account.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          account.role === "student" ? "bg-blue-100 text-blue-700" :
                          account.role === "chairman" ? "bg-purple-100 text-purple-700" :
                          account.role === "admin" ? "bg-red-100 text-red-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {account.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(account._id)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FaRegEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminShowAllAccount;
