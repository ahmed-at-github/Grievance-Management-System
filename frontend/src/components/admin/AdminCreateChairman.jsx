import React, { useState } from "react";

const AdminCreateChairman = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch(
        "http://localhost:4000/api/chairman/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Chairman account created successfully!");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error || "Something went wrong!");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-base-200 rounded-2xl shadow-2xl p-10 flex flex-col gap-5">
        <h2 className="">Create Chairman</h2>
        {message && <p className="text-center text-red-500">{message}</p>}
        {/* <label className="label">Email</label>
        <input type="email" className="input" placeholder="Email" /> */}
        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} //
        />
        {/* <label className="label">Password</label>
        <input type="password" className="input" placeholder="Password" /> */}
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-neutral mt-4" onClick={handleSubmit}>
          create
        </button>
      </div>
    </div>
  );
};

export default AdminCreateChairman;
