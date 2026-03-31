import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { loading } = useAuth();

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-blue-500 text-xl font-bold">
                Loading...
            </div>
        );

    return (
        <div className="flex">


            <Sidebar />

            <div className="flex-1 ml-64 bg-gray-100 pt-16 min-h-screen">

                <AdminNavbar />

                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;