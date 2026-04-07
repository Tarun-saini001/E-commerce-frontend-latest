import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema } from "../schemas/validators";
import type { LoginInput } from "../types/authTypes";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginInput>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        if (user) {
            if (user.role === 1) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/");
            }
        }
    }, [user]);

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
            const response = await fetch(`${API}/service/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
                credentials: "include"
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                login();
                toast.success("login successfully!", {
                    id: "login-success"
                });
                // console.log('data.data: ', data.data);
                // if (user?.role === 1) {
                //     navigate("/admin", { replace: true });
                // } else {
                //     navigate("/");
                // }
            } else {
                if (data.message === "User not found") {
                    setErrors({ email: "User not found" });
                } else if (data.message === "Invalid password") {
                    setErrors({ password: "Invalid password" });
                }
                toast.error(data.message || "Something went wrong", {
                    id: "login-error"
                });
            }
        } catch (err) {
            toast.error("Server error", {
                id: "server-error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black bg-white shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Login</p>

                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.email
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* password */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Password <span className="text-red-500">*</span></label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleLogin();
                            }}
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

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="mt-4 rounded p-2 w-[60%] bg-black text-white cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
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