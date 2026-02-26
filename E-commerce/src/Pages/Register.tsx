import { useState } from "react";
import { Link } from "react-router-dom";
import type { RegisterInput } from "../types/authTypes";
import { registerSchema } from "../schemas/validators";
import toast from "react-hot-toast";

const Register = () => {
    const API = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const updatedData = {
            ...formData,
            [name]: value,
        };

        setFormData(updatedData);

        const result = registerSchema.safeParse(updatedData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof RegisterInput;
                fieldErrors[field] = err.message;
            });

            setErrors(fieldErrors);
        } else {
            setErrors({});
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
            const response = await fetch(`${API}/onboarding/user/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    app: "anstmasr2588",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    otpType: 1
                }),
            });
            const data = await response.json();
            console.log("Validated Data:", data);
            if (response.ok) {
                toast.success("OTP sent successfully!");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-4">
            <div className="w-full max-w-md text-black shadow-2xl rounded-3xl py-8 flex flex-col items-center gap-5">
                <p className="text-4xl">Register</p>

                {/* name */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter name"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                    {errors.name && (<span className="text-red-500 text-xs">{errors.name}</span>)}
                </div>


                {/* email */}
                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Email <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter email"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                {/* password */}

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter password"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>

                {/* confirm password */}

                <div className="w-[80%] flex flex-col space-y-1">
                    <label>Confirm Password <span className="text-red-500">*</span></label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="confirm password"
                        className={`bg-white px-3 py-2 border rounded focus:outline-none focus:ring-2`}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-black text-white px-4 w-[60%] py-2 rounded disabled:opacity-50"
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
