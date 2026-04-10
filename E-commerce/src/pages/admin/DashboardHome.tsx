import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../constants/paths";

interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API}/service/user/dashboard`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log('dashboard data: ', data);

      if (res.ok) {
        setData(data.data);
      }
    } catch (err) {
      console.log("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>


      {loading ? (
        <p className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">

          {/* users */}
          <div onClick={() => navigate(paths.ADMIN_USERS)} className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition">
            <h2 className="text-gray-500 text-sm">Total Users</h2>
            <p className="text-2xl font-bold mt-2">{data.totalUsers}</p>
          </div>

          {/* products */}
          <div onClick={() => navigate(paths.ADMIN_PRODUCTS)}  className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition">
            <h2 className="text-gray-500 text-sm">Total Products</h2>
            <p className="text-2xl font-bold mt-2">{data.totalProducts}</p>
          </div>

          {/* orders */}
          <div onClick={() => navigate(paths.ADMIN_ORDERS)}  className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition">
            <h2 className="text-gray-500 text-sm">Total Orders</h2>
            <p className="text-2xl font-bold mt-2">{data.totalOrders}</p>
          </div>

          {/* revenue */}
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-gray-500 text-sm">Total Revenue</h2>
            <p className="text-2xl font-bold mt-2">
               {data.totalRevenue}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardHome;