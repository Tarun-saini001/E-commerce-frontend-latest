import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePasswordSchema } from "../../schemas/validators";
import type { ChangePassword as ChangePasswordType } from "../../types/authTypes";
import { useNavigate } from "react-router-dom";
import { paths } from "../../constants/paths";

const ChangePassword = () => {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [form, setForm] = useState<ChangePasswordType>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof ChangePasswordType, string>>
    >({});

    const [show, setShow] = useState({
        new: false,
        confirm: false,
    });

    const [loading, setLoading] = useState(false);


    const validateField = (name: keyof ChangePasswordType, value: string) => {
        const fieldSchema = changePasswordSchema.shape[name];
        if (!fieldSchema) return;

        const result = fieldSchema.safeParse(value);

        setErrors((prev) => ({
            ...prev,
            [name]: result.success ? "" : result.error.issues[0].message,
        }));
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name as keyof ChangePasswordType, value);
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name as keyof ChangePasswordType, value);
    };


    const handleChangePassword = async () => {
        const result = changePasswordSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ChangePasswordType, string>> = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof ChangePasswordType;

                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch(`${API}/service/user/change-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassword: form.currentPassword,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword,
                    isResetPassword: false
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Password changed successfully");

                setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                navigate(paths.PROFILE);
            } else {
                toast.error(data.message, {
                    id: "change-password-error"
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
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg space-y-6">
                <h2 className="text-3xl font-bold text-center">
                    Change Password
                </h2>

                {/* current pass */}
                <div className="flex flex-col space-y-1">
                    <label>
                        Current Password <span className="text-red-500">*</span>
                    </label>

                    <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter current password"
                        className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 ${errors.currentPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-400 focus:ring-blue-500"
                            }`}
                    />

                    {errors.currentPassword && (<span className="text-red-500 text-xs"> {errors.currentPassword}
                    </span>
                    )}
                </div>

                {/* new pass */}
                <div className="flex flex-col space-y-1 relative">
                    <label>
                        New Password <span className="text-red-500">*</span>
                    </label>

                    <input
                        type={show.new ? "text" : "password"}
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter new password"
                        className={`px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.newPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-400 focus:ring-blue-500"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() => setShow({ ...show, new: !show.new })}
                        className="absolute right-3 top-9 text-gray-600"
                    >
                        {show.new ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    {errors.newPassword && (
                        <span className="text-red-500 text-xs">
                            {errors.newPassword}
                        </span>
                    )}
                </div>

                {/* confirm pass */}
                <div className="flex flex-col space-y-1 relative">
                    <label>
                        Confirm Password <span className="text-red-500">*</span>
                    </label>

                    <input
                        type={show.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm password"
                        className={`px-3 py-2 pr-10 border rounded w-full focus:outline-none focus:ring-2 ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-400 focus:ring-blue-500"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShow({ ...show, confirm: !show.confirm })
                        }
                        className="absolute right-3 top-9 text-gray-600"
                    >
                        {show.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>

                    {errors.confirmPassword && (<span className="text-red-500 text-xs"> {errors.confirmPassword} </span>)}
                </div>


                <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50"
                >
                    {loading ? "Changing..." : "Change"}
                </button>

                {/* <p className="text-center text-blue-600 cursor-pointer hover:underline">
                    Forgot Password?
                </p> */}
            </div>
        </div>
    );
};

export default ChangePassword;