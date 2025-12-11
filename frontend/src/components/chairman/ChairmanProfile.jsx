import React from "react";

const ChairmanProfile = () => {
  // Example static data — you can replace with actual props/state/API
  const chairman = {
    name: "Dr. John Doe",
    email: "chairman@example.com",
    phone: "+1 (555) 123-4567",
    department: "Computer Science",
    bio: "Passionate about education and innovation, leading the department with vision and dedication.",
    avatar:
      "https://www.iiuc.ac.bd/assets/cse-DFgQI13j.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={chairman.avatar}
            alt="Chairman Avatar"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {chairman.name}
            </h2>
            <p className="text-gray-600 mt-1">{chairman.department}</p>
            <p className="text-gray-500 mt-1">{chairman.email}</p>
            <p className="text-gray-500 mt-1">{chairman.phone}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 text-gray-700">
          <h3 className="text-lg font-semibold mb-2">About</h3>
          <p>{chairman.bio}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center md:justify-start gap-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Edit Profile
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChairmanProfile;
