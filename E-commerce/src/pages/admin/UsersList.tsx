import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/service/user/users`,{
          credentials:"include"
        }
      );

      const data = await res.json();
      console.log('fetch all users- ', data);

      setUsers(data.data);
    } catch (err) {
      console.log("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch(
        `${API}/service/user/changeStatus/${userId}`,
        {
          method: "PATCH",
          credentials:"include"
        }
      );

      const data = await res.json();
      console.log('user status changed', data);

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isActive: !user.isActive }
              : user
          )
        );
      } else {
        console.log("Failed to change status:", data);
      }
    } catch (err) {
      console.log("Error updating user", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users List</h1>

      {/* user table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-4 font-semibold p-4 border-b bg-gray-100">
          <p>Profile</p>
          <p>Name</p>
          <p>Email</p>
          <p>Status</p>
        </div>

        {/* users */}
        {users.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-4 items-center p-4 border-b"
          >
            {/* profile */}
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* name */}
            <p className="font-medium">{user.name}</p>

            {/* email */}
            <p>{user.email}</p>

            {/* status */}
            <div className="flex items-center gap-3">
              
              <div
                onClick={() => toggleUserStatus(user._id)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  user.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                    user.isActive ? "translate-x-6" : ""
                  }`}
                />
              </div>

              {/* status text */}
              <span
                className={`font-medium ${
                  user.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;