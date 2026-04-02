import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import { categorySchema } from "../../schemas/validators";

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
                fieldErrors[field] = err.message;
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
                toast.error(data.message || "Something went wrong");
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
                        onChange={handleImageChange}
                    />
                </label>
                {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}


                <button
                    onClick={handleSubmit}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                    {existingData ? "Update Category" : "Publish Category"}
                </button>
            </div>
        </div>
    );
};

export default AddCategory;