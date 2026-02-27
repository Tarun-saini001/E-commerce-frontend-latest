import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const { email, name, password, expiresIn } = location.state || {};

    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(expiresIn || 0);

    // Countdown
    useEffect(() => {
        if (!timeLeft) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // OTP change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // remove non-numeric characters
        value = value.replace(/\D/g, "");


        setOtp(value);

        // validation
        if (value.length < 4) {
            setError("OTP must be exactly 4 digits");
        } else {
            setError("");
        }
    };

    // verify otp
    const handleVerify = async () => {
        if (otp.length !== 4) {
            setError("OTP must be exactly 4 digits");
            return;
        }

        if (timeLeft === 0) {
            toast.error("OTP expired");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API}/onboarding/user/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    app: "anstmasr2588",
                },
                body: JSON.stringify({ email, otp, otpType: 1, fullName: name, password }),
            });

            const data = await response.json();
            console.log('data: verify-otp', data);

            if (response.ok) {
                login(data?.token);
                toast.success("Account verified successfully!");
                navigate("/");
            } else {
                 setError(data.message || "Invalid OTP");
                toast.error(data.message || "Invalid OTP");
            }
        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Verify OTP</p>

                <p className="text-sm text-gray-600 text-center w-[80%]">
                    OTP sent to <span className="font-semibold">{email}</span>
                </p>

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>
                        Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        value={otp}
                        onChange={handleChange}
                        placeholder="Enter 4-digit OTP"
                        className="bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    />
                    {error && <span className="text-red-500 text-xs">{error}</span>}
                </div>

                <p className="text-sm text-gray-500">
                    {timeLeft > 0 ? `Expires in ${timeLeft}s` : "OTP expired"}
                </p>

                <button
                    onClick={handleVerify}
                    disabled={loading || otp.length !== 4 || timeLeft === 0}
                    className="bg-black text-white px-4 w-[60%] py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;