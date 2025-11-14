import React from "react";
import { Link } from "react-router";

const AdminHome = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen  bg-gray-200">
      <div className="flex flex-col items-center justify-center shadow-2xl p-20 gap-10 text-2xl font-bold rounded-2xl">
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
