// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [openMenu, setOpenMenu] = useState<string | null>(null);

//   const toggleMenu = (menu: string) => setOpenMenu(openMenu === menu ? null : menu);

//   return (
//     <div className="w-64 bg-white shadow-md p-4 fixed h-full top-0 left-0">
//       <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>

//       <ul className="space-y-2">
//         {/* categories */}
//         <li>
//           <button
//             onClick={() => toggleMenu("categories")}
//             className="w-full flex justify-between items-center text-xl px-3 py-2 text-left bg-gray-100 rounded"
//           >
//             Categories
//             {openMenu === "categories" ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
//           </button>
//           {openMenu === "categories" && (
//             <ul className="pl-4 mt-1 space-y-1 text-gray-700">
//               <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/admin/categories/add")}>Add Category</li>
//               <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/admin/categories/list")}>List Categories</li>
//             </ul>
//           )}
//         </li>

//         {/* products */}
//         <li>
//           <button
//             onClick={() => toggleMenu("products")}
//             className="w-full flex justify-between text-xl items-center px-3 py-2 text-left bg-gray-100 rounded"
//           >
//             Products
//             {openMenu === "products" ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
//           </button>
//           {openMenu === "products" && (
//             <ul className="pl-4 mt-1 space-y-1 text-gray-700">
//               <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/admin/products/add")}>Add Product</li>
//               <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate("/admin/products/list")}>List Products</li>
//             </ul>
//           )}
//         </li>

//         {/* users */}
//         <li>
//           <button
//             onClick={() => navigate("/admin/users")}
//             className="w-full px-3 text-xl py-2 text-left bg-gray-100 rounded"
//           >
//             View Users
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;


import { useNavigate, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaShoppingCart, } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { paths } from "../../constants/paths";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-700";

  return (
    <div className="w-64 bg-[#182646]  text-white mt-16 fixed h-full top-0 left-0 p-4">

      <p className="text-gray-400 mb-3 text-sm">Admin Panel</p>

      <ul className="space-y-2 text-sm">

        {/* dashboard */}
        <li
          onClick={() => navigate(paths.ADMIN)}
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${isActive("/admin")}`}
        >
          <FaTachometerAlt />
          Dashboard
        </li>

        {/* users */}
        <li
          onClick={() => navigate(paths.ADMIN_USERS)}
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${isActive("/admin/users")}`}
        >
          <FaUsers />
          Users
        </li>

        {/* category */}
        <li
          onClick={() => navigate(paths.ADMIN_CATEGORIES)}
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${isActive("/admin/categories")}`}
        >
          <BiSolidCategory />
          Categories
        </li>

        {/* products */}
        <li
          onClick={() => navigate(paths.ADMIN_PRODUCTS)}
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${isActive("/admin/products")}`}
        >
          <FaBox />
          Products
        </li>

        {/* oders */}
        <li
          onClick={() => navigate(paths.ADMIN_ORDERS)}
          className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${isActive("/admin/orders")}`}
        >
          <FaShoppingCart />
          Orders</li>

      </ul>
    </div>
  );
};

export default Sidebar;