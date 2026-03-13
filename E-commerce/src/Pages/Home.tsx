import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { useEffect, useState } from "react";
import { AiTwotoneLike } from "react-icons/ai";
import CategorySidebar from "../components/CategoriesSidebar";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { products, loading, error, searchTerm } = useSelector((state: RootState) => state.products)
  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 9;

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  if (loading) return <div className="flex justify-center items-center text-blue-500 text-2xl font-bold">Loading products...</div>;
  if (error) return <div className="flex justify-center items-center text-blue-500 text-2xl font-bold">{error}</div>;


  return (
    <div className="min-h-screen bg-white px-2">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 mt-3 items-stretch">
        <div className="col-span-3">
          <CategorySidebar />
        </div>
        <div className="col-span-9 relative w-full h-full  flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src="/home-image.avif"
            alt="TS Mart Banner"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              Welcome to TS Mart
            </h1>
            <p className="mt-4 text-lg md:text-2xl text-white drop-shadow-md">
              Find the best products at amazing prices
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-3 bg-gray-300 font-bold text-white rounded-lg shadow-lg transition hover:shadow-2xl"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* banners */}
      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-3 gap-6">

        {/* banner 1 */}
        <div className="bg-pink-100 rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-gray-600 text-sm">Bundle Package</p>
            <h3 className="text-xl font-bold mt-1">Save 30%</h3>
            <button className="mt-3 text-red-500 font-semibold text-sm hover:underline"
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>
          </div>

          <img
            src="/banner-1.jpg"
            alt="Loading..."
            className="h-20 object-contain rounded-2xl"
          />
        </div>

        {/* banner 2 */}
        <div className="bg-yellow-100 rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-gray-600 text-sm">Valentine Offer</p>
            <h3 className="text-xl font-bold mt-1">30% Sale</h3>
            <button className="mt-3 text-red-500 font-semibold text-sm hover:underline"
              onClick={() => navigate("/products")}
            >
              Buy Now
            </button>
          </div>

          <img
            src="/banner-2.jpg"
            alt="Loading..."
            className="h-20 object-contain rounded-2xl"
          />
        </div>

        {/* banner 3 */}
        <div className="bg-green-100 rounded-lg p-6 flex items-center justify-between hover:shadow-lg transition">
          <div>
            <p className="text-gray-600 text-sm">Relax Chair</p>
            <h3 className="text-xl font-bold mt-1">New Arrival</h3>
            <button className="mt-3 text-red-500 font-semibold text-sm hover:underline"
              onClick={() => navigate("/products")}
            >
              Buy Now
            </button>
          </div>

          <img
            src="/banner-3.jpg"
            alt="Loading..."
            className="h-20 object-contain"
          />
        </div>

      </div>
      {/* products */}
      <div className="max-w-7xl mx-auto px-6 mt-14">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Featured Items</h2>

        <div className="grid  grid-cols-3  gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <div className="relative bg-gray-100 p-4 rounded-lg">
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  -30%
                </span>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-40 w-full object-contain"
                />
              </div>

              <h3 className="font-semibold mt-3 text-sm truncate" title={product.title}>
                {product.title}
              </h3>

              <p className="text-gray-500 text-xs mt-1">{product.brand}</p>
              <div className="flex  items-center gap-2 ">
                <span><AiTwotoneLike /></span>
                <p className="text-yellow-500 text-xs mt-1">{product.rating}</p>
              </div>


              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="text-blue-400 font-bold">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-blue-400 cursor-pointer text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* pages */}
        <div className="flex justify-center my-10 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-4 py-2 rounded border ${currentPage === page
                ? "bg-blue-300 text-white"
                : "bg-white text-blue-500 border-blue-500"
                }`}
            >
              {page}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Home;
