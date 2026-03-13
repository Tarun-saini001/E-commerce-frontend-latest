import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const TopMenu = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className='fixed top-[60px] left-0 w-full bg-white border-b border-gray-200 z-40' >
            <div className="max-w-7xl mx-auto justify-center items-center flex gap-8 px-6 py-3 font-semibold text-gray-700">
                <span
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:text-sky-500"
                >Home
                </span>

                <span
                    onClick={() => navigate("/products")}
                    className="cursor-pointer hover:text-sky-500"
                >All products
                </span>
                {isAuthenticated && (
                    <>
                        <span
                            onClick={() => navigate("/wishlist")}
                            className="cursor-pointer hover:text-sky-500"
                        >
                            Wishlist
                        </span>

                        <span
                            onClick={() => navigate("/orders")}
                            className="cursor-pointer hover:text-sky-500"
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
