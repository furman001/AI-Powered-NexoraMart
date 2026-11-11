import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";


export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function loadData() {
    const categoriesResponse = await api.get("/categories/");
    const productsResponse = await api.get("/products/");


    setCategories(categoriesResponse.data);
    setProducts(productsResponse.data);
  }


  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    }


    if (selectedImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }


    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [selectedImage]);


  async function uploadImages() {
    if (imageFiles.length === 0) {
      return [];
    }


    const formData = new FormData();


    for (const file of imageFiles) {
      formData.append("files", file);
    }


    const response = await api.post(
      "/uploads/product-images",
      formData
    );


    return response.data.image_urls || [];
  }


  async function uploadVideo() {
    if (!videoFile) {
      return null;
    }


    const formData = new FormData();
    formData.append("file", videoFile);


    const response = await api.post(
      "/uploads/product-video",
      formData
    );


    return response.data.video_url || null;
  }


  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);


    try {
      const imageUrls = await uploadImages();
      const videoUrl = await uploadVideo();


      const payload = {
        category_id: categoryId,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        images: imageUrls,
        video_url: videoUrl,
        model_url: modelUrl || null,
        is_active: true,
      };


      if (editingProduct) {
        if (imageUrls.length > 0) {
          payload.image_url = imageUrls[0];
        } else {
          delete payload.image_url;
        }


        if (!videoUrl) {
          delete payload.video_url;
        }


        await api.put(
          `/products/${editingProduct.id}`,
          payload
        );
      } else {
        payload.image_url = imageUrls[0] || null;


        await api.post("/products/", payload);
      }


      resetForm();
      await loadData();
    } catch (submitError) {
      setError(
        submitError.response?.data?.detail ||
          "Could not save product"
      );
    } finally {
      setLoading(false);
    }
  }


  async function handleStatusChange(productId, newStatus) {
    setError("");


    try {
      await api.patch(
        `/products/${productId}/status?product_status=${newStatus}`
      );


      await loadData();
    } catch (statusError) {
      setError(
        statusError.response?.data?.detail ||
          "Could not update product status"
      );
    }
  }


  async function handleDelete(productId) {
    if (!window.confirm("Delete this product?")) {
      return;
    }


    try {
      await api.delete(`/products/${productId}`);
      await loadData();
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.detail ||
          "Could not delete product"
      );
    }
  }


  function startEdit(product) {
    setEditingProduct(product);
    setCategoryId(product.category_id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setStock(product.stock);
    setModelUrl(product.model_url || "");
    setImageFiles([]);
    setVideoFile(null);
    setError("");
  }


  function resetForm() {
    setEditingProduct(null);
    setCategoryId("");
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setModelUrl("");
    setImageFiles([]);
    setVideoFile(null);
    setError("");
  }


  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 bg-clip-text text-4xl font-black text-transparent">
          Products
        </h1>


        <Link
          to="/dashboard"
          className="rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white transition hover:scale-105"
        >
          Dashboard
        </Link>
      </div>


      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up h-fit rounded-3xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-6 text-xl font-bold">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>


          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              Category
            </span>


            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>


              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>


          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              Product Name
            </span>


            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            />
          </label>


          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              Description
            </span>


            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
          </label>


          <div className="mb-4 grid grid-cols-2 gap-4">
            <label>
              <span className="mb-2 block text-sm font-semibold">
                Price
              </span>


              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </label>


            <label>
              <span className="mb-2 block text-sm font-semibold">
                Stock
              </span>


              <input
                type="number"
                min="0"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                required
              />
            </label>
          </div>


          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              3D Model URL (.glb)
            </span>


            <input
              value={modelUrl}
              onChange={(event) => setModelUrl(event.target.value)}
              placeholder="https://.../headphones.glb"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />


            <p className="mt-2 text-xs text-slate-500">
              Optional. Paste a public Supabase Storage URL ending in .glb.
            </p>
          </label>


          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              Product Images
            </span>


            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setImageFiles(Array.from(event.target.files))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />


            {imageFiles.length > 0 && (
              <p className="mt-2 text-sm text-green-600">
                {imageFiles.length} image(s) selected
              </p>
            )}
          </label>


          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-semibold">
              Short Product Video
            </span>


            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(event) =>
                setVideoFile(event.target.files[0])
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />


            {videoFile && (
              <p className="mt-2 text-sm text-green-600">
                Video selected
              </p>
            )}
          </label>


          {error && (
            <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}


          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Add Product"}
            </button>


            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-200 px-5 font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="animate-fade-up group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-1">
                  {product.images.slice(0, 4).map((imageUrl, index) => (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() =>
                        setSelectedImage({
                          url: imageUrl,
                          name: `${product.name} - Image ${
                            index + 1
                          }`,
                        })
                      }
                      className="relative block cursor-zoom-in overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : product.image_url ? (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage({
                      url: product.image_url,
                      name: product.name,
                    })
                  }
                  className="relative block w-full cursor-zoom-in overflow-hidden"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </button>
              ) : (
                <div className="flex h-48 items-center justify-center bg-slate-200 text-slate-500">
                  No image
                </div>
              )}


              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">
                    {product.name}
                  </h3>


                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      product.status === "published"
                        ? "bg-green-100 text-green-700"
                        : product.status === "archived"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {product.status.toUpperCase()}
                  </span>
                </div>


                <p className="mt-1 text-sm text-slate-500">
                  {product.description || "No description"}
                </p>


                <p className="mt-3 text-2xl font-black text-blue-600">
                  Rs {product.price}
                </p>


                <p className="mt-1 text-sm text-slate-500">
                  Stock: {product.stock}
                </p>


                {product.model_url && (
                  <p className="mt-2 truncate text-xs text-emerald-600">
                    3D model added
                  </p>
                )}


                {product.video_url && (
                  <video
                    src={product.video_url}
                    controls
                    className="mt-4 w-full rounded-xl"
                  />
                )}


                <div className="mt-5 flex flex-wrap gap-3">
                  {product.status !== "published" && (
                    <button
                      onClick={() =>
                        handleStatusChange(product.id, "published")
                      }
                      className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                    >
                      Publish
                    </button>
                  )}


                  {product.status !== "archived" && (
                    <button
                      onClick={() =>
                        handleStatusChange(product.id, "archived")
                      }
                      className="rounded-xl bg-slate-600 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
                    >
                      Archive
                    </button>
                  )}


                  {product.status !== "draft" && (
                    <button
                      onClick={() =>
                        handleStatusChange(product.id, "draft")
                      }
                      className="rounded-xl bg-yellow-600 px-4 py-2 font-semibold text-white transition hover:bg-yellow-700"
                    >
                      Move to Draft
                    </button>
                  )}


                  <button
                    onClick={() => startEdit(product)}
                    className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition hover:scale-110 hover:bg-white/20"
          >
            ×
          </button>


          <div
            onClick={(event) => event.stopPropagation()}
            className="animate-fade-up max-h-[90vh] max-w-5xl"
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />


            <p className="mt-4 text-center text-lg font-semibold text-white">
              {selectedImage.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}