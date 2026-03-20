import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsBox } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchOrders } from "../redux/slices/orderSlice";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();

    const { orders, loading } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchOrders());
        }
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 min-h-[70vh] text-center">
                <p className="text-gray-500">Please log in to see your orders.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-sky-400 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow transition"
                >
                    Login
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
                Loading your orders...
            </div>
        );
    }

    if (orders.length === 0) {
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
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="border rounded-lg shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate(`/orders/${order._id}`)}
                    >
                        <div className="flex justify-between mb-4">
                            <span className="font-semibold">Order ID: {order._id}</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${order.orderStatus === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {order.orderStatus}
                            </span>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">
                                Placed on: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                Shipping: {order.billingDetails.city}, {order.billingDetails.country}
                            </p>
                        </div>

                        <div className="space-y-2 font-bold">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-gray-700">

                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-10 h-10 object-cover rounded"
                                        />

                                        <span>
                                            {item.title} (x{item.quantity})
                                        </span>
                                    </div>

                                    <span className="font-semibold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-4 pt-3 flex justify-between font-bold text-gray-800">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;