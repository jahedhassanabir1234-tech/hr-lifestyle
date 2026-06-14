import { useState, useEffect } from "react";
import api from "../../services/api";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/getImageUrl";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load categories. Backend server may be offline.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setEditingCategory(null);
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setDescription(category.description || "");
      setImagePreview(getImageUrl(category.image) || null);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated!");
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created!");
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <HiPlus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button onClick={fetchCategories} className="btn-primary">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className={`flex-col items-center justify-center gap-1 ${category.image ? 'hidden' : 'flex'}`}>
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-gray-400 font-poppins">{category.name}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm mb-4">
                {category.description || "No description"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(category)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <HiPencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <HiTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">No categories found</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-field"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : editingCategory ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
