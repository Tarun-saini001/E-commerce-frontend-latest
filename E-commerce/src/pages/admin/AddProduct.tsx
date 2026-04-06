
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import type { ProductInput } from "../../types/productTypes";
import { productSchema } from "../../schemas/validators";

interface Category {
    _id: string;
    name: string;
}

const AddProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const existingData = location.state;

    const API = import.meta.env.VITE_API_URL;

    const [categories, setCategories] = useState<Category[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<
        Partial<Record<keyof ProductInput, string>>
    >({});

    useEffect(() => {
        if (existingData) {
            setFormData({
                title: existingData.title || "",
                description: existingData.description || "",
                category: existingData.categoryName || "",
                price: existingData.price?.toString() || "",
                stock: existingData.stock?.toString() || "",
            });

            const imageUrl = existingData.thumbnail.startsWith("http")
                ? existingData.thumbnail
                : `${API}/${existingData.thumbnail}`;

            setPreview(imageUrl);
        }
    }, [existingData]);


    const validateField = (name: keyof ProductInput, value: any) => {
        const fieldSchema = productSchema.shape[name];

        if (!fieldSchema) return;

        let parsedValue = value;

        // convert number fields
        if (name === "price" || name === "stock") {
            parsedValue = Number(value);
        }

        const result = fieldSchema.safeParse(parsedValue);

        setErrors((prev) => ({
            ...prev,
            [name]: result.success ? "" : result.error.issues[0].message,
        }));
    };

    const validateImage = (file: File | null) => {
        const result = productSchema.shape.thumbnail.safeParse(file);

        setErrors((prev) => ({
            ...prev,
            thumbnail: result.success ? "" : result.error.issues[0].message,
        }));
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/service/category`, {
                credentials: "include",
            });

            const data = await res.json();
            setCategories(data.data.categories);
        } catch (err) {
            console.log("Error fetching categories", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name as keyof ProductInput, value);
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        validateField(name as keyof ProductInput, value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));

            validateImage(file);
        }
    };

    // const handleSubmit = async (e: any) => {
    //     e.preventDefault();

    //     try {
    //         const form = new FormData();

    //         form.append("title", formData.title);
    //         form.append("description", formData.description);
    //         form.append("categoryName", formData.category);
    //         form.append("price", formData.price);
    //         form.append("stock", formData.stock);

    //         if (image) {
    //             form.append("thumbnail", image);
    //         }

    //         const url = existingData
    //             ? `${API}/service/product/${existingData._id}`
    //             : `${API}/service/product/`;

    //         const method = existingData ? "PATCH" : "POST";

    //         const res = await fetch(url, {
    //             method,
    //             credentials: "include",
    //             body: form,
    //         });

    //         const data = await res.json();
    //         console.log("Add product ", data);

    //         if (res.ok) {
    //             toast.success(
    //                 existingData
    //                     ? "Product updated successfully"
    //                     : "Product added successfully"
    //             );
    //             navigate("/admin/products");
    //         } else {
    //             toast.error(data.message || "Error adding product");
    //         }
    //     } catch (err) {
    //         console.log("Error adding product", err);
    //         toast.error("Something went wrong");
    //     }
    // };

    const handleSubmit = async (e: any) => {

        e.preventDefault();



        const finalData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
            stock: Number(formData.stock),
            thumbnail: image || preview,
        };

        const result = productSchema.safeParse(finalData);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ProductInput, string>> = {};

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof ProductInput;

                if (!fieldErrors[field]) {
                    fieldErrors[field] = err.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const form = new FormData();

            form.append("title", formData.title);
            form.append("description", formData.description);
            form.append("categoryName", formData.category);
            form.append("price", formData.price);
            form.append("stock", formData.stock);

            if (image) {
                form.append("thumbnail", image);
            }

            const url = existingData
                ? `${API}/service/product/${existingData._id}`
                : `${API}/service/product/`;

            const method = existingData ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
                body: form,
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(
                    existingData
                        ? "Product updated successfully"
                        : "Product added successfully"
                );
                navigate("/admin/products");
            } else {
                toast.error(data.message || "Error adding product", {
                    id: "add-product-error"
                });
            }
        } catch (err) {
            toast.error("Something went wrong", {
                id: "server-error"
            });
        }
    };

    return (
        <div className="p-6">

            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)}>
                    <IoIosArrowBack />
                </button>
                {existingData ? "Edit Product" : "Add Product"}
            </div>

            <form
                onSubmit={handleSubmit}

                className="bg-white p-6 rounded-xl shadow space-y-5"
            >
                {/* title */}
                <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border p-2 rounded"

                    />
                    {errors.title && (
                        <p className="text-red-500 text-xs">{errors.title}</p>
                    )}
                </div>

                {/* description */}
                <div>
                    <label className="block mb-1 font-medium">
                        Product Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border p-2 rounded h-28"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs">{errors.description}</p>
                    )}
                </div>

                {/* category*/}
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border p-2 rounded"

                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* stock and price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border p-2 rounded"

                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 font-medium">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full border p-2 rounded"

                        />
                        {errors.stock && (
                            <p className="text-red-500 text-xs">{errors.stock}</p>
                        )}
                    </div>
                </div>

                {/* image */}
                <div>
                    <label className="block mb-2 font-medium">Product Image</label>

                    <label className="w-40 h-40 border-2 border-dashed flex items-center justify-center rounded cursor-pointer overflow-hidden">

                        {preview ? (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm text-center px-2">
                                Upload Image
                            </span>
                        )}

                        <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                        />
                    </label>
                    {errors.thumbnail && (
                        <p className="text-red-500 text-xs">{errors.thumbnail}</p>
                    )}
                </div>


                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    {existingData ? "Update Product" : "Publish Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;