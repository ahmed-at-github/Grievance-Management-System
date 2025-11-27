import React from "react";
import { Link } from "react-router";

const ChairmanNav = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to={"/chairman"} className="btn btn-ghost text-xl">
          Chairman
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-neutral">Logout</button>
      </div>
    </div>
  );
};

export default ChairmanNav;
