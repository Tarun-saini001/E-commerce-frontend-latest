import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropup } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";

const Dashboard = () => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState<string | null>(null); 

    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            
            <div className="w-64 bg-white shadow-md p-4">
                <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>

                <ul className="space-y-2">
                    {/* categories*/}
                    <li>
                        <button
                            onClick={() => toggleMenu("categories")}
                            className="w-full flex justify-between items-center text-xl px-3 py-2 text-left bg-gray-100 rounded"
                        >
                            Categories
                            <span>{openMenu === "categories" ? <IoIosArrowDropup />
                                : <IoIosArrowDropdown />}</span>
                        </button>
                        {openMenu === "categories" && (
                            <ul className="pl-4 mt-1 space-y-1 text-gray-700">
                                <li
                                    className="cursor-pointer hover:text-blue-500 "
                                    onClick={() => navigate("/admin/categories/add")}
                                >
                                    Add Category
                                </li>
                                <li
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => navigate("/admin/categories/list")}
                                >
                                    List Categories
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* products */}
                    <li>
                        <button
                            onClick={() => toggleMenu("products")}
                            className="w-full flex justify-between text-xl items-center px-3 py-2 text-left bg-gray-100 rounded"
                        >
                            Products
                            <span>{openMenu === "products" ? <IoIosArrowDropup />
                                : <IoIosArrowDropdown />}</span>
                        </button>
                        {openMenu === "products" && (
                            <ul className="pl-4 mt-1 space-y-1 text-gray-700">
                                <li
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => navigate("/admin/products/add")}
                                >
                                    Add Product
                                </li>
                                <li
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => navigate("/admin/products/list")}
                                >
                                    List Products
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* users */}
                    <li>
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="w-full px-3 text-xl py-2 text-left bg-gray-100 rounded"
                        >
                            View Users
                        </button>
                    </li>
                </ul>
            </div>

            
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
                <p>Select an option from the sidebar to manage categories, products, or view users.</p>
            </div>
        </div>
    );
};

export default Dashboard;