import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopMenu from "../components/TopMenu";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useEffect } from "react";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";


const UserLayout = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (user?.role === 1) {
            navigate("/admin", { replace: true });
        }
    }, [user, navigate]);
    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading...</div>;


    return (
        <>
            <Navbar />
            <div className="pt-[110px]" />
            <TopMenu />

            <div className="min-h-[80vh]">
                <Outlet />
            </div>

            <Footer />
        </>
    );
};

export default UserLayout;