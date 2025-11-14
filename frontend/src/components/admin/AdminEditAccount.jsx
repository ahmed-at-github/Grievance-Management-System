import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

const AdminEditAccount = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchedData = {
      id,
      name: "Ariana Smith",
      email: "ariana.smith@example.com",
      department: "Computer Science",
      section: "A",
      session: "2022–2023",
      role: "Student",
    };
    setAccount(fetchedData);
  }, [id]);

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Account:", account);
    alert(`Account for ${account.name} updated successfully!`);
  };

  if (!account)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-2xl font-medium"
      >
        <legend className="fieldset-legend font-semibold text-lg">
          Edit Account (ID: {id})
        </legend>

        <label className="label">Name</label>
        <input
          type="text"
          name="name"
          value={account.name}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Email</label>
        <input
          type="email"
          name="email"
          value={account.email}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Department</label>
        <input
          type="text"
          name="department"
          value={account.department}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Section</label>
        <input
          type="text"
          name="section"
          value={account.section}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Session</label>
        <input
          type="text"
          name="session"
          value={account.session}
          onChange={handleChange}
          className="input"
        />

        <label className="label">Role</label>
        <input
          type="text"
          name="role"
          value={account.role}
          onChange={handleChange}
          className="input"
        />

        <button type="submit" className="btn btn-neutral mt-4 w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminEditAccount;
