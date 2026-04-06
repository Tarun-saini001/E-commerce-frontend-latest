import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

const UsersList = () => {
  const [users = [], setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(localStorage.getItem("catPage")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 3) {
        setDebouncedSearch(search);
      } else {
        setDebouncedSearch("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async (currentPage = 1, searchQuery = "") => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/service/user/users?page=${currentPage}&limit=6&search=${searchQuery}`, {
        credentials: "include"
      }
      );

      const data = await res.json();
      console.log('fetch all users- ', data);

      setUsers(data.data.users || []);
      setTotalPages(data.data.totalPages || 1);
      setPage(data.data.currentPage || 1);

    } catch (err) {
      console.log("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUsers(page, debouncedSearch);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("catPage", page.toString());
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
        Loading...
      </div>
    );
  }

  const toggleUserStatus = async (userId: string) => {
    try {
      const res = await fetch(
        `${API}/service/user/changeStatus/${userId}`,
        {
          method: "PATCH",
          credentials: "include"
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

  const handleConfirm = async () => {
    if (!selectedUser) return;

    await toggleUserStatus(selectedUser._id);

    setShowModal(false);
    setSelectedUser(null);
  };


  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-[400px]">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {search && (
          <p className="mt-3 text-blue-500 font-medium">
            Showing results for <span className="font-semibold">"{search}"</span>
          </p>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-6">Users List</h1>

      {/* user table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-4 font-semibold p-4 border-b bg-gray-50 text-gray-600">
          <p>Profile</p>
          <p>Name</p>
          <p>Email</p>
          <p>Status</p>
        </div>

        {/* users */}
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500 font-medium">
            <div className="p-10 text-center">
              <p className="text-gray-500 text-lg font-medium">
                No users found
              </p>

            </div>
          </div>
        ) : (users.map((user) => (
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
                onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${user.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${user.isActive ? "translate-x-6" : ""
                    }`}
                />
              </div>

              {/* status text */}
              <span
                className={`font-medium ${user.isActive ? "text-green-600" : "text-red-500"
                  }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

            </div>
          </div>
        ))
        )}
      </div>

      {/* page */}
      <div className="flex justify-center items-center gap-3 mt-6">

        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded cursor-pointer ${page === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
        >
          Next
        </button>

      </div>
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-lg p-6 w-[350px] text-center">

            <h2 className="text-xl font-semibold mb-2">
              {selectedUser.isActive ? "Deactivate User" : "Activate User"}
            </h2>

            <p className="text-gray-600 mb-6">
              {selectedUser.isActive
                ? "This user will not be able to login."
                : "This user will be able to login."}
              <br />
              Continue?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${selectedUser.isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                {selectedUser.isActive ? "Deactivate" : "Activate"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default UsersList;