
// import './App.css'
// import { Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Home from './pages/Home'
// import About from './pages/About'
// import ContactUs from './pages/ContactUs'
// import Register from './pages/Register'
// import Login from './pages/Login'
// import VerifyOtp from './pages/VerifyOtp'
// import ForgotPassword from './pages/ForgotPassword'
// import ResetPassword from './pages/ResetPassword'
// import Profile from './pages/profile'
// import ProtectedRoute from './components/ProtectedRoute'
// // import Dashboard from './pages/Dashboard'
// import AdminLayout from './pages/admin/AdminLayout'
// import DashboardHome from './pages/admin/DashboardHome'
// import AddCategory from './pages/admin/AddCategory'
// import ListCategories from './pages/admin/ListCategories'
// import AddProduct from './pages/admin/AddProduct'
// import ListProducts from './pages/admin/ListProducts'
// import UsersList from './pages/admin/UsersList'
// import { useAuth } from './context/AuthContext'
// import ProductDetails from './pages/ProductDetails'
// import Cart from './pages/Cart'
// import { useDispatch } from 'react-redux'
// import type { AppDispatch } from './redux/store'
// import { useEffect } from 'react'
// import { fetchCart } from './redux/slices/cartSlice'
// import { fetchWishlist } from "./redux/slices/wishlistSlice";
// import AllProducts from './pages/AllProducts'
// import Footer from './components/Footer'
// import TopMenu from './components/TopMenu'
// import Wishlist from './pages/Wishlist'
// import Orders from './pages/Orders'
// import ScrollToTop from './components/ScrollToTop'
// import Checkout from './pages/Checkout'
// import OrderDetails from './pages/OrderDetails'

// function App() {

//   const { loading } = useAuth();
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(fetchCart());
//     dispatch(fetchWishlist());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }



//   return (
//     <>
//       <div>
//         < Navbar />
//         <div className="pt-[110px]"></div>
//         <TopMenu />
//         <ScrollToTop />
//         <Routes>
//           <Route path='/' element={<Home />} />
//           <Route path='/about' element={<About />} />
//           <Route path='/contact-us' element={<ContactUs />} />
//           <Route path='/register' element={<Register />} />
//           <Route path='/login' element={<Login />} />
//           <Route path='*' element={<Home />} />
//           <Route path='/verify-otp' element={<VerifyOtp />} />
//           <Route path='/forgot-password' element={<ForgotPassword />} />
//           <Route path='/reset-password' element={<ResetPassword />} />
//           <Route path='/product/:id' element={<ProductDetails />} />
//           <Route path='/cart' element={<Cart />} />
//           <Route path="/products" element={<AllProducts />} />
//           <Route path="/wishlist" element={<Wishlist />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/orders/:orderId" element={<OrderDetails />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//           {/* <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} /> */}
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<DashboardHome />} />
//             <Route path="categories/add" element={<AddCategory />} />
//             <Route path="categories/list" element={<ListCategories />} />
//             <Route path="products/add" element={<AddProduct />} />
//             <Route path="products/list" element={<ListProducts />} />
//             <Route path="users" element={<UsersList />} />
//           </Route>
//         </Routes>

//         <Footer />
//       </div>
//     </>
//   )
// }

// export default App


import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

// user pages
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactUs from "./pages/ContactUs";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/profile";

// admin pages
// import AddProduct from "./pages/admin/AddProduct";
import DashboardHome from "./pages/admin/DashboardHome";
import UsersList from "./pages/admin/UsersList";
import Categories from "./pages/admin/Categories";
import AddCategory from "./pages/admin/AddCategory";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import OrdersList from "./pages/admin/OrdersList";
import AdminProfile from "./pages/admin/AdminProfile";
function App() {
  return (
    <Routes>

      {/* user routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path='/contact-us' element={<ContactUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

     {/* admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        {/* <Route path="products/add" element={<AddProduct />} />
        <Route path="products/add" element={<AddProduct />} /> */}
        <Route path="users" element={<UsersList/>}/>
        <Route path="categories" element={<Categories/>}/>
        <Route path="add-category" element={<AddCategory/>}/>
        <Route path="products" element={<Products/>}/>
        <Route path="add-product" element={<AddProduct/>}/>
        <Route path="orders" element={<OrdersList/>}/>
        <Route path="profile" element={<AdminProfile/>}/>
      </Route>

    </Routes>
  );
}

export default App;


