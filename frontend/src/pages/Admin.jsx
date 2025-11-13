import React from "react";
import AdminNavbar from "../components/admin/AdminNavbar";
import { Outlet } from "react-router";

const Admin = () => {
  return (
    <>
      <AdminNavbar></AdminNavbar>
      <Outlet></Outlet>
    </>
  );
};

export default Admin;
