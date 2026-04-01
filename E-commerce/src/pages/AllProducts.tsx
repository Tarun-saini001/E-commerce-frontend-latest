

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { AiTwotoneLike } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import { useSearchParams } from "react-router-dom";

const AllProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { products, loading, error, searchTerm } = useSelector((state: RootState) => state.products);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const [cartLoadingMap, setCartLoadingMap] = useState<Record<string, boolean>>({});
    const [wishlistLoadingMap, setWishlistLoadingMap] = useState<Record<string, boolean>>({});

    const isInWishlist = (id: string) => {
        return wishlistItems.some((item) => item._id === id);
    };


    const filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;


    const [searchParams] = useSearchParams();
    const category = searchParams.get("category");

    useEffect(() => {
        dispatch(fetchProducts(category));
    }, [dispatch, category]);

    //reset pagination when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [category]);

    const handleAddToCart = async (product: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart!");
            navigate("/login");
            return;
        }
        const id = product._id;

        if (cartLoadingMap[id]) return;
        setCartLoadingMap((prev) => ({ ...prev, [id]: true }));
        try {
            await dispatch(addToCart(product))
                .unwrap()
                .then(() => toast.success("Product added to cart!"))
                .catch(() => toast.error("Failed to add product to cart"));
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
    // pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading products...</div>;
    if (error) return <div className="flex justify-center items-center min-h-[70vh] text-red-500 text-xl mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <button
                onClick={() => {
                    dispatch(fetchProducts(null)); // reset products

                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate("/products");
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
                        : searchTerm
                            ? `Search results for "${searchTerm}"`
                            : "TS Mart Products"}
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Shop the latest and trending products from TS Mart at unbeatable prices.
                </p>
            </div>

            {/* products  */}
            <div className="grid grid-cols-3 gap-6">
                {currentProducts.map((product) => (
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
                                            navigate("/login");
                                            return;
                                        }

                                        const alreadyInWishlist = isInWishlist(product._id);

                                        handleWishlist(product);
                                        if (alreadyInWishlist) {
                                            toast.success("Product removed from wishlist");
                                        } else {
                                            toast.success("Product added to wishlist");
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
                                        navigate("/login");
                                        return;
                                    }
                                    handleAddToCart(product);
                                    navigate("/cart");
                                }}
                                className="bg-blue-400 cursor-pointer w-[80%]  text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent card click

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
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded border ${currentPage === page ? "bg-blue-300 text-white" : "bg-white text-blue-500 border-blue-500"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AllProducts;