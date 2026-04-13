// import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import { paths } from '../../constants/paths';

const TopMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const baseStyle = "cursor-pointer hover:text-sky-500";
    const activeStyle = "text-sky-500 border-b-2 border-sky-500";

    return (
        <div className='fixed top-[60px] left-0 w-full bg-white border-b border-gray-200 z-40'>
            <div className="max-w-7xl mx-auto justify-center items-center flex gap-8 px-6 py-3 font-semibold text-gray-700">
                {isAuthenticated && user?.role === 1 && (
                    <span
                        onClick={() => navigate(paths.ADMIN)}
                        className={`${baseStyle} ${isActive("/admin") ? activeStyle : ""}`}
                    >
                        Dashboard
                    </span>
                )}
                <span
                    onClick={() => navigate(paths.HOME)}
                    className={`${baseStyle} ${isActive("/") ? activeStyle : ""}`}
                >
                    Home
                </span>

                <span
                    onClick={() => navigate(paths.PRODUCTS)}
                    className={`${baseStyle} ${isActive("/products") ? activeStyle : ""}`}
                >
                    All Products
                </span>

                {isAuthenticated && (
                    <>
                        <span
                            onClick={() => navigate(paths.WISHLIST)}
                            className={`${baseStyle} ${isActive("/wishlist") ? activeStyle : ""}`}
                        >
                            Wishlist
                        </span>

                        <span
                            onClick={() => navigate(paths.ORDERS)}
                            className={`${baseStyle} ${isActive("/orders") ? activeStyle : ""}`}
                        >
                            Orders
                        </span>
                    </>
                )}

            </div>
        </div>
    )
}

export default TopMenu