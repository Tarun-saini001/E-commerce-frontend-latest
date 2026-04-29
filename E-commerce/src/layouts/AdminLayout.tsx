import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";
import { useAuth } from "../context/AuthContext";
import AdminLayoutSkeleton from "../components/admin/AdminLayoutSkeleton";

const AdminLayout = () => {
    const { loading } = useAuth();

    if(loading)return<AdminLayoutSkeleton/>

    
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