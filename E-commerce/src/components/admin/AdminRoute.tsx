import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../constants/paths";
import AdminLayoutSkeleton from "./AdminLayoutSkeleton";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <AdminLayoutSkeleton/>;

  if (!user || user.role !== 1) {
    return <Navigate to={paths.HOME} />;
  }

  return <>{children}</>;
};

export default AdminRoute;