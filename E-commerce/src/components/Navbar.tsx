
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../redux/slices/productSlice";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const { items } = useSelector((state: RootState) => state.cart);


    return (
        <div className="bg-white fixed top-0 left-0 w-full z-50 h-[60px] p-2 flex justify-between items-center border-b border-gray-200">

            <div
                onClick={() => navigate("/")}
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

            {/* searchbar */}
            <div className="flex-1 flex justify-center">
                <div className="relative w-[400px]">

                    <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2  text-xl" />

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-sky-300"
                        onChange={(e) => {
                            dispatch(setSearchTerm(e.target.value));
                            navigate("/products");
                        }}
                    />

                </div>
            </div>
            {/* <nav className="flex justify-center items-center pr-10 w-[60%]">
                <ul className="flex font-bold space-x-8">
                    {isAuthenticated && user?.role === 1 && (
                        <li
                            className="cursor-pointer text-black font-bold"
                            onClick={() => navigate("/admin")}
                        >
                            Dashboard
                        </li>
                    )}
                    <li onClick={() => navigate("/")} className="cursor-pointer text-sky-400">
                        Home
                    </li>
                    <li onClick={() => navigate("/products")} className="cursor-pointer text-sky-400">
                        All Products
                    </li>

                </ul>
            </nav> */}

            <span className="flex space-x-4 pr-2 relative">

                {isAuthenticated && (
                    <span className="relative flex justify-center items-center cursor-pointer" onClick={() => navigate("/cart")}>
                        <FaCartShopping size={24} />
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-sky-300 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {items.length}
                            </span>
                        )}
                    </span>
                )}
                {isAuthenticated ? (
                    <div
                        onClick={() => navigate("/profile")}
                        className="w-10 h-10 rounded-full bg-gray-300 text-black flex items-center justify-center cursor-pointer"
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                ) : (
                    <>
                        {/* <button
                            className=" text-black bg-white shadow w-20 cursor-pointer font-semibold rounded-md"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button> */}
                        <button
                            className=" text-white bg-sky-500 p-2 shadow w-20 cursor-pointer font-semibold rounded-md"
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