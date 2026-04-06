import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log('user.name: ', user.name);
  return (
    <div className="  flex flex-col items-center justify-center h-screen  gap-5 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl text-center w-[350px]">

            <h2 className="text-xl font-semibold mb-2">
              Logout
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 cursor-pointer border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;