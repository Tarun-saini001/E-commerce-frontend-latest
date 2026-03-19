import { useState } from "react";
import toast from "react-hot-toast";

const AddCategory = () => {
  const API = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("categoryName", name);
      formData.append("image", image);

      const response = await fetch(`${API}/admin/category`, {
        method: "POST",
        body: formData,
        headers: {
          app: "anstmasr2588",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Category added successfully!");
        setName("");
        setImage(null);
        setPreview(null);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Category</h2>

      {/* Category Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Category Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded border"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Category"}
      </button>
    </div>
  );
};

export default AddCategory;