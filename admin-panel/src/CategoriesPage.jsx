import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";

const categoryColors = [
  "from-blue-500 to-cyan-400",
  "from-fuchsia-500 to-pink-400",
  "from-emerald-500 to-lime-400",
  "from-orange-500 to-amber-400",
  "from-violet-500 to-indigo-400",
  "from-rose-500 to-red-400",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCategories() {
    const response = await api.get("/categories/");
    setCategories(response.data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name,
          description,
          is_active: true,
        });
      } else {
        await api.post("/categories/", {
          name,
          description,
          is_active: true,
        });
      }

      setName("");
      setDescription("");
      setEditingCategory(null);
      await loadCategories();
    } catch (submitError) {
      setError(
        submitError.response?.data?.detail ||
          "Could not save category"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(categoryId) {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      await loadCategories();
    } catch (deleteError) {
      setError(
        deleteError.response?.data?.detail ||
          "Could not delete category"
      );
    }
  }

  function startEdit(category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setError("");
  }

  function cancelEdit() {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-blue-600 via-fuchsia-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent">
          Categories
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
            {editingCategory ? "Edit Category" : "Add Category"}
          </h2>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold">
              Category Name
            </span>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
              required
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-semibold">
              Description
            </span>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            />
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
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl bg-slate-200 px-5 font-semibold text-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`animate-fade-up rounded-3xl bg-gradient-to-br ${
                categoryColors[index % categoryColors.length]
              } p-6 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
            >
              <h3 className="text-2xl font-black">
                {category.name}
              </h3>

              <p className="mt-2 text-sm opacity-80">
                {category.slug}
              </p>

              <p className="mt-4 text-sm opacity-90">
                {category.description || "No description"}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => startEdit(category)}
                  className="rounded-xl bg-white/20 px-4 py-2 font-semibold backdrop-blur transition hover:bg-white/30"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="rounded-xl bg-red-600/80 px-4 py-2 font-semibold transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}