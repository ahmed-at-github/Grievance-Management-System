import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGavel } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center px-4 py-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        {/* Main Container - Glassmorphism */}
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl border border-white/40 p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
              <FaGavel className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Grievance Portal
            </h1>
            <p className="text-gray-600 text-sm">Secure access to your grievance management system</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              <input
                type="email"
                className="w-full px-5 py-3 bg-white/50 border-2 border-cyan-200/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:border-cyan-400 focus:bg-white/80 transition-all duration-200 backdrop-blur-sm"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
              <input
                type="password"
                className="w-full px-5 py-3 bg-white/50 border-2 border-cyan-200/50 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:border-cyan-400 focus:bg-white/80 transition-all duration-200 backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {message && (
              <div className="p-4 bg-red-100/60 backdrop-blur-sm border-2 border-red-300 rounded-xl text-red-700 text-sm font-medium">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cyan-300"></div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cyan-300"></div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-600 text-xs mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
