import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js";

const UsersInfo = () => {
  const { id } = useParams(); // get the dynamic user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithRefresh(
          `http://localhost:4000/api/v1/admin/user/${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch user");
        const user = await res.json();

        console.log(user);

        setUser(user.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Student ID: {user.studId}</p>
      <p>Department: {user.dept}</p>
      <p>Section: {user.section}</p>
      <p>Session: {user.session}</p>
      <p>Role: {user.role}</p>
          
    </div>
  );
};

export default UsersInfo;
