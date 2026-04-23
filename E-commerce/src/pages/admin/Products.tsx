import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { fetchProducts } from "../../redux/slices/productSlice";
import Pagination from "../../components/common/Pagination";
import { CiSearch } from "react-icons/ci";
import { paths } from "../../constants/paths";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  categoryName: string;
  thumbnail: string;
}

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, totalPages } = useSelector(
    (state: RootState) => state.products
  )
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const updatePage = (newPage: number) => {
    const params: any = {
      page: newPage.toString(),
    };

    if (search) params.search = search;

    setSearchParams(params);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;
  const search = searchParams.get("search") || "";
  console.log("search param:", search);

  useEffect(() => {
    dispatch(fetchProducts({ category: null, page, limit: 9, search }));
  }, [dispatch, page, search]);


  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(
        `${API}/service/product/${selectedProduct._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        dispatch(
          fetchProducts({
            category: null,
            page,
            limit: 9,
            search,
          })
        );
      }
    } catch (err) {
      console.log("Delete error", err);
    } finally {
      setShowModal(false);
      setSelectedProduct(null);
    }
  };


  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Product List</h1>

        <div className="flex flex ml-[35%] justify-center">
          <div className="relative w-[400px]">

            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2  text-xl" />

            <input
              type="text"
              value={search}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => {
                const value = e.target.value;
                const params: any = {
                  page: "1",
                };

                if (value.trim()) {
                  params.search = value;
                }

                setSearchParams(params);

              }}
            />

          </div>
        </div>

        <button
          onClick={() => navigate(paths.ADMIN_ADD_PRODUCT)}
          className="bg-blue-600 cursor-pointer text-white text-sm w-full px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>


      <div className=" ml-[50%] text-xsm mb-8">

        <h2 className="text-xl  text-blue-400">
          {search
            ? `Search results for "${search}"`
            : ""}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-6 p-4 font-semibold bg-gray-100 border-b">
          <p>Image</p>
          <p>Product</p>
          <p>Category</p>
          <p>Price</p>
          <p>Stock</p>
          <p className="text-center">Action</p>
        </div>

        {loading ? (
          <div
            className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
            Loading...
          </div>
        ) :
            products.length === 0 ? (
              <div className="p-6 text-center text-gray-500 font-medium">
                <div className="p-10 text-center">
                  <p className="text-gray-500 text-lg font-medium">
                    No products found
                  </p>

                </div>
              </div>
            ) : (products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-6 items-center p-4 border-b"
            >

              <img
                src={product.thumbnail.startsWith("http")
                  ? product.thumbnail
                  : `${API}/${product.thumbnail}`}
                alt={product.title}
                className="w-14 h-14 object-cover rounded"
              />

              <p className="font-medium">{product.title}</p>

              <p>{product.categoryName}</p>

              <p>{product.price} Rs.</p>

              <p>{product.stock}</p>

              {/* actions */}
              <div className="flex justify-center gap-4 text-lg">

                <button
                  onClick={() =>
                    navigate(paths.ADMIN_ADD_PRODUCT, {
                      state: product,
                    })
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  <FaEdit />
                </button>

                {/* delete */}
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowModal(true);
                  }}
                  className="text-red-500 cursor-pointer"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))
          )}
      </div>

      {/* pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={updatePage}
      />

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl text-center w-[350px]">

            <h2 className="text-xl font-semibold mb-2">
              Delete Product
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 cursor-pointer border rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteProduct}
                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Products;