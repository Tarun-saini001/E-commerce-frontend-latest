import { useNavigate } from "react-router-dom";
import { BsHeart } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { AiFillHeart } from "react-icons/ai";
import { fetchProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { paths } from "../../constants/paths";

const Wishlist = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const { items } = useSelector((state: RootState) => state.wishlist);
    const { products, loading } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts({category:null}));
        }
    }, [dispatch, products.length]);

    // match wishlist productIds with products list
    const wishlistProducts = products.filter((product) =>
        items.some((item) => item._id === product._id)
    );

    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading products...</div>;

    const handleAddToCart = async (product: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart!");
            navigate(paths.LOGIN);
            return;
        }
        const id = product._id;

        if (loadingMap[id]) return;
        setLoadingMap((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(addToCart(product))
                .unwrap()
                .then(() => toast.success("Product added to cart!", {
                    id: "product-added"
                }))
                .catch(() => toast.error("Failed to add product to cart", {
                    id: "fail-addition"
                }));
        } finally {
            setLoadingMap((prev) => ({ ...prev, [id]: false }))
        }
    };


    // empty wishlist ui
    if (wishlistProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 min-h-[70vh]">
                <div className="text-center">
                    <BsHeart className="text-6xl text-gray-400 mb-4 mx-auto" />

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Your Wishlist is Empty
                    </h2>

                    <p className="text-gray-500 mb-4">
                        You haven’t liked any products yet. Start exploring and add your favorites here.
                    </p>

                    <button
                        onClick={() => navigate(paths.PRODUCTS)}
                        className="bg-sky-400 hover:bg-sky-600 text-white px-6 py-3 rounded-lg shadow transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">

            <h2 className="text-3xl flex gap-2 items-center font-bold text-gray-800 mb-8">
                Your Wishlist <span><AiFillHeart className="text-pink-600" /></span>
            </h2>

            <div className="grid grid-cols-3 gap-6">
                {wishlistProducts.map((product) => (
                    <div
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer flex flex-col"
                    >
                        <div className="bg-gray-100 rounded-lg p-4">
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-40 w-full object-contain"
                            />
                        </div>

                        <h3
                            className="font-semibold mt-3 truncate"
                            title={product.title}
                        >
                            {product.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                            {product.brand}
                        </p>


                        <span className="text-sky-500 font-bold mt-2">
                            ${product.price}
                        </span>

                        <div className="flex flex-col mt-2 items-center gap-2">
                            <button
                                className="bg-red-400 text-white w-[80%] px-3 py-1 rounded hover:bg-red-600 transition"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(toggleWishlist(product._id))
                                        .unwrap()
                                        .then(() => toast.success("Product removed from wishlist!", {
                                            id: "add-to-wishlist"
                                        }))
                                        .catch(() => toast.error("Failed to remove product from wishlist", {
                                            id: "remove-from-wishlist"
                                        }));
                                }}
                            >
                                Remove
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                }}
                                disabled={loadingMap[product._id]}
                                className="bg-blue-400 text-white w-[80%] px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                                {loadingMap[product._id] ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default Wishlist;