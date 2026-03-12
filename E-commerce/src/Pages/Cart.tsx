import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { removeItem, clearCart, updateCartQuantity } from "../redux/slices/cartSlice";
import { IoIosRemoveCircle, IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
    const { items, total } = useSelector((state: RootState) => state.cart);
    console.log('items: ', items);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    if (items.length === 0)
        return <div className="text-center text-2xl mt-20">Your cart is empty.</div>;

    const handleIncrease = (productId: number, currentQty: number) => {
        console.log("Increase - productId:", productId, "currentQty:", currentQty);
        dispatch(updateCartQuantity({ productId, quantity: currentQty + 1 }));
    };

    const handleDecrease = (productId: number, currentQty: number) => {
        if (currentQty > 1) {
            console.log('productId: ', productId);
            dispatch(updateCartQuantity({ productId, quantity: currentQty - 1 }));
        }
    };

    const handleRemove = (productId: number) => {
        dispatch(removeItem(productId))
        .unwrap()
        .then(()=>toast.success("Item removed from cart"))
        .catch(()=>toast.error("Failed to remove item"))
    };

    const handleClearCart = () => {
        dispatch(clearCart())
        .unwrap()
        .then(()=>toast.success("Cart cleared"))
        .catch(()=>toast.error("Failed to clear cart"))
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
            <div className="grid grid-cols-1 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                        <img src={item.thumbnail} alt={item.title} className="h-24 object-contain" />
                        <div className="flex-1   px-4">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-gray-500">{item.brand} . {item.category}</p>
                            <p className="text-blue-500 font-bold">${item.price}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <button onClick={() => handleDecrease(item.id, item.quantity)}>
                                    <IoIosRemoveCircle size={24} />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleIncrease(item.id, item.quantity)}>
                                    <IoIosAddCircle size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={handleClearCart}
                    className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Clear Cart
                </button>
                <div className="text-xl font-bold">
                    Total: ${total.toFixed(2)}
                </div>
                <button
                    onClick={() => navigate("/checkout")}
                    className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;