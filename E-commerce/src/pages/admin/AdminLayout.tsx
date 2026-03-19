import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar /> 
      <div className="flex-1 bg-gray-100 p-6 ml-64">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminLayout;