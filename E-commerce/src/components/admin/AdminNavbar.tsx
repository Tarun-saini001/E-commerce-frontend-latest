import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#182646]  shadow px-6 flex justify-between items-center z-10">

            <div
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 pl-6 cursor-pointer"
            >
                <img
                    src="/logo.avif"
                    alt="TS Mart Logo"
                    className="h-12 w-12 object-contain rounded-full"
                />

                <span className="text-xl font-bold text-sky-500">
                    TS Mart
                </span>
            </div>

            <div
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center cursor-pointer"
            >
                {user?.name?.charAt(0).toUpperCase()}
            </div>
        </div>
    );
};

export default AdminNavbar;