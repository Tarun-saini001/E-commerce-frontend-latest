import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../components/Pagination";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/category";

interface Category {
  _id: string;
  name: string;
  image: string;
}

const Categories = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { categories, loading, totalPages } = useSelector(
    (state: RootState) => state.category
  )
  // const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const updatePage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  // const [page, setPage] = useState(Number(localStorage.getItem("catPage")) || 1);


  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    localStorage.setItem("catPage", page.toString());
  }, [page]);

  useEffect(() => {
    dispatch(fetchCategories({ page, limit: 6 }));
  }, [dispatch, page]);


  const deleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      const res = await fetch(
        `${API}/service/category/${selectedCategory._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        {
          dispatch(fetchCategories({ page, limit: 6 }));
        }

      }
    } catch (err) {
      console.log("Delete error", err);
    } finally {
      setShowModal(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category List</h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/admin/add-category")}
            className="px-4 py-2 bg-blue-600 text-white cursor-pointer rounded"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-3 p-4 font-semibold bg-gray-100 border-b">
          <p>Image</p>
          <p>Category Name</p>
          <p className="text-center">Action</p>
        </div>


        {loading ? (
          <div
            className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">
            Loading...
          </div>
        ) :
          categories.map((cat) => (
            <div
              key={cat._id}
              className="grid grid-cols-3 items-center p-4 border-b"
            >
              {/* image */}
              <img
                src={`${API}${cat.image}`}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded"
              />

              {/* category name */}
              <p className="font-medium">{cat.name}</p>

              {/* actions */}
              <div className="flex justify-center gap-4 text-xl">
                {/* edit */}
                <button
                  onClick={() =>
                    navigate("/admin/add-category", {
                      state: cat,
                    })
                  }
                  className="text-blue-500 cursor-pointer"
                >
                  <FaEdit />
                </button>

                {/* delete */}
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={updatePage}
      />

      {/*cinfirmation message*/}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl text-center w-[350px]">
            <h2 className="text-xl font-semibold mb-2">
              Delete Category
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteCategory}
                className="px-4 py-2 bg-red-500 text-white rounded"
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

export default Categories;