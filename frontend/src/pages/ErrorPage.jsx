
import React from "react";
import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="my-14 flex justify-center items-center">
      <title>Error-404</title>
      <div className="flex flex-col justify-center items-center gap-2">
        {/* <img src={errImg} alt="error" /> */}
        <h2 className="text-5xl font-semibold  text-[#001931]">
          Oops, page not found!
        </h2>
        <p className="text-[#001931] text-lg">
          {error.status} — The page you are looking for is not available.
        </p>
        <Link
          to="/"
          className="btn bg-linear-to-r from-[#632EE3] to-[#9F62F2] text-white"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;