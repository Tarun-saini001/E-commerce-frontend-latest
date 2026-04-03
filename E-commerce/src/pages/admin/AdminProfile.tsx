import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; 

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
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;