import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordSchema } from "../schemas/validators";
import toast from "react-hot-toast";

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

            const resetToken = localStorage.getItem("resetToken");

            if (!resetToken) {
                toast.error("autherizstion error");
                navigate("/forgot-password");
                return;
            }

            const response = await fetch(`${API}/onboarding/user/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resetToken}`,
                    app: "anstmasr2588",
                },
                body: JSON.stringify({
                    newPassword: formData.password,
                    isResetPassword: true
                }),
            });

            const data = await response.json();
            console.log('data:reset password ', data);

            if (response.ok) {
                toast.success("Password reset successfully!");
                const authToken = localStorage.getItem("token"); // normal login token

                localStorage.removeItem("resetToken");

                if (authToken) {
                    navigate("/"); // already logged in - navigate home
                } else {
                    navigate("/login"); // not logged in - navigate login
                }
            } else {
                toast.error(data.message);
            }
        } catch (err) {
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
                    <input
                        type="password"
                        placeholder="New Password"
                        className="border px-3 py-2 rounded "
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                    {errors.password && (
                        <span className="text-red-500 text-xs">{errors.password}</span>
                    )}
                </div>


                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="border px-3 py-2 rounded "
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                    />
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