
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCartShopping } from "react-icons/fa6";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // 

    return (
        <div className="bg-white h-[8%] rounded p-2 text-black flex my-3 mx-5 shadow justify-between">
            <p
                onClick={() => navigate("/")}
                className="text-sm pl-10 text-blue-500 font-bold gap-4 flex justify-center items-center cursor-pointer"
            >
                TS Mart
                <FaCartShopping />
            </p>

            <nav className="flex justify-center items-center pr-10 w-[60%]">
                <ul className="flex font-bold space-x-8">
                    {isAuthenticated && user?.role === 1 && (
                        <li
                            className="cursor-pointer text-black font-bold"
                            onClick={() => navigate("/admin")}
                        >
                            Dashboard
                        </li>
                    )}
                    <li onClick={() => navigate("/")} className="cursor-pointer text-blue-500">
                        Home
                    </li>

                </ul>
            </nav>

            <span className="flex space-x-4 pr-2 relative">

                {isAuthenticated && (
                    <div
                        onClick={() => navigate("/cart")}
                        className="cursor-pointer  text-xl flex items-center"
                    >
                        <FaCartShopping />
                    </div>
                )}
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