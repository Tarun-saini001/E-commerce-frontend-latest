import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { createOrder } from "../../redux/slices/orderSlice";
import type { AppDispatch } from "../../redux/store";

const PaymentSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    console.log("sessionId:", sessionId);
    useEffect(() => {
        console.log("useEffect triggered");
        if (!sessionId) {
            console.log("No sessionId");
            return;
        }

        console.log("Calling API...");

        dispatch(createOrder({ sessionId }))
            .unwrap()
            .then(() => {
                console.log("Order success");
                dispatch(clearCart());
                navigate("/");
            })
            .catch((err) => {
                console.log("Order failed", err);
            });

    }, [sessionId, dispatch, navigate]);
    return <h1>Payment Successful </h1>;
};

export default PaymentSuccess;