import React, { useState } from "react";
import { fetchWithRefresh } from "../../utils/fetchUtil";

const AdminCreateAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studId: "",
    password: "",
    section: "",
    dept: "",
    session: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      const res = await fetchWithRefresh(
        "http://localhost:4000/api/v1/create-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        alert("Account created successfully!");
        setFormData({
          name: "",
          email: "",
          studId: "",
          section: "",
          password: "",
          dept: "",
          session: "",
          role: "",
        });
      } else {
        alert("Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error("Error: ", err);
      alert("Something went worng. Check your server connection");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-2xl font-medium"
      >
        <legend className="fieldset-legend font-semibold text-lg">
          Account Details
        </legend>

        <label className="label">Name</label>
        <input
          type="text"
          className="input"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <label className="label">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input"
          placeholder="email@email.com"
        />

        <label className="label">Student Id:</label>
        <input
          type="text"
          className="input"
          placeholder="Student ID:"
          name="studId"
          value={formData.studId}
          onChange={handleChange}
          required
        />

        <label className="label">Section</label>
        <input
          type="text"
          className="input"
          placeholder="Section:"
          name="section"
          onChange={handleChange}
          value={formData.section}
          required
        />

        <label className="label">Department:</label>
        <input
          type="text"
          className="input"
          placeholder="Department"
          name="dept"
          value={formData.dept}
          onChange={handleChange}
          required
        />

        <label className="label">Session</label>
        <input
          type="text"
          className="input"
          placeholder="Session:"
          name="session"
          value={formData.session}
          onChange={handleChange}
          required
        />

        <label className="label">Role</label>
        <input
          type="text"
          className="input"
          placeholder="Role:"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <button type="submit" className="mt-4 w-full btn-neutral btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminCreateAccount;
