import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../redux/slices/productSlice";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import type { AppDispatch } from "../redux/store";

const ProductDetails = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product>();

    const navigate = useNavigate();

    const handleAddToCart = () => {
        dispatch(addToCart(product!));
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`https://dummyjson.com/products/${productId}`);
            const data = await res.json();
            setProduct(data);
        };

        fetchProduct();
    }, [productId]);

    if (!product) return <div className="flex justify-center items-center text-blue-500 text-2xl font-bold">Loading Product...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-3 py-1 rounded  border  border-black  hover:bg-gray-300 transition"
            >
                <IoIosArrowBack />
            </button>
            <div className="grid md:grid-cols-2 gap-10">

                {/*product image*/}
                <div className="flex justify-center">
                    <img src={product.thumbnail} alt={product.title} className="h-96 object-contain" />
                </div>

                {/* product info */}
                <div>
                    <h2 className="text-3xl font-bold mb-3">{product.title}</h2>
                    <p className="text-gray-500 mb-2">{product.brand} • {product.category}</p>
                    <p className="text-yellow-500 mb-2">raiting {product.rating}</p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
                    <p className="text-gray-700 mb-4">{product.description}</p>
                    <p className="text-sm text-green-600 mb-6">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                    <button 
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                        Add to Cart
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductDetails;