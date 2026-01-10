import React from "react";
import { NavLink } from "react-router";
import logo from "../../assets/iiuclogo.png";

const ChairmanNav = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1 flex items-center pl-5">
        <img src={logo} className="w-9  h-9" alt="" />
        <NavLink to={"/chairman"} className="btn btn-ghost text-xl">
          Chairman
        </NavLink>
      </div>
      <div className="flex-none">
        <div className="menu menu-horizontal px-4 flex items-center gap-5">
          <NavLink to={"profile"} className="font-semibold">Profile</NavLink>
          <NavLink className="btn btn-neutral font-medium" to={""}>Logout</NavLink>
        </div>
      </div>
    </div>
  );
};

export default ChairmanNav;
