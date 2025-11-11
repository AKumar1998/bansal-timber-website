import { useEffect, useState } from "react";

export default function CategoryProducts({ category, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    images: [],
    attribute_values: {},
  });

  const fetchProducts = () => {
    if (!category?.id) return;
    setLoading(true);

    const query = new URLSearchParams({
      category_id: category.id,
      search: search.trim(),
    });

    Object.entries(filters).forEach(([attrId, value]) => {
      if (value !== "") query.append(`sort_attributes[${attrId}]`, value);
    });

    fetch(`https://bansaltimber.com/api/products/index.php?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchFilterAttributes = () => {
    fetch(
      `https://bansaltimber.com/api/products/get_admin_attributes.php?category_id=${category.id}&mode=filter`
    )
      .then((res) => res.json())
      .then((data) => {
        setAttributes(data.attributes || []);
      })
      .catch(() => setAttributes([]));
  };

  useEffect(() => {
    fetchProducts();
    fetchFilterAttributes();
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [filters, search]);

  const fetchAttributeBundle = () => {
    fetch(
      `https://bansaltimber.com/api/products/get_admin_attributes.php?category_id=${category.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAttributes(data.attributes || []);
      })
      .catch(() => setAttributes([]));
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      images: [],
      attribute_values: {},
    });
    fetchAttributeBundle();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditing(product);
    fetchAttributeBundle();
    setForm({
      name: product.name || "",
      description: product.description || "",
      images: (product.images || []).map((url) => ({ url })),
      attribute_values: product.attributes || {},
    });
    setShowModal(true);
  };

  const handleFilterChange = (attrId, value) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === "") delete next[attrId];
      else next[attrId] = value;
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({});
    setSearch("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "https://bansaltimber.com/api/products/upload_product_image.php",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success && data.url) {
        setForm((f) => ({
          ...f,
          images: [...f.images, { url: data.url }],
        }));
      } else alert("Image upload failed.");
    } catch {
      alert("Image upload error.");
    }
  };

  const removeImage = (i) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      category_id: category.id,
      images: form.images.map((i) => i.url),
      attribute_values: [],
    };

    for (const [aid, val] of Object.entries(form.attribute_values || {})) {
      if (!val || val === "") continue;
      const isNum = /^\d+$/.test(val);
      payload.attribute_values.push({
        attribute_id: parseInt(aid),
        attribute_option_id: isNum ? parseInt(val) : null,
        value_text: isNum ? null : val,
      });
    }

    const url = editing
      ? "https://bansaltimber.com/api/products/update_product.php"
      : "https://bansaltimber.com/api/products/add_product.php";

    if (editing) payload.id = editing.id;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      setShowModal(false);
      fetchProducts();
    } else alert(data.message || "Save failed.");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(
      "https://bansaltimber.com/api/products/delete_product.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const data = await res.json();
    if (data.success) fetchProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {category.name} Products
        </h1>
        <div className="space-x-3">
          <button
            onClick={onBack}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={openAddModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64"
          />
          <button
            onClick={fetchProducts}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg border"
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Reset
          </button>
        </div>

        {attributes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {attributes.map((attr) => (
              <div key={attr.id} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {attr.name}
                </label>
                <select
                  value={filters[attr.id] || ""}
                  onChange={(e) =>
                    handleFilterChange(attr.id, e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                >
                  <option value="">All {attr.name}</option>
                  {/* ✅ FIX: ensure unique keys for options */}
                  {(attr.options || []).map((opt, i) => (
                    <option
                      key={opt.option_id ?? `${attr.id}-${i}`}
                      value={opt.option_id || opt.value_text}
                    >
                      {opt.value_text}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {loading ? (
          <p className="p-6 text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            No products found in this category.
          </p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 border-b text-sm text-gray-700">
                    {p.id}
                  </td>
                  <td className="px-6 py-3 border-b">
                    <img
                      src={
                        p.images?.[0] ||
                        "https://bansaltimber.com/uploads/dummy.jpg"
                      }
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  </td>
                  <td className="px-6 py-3 border-b text-sm font-medium text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-600 max-w-[300px] truncate">
                    {p.description || "—"}
                  </td>
                  <td className="px-6 py-3 border-b text-right space-x-3">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block Board 8x4 ft"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {attr.name}
                    </label>

                    {attr.is_default ? (
                      <input
                        type="text"
                        value={attr.default_value || ""}
                        disabled
                        className="w-full border border-gray-200 rounded-xl p-2.5 bg-gray-100 text-gray-600"
                      />
                    ) : (
                      <select
                        value={form.attribute_values?.[attr.id] || ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            attribute_values: {
                              ...f.attribute_values,
                              [attr.id]: e.target.value,
                            },
                          }))
                        }
                        className="w-full border border-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select {attr.name}</option>
                        {(attr.options || []).map((opt, i) => (
                          <option
                            key={opt.option_id ?? `${attr.id}-${i}`}
                            value={opt.option_id || opt.value_text}
                          >
                            {opt.value_text}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                <div className="flex flex-wrap gap-4">
                  {form.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                    >
                      <img
                        src={
                          img.url?.startsWith("http")
                            ? img.url
                            : `https://bansaltimber.com/uploads/${img.url}`
                        } // ✅ FIX: normalize image src
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition">
                    <span className="text-gray-500 text-sm">+ Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl shadow-md transition"
                >
                  {editing ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

