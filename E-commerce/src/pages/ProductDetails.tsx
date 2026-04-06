import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, type Product } from "../redux/slices/productSlice";
import { IoStar } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
// const API = import.meta.env.VITE_API_URL;

const ProductDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();
  // const [product, setProduct] = useState<Product>();
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const { singleProduct, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add to cart!");
      navigate("/login");
      return;
    }
    dispatch(addToCart(product))
      .unwrap()
      .then(() => toast.success("Product added to cart!", {
        id: "product-added"
      }))
      .catch(() => toast.error("Failed to add product to cart", {
        id: "add-to-cart-error"
      }));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
        Loading Product...
      </div>
    );

  if (error) {
    return <div className="flex justify-center items-center min-h-[70vh] text-red-500 text-xl font-bold"
    >{error}</div>;
  }

  if (!singleProduct) {
    return <div className="flex justify-center items-center min-h-[70vh] text-red-500 text-xl font-bold"
    >Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        Back
      </button>

      {/* Upper section: image + info */}
      <div className="md:flex md:gap-10">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={singleProduct.thumbnail}
            alt={singleProduct.title}
            className="w-full max-h-[500px] object-contain rounded-lg shadow"
          />
        </div>

        <div className="md:w-1/2 mt-6 md:mt-0 bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-2">{singleProduct.title}</h2>
          <p className="text-gray-500 mb-2">
            {singleProduct.brand} * {singleProduct.categoryName}
          </p>

          {/* rating */}
          <div className="flex items-center mb-2">
            <IoStar className="text-yellow-400 mr-1" />
            <span className="text-gray-700">{singleProduct.rating.toFixed(1)}</span>
          </div>

          <p className="text-2xl font-bold text-blue-600 mb-4">{singleProduct.price} Rs.</p>

          <p
            className={`text-sm font-semibold mb-4 ${singleProduct.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            {singleProduct.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button
            onClick={() => handleAddToCart(singleProduct)}
            className="w-full py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* bottom section with tabs */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow">
        {/* tabs */}
        <div className="flex border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-4 -mb-px font-semibold ${activeTab === "details"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
              }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-4 -mb-px font-semibold ${activeTab === "reviews"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
              }`}
          >
            Reviews
          </button>
        </div>

        {/* content */}
        <div className="max-h-[400px] overflow-y-auto">
          {activeTab === "details" && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Product Details</h3>
              <p className="text-gray-700 mb-2">{singleProduct.description}</p>
              <p className="text-gray-700 mb-1">
                <strong>Category:</strong> {singleProduct.categoryName}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Brand:</strong> {singleProduct.brand}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Stock:</strong> {singleProduct.stock}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Rating:</strong> {singleProduct.rating}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Reviews</h3>
              <p className="text-gray-500">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;