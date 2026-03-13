import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const categories = [
  "Electronics",
  "Smartphones",
  "Laptops",
  "Skincare",
  "Home Decoration",
  "Furniture",
  "Mens Shirts",
  "Mens Shoes",
  "Womens Shoes",
  "Watches",
  "Bags",
  "Sunglasses",
];
const CategoriesSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full">
      <h3 className="font-bold text-lg bg-sky-100 p-4  text-gray-800 ">
        Categories
      </h3>

      <ul>
        {categories.map((cat) => (
          <li
            key={cat}
            onClick={() => navigate("/products")}
            className="flex justify-between items-center px-4 py-3 text-sm text-gray-600 border-b cursor-pointer
                       hover:bg-sky-100 hover:text-sky-700 transition"
          >
            <span>{cat}</span>
            <FaChevronRight className="text-xs" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesSidebar;