import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      //  Login request
      const loginRes = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies if backend sets httpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setMessage(loginData.message || "Login failed");
        return;
      }

      // Save token (if backend returns it)
      const token = loginData.accessToken;
      localStorage.setItem("accessToken", token);

      // Call /me endpoint with token
      const meRes = await fetch("http://localhost:4000/api/v1/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const meData = await meRes.json();

      console.log(meData.data);

      if (!meRes.ok) {
        setMessage(meData.message || "Failed to get user info");
        return;
      }

      //Check role
      if (meData.data.role === "admin") {
        navigate("/admin"); // redirect admin to admin page
      } else if (meData.data.role === "student") {
        navigate("/student");
      } else if (meData.data.role === "chairman") {
        navigate("/chairman");
      }else if (meData.data.role === "decision committee") {
        navigate("/decision");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {message && (
                  <p className="mt-2 text-sm text-red-500">{message}</p>
                )}

                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>

                <button type="submit" className="btn btn-neutral mt-4">
                  Login
                </button>

                <button className="mt-4" type="button">
                  Don't have an account?{" "}
                  <span className="text-sm font-bold hover:underline">
                    Register
                  </span>
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
