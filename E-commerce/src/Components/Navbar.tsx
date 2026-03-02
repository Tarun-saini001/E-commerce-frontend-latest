import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white h-[8%] rounded p-2 text-black flex my-3 mx-5 shadow justify-between">
            <p
                onClick={() => navigate("/")}
                className="text-sm pl-10 font-bold cursor-pointer"
            >
                TS Mart
            </p>

            <nav className="flex justify-center items-center pr-10 w-[60%]">
                <ul className="flex font-bold space-x-8">
                    <li onClick={() => navigate("/")} className="cursor-pointer">
                        Home
                    </li>
                    <li onClick={() => navigate("/about")} className="cursor-pointer">
                        About Us
                    </li>
                    <li onClick={() => navigate("/contact-us")} className="cursor-pointer">
                        Contact Us
                    </li>
                </ul>
            </nav>

            <span className="flex space-x-4 pr-2 relative" ref={dropdownRef}>
                {isAuthenticated ? (
                    <div
                        onClick={() => navigate("/profile")}
                        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center cursor-pointer"
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <>
                        <button
                            className="bg-white text-black w-20 shadow rounded-md"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                        <button
                            className="bg-white text-black w-20 shadow rounded-md"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </>
                )}
            </span>
        </div>
    );
};

export default Navbar;