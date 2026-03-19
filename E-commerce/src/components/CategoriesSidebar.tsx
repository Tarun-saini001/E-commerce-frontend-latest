import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/category";
import type { RootState, AppDispatch } from "../redux/store";


// const categories = [
//   "Electronics",
//   "Smartphones",
//   "Laptops",
//   "Skincare",
//   "Home Decoration",
//   "Furniture",
//   "Mens Shirts",
//   "Mens Shoes",
//   "Womens Shoes",
//   "Watches",
//   "Bags",
//   "Sunglasses",
// ];
const CategoriesSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full">
      <h3 className="font-bold text-lg bg-sky-100 p-4  text-gray-800 ">
        Categories
      </h3>

      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            onClick={() => navigate(`/products?category=${cat.name}`)}
            className="flex justify-between items-center px-4 py-4 text-sm text-gray-600 border-b cursor-pointer
               hover:bg-sky-100 hover:text-sky-700 transition"
          >
            <span>{cat.name}</span>
            <FaChevronRight className="text-xs" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesSidebar;