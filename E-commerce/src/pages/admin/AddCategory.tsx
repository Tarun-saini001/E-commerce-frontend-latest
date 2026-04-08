import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import { categorySchema } from "../../schemas/validators";
import { FaRegEye } from "react-icons/fa6";
import { SiEditorconfig } from "react-icons/si";

const AddCategory = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const existingData = location.state;

    console.log('existingData: ', existingData);
    const API = import.meta.env.VITE_API_URL;
    const [name, setName] = useState(existingData?.name || "");
    const [image, setImage] = useState<File | string | undefined>(existingData?.image ? `${API}${existingData.image}` : undefined);
    const [preview, setPreview] = useState<string>(existingData?.image ? `${API}${existingData.image}` : "");
    const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
    const [showImageModal, setShowImageModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        validateField("image", file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setImage(file);
    };

    const validateField = (field: "name" | "image", value: any) => {

        const result = categorySchema.safeParse({
            name: field === "name" ? value : name,
            image: field === "image" ? value : image,
        });

        if (!result.success) {
            const error = result.error.issues.find((e) => e.path[0] === field);
            setErrors((prev) => ({
                ...prev,
                [field]: error?.message || "",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleSubmit = async () => {

        const result = categorySchema.safeParse({
            name,
            image,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });

            console.log('fieldErrors: ', fieldErrors);
            setErrors(fieldErrors);
            return;
        }

        try {

            const formData = new FormData();
            formData.append("name", name);
            if (image instanceof File) {
                formData.append("image", image);
            } else if (typeof image === "string") {
                formData.append("image", image);
            }

            const url = existingData
                ? `${API}/service/category/${existingData._id}`
                : `${API}/service/category/`;

            const method = existingData ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            });

            const data = await res.json();
            console.log("category added/updated", data);

            if (res.ok) {
                toast.success(existingData ? "Category updated successfully!" : "Category added successfully!");
                navigate("/admin/categories");
            } else {
                toast.error(data.message || "Something went wrong", {
                    id: "add-category"
                });
            }
        } catch (err) {
            console.log("Error:", err);
        }
    };

    return (
        <div className="p-6">

            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="text-xl cursor-pointer">
                    <IoIosArrowBack />
                </button>

                <h1 className="text-2xl font-semibold">
                    {existingData ? "Edit Category" : "Add New Category"}
                </h1>
            </div>


            <div className="max-w-md">


                <label className="block mb-2 font-medium">Category Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        validateField("name", e.target.value)
                    }}
                    onBlur={(e) => validateField("name", e.target.value)}
                    className="w-full border rounded p-2 "
                />
                {errors.name && <p className="text-red-500 text-sm mb-4">{errors.name}</p>}

                <label className="block mb-2 font-medium mt-4">Category Image</label>

                <label className="w-40 h-40 border-2 border-dashed flex items-center justify-center rounded cursor-pointer overflow-hidden">
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500">Upload Image</span>
                    )}

                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                </label>
                {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}
                {preview && !errors.image &&(<div className="flex justify-center items-center gap-2 w-40 mt-4 text-xl">
                    {/* view category image option */}
                    <button
                        onClick={() => setShowImageModal(true)}
                        className=" px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer">
                        <FaRegEye />
                    </button>
                    {/* change category image option */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className=" px-3 py-1 rounded bg-gray-300  hover:bg-gray-400 cursor-pointer">
                        <SiEditorconfig />
                    </button>

                </div>)}

                <button
                    onClick={handleSubmit}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                    {existingData ? "Update Category" : "Publish Category"}
                </button>
            </div>

            {showImageModal && (
                <div
                    onClick={() => setShowImageModal(false)}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg relative">

                        <img
                            src={preview}
                            alt="Full Preview"
                            className="max-w-[500px] max-h-[500px] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCategory;