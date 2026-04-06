import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  categoryName: string;
  thumbnail: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(Number(localStorage.getItem("catPage")) ||1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    localStorage.setItem("catPage", page.toString());
  }, [page]);

  const fetchProducts = async (currentPage = 1) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/service/product?page=${currentPage}&limit=6`,
        { credentials: "include" }
      );

      const data = await res.json();
      console.log('product list fetched ', data);

      setProducts(data.data.products);
      setTotalPages(data.data.totalPages);
      setPage(data.data.currentPage);
    } catch (err) {
      console.log("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

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
        setProducts((prev) =>
          prev.filter((p) => p._id !== selectedProduct._id)
        );
      }
    } catch (err) {
      console.log("Delete error", err);
    } finally {
      setShowModal(false);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
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

        {products.map((product) => (
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
                  navigate("/admin/add-product", {
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
        ))}
      </div>

      {/* pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 cursor-pointer rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 cursor-pointer  rounded ${page === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 cursor-pointer bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

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