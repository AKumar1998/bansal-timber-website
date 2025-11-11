import { useEffect, useState } from "react";
import CategoryProducts from "./CategoryProducts.jsx";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    name: "",
    slug: "",
    has_attributes: false,
    bundle_name: "",
  });
  const [editing, setEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/products/get_categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Slugify name and auto-fill bundle
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((f) => ({
      ...f,
      name,
      slug,
      bundle_name: name ? `${name} Attributes` : "",
    }));
  };

  // Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = editing
      ? "https://bansaltimber.com/api/products/update_category.php"
      : "https://bansaltimber.com/api/products/add_category.php";

    const payload = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      has_attributes: form.has_attributes,
      bundle_name: form.bundle_name,
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      setForm({ id: null, name: "", slug: "", has_attributes: false, bundle_name: "" });
      setEditing(false);
      fetchCategories();
    } else {
      alert(data.error || "Error saving category.");
    }
  };

  // Edit Category
  const handleEdit = (cat) => {
    setEditing(true);
    setForm({ ...cat, has_attributes: false }); // Hide toggle during edit
    setShowModal(true);
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? All products under it will be removed.")) return;
    const res = await fetch("https://bansaltimber.com/api/products/delete_category.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchCategories();
  };

  // Switch view to products in category
  if (selectedCategory) {
    return (
      <CategoryProducts
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Categories & Products
        </h1>
        <button
          onClick={() => {
            setEditing(false);
            setForm({
              id: null,
              name: "",
              slug: "",
              has_attributes: false,
              bundle_name: "",
            });
            setShowModal(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-gray-500">No categories found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 border-b text-sm text-gray-700">{cat.id}</td>
                  <td className="px-6 py-3 border-b text-sm text-gray-800 font-medium">
                    {cat.name}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-500">
                    {cat.slug || "-"}
                  </td>
                  <td className="px-6 py-3 border-b text-right text-sm space-x-3">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full border p-2 rounded"
              />

              {!editing && (
                <>
                  <div className="flex items-center justify-between mt-3">
                    <label className="text-sm font-medium text-gray-700">
                      Does this category have attributes?
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          has_attributes: !f.has_attributes,
                        }))
                      }
                      className={`w-12 h-6 flex items-center rounded-full transition-all duration-200 ${
                        form.has_attributes ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                          form.has_attributes ? "translate-x-6" : "translate-x-1"
                        }`}
                      ></span>
                    </button>
                  </div>

                  {form.has_attributes && (
                    <div className="space-y-2 mt-3 border-t pt-3">
                      <p className="text-sm text-gray-600">
                        The bundle will be automatically created with this name:
                      </p>
                      <input
                        type="text"
                        value={form.bundle_name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, bundle_name: e.target.value }))
                        }
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

