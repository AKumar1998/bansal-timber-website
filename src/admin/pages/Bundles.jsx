import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation

export default function Bundles() {
  const [bundles, setBundles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    category_id: "",
    name: "",
    description: "",
  });

  const navigate = useNavigate(); // ✅ React Router navigation

  // ------------------------------------------
  // Fetch all bundles
  // ------------------------------------------
  const fetchBundles = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/products/get_categories.php")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || [];
        setCategories(cats);

        // Fetch bundle for each category
        Promise.all(
          cats.map((cat) =>
            fetch(
              `https://bansaltimber.com/api/products/get_bundle.php?category_id=${cat.id}`
            )
              .then((r) => r.json())
              .catch(() => ({ success: false }))
          )
        ).then((bundleResults) => {
          const validBundles = bundleResults
            .filter((b) => b.success && b.bundle)
            .map((b) => b.bundle);
          setBundles(validBundles);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  // ------------------------------------------
  // Modal Logic
  // ------------------------------------------
  const openAddModal = () => {
    setEditing(false);
    setForm({
      id: null,
      category_id: "",
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (bundle) => {
    setEditing(true);
    setForm({
      id: bundle.id,
      category_id: bundle.category_id,
      name: bundle.name,
      description: bundle.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = editing
      ? "https://bansaltimber.com/api/products/update_bundle.php"
      : "https://bansaltimber.com/api/products/add_bundle.php";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      fetchBundles();
    } else {
      alert(data.message || "Error saving bundle");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bundle? This will remove all attributes.")) return;

    const res = await fetch(
      "https://bansaltimber.com/api/products/delete_bundle.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );

    const data = await res.json();
    if (data.success) fetchBundles();
  };

  // ------------------------------------------
  // Render
  // ------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Attribute Bundles
        </h1>
        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Bundle
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading bundles...</p>
        ) : bundles.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No bundles found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Bundle Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((b) => {
                const category = categories.find((c) => c.id === b.category_id);
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 border-b text-sm text-gray-700">
                      {b.id}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-800 font-medium">
                      {b.name}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-600">
                      {category ? category.name : "—"}
                    </td>
                    <td className="px-6 py-3 border-b text-sm text-gray-500">
                      {b.created_at
                        ? new Date(b.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-3 border-b text-right space-x-3">
                      {/* ✅ Updated Manage Button */}
                      <button
                        onClick={() => navigate(`/admin/bundles/${b.id}`)} // 👈 go to BundleEditor
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => openEditModal(b)}
                        className="text-gray-700 hover:text-gray-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
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
              {editing ? "Edit Bundle" : "Add Bundle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                required
                disabled={editing}
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Bundle Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                className="w-full border p-2 rounded"
              />

              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full border p-2 rounded h-20"
              />

              <div className="flex justify-end space-x-3">
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

