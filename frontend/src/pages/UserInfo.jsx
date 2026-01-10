import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithRefresh } from "../utils/fetchUtil.js";
import AdminNabar from "../components/admin/AdminNavbar.jsx"

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
    <>

   <AdminNabar/>
    <div className="flex justify-center items-center min-h-screen py-20 rounded-2xl">
      <ul className="list bg-base-100 rounded-box shadow-2xl p-10">
        <li className="p-5 pb-2 text-2xl opacity-60 tracking-wide">
          Student Account Details
        </li>

        <li className="list-row">
          <div className="text-4xl font-thin opacity-40 tabular-nums">01</div>
          <div className="list-col-grow space-y-2">
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-xs font-semibold opacity-60">
              Email: {user.email}
            </div>
            <div className="text-xs font-semibold opacity-60">
              Student ID: {user.studId}
            </div>
            <div className="text-xs font-semibold opacity-60">
              Department: {user.dept}
            </div>
            <div className="text-xs font-semibold opacity-60">
              Section: {user.section}
            </div>
            <div className="text-xs font-semibold opacity-60">
              Session: {user.session}
            </div>
            <div className="text-xs font-semibold opacity-60">
              Role: {user.role}
            </div>
          </div>
        </li>
      </ul>
    </div>
     </>
  );
};

export default UsersInfo;
