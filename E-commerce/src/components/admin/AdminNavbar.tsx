import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { paths } from "../../constants/paths";

const AdminNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate(paths.HOME);
    };

    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#182646] shadow px-6 flex justify-between items-center z-10">


            <div
                onClick={() => navigate(paths.ADMIN)}
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

            {/* profile */}
            <div className="relative" ref={dropdownRef}>


                <div
                    onClick={() => setOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </div>


                {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-4 z-50">

                        <div className="mb-3 flex flex-col justify-center items-center gap-3">
                            <p className="font-semibold text-gray-800">
                                {user?.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>



                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full  px-3 py-2 rounded-lg text-center text-white bg-red-400 hover:bg-red-500 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
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
        </div>
    );
};

export default AdminNavbar;