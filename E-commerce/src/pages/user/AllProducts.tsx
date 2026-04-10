

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { AiTwotoneLike } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import AuthModal from "../../components/user/AuthModal";
import { paths } from "../../constants/paths";

const AllProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { products, loading, error, totalPages } = useSelector((state: RootState) => state.products);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const [cartLoadingMap, setCartLoadingMap] = useState<Record<string, boolean>>({});
    const [wishlistLoadingMap, setWishlistLoadingMap] = useState<Record<string, boolean>>({});
    const [showAuthModal, setShowAuthModal] = useState(false);
    const isFirstRender = useRef(true);

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item._id === id);
    };


    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const updatePage = (newPage: number) => {
        const params: any = {
            page: newPage.toString(),
        };

        if (category) params.category = category;
        if (search) params.search = search;

        setSearchParams(params);
    };

    const category = searchParams.get("category");
    const search = searchParams.get("search");



    useEffect(() => {
        dispatch(fetchProducts({ category, page, limit: 9, search }));
    }, [dispatch, category, page, search]);



    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        // update the current params (set page to 1)
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);// create copy of current url
            params.set("page", "1");
            return params;
        });
    }, [category, search]);


    const handleAddToCart = async (product: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart!");
            navigate(paths.LOGIN);
            return;
        }
        const id = product._id;

        if (cartLoadingMap[id]) return;
        setCartLoadingMap((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(addToCart(product))
                .unwrap()
                .then(() => toast.success("Product added to cart!", { id: "Add-to-cart" }))
                .catch(() => toast.error("Failed to add product to cart", { id: "AddToCart-error" }));
        } finally {
            setCartLoadingMap((prev) => ({ ...prev, [id]: false }))
        }
    };

    const handleWishlist = async (product: any) => {
        const id = product._id;
        if (wishlistLoadingMap[id]) return;

        setWishlistLoadingMap((prev) => ({ ...prev, [id]: true }));

        try {
            await dispatch(toggleWishlist(id));
        } finally {
            setWishlistLoadingMap((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleLoginRedirect = () => {
        setShowAuthModal(false);
        navigate(paths.LOGIN);
    };

    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading products...</div>;
    if (error) return <div className="flex justify-center items-center min-h-[70vh] text-red-500 text-xl mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <button
                onClick={() => {
                    dispatch(fetchProducts({ category: null, page: 1, limit: 9 })); // reset products

                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate(paths.PRODUCTS);
                    }
                }}
                className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
                Back
            </button>
            <div className="text-center mb-10">

                <h2 className="text-3xl font-bold text-blue-400">
                    {category
                        ? `${category}`
                        : search
                            ? `Search results for "${search}"`
                            : "TS Mart Products"}
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Shop the latest and trending products from TS Mart at unbeatable prices.
                </p>
            </div>

            {/* products  */}
            <div className="grid grid-cols-3 gap-6">
                {products
                    .map((product) => (
                        <div
                            onClick={() => navigate(`/product/${product._id}`)}
                            key={product._id}
                            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                        >
                            <div className="relative bg-gray-100 p-4 rounded-lg mb-4">
                                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                    -30%
                                </span>
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-40 w-full object-contain"
                                />
                            </div>

                            <h3
                                className="font-semibold  mb-1 truncate"
                                title={product.title}
                            >
                                {product.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-1 ">
                                {product.brand} * {product.categoryName}
                            </p>

                            {/* <p className="text-gray-500 text-xs mt-1">{product.brand}</p> */}

                            <div className="flex  items-center gap-2 ">
                                <span><AiTwotoneLike /></span>
                                <p className="text-yellow-500 text-xs mt-1">{product.rating}</p>
                            </div>

                            <div className="mt-auto flex items-center flex-col gap-2 justify-between pt-3">
                                <div className="flex justify-between w-full mb-4">
                                    <span className="text-blue-00 items-start w-full font-bold">{product.price.toFixed(2)} Rs.</span>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            if (wishlistLoadingMap[product._id]) return;

                                            if (!isAuthenticated) {
                                                setShowAuthModal(true);
                                                return;
                                            }

                                            const alreadyInWishlist = isInWishlist(product._id);

                                            handleWishlist(product);
                                            if (alreadyInWishlist) {
                                                toast.success("Product removed from wishlist", {
                                                    id: "product-removed"
                                                });
                                            } else {
                                                toast.success("Product added to wishlist", {
                                                    id: "produt-added"
                                                });
                                            }
                                        }}
                                        className="cursor-pointer text-2xl"
                                    >
                                        {isInWishlist(product._id) ? (
                                            <AiFillHeart className="text-pink-600" />
                                        ) : (
                                            <FaRegHeart className="text-gray-300 hover:text-pink-400" />
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent card click
                                        if (!isAuthenticated) {
                                            setShowAuthModal(true);
                                            return;
                                        }
                                        handleAddToCart(product);
                                        navigate(paths.CART);
                                    }}
                                    className="bg-blue-400 cursor-pointer w-[80%]  text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent card click
                                        if (!isAuthenticated) {
                                            setShowAuthModal(true);
                                            return;
                                        }
                                        handleAddToCart(product);
                                    }}
                                    disabled={cartLoadingMap[product._id]}
                                    className="bg-blue-400 text-white w-[80%] px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    {cartLoadingMap[product._id] ? "Adding..." : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* page buttons */}
            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={updatePage}
            />

            {/* login modal message */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onConfirm={handleLoginRedirect}
                message="You need to login to perform this action."
            />

        </div>
    );
};

export default AllProducts;