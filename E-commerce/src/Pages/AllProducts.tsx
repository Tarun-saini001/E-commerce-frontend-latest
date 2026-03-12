

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AllProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { products, loading, error } = useSelector((state: RootState) => state.products);

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; 

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

    if (loading) return <div className="text-center text-blue-500 text-2xl mt-10">Loading products...</div>;
    if (error) return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">All Products</h2>

            {/* products  */}
            <div className="grid grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition hover:shadow-xl">
                        <img src={product.thumbnail} alt={product.title} className="h-40 object-contain mb-4" />
                        <h3 className="font-semibold text-center mb-1">{product.title}</h3>
                        <p className="text-sm text-gray-500 mb-1">{product.brand} • {product.category}</p>
                        <p className="text-yellow-500 text-sm mb-1">Rating {product.rating}</p>
                        <p className="text-blue-500 font-bold mb-3">${product.price}</p>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* page buttons */}
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`px-4 py-2 rounded border ${
                            currentPage === page ? "bg-blue-500 text-white" : "bg-white text-blue-500 border-blue-500"
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