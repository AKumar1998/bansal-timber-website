import { useEffect, useState } from "react";
import CategoryProducts from "./CategoryProducts.jsx";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    slug: "",
    has_attributes: false,
    bundle_name: "",
  });

  // Global status message system
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // loading | success | error

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    if (type !== "loading") {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2200);
    }
  };

  const messageClasses = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  // Fetch categories
  const fetchCategories = () => {
    setLoading(true);

    fetch("https://bansaltimber.com/api/products/get_categories.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => {
        showMessage("Failed to load categories", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Slugify name + auto bundle
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((prev) => ({
      ...prev,
      name,
      slug,
      bundle_name: name ? `${name} Bundle` : "",
    }));
  };

  // Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage(editing ? "Updating..." : "Saving...", "loading");

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
    setIsSubmitting(false);

    if (data.success) {
      showMessage(editing ? "Category updated!" : "Category added!", "success");

      setShowModal(false);
      resetForm();
      fetchCategories();
    } else {
      showMessage(data.error || "Failed to save category.", "error");
    }
  };

  const resetForm = () => {
    setEditing(false);
    setForm({ id: null, name: "", slug: "", has_attributes: false, bundle_name: "" });
  };

  // Edit
  const handleEdit = (cat) => {
    setEditing(true);
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      has_attributes: false,
      bundle_name: cat.bundle_name || "",
    });
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? All related products will be removed.")) return;

    showMessage("Deleting category...", "loading");

    const res = await fetch("https://bansaltimber.com/api/products/delete_category.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      showMessage("Category deleted.", "success");
      fetchCategories();
    } else {
      showMessage("Failed to delete category.", "error");
    }
  };

  // Switch view to Category Products
  if (selectedCategory) {
    return <CategoryProducts category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <div className="space-y-6">

      {/* Global Message */}
      {message && (
        <div className={`border text-center font-medium p-2 rounded ${messageClasses[messageType]}`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Categories & Products</h1>

        <button
          onClick={() => {
            setEditing(false);
            resetForm();
            setShowModal(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow transition"
        >
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-gray-500">No categories found.</p>
        ) : (
          <table className="min-w-[600px] w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Category Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Slug</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b">{cat.id}</td>
                  <td className="px-6 py-3 border-b font-medium text-gray-700">{cat.name}</td>
                  <td className="px-6 py-3 border-b text-gray-500">{cat.slug || "-"}</td>
                  <td className="px-6 py-3 border-b text-right space-x-3">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
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
                className="w-full border rounded p-2"
              />

              <input
                type="text"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full border rounded p-2"
              />

              {!editing && (
                <>
                  <div className="flex items-center justify-between pt-2">
                    <label className="text-sm text-gray-700 font-medium">
                      Does this category have attributes?
                    </label>

                    <button
                      type="button"
                      className={`w-12 h-6 rounded-full transition ${
                        form.has_attributes ? "bg-orange-500" : "bg-gray-400"
                      }`}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          has_attributes: !prev.has_attributes,
                        }))
                      }
                    >
                      <span
                        className={`block w-5 h-5 bg-white rounded-full shadow transform transition ${
                          form.has_attributes ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {form.has_attributes && (
                    <div className="space-y-2 border-t pt-3">
                      <p className="text-sm text-gray-600">
                        Default Bundle Name (editable)
                      </p>
                      <input
                        type="text"
                        value={form.bundle_name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, bundle_name: e.target.value }))
                        }
                        className="w-full border rounded p-2"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  {isSubmitting ? "Saving..." : editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

