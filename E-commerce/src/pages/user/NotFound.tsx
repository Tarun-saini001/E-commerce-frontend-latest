import { useNavigate } from "react-router-dom";
import { paths } from "../../constants/paths";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
      
      <h1 className="text-7xl font-extrabold text-blue-500">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
      </h2>

      <button
        onClick={() => navigate(paths.HOME)}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;