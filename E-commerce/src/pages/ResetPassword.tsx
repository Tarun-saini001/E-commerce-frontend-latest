import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordSchema } from "../schemas/validators";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const API = import.meta.env.VITE_API_URL;

    const email = location.state?.email;

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        const resetToken = localStorage.getItem("tempToken");
        if (!email || !resetToken) {
            toast.error("Unauthorized access");
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleReset = async () => {

        const result = resetPasswordSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: any = {};
            result.error.issues.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            setLoading(true);

            const resetToken = localStorage.getItem("tempToken");
            console.log('resetToken: ', resetToken);

            if (!resetToken) {
                toast.error("Autherizstion error");
                navigate("/forgot-password");
                return;
            }

            const response = await fetch(`${API}/service/user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${resetToken}`,
                },
                body: JSON.stringify({
                    newPassword: formData.password,
                    confirmPassword: formData.confirmPassword,
                    isResetPassword: true
                }),
            });

            const data = await response.json();
            console.log('data:reset password ', data);

            if (response.ok) {
                toast.success("Password reset successfully!");
                // const authToken = localStorage.getItem("token"); // normal login token

                localStorage.removeItem("tempToken");

                // if (authToken) {
                //     navigate("/"); // already logged in - navigate home
                // } else {
                navigate("/login"); // not logged in - navigate login
                // }
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Reset Password</p>
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>New Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className={`bg-white px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.password
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-500 focus:ring-blue-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-red-500 text-xs">{errors.password}</span>
                    )}
                </div>


                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            className={`bg-white px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.confirmPassword
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-500 focus:ring-blue-500"
                                }`}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
                    )}

                </div>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-black text-white px-4 w-[40%] py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;