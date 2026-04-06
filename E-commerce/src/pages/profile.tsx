import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(false);

  if (!user) return null;


  const handleUpdateName = async () => {
    try {
      const res = await fetch(`${API}/service/user/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Name updated");
        await refreshUser();
        setIsEditing(false);
      } else {
        toast.error(data.message, {
          id: "update-profile-error"
        });
      }
    } catch (err) {
      toast.error("Error updating name", {
        id: "server-error"
      });
    }
  };


  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await fetch(`${API}/service/user/uploadProfile`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated");
        await refreshUser();
      } else {
        toast.error(data.message, {
          id: "update-profile-error"
        });
      }
    } catch (err) {
      toast.error("Upload failed", {
        id: "upload-profile-error"
      });
    }
  };

  const handleLogout = async () => {
    setShowModal(false);
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-[40%] rounded-2xl shadow-lg p-8 flex flex-col items-center gap-3">


        <img
          src={
            user.profilePic
              ? `${API}${user.profilePic}`
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="profile"
          onClick={() => setPreview(true)}
          className="w-28 h-28 rounded-full object-cover cursor-pointer border"
        />

        <label className="text-blue-600 cursor-pointer text-sm">
          Change Profile Picture
          <input
            type="file"
            hidden
            onChange={handleImageUpload}
          />
        </label>


        {isEditing ? (
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-1 rounded-md"
            />
            <button
              onClick={handleUpdateName}
              className="bg-black text-white px-3 rounded-md"
            >
              Save
            </button>
          </div>
        ) : (
          <h2
            onClick={() => setIsEditing(true)}
            className="text-xl font-semibold cursor-pointer hover:text-blue-600"
          >
            {user.name}
          </h2>
        )}


        <p className="text-gray-500">{user.email}</p>

        {/* change password */}
        <div className="w-full flex flex-col items-center gap-3 mt-4">

          <button
            onClick={() => navigate("/change-password")}
            className="w-[70%] items-center flex justify-center bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Change Password
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* logout confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[320px] text-center">
            <h2 className="text-lg font-semibold mb-2">Logout</h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {preview && (
        <div
          onClick={() => setPreview(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <img
            src={
              user.profilePic
                ? `${API}${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="w-80 h-80 object-cover rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;