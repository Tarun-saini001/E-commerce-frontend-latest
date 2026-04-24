import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../constants/paths";

const VerifyOtp = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const storedSession = localStorage.getItem("otpSession");

    const {
        email,
        name,
        password,
        confirmPassword,
        otpType,
        expiresAt,
    } = storedSession ? JSON.parse(storedSession) : {};

    useEffect(() => {
        if (!storedSession) {
            navigate(paths.LOGIN, { replace: true });
        }
    }, []);

    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(expiresAt || 0);

    // countdown
    useEffect(() => {
        if (!expiresAt) return;

        const updateTimer = () => {
            const remaining = Math.max(
                0,
                Math.floor((expiresAt - Date.now()) / 1000)
            );
            setTimeLeft(remaining);
        };

        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);


    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };


    useEffect(() => {
        if (timeLeft === 0 && expiresAt) {
            localStorage.removeItem("otpSession");
            toast.error("OTP expired", {
                id: "otp-expired"
            });
            navigate(paths.REGISTER);
        }
    }, [timeLeft]);


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
            toast.error("OTP expired", {
                id: "expired-otp"
            });
            return;
        }

        try {
            setLoading(true);

            console.log('otpType: ', otpType);
            const response = await fetch(`${API}/service/user/verifyOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                    otpType,
                    name: otpType == 1 ? name : undefined,
                    password: otpType == 1 ? password : undefined,
                    confirmPassword: otpType == 1 ? confirmPassword : undefined
                }),
            });

            const data = await response.json();
            console.log('data: verify-otp', data);

            if (response.ok) {
                if (otpType === 1) {
                    // register
                    localStorage.removeItem("otpSession");
                    login();
                    toast.success("Account verified successfully!");
                    navigate(paths.LOGIN);
                }

                else if (otpType === 3) {
                    localStorage.removeItem("otpSession");
                    console.log('data?.tempToken: ', data?.tempToken);
                    // forgot password
                    localStorage.setItem("tempToken", data?.tempToken)
                    toast.success("OTP verified successfully!");
                    navigate(paths.RESET_PASSWORD, {
                        state: { email },
                    });
                }
            } else {
                setError(data.message || "Invalid OTP");
                toast.error(data.message || "Invalid OTP", {
                    id: "invalid-otp"
                });
            }
        } catch {
            toast.error("Server error", {
                id: "server-error"
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex w-[80%] justify-center items-center my-15">
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
                    {timeLeft > 0
                        ? `Expires in ${formatTime(timeLeft)}`
                        : "OTP expired"}
                </p>

                <button
                    onClick={handleVerify}
                    disabled={loading || otp.length !== 4 || timeLeft === 0}
                    className="bg-black cursor-pointer text-white px-4 w-[60%] py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;