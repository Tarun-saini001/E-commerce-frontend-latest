import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schemas/validators";
import type { LoginInput } from "../types/authTypes";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState<LoginInput>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
    const [loading, setLoading] = useState(false);

    // Validate individual field
    const validateField = (name: keyof LoginInput, value: string) => {
        const fieldSchema = loginSchema.shape[name];
        if (!fieldSchema) return;

        const result = fieldSchema.safeParse(value);
        setErrors((prev) => ({
            ...prev,
            [name]: result.success ? "" : result.error.issues[0].message,
        }));
    };

    // handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // validate field on typing
        validateField(name as keyof LoginInput, value);
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name as keyof LoginInput, value);
    };

    // Handle login click
    const handleLogin = async () => {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            // Show all validation errors
            const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof LoginInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await fetch(`${API}/onboarding/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    app: "anstmasr2588",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                login(data.data?.token, {
                    name:data.data?.fullName,
                    email: data.data?.email
                })
                toast.success("login successfully!");
                navigate("/");
            } else {
                setErrors({ password: "Invalid password" });
                toast.error(data.message || "Something went wrong");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Login</p>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Email"
                        className="bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label className="text-sm font-medium text-left">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter password"
                        className="bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-4 rounded p-2 w-[60%] bg-black text-white cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Sending OTP..." : "Login"}
                </button>
                
                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-blue-600 font-medium cursor-pointer text-sm"
                >
                    Forgot Password?
                </p>

                <div className="w-[80%] text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="text-blue-600 cursor-pointer font-medium">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;