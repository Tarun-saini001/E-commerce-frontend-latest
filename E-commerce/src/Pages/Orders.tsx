import React from "react";
import { useNavigate } from "react-router-dom";
import { BsBox } from "react-icons/bs";

const Orders = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 min-h-[70vh]">
            <div className="text-center">
                <BsBox className="text-6xl text-gray-400 mb-4 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-4">
                    You haven’t placed any orders yet. Start shopping to fill your order history!
                </p>
                <button
                    onClick={() => navigate("/products")}
                    className="bg-sky-400 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow transition"
                >
                    Browse Products
                </button>
            </div>

        </div>
    );
};

export default Orders;