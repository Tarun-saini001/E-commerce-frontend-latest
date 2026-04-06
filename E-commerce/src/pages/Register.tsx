import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { RegisterInput } from "../types/authTypes";
import { registerSchema } from "../schemas/validators";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Register = () => {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<RegisterInput>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterInput, string>>
    >({});

    // validate field
    const validateField = (name: keyof RegisterInput, value: string) => {
        const fieldSchema = registerSchema.shape[name];

        if (!fieldSchema) return;

        const result = fieldSchema.safeParse(value);

        setErrors((prev) => ({
            ...prev,
            [name]: result.success ? "" : result.error.issues[0].message,
        }));
    };

    //on change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // validate ONLY this field
        validateField(name as keyof RegisterInput, value);


        if (name === "confirmPassword") {
            if (value !== formData.password) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Passwords do not match",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                }));
            }
        }

        if (name === "password" && formData.confirmPassword) {
            if (formData.confirmPassword !== value) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "Passwords do not match",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                }));
            }
        }
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name as keyof RegisterInput, value);
    };


    const handleRegister = async () => {
        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            console.log("result.success");
            const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof RegisterInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            console.log("api call");
            const response = await fetch(`${API}/service/user/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                    otpType: 1
                }),
            });
            const data = await response.json();
            console.log("register Data:", data);
            if (response.ok) {
                toast.success("Otp send to your mail");
                localStorage.setItem(
                    "otpSession",
                    JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        otpType: 1,
                        expiresAt: Date.now() + 1 * 60 * 1000,
                    })
                );
                navigate("/verify-otp");
            } else {
                toast.error(data.message || "Something went wrong", {
                    id: "send-otp-error"
                });
            }
        } catch (error) {
            toast.error("Server error", {
                id: "server-error"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black bg-white shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Register</p>

                {/* name */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.name
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-500 focus:ring-blue-500"
                            }`}
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                </div>


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

                {/* Password */}
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

                {/* confirm password */}

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRegister();
                            }}
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
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-black text-white cursor-pointer px-4 w-[60%] py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <div className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register
