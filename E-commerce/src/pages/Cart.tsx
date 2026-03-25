import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { removeItem, clearCart, updateCartQuantity } from "../redux/slices/cartSlice";
import { IoIosRemoveCircle, IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import { BsCart4 } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa6";
import { AiFillHeart } from "react-icons/ai";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Cart = () => {
    const { items, total } = useSelector((state: RootState) => state.cart);
    console.log('items: ', items);
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});



    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item._id === id);
    };

    if (items.length === 0) {
        return <div className="text-center my-5">
            <BsCart4 className="text-6xl text-gray-400 mb-4 mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-4">
                Looks like you haven't added anything to your cart yet.
            </p>
            <button
                onClick={() => navigate("/products")}
                className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-3 rounded-lg shadow transition"
            >
                Start Shopping
            </button>
        </div>
    }

    const handleIncrease = (productId: string, currentQty: number) => {
        console.log("Increase - productId:", productId, "currentQty:", currentQty);
        dispatch(updateCartQuantity({ productId, quantity: currentQty + 1 }));
    };

    const handleDecrease = (productId: string, currentQty: number) => {
        if (currentQty > 1) {
            console.log('productId: ', productId);
            dispatch(updateCartQuantity({ productId, quantity: currentQty - 1 }));
        }
    };

    const handleRemove = (productId: string) => {
        dispatch(removeItem(productId))
            .unwrap()
            .then(() => toast.success("Item removed from cart"))
            .catch(() => toast.error("Failed to remove item"))
    };

    const handleClearCart = () => {
        dispatch(clearCart())
            .unwrap()
            .then(() => toast.success("Cart cleared"))
            .catch(() => toast.error("Failed to clear cart"))
    };

    const handleWishlist = async (product: any) => {
        const id = product._id;
        if (loadingMap[id]) return;

        setLoadingMap((prev) => ({ ...prev, [id]: true }));

        try {
            await dispatch(toggleWishlist(id));
        } finally {
            setLoadingMap((prev) => ({ ...prev, [id]: false }));
        }
    };
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">

            <h2 className="text-3xl font-bold mb-8">Your Cart</h2>

            <div className="grid grid-cols-3 gap-8">

                {/* LEFT SIDE - CART ITEMS */}
                <div className="col-span-2 space-y-4">

                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm"
                        >

                            {/* Product Image */}
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="h-16 w-16 object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 px-4">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {item.brand} * {item.categoryName}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Price: ${item.price}
                                </p>
                            </div>

                            {/* quantity */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleDecrease(item._id, item.quantity)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    <IoIosRemoveCircle size={22} />
                                </button>

                                <span className="px-2">{item.quantity}</span>

                                <button
                                    onClick={() => handleIncrease(item._id, item.quantity)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    <IoIosAddCircle size={22} />
                                </button>
                            </div>

                            {/* price */}
                            <div className="w-30 ml-8  flex justify-between text-blue-600 font-bold">
                                ${(item.price * item.quantity).toFixed(2)}

                                {/* like button */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (loadingMap[item._id]) return;
                                        if (!isAuthenticated) {
                                            navigate("/login");
                                            return;
                                        }

                                        const alreadyInWishlist = isInWishlist(item._id);

                                        dispatch(toggleWishlist(item._id));
                                        handleWishlist(item);
                                        if (alreadyInWishlist) {
                                            toast.success("Product removed from wishlist");
                                        } else {
                                            toast.success("Product added to wishlist");
                                        }
                                    }}
                                    className="cursor-pointer text-2xl"
                                >
                                    {isInWishlist(item._id) ? (
                                        <AiFillHeart className="text-pink-600" />
                                    ) : (
                                        <FaRegHeart className="text-gray-300 hover:text-pink-400" />
                                    )}
                                </div>

                                {/* remove */}
                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-black hover:text-red-500 text-xl"
                                >
                                    <RxCross1 />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleClearCart}
                        className="text-sm bg-red-500 p-2 rounded hover:bg-red-600 text-white "
                    >
                        Remove all from cart
                    </button>

                </div>

                {/* rite side - order summary */}
                <div className="bg-white border rounded-lg p-6 shadow-sm h-fit">
                    <h3 className="font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                        {/* List cart items */}
                        {items.map(item => (
                            <div key={item._id} className="flex justify-between">
                                <span>{item.title} (x{item.quantity})</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-4">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Shipping Fee</span>
                        <span>$15.00</span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Tax (5%)</span>
                        <span>${(total * 0.05).toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-bold text-lg mt-2">
                        <span>Total</span>
                        <span>${(total + 15 + total * 0.05).toFixed(2)}</span>
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Shipping Method</h4>

                        <label className="inline-flex items-center mb-2 cursor-pointer">
                            <input type="radio" name="shippingMethod" value="upi" defaultChecked className="mr-2" />
                            UPI Payment
                        </label>

                        <label className="inline-flex items-center mb-2 cursor-pointer">
                            <input type="radio" name="shippingMethod" value="cod" className="mr-2" />
                            Cash on Delivery
                        </label>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Checkout
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Cart;