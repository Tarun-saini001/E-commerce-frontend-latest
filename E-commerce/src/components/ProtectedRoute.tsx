import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    adminOnly?: boolean;
}
const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;