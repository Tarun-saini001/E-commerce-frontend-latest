
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();


    const { items } = useSelector((state: RootState) => state.cart);
    

    return (
        <div className="bg-white h-[8%] rounded p-2 transition hover:shadow-xl text-black flex my-3 mx-5 shadow justify-between">
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
                    <span className="relative flex justify-center items-center cursor-pointer" onClick={() => navigate("/cart")}>
                        <FaCartShopping size={24} />
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {items.length}
                            </span>
                        )}
                    </span>
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