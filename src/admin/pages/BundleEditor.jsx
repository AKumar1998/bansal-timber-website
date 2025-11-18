import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BundleEditor() {
  const { bundleId } = useParams();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attribute Modal
  const [showAttrModal, setShowAttrModal] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);

  // Option Modal
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [optionAttributeId, setOptionAttributeId] = useState(null);
  const [newOptionValue, setNewOptionValue] = useState("");

  const [attrForm, setAttrForm] = useState({
    name: "",
    input_type: "select",
    is_common: 0,
    required: 1,
  });

  // ---------------------------------------------------------
  // Fetch Bundle
  // ---------------------------------------------------------
  const fetchBundle = () => {
    setLoading(true);

    const id = parseInt(bundleId, 10);
    if (!id || isNaN(id)) {
      alert("Invalid ID.");
      setLoading(false);
      return;
    }

    const tryByBundleId = `https://bansaltimber.com/api/products/get_bundle.php?bundle_id=${id}&t=${Date.now()}`;
    const tryByCategoryId = `https://bansaltimber.com/api/products/get_bundle.php?category_id=${id}&t=${Date.now()}`;

    fetch(tryByBundleId)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.bundle) {
          setBundle(data.bundle);
        } else {
          return fetch(tryByCategoryId)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.bundle) {
                setBundle(d.bundle);
              } else {
                setBundle(null);
              }
            });
        }
      })
      .finally(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        alert("Network error fetching bundle details.");
      });
  };

  useEffect(() => {
    fetchBundle();
  }, [bundleId]);

  // ---------------------------------------------------------
  // Attribute Logic
  // ---------------------------------------------------------
  const openAddAttrModal = () => {
    setEditingAttr(null);
    setAttrForm({
      name: "",
      input_type: "select",
      is_common: 0,
      required: 1,
    });
    setShowAttrModal(true);
  };

  const openEditAttrModal = (attr) => {
    setEditingAttr(attr);
    setAttrForm({
      name: attr.name,
      input_type: attr.input_type,
      is_common: attr.is_common,
      required: attr.required,
    });
    setShowAttrModal(true);
  };

  const handleAttrSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = editingAttr
      ? "https://bansaltimber.com/api/products/update_bundle_attribute.php"
      : "https://bansaltimber.com/api/products/add_bundle_attribute.php";

    const payload = { bundle_id: bundleId, ...attrForm };
    if (editingAttr) payload.id = editingAttr.id;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      setShowAttrModal(false);
      fetchBundle();
    } else alert(data.message || "Error saving attribute.");
  };

  const handleDeleteAttribute = async (id) => {
    if (!window.confirm("Delete this attribute?")) return;

    const res = await fetch("https://bansaltimber.com/api/products/delete_bundle_attribute.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) fetchBundle();
  };

  // ---------------------------------------------------------
  // Option Logic
  // ---------------------------------------------------------
  const openAddOptionModal = (attribute_id) => {
    setOptionAttributeId(attribute_id);
    setNewOptionValue("");
    setShowOptionModal(true);
  };

  const handleSaveOption = async () => {
    if (!newOptionValue.trim()) return alert("Option value cannot be empty.");

    const res = await fetch("https://bansaltimber.com/api/products/add_bundle_option.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attribute_id: optionAttributeId,
        value: newOptionValue.trim(),
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShowOptionModal(false);
      fetchBundle();
    } else alert("Error adding option.");
  };

  const handleDeleteOption = async (id) => {
    if (!window.confirm("Delete this option?")) return;

    const res = await fetch("https://bansaltimber.com/api/products/delete_bundle_option.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) fetchBundle();
  };

  const handleDefaultChange = async (attribute_id, newValue) => {
    const res = await fetch(
      "https://bansaltimber.com/api/products/set_bundle_default_value.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attribute_id, value_text: newValue }),
      }
    );

    const data = await res.json();
    if (data.success) fetchBundle();
  };

  // ---------------------------------------------------------
  // Swipe Handlers — Touch UX
  // ---------------------------------------------------------
  const swipeRefs = useRef({});

  const startSwipe = (id, e) => {
    swipeRefs.current[id] = { x: e.touches[0].clientX };
  };

  const moveSwipe = (id, e) => {
    if (!swipeRefs.current[id]) return;

    const deltaX = e.touches[0].clientX - swipeRefs.current[id].x;
    const element = document.getElementById("attr_row_" + id);

    if (deltaX < 0) {
      element.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const endSwipe = (id, e) => {
    const element = document.getElementById("attr_row_" + id);

    if (!element) return;

    if (element.style.transform.includes("translateX") && Math.abs(parseInt(element.style.transform)) > 60) {
      element.style.transform = "translateX(-80px)"; // show actions
    } else {
      element.style.transform = "translateX(0)";
    }

    swipeRefs.current[id] = null;
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  if (loading) return <p className="text-gray-500 p-6">Loading...</p>;
  if (!bundle) return <p className="text-center text-gray-500 p-6">Bundle not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          Editing: {bundle.name}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        {bundle.attributes?.length > 0 ? (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Attribute</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-center">Common</th>
                <th className="px-6 py-3 text-left">Options / Default</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundle.attributes.map((attr) => (
                <tr key={attr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">{attr.name}</td>
                  <td className="px-6 py-3 border-b">{attr.input_type}</td>
                  <td className="px-6 py-3 border-b text-center">{attr.is_common ? "✔️" : "—"}</td>
                  <td className="px-6 py-3 border-b">
                    {attr.input_type === "select" &&
                      <div className="space-y-1">
                        {attr.options?.map((o) => (
                          <div key={o.id} className="flex items-center justify-between bg-gray-50 border rounded px-2 py-1">
                            <span>{o.value}</span>
                            <button
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => handleDeleteOption(o.id)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button className="text-blue-500 text-sm" onClick={() => openAddOptionModal(attr.id)}>
                          + Add Option
                        </button>
                      </div>
                    }

                    {attr.input_type === "text" && attr.is_common === 1 && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          defaultValue={attr.default_value || ""}
                          onChange={(e) => (attr._pending = e.target.value)}
                        />
                        <button
                          className="px-3 py-1 rounded bg-blue-500 text-white"
                          onClick={() => handleDefaultChange(attr.id, attr._pending || "")}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 border-b text-right space-x-4">
                    <button className="text-blue-500" onClick={() => openEditAttrModal(attr)}>Edit</button>
                    <button className="text-red-500" onClick={() => handleDeleteAttribute(attr.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="p-6 text-center">No attributes yet.</p>}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-5 pb-8">
        {bundle.attributes?.map((attr) => (
          <div
            key={attr.id}
            className="bg-white rounded-xl shadow-md p-5 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">{attr.name}</h3>

            <p className="text-gray-600 text-sm">
              Type: <span className="font-medium capitalize">{attr.input_type}</span> •{" "}
              {attr.is_common ? "Common Attribute" : "Product-Specific"}
            </p>

            {/* Select Options */}
            {attr.input_type === "select" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {attr.options?.map((o) => (
                    <div key={o.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm border">
                      {o.value}
                      <button
                        onClick={() => handleDeleteOption(o.id)}
                        className="ml-2 text-red-500 font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openAddOptionModal(attr.id)}
                  className="w-full text-blue-600 text-sm font-medium py-1"
                >
                  + Add Option
                </button>
              </div>
            )}

            {/* Common Text Default */}
            {attr.input_type === "text" && attr.is_common === 1 && (
              <div className="space-y-2">
                <input
                  type="text"
                  defaultValue={attr.default_value || ""}
                  onChange={(e) => (attr._pending = e.target.value)}
                  className="border w-full rounded-lg p-2"
                />
                <button
                  onClick={() => handleDefaultChange(attr.id, attr._pending || "")}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
                >
                  Save Default
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => openEditAttrModal(attr)}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium"
              >
                Edit Attribute
              </button>

              <button
                onClick={() => handleDeleteAttribute(attr.id)}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-medium"
              >
                Delete Attribute
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Attribute Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddAttrModal}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl shadow-lg w-full md:w-auto"
        >
          + Add Attribute
        </button>
      </div>

      {/* Attribute Modal */}
      {showAttrModal && (
        <Modal onClose={() => setShowAttrModal(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center">
            {editingAttr ? "Edit Attribute" : "Add Attribute"}
          </h2>

          <form onSubmit={handleAttrSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Attribute Name"
              required
              value={attrForm.name}
              onChange={(e) => setAttrForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border rounded-xl p-3"
            />

            <select
              className="w-full border rounded-xl p-3"
              value={attrForm.input_type}
              onChange={(e) => setAttrForm((f) => ({ ...f, input_type: e.target.value }))}
            >
              <option value="select">Select Input</option>
              <option value="text">Text Input</option>
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={attrForm.is_common === 1}
                onChange={(e) => setAttrForm((f) => ({ ...f, is_common: e.target.checked ? 1 : 0 }))}
              />
              <span>Mark as common attribute</span>
            </label>

            <div className="flex gap-3">
              <button type="button" className="flex-1 border py-2 rounded-xl" onClick={() => setShowAttrModal(false)}>
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded-xl">
                {editingAttr ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Option Modal */}
      {showOptionModal && (
        <Modal onClose={() => setShowOptionModal(false)}>
          <h2 className="text-lg font-semibold mb-4 text-center">Add Option</h2>

          <input
            type="text"
            placeholder="Enter option value"
            value={newOptionValue}
            onChange={(e) => setNewOptionValue(e.target.value)}
            className="w-full border rounded-xl p-3 mb-4"
          />

          <div className="flex gap-3">
            <button onClick={() => setShowOptionModal(false)} className="flex-1 border py-2 rounded-xl">
              Cancel
            </button>
            <button onClick={handleSaveOption} className="flex-1 bg-blue-600 text-white rounded-xl py-2">
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-end md:items-center justify-center z-[9999]">
    <div className="bg-white w-full md:max-w-md p-6 rounded-t-2xl md:rounded-2xl shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl md:text-xl"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

