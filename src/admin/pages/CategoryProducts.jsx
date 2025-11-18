import { useEffect, useState } from "react";

export default function CategoryProducts({ category, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [filterAttributes, setFilterAttributes] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    images: [],
    attribute_values: {},
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    if (type !== "loading") {
      setTimeout(() => { setMessage(""); setMessageType(""); }, 2500);
    }
  };

  const showModalMessage = (text, type) => {
    setModalMessage(text);
    setModalMessageType(type);
    if (type !== "loading") {
      setTimeout(() => { setModalMessage(""); setModalMessageType(""); }, 2500);
    }
  };

  const messageClasses = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  const cleanImageUrl = (url) => {
    if (!url) return "https://bansaltimber.com/uploads/dummy.jpg";
    if (url.startsWith("http")) return url;
    url = url.replace(/^\/+/, "");
    if (url.startsWith("uploads/")) return `https://bansaltimber.com/${url}`;
    return `https://bansaltimber.com/uploads/${url}`;
  };

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
    if (!category?.id) return setFilterAttributes([]);

    fetch(
      `https://bansaltimber.com/api/products/get_admin_attributes.php?category_id=${category.id}&mode=filter&t=${Date.now()}`
    )
      .then((res) => res.json())
      .then((data) => setFilterAttributes(data.attributes || []))
      .catch(() => setFilterAttributes([]));
  };

  useEffect(() => {
    fetchProducts();
    fetchFilterAttributes();
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [filters, search]);

  const fetchAttributeBundle = () => {
    setAttributes([]);
    fetch(
      `https://bansaltimber.com/api/products/get_admin_attributes.php?category_id=${category.id}&mode=full&t=${Date.now()}`
    )
      .then((res) => res.json())
      .then((data) => setAttributes(data.attributes || []))
      .catch(() => setAttributes([]));
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({ name: "", description: "", images: [], attribute_values: {} });
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
    showModalMessage("Uploading Image...", "loading");

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(
        "https://bansaltimber.com/api/products/upload_product_image.php",
        { method: "POST", body: fd }
      );
      const data = await res.json();

      if (data.success && data.url) {
        setForm((f) => ({ ...f, images: [...f.images, { url: data.url }] }));
        showModalMessage("Image uploaded!", "success");
      } else showModalMessage("Upload failed", "error");
    } catch {
      showModalMessage("Upload error", "error");
    }
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    showModalMessage("Saving Product...", "loading");

    const payload = {
      name: form.name,
      description: form.description,
      category_id: category.id,
      images: form.images.map((i) => i.url),
      attribute_values: [],
    };

    for (const [aid, val] of Object.entries(form.attribute_values || {})) {
      if (!val) continue;
      const isNumber = /^\d+$/.test(val);
      payload.attribute_values.push({
        attribute_id: parseInt(aid),
        attribute_option_id: isNumber ? parseInt(val) : null,
        value_text: isNumber ? null : val,
      });
    }

    const apiUrl = editing
      ? "https://bansaltimber.com/api/products/update_product.php"
      : "https://bansaltimber.com/api/products/add_product.php";

    if (editing) payload.id = editing.id;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      showModalMessage("Saved!", "success");
      setTimeout(() => setShowModal(false), 350);
      fetchProducts();
    } else showModalMessage(data.message || "Save failed.", "error");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    showMessage("Deleting...", "loading");

    const res = await fetch("https://bansaltimber.com/api/products/delete_product.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      showMessage("Deleted!", "success");
      fetchProducts();
    } else showMessage("Delete failed", "error");
  };

  return (
    <div className="space-y-6">

      {message && (
        <div className={`border text-center font-medium p-2 rounded ${messageClasses[messageType]}`}>
          {message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">
          {category.name} — Products
        </h1>

        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all w-full md:w-auto"
          >
            ← Back
          </button>
          <button
            onClick={openAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all w-full md:w-auto"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        {/* Search */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72"
          />

          <div className="flex gap-2">
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
        </div>

        {/* Dynamic Attributes */}
        {filterAttributes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filterAttributes.map((attr) => (
              <div key={attr.id} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">{attr.name}</label>
                <select
                  value={filters[attr.id] || ""}
                  onChange={(e) => handleFilterChange(attr.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                >
                  <option value="">All {attr.name}</option>
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

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        {loading ? (
          <p className="p-6 text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No products found.</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Image</th>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Description</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b">{p.id}</td>
                  <td className="px-6 py-3 border-b">
                    <img
                      src={cleanImageUrl(p.images?.[0])}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-3 border-b font-medium">{p.name}</td>
                  <td className="px-6 py-3 border-b text-sm max-w-[320px] truncate">
                    {p.description || "—"}
                  </td>
                  <td className="px-6 py-3 border-b text-right space-x-3">
                    <button onClick={() => openEditModal(p)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-white shadow border rounded-xl p-4">
              {/* Top row */}
              <div className="flex gap-3">
                <img
                  src={cleanImageUrl(p.images?.[0])}
                  alt={p.name}
                  className="w-20 h-20 rounded-lg object-cover flex-none"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                    {p.description || "—"}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">ID: {p.id}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full mt-4">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 text-center text-sm bg-blue-50 text-blue-700 py-2 rounded-lg border border-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 text-center text-sm bg-red-50 text-red-600 py-2 rounded-lg border border-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: MOBILE BOTTOM-SHEET + DESKTOP CENTER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-end md:items-center justify-center z-[9999]">
          <div className="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl shadow-lg animate-[slideUp_.3s_ease-out] md:animate-[fadeIn_.25s_ease-out] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">{editing ? "Edit Product" : "Add Product"}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-2xl leading-none hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            {modalMessage && (
              <div
                className={`border text-center font-medium p-2 ${messageClasses[modalMessageType]}`}
              >
                {modalMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attributes.map((attr) => (
                  <div key={attr.id}>
                    <label className="block font-medium mb-1">{attr.name}</label>

                    {attr.is_default ? (
                      <input
                        type="text"
                        disabled
                        value={attr.default_value}
                        className="w-full border rounded-xl p-2 bg-gray-100"
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
                        className="w-full border rounded-xl p-2"
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
                <label className="block font-medium mb-2">Product Images</label>

                <div className="flex flex-wrap gap-4">
                  {form.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-28 h-28 rounded-xl overflow-hidden border shadow group"
                    >
                      <img src={cleanImageUrl(img.url)} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <label className="cursor-pointer flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-xl hover:border-orange-500 hover:bg-orange-50">
                    <span className="text-gray-500 text-sm">+ Upload</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition"
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

