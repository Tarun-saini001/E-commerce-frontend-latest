import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect } from "react";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleBuyNow = (productId: number) => {
    // navigate to product details page
    navigate(`/product/${productId}`);
  };


  if (loading) return <div className="flex justify-center items-center text-blue-500 text-2xl font-bold">Loading products...</div>;
  if (error) return <div className="flex justify-center items-center text-blue-500 text-2xl font-bold">{error}</div>;


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="/e-commerce.avif"
          alt="TS Mart Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            Welcome to TS Mart
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-md">
            Find the best products at amazing prices
          </p>
          <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg transition"
          >
            Shop Now
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">
          Featured Products
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center transition hover:shadow-xl"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-40 object-contain mb-4"
              />

              <h3 className="font-semibold text-center mb-1">
                {product.title.length > 30
                  ? product.title.substring(0, 27) + "..."
                  : product.title}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                {product.brand} • {product.category}
              </p>

              <p className="text-yellow-500 text-sm mb-1">
                ratings {product.rating}
              </p>

              <p className="text-blue-500 font-bold mb-3">
                ${product.price}
              </p>

              <button
                onClick={() => handleBuyNow(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Home;
