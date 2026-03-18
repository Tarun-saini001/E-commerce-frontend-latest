import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchOrderById } from "../redux/slices/orderSlice";

const OrderDetails = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    const { selectedOrder, loading } = useSelector(
        (state: RootState) => state.order
    );

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
        }
    }, [dispatch, orderId]);

    if (loading || !selectedOrder) {
        return <div className="text-center py-20">Loading order...</div>;
    }

    const order = selectedOrder;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold mb-6">
                Order ID: {order._id}
            </h1>

            {/* Status */}
            <div className="mb-6">
                <span className="font-semibold">Status: </span>
                <span className="text-green-600 font-bold">
                    {order.orderStatus}
                </span>
            </div>

            {/* Billing */}
            <div className="mb-8 border p-4 rounded">
                <h2 className="font-semibold  bg-sky-200  rounded p-2 w-full mb-2">Billing Details</h2>
                <p>{order.billingDetails.name}</p>
                <p>{order.billingDetails.address}</p>
                <p>
                    {order.billingDetails.city}, {order.billingDetails.country}
                </p>
                <p>{order.billingDetails.phone}</p>
                <p>{order.billingDetails.email}</p>
            </div>

            {/* Items */}
            <div className="mb-8 border p-2">

                <div className="space-y-4">
                <h2 className="font-semibold  bg-sky-200  rounded p-2 w-full mb-2">Order Items</h2>
                    {order.items.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between border p-4 rounded"
                        >
                            <div className="flex items-center gap-4">
                                {/* IMAGE (make sure backend sends it) */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-16 h-16 object-cover rounded"
                                />

                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                            </div>

                            <p className="font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="border p-6 rounded max-w-md">
                <h2 className="font-semibold  bg-sky-200  rounded p-2 w-full mb-4">Order Summary</h2>

                <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${order.shippingFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;