import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import { useAuth } from "../context/AuthContext";
import type { AppDispatch } from "../redux/store";

const CartLoader = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return null;
};

export default CartLoader;