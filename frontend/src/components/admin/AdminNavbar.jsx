import React from "react";
import { Link, useNavigate } from "react-router";

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
    navigate("/");
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to={"/admin"} className="btn btn-ghost text-xl">
          Admin
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-neutral" onClick={handleLogout}>
          Logout{" "}
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
