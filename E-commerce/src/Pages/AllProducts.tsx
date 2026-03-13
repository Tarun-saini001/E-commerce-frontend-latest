

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { AiTwotoneLike } from "react-icons/ai";

const AllProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddToCart = (product: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to add to cart!");
            navigate("/login");
            return;
        }
        dispatch(addToCart(product))
            .unwrap()
            .then(() => toast.success("Product added to cart!"))
            .catch(() => toast.error("Failed to add product to cart"));
    };

    // pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <div className="text-center text-blue-300 text-2xl mt-10">Loading products...</div>;
    if (error) return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-blue-400">TS Mart Products</h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Shop the latest and trending products from TS Mart at unbeatable prices.
                </p>
            </div>

            {/* products  */}
            <div className="grid grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                    <div
                        onClick={() => navigate(`/product/${product.id}`)}
                        key={product.id}
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
                            {product.brand} * {product.category}
                        </p>

                        {/* <p className="text-gray-500 text-xs mt-1">{product.brand}</p> */}

                        <div className="flex  items-center gap-2 ">
                            <span><AiTwotoneLike /></span>
                            <p className="text-yellow-500 text-xs mt-1">{product.rating}</p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-3">
                            <span className="text-blue-00 font-bold">${product.price.toFixed(2)}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent card click

                                    handleAddToCart(product);

                                }}
                                className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Add to Cart
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