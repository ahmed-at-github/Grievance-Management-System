import React from "react";
import { Link } from "react-router";

const AdminNavbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">Admin</Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-neutral">Login</button>
      </div>
    </div>
  );
};

export default AdminNavbar;
