import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading...</div>;

  if (!user || user.role !== 1) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;