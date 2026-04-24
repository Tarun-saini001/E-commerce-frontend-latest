import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import TopMenu from "../components/user/TopMenu";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useEffect } from "react";
import { fetchCart } from "../redux/slices/cartSlice";
import { fetchWishlist } from "../redux/slices/wishlistSlice";
import { paths } from "../constants/paths";


const UserLayout = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (user?.role === 1) {
            navigate(paths.ADMIN, { replace: true });
        }
    }, [user, navigate]);
    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading...</div>;

    const hideFooterRoutes = [
        paths.LOGIN,
        paths.REGISTER,
        paths.FORGOT_PASSWORD,
        paths.VERIFY_OTP,
        paths.RESET_PASSWORD,
    ];
    const isAuthPage = hideFooterRoutes.includes(location.pathname);
    return (
        <>
            <Navbar />
            <div className="pt-[110px]" />
            {!isAuthPage && (
                <>
                    <TopMenu />
                </>
            )}


            <main
                className={
                    isAuthPage
                        ? "flex-1 flex items-center justify-center"
                        : "flex-1 min-h-[80vh]"
                }
            >
                <Outlet />
            </main>

            {!isAuthPage && <Footer />}
        </>
    );
};

export default UserLayout;