import React from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const loginRes = await fetch("http://localhost:4000/api/v1/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    let msg = await loginRes.json();
    console.log(msg);

    localStorage.removeItem("accessToken");
     toast.success("Logout Successful", {
              theme: "light",
            });
    navigate("/");
  };
  return (
    <header className="bg-gradient-to-r from-slate-700 to-slate-900 border-b border-slate-700 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Logo & Title */}
          <Link to={"/admin"} className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity min-w-0">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 flex-shrink-0">
              <svg className="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div className="border-l border-slate-600 pl-2 sm:pl-4 min-w-0">
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">Grievance Management</h1>
              <p className="text-xs sm:text-sm text-slate-300 truncate">Admin Portal</p>
            </div>
          </Link>

          {/* Right Section - Logout */}
          <button 
            className="px-3 sm:px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex-shrink-0 whitespace-nowrap"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
