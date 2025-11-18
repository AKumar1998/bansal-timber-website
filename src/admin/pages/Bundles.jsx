import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Bundles() {
  const [bundles, setBundles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [actionSheetBundle, setActionSheetBundle] = useState(null);

  const [form, setForm] = useState({
    id: null,
    category_id: "",
    name: "",
    description: "",
  });

  const navigate = useNavigate();

  // -------------------- Messages --------------------
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");

  const msgClasses = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  const showMessage = (txt, type) => {
    setMessage(txt);
    setMessageType(type);
    if (type !== "loading") setTimeout(() => setMessage(""), 2200);
  };

  const showModalMessage = (txt, type) => {
    setModalMessage(txt);
    setModalMessageType(type);
    if (type !== "loading") setTimeout(() => setModalMessage(""), 2200);
  };

  // -------------------- Fetch Data --------------------
  const fetchBundles = () => {
    setLoading(true);

    fetch("https://bansaltimber.com/api/products/get_categories.php")
      .then((res) => res.json())
      .then((data) => {
        const cats = data.categories || [];
        setCategories(cats);

        Promise.all(
          cats.map((cat) =>
            fetch(`https://bansaltimber.com/api/products/get_bundle.php?category_id=${cat.id}`)
              .then((r) => r.json())
              .catch(() => ({ success: false }))
          )
        ).then((results) => {
          const valid = results.filter((r) => r.success && r.bundle).map((r) => r.bundle);
          setBundles(valid);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => fetchBundles(), []);

  // -------------------- Modal Logic --------------------
  const openAddModal = () => {
    setEditing(false);
    setForm({ id: null, category_id: "", name: "", description: "" });
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
    showModalMessage("Saving...", "loading");

    const api = editing
      ? "https://bansaltimber.com/api/products/update_bundle.php"
      : "https://bansaltimber.com/api/products/add_bundle.php";

    const res = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      showModalMessage(editing ? "Updated!" : "Created!", "success");
      setTimeout(() => {
        setShowModal(false);
        fetchBundles();
      }, 600);
    } else showModalMessage(data.message || "Failed!", "error");
  };

  // -------------------- Desktop Delete Only --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bundle? Attributes will also be deleted.")) return;

    showMessage("Deleting...", "loading");

    const res = await fetch("https://bansaltimber.com/api/products/delete_bundle.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    data.success ? showMessage("Deleted!", "success") : showMessage("Failed!", "error");
    fetchBundles();
  };

  // -------------------- Action Sheet for Mobile --------------------
  const closeActionSheet = () => setActionSheetBundle(null);

  // -------------------- Render --------------------
  return (
    <div className="space-y-6">

      {/* GLOBAL MESSAGE */}
      {message && (
        <div className={`border text-center font-medium p-2 rounded ${msgClasses[messageType]}`}>
          {message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Attribute Bundles</h1>
        <button
          onClick={openAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl shadow w-full md:w-auto"
        >
          + Add Bundle
        </button>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : bundles.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No bundles found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((b) => {
                const category = categories.find((c) => c.id === b.category_id);
                return (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 border-b">{b.id}</td>
                    <td className="px-6 py-3 border-b font-medium">{b.name}</td>
                    <td className="px-6 py-3 border-b">{category?.name}</td>
                    <td className="px-6 py-3 border-b text-gray-500">
                      {b.created_at ? new Date(b.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-3 border-b text-right space-x-4">
                      <button onClick={() => navigate(`/admin/bundles/${b.id}`)} className="text-blue-500 hover:text-blue-700">Manage</button>
                      <button onClick={() => openEditModal(b)} className="text-gray-700 hover:text-gray-900">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* MOBILE CARD LIST */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : bundles.length === 0 ? (
          <p className="text-gray-500 text-center">No bundles found.</p>
        ) : (
          bundles.map((b) => {
            const category = categories.find((c) => c.id === b.category_id);
            return (
              <div key={b.id} className="bg-white shadow p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{b.name}</h3>
                  <span className="text-xs text-gray-500">#{b.id}</span>
                </div>

                <p className="text-gray-500 text-sm">{category?.name || "—"}</p>

                <button
                  onClick={() => setActionSheetBundle(b)}
                  className="mt-3 w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm"
                >
                  Actions
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ACTION SHEET — MOBILE ONLY */}
      {actionSheetBundle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999]">
          <div className="bg-white w-full rounded-t-2xl p-6 animate-[slideUp_.3s_ease-out]">

            <h3 className="text-lg font-semibold mb-5 text-center text-gray-800">
              {actionSheetBundle.name}
            </h3>

            {/* Manage */}
            <button
              onClick={() => {
                navigate(`/admin/bundles/${actionSheetBundle.id}`);
                closeActionSheet();
              }}
              className="w-full py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 mb-3 font-medium"
            >
              Manage
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                openEditModal(actionSheetBundle);
                closeActionSheet();
              }}
              className="w-full py-3 rounded-xl bg-gray-50 text-gray-700 border border-gray-200 mb-3 font-medium"
            >
              Edit
            </button>

            {/* DELETE — newly added */}
            <button
              onClick={() => {
                closeActionSheet();
                setTimeout(() => {
                  handleDelete(actionSheetBundle.id);
                }, 250);
              }}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow-sm mb-3"
            >
              Delete
            </button>

            {/* Cancel */}
            <button
              onClick={closeActionSheet}
              className="w-full py-3 rounded-xl border border-gray-300 bg-gray-100 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL — ADD/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-end md:items-center justify-center z-[9999]">
          <div className="bg-white w-full md:max-w-md p-6 rounded-t-2xl md:rounded-2xl shadow-lg">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl md:text-xl"
            >
              &times;
            </button>

            {modalMessage && (
              <div className={`border text-center font-medium p-2 rounded mb-2 ${msgClasses[modalMessageType]}`}>
                {modalMessage}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4 text-center">
              {editing ? "Edit Bundle" : "Add Bundle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <select
                value={form.category_id}
                required
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Bundle Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-xl p-3"
              />

              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border rounded-xl p-3 h-20"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
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
        `}
      </style>
    </div>
  );
}

