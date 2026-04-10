import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { JSX } from "react";
import { paths } from "../../constants/paths";

interface ProtectedRouteProps {
    children: JSX.Element;
    adminOnly?: boolean;
}
const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={paths.LOGIN} replace />;
    }

    if (adminOnly && user?.role !== 1) {
        return <Navigate to={paths.HOME} replace />;
    }

    return children;
};

export default ProtectedRoute;