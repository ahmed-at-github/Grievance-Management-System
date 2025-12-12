import React from "react";
import ChairmanNav from "../components/chairman/ChairmanNav";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const Chairman = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <ChairmanNav></ChairmanNav>
      </div>
      <main className="grow">
        <Outlet></Outlet>
      </main>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Chairman;
