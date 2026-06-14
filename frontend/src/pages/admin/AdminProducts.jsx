import { useState, useEffect } from "react";
import api from "../../services/api";
import { HiPlus, HiPencil, HiTrash, HiEye, HiEyeOff } from "react-icons/hi";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/getImageUrl";
import { uploadMultipleToCloudinary } from "../../utils/uploadImage";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [sizeChart, setSizeChart] = useState([]);
  const [chartCol, setChartCol] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products/admin/all");
      setProducts(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to load products. Backend server may be offline.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setCategory("");
    setBrand("");
    setStock("");
    setFeatured(false);
    setSizes([]);
    setSizeInput("");
    setSizeChart([]);
    setChartCol("");
    setImagePreviews([]);
    setExistingImages([]);
    setNewImageFiles([]);
    setEditingProduct(null);
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setDiscountPrice(product.discountPrice || "");
      setCategory(product.category?._id || "");
      setBrand(product.brand || "");
      setStock(product.stock);
      setFeatured(product.featured);
      setSizes(product.sizes || []);
      setSizeChart(product.sizeChart || []);
      setExistingImages(product.images || []);
      setImagePreviews([]);
      setNewImageFiles([]);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
    setNewImageFiles((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImageUrls = [...existingImages];

      if (newImageFiles.length > 0) {
        toast.loading("Uploading images...", { id: "upload" });
        const newUrls = await uploadMultipleToCloudinary(newImageFiles);
        uploadedImageUrls = [...uploadedImageUrls, ...newUrls];
        toast.dismiss("upload");
      }

      const payload = {
        name,
        description,
        price: Number(price),
        discountPrice: Number(discountPrice) || 0,
        category,
        brand: brand || "",
        stock: Number(stock),
        featured,
        sizes,
        sizeChart,
        images: uploadedImageUrls,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success("Product updated!");
      } else {
        await api.post("/products", payload);
        toast.success("Product created!");
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle-active`);
      toast.success("Product status updated!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <HiPlus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Error</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button onClick={fetchProducts} className="btn-primary">Retry</button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Featured</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23ccc' viewBox='0 0 24 24'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E"; }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <HiPlus className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      {product.discountPrice > 0 ? (
                        <span>
                          <span className="line-through text-gray-400 text-sm">৳{product.price}</span>
                          <span className="text-red-600 ml-1">৳{product.discountPrice}</span>
                        </span>
                      ) : (
                        <span>৳{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock <= 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category?.name || "-"}</td>
                    <td className="px-4 py-3">
                      {product.featured ? (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(product._id)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition ${
                          product.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {product.isActive ? (
                          <><HiEye className="h-3 w-3" /> Active</>
                        ) : (
                          <><HiEyeOff className="h-3 w-3" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <HiPencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <HiTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-400">No products found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
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
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="input-field"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium mb-1">Sizes (e.g. S, M, L, XL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = sizeInput.trim();
                        if (val && !sizes.includes(val)) {
                          setSizes([...sizes, val]);
                          setSizeInput("");
                        }
                      }
                    }}
                    className="input-field"
                    placeholder="Type size and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = sizeInput.trim();
                      if (val && !sizes.includes(val)) {
                        setSizes([...sizes, val]);
                        setSizeInput("");
                      }
                    }}
                    className="btn-secondary text-sm whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((s, i) => (
                      <span key={i} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-red-500 font-bold ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Chart */}
              <div>
                <label className="block text-sm font-medium mb-1">Size Chart (optional)</label>
                <p className="text-xs text-gray-400 mb-2">Add rows with size measurements. Columns are flexible.</p>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={chartCol}
                    onChange={(e) => setChartCol(e.target.value)}
                    className="input-field"
                    placeholder='e.g. M, 30-32, 20, 37'
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const parts = chartCol.split(",").map(p => p.trim()).filter(Boolean);
                      if (parts.length >= 1) {
                        const row = {
                          size: parts[0] || "",
                          waist: parts[1] || "",
                          hip: parts[2] || "",
                          length: parts[3] || "",
                          other: parts.slice(4).join(", ") || "",
                        };
                        setSizeChart([...sizeChart, row]);
                        setChartCol("");
                      }
                    }}
                    className="btn-secondary text-sm whitespace-nowrap"
                  >
                    Add Row
                  </button>
                </div>
                {sizeChart.length > 0 && (
                  <div className="border rounded overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 text-left">Size</th>
                          <th className="px-2 py-1 text-left">Waist</th>
                          <th className="px-2 py-1 text-left">Hip</th>
                          <th className="px-2 py-1 text-left">Length</th>
                          <th className="px-2 py-1 text-left">Other</th>
                          <th className="px-2 py-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1">{row.size}</td>
                            <td className="px-2 py-1">{row.waist}</td>
                            <td className="px-2 py-1">{row.hip}</td>
                            <td className="px-2 py-1">{row.length}</td>
                            <td className="px-2 py-1">{row.other}</td>
                            <td className="px-2 py-1">
                              <button type="button" onClick={() => setSizeChart(sizeChart.filter((_, j) => j !== i))} className="text-red-500 text-xs">&times;</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Images (max 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-field"
                />

                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={getImageUrl(img)} alt="" className="w-20 h-20 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((preview, i) => (
                      <div key={i} className="relative group">
                        <img src={preview} alt="" className="w-20 h-20 object-cover rounded border" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Featured Product</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : editingProduct ? "Update" : "Create"}
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

export default AdminProducts;
