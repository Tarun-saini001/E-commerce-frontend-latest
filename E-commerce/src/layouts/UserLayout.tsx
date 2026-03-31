import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopMenu from "../components/TopMenu";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const UserLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return <div className="flex justify-center items-center min-h-[70vh] text-blue-500 text-xl font-bold">Loading...</div>;

    if (user?.role === 1) {
        navigate("/admin" , { replace: true });
    }
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