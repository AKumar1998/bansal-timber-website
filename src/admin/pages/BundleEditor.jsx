import { useEffect, useState } from "react";
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
          fetch(tryByCategoryId)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.bundle) {
                setBundle(d.bundle);
              } else {
                setBundle(null);
              }
            });
        }
        setLoading(false);
      })
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

    const payload = {
      bundle_id: bundleId,
      ...attrForm,
    };

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
    } else {
      alert(data.message || "Error saving attribute.");
    }
  };

  const handleDeleteAttribute = async (id) => {
    if (!window.confirm("Delete this attribute?")) return;

    const res = await fetch(
      "https://bansaltimber.com/api/products/delete_bundle_attribute.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );

    const data = await res.json();
    if (data.success) fetchBundle();
  };

  // ---------------------------------------------------------
  // Option Logic — New proper modal (no prompt)
  // ---------------------------------------------------------
  const openAddOptionModal = (attribute_id) => {
    setOptionAttributeId(attribute_id);
    setNewOptionValue("");
    setShowOptionModal(true);
  };

  const handleSaveOption = async () => {
    if (!newOptionValue.trim()) {
      alert("Option value cannot be empty.");
      return;
    }

    const res = await fetch(
      "https://bansaltimber.com/api/products/add_bundle_option.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attribute_id: optionAttributeId,
          value: newOptionValue.trim(),
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      setShowOptionModal(false);
      fetchBundle();
    } else {
      alert("Error adding option.");
    }
  };

  const handleDeleteOption = async (id) => {
    if (!window.confirm("Delete this option?")) return;
    const res = await fetch(
      "https://bansaltimber.com/api/products/delete_bundle_option.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }
    );
    const data = await res.json();
    if (data.success) fetchBundle();
  };

  // ---------------------------------------------------------
  // Default Value Logic
  // ---------------------------------------------------------
  const handleDefaultChange = async (attribute_id, newValue) => {
    const payload = { attribute_id, value_text: newValue };

    const res = await fetch(
      "https://bansaltimber.com/api/products/set_bundle_default_value.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (data.success) fetchBundle();
  };

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  if (loading)
    return <p className="text-gray-500 p-6">Loading bundle details...</p>;
  if (!bundle)
    return (
      <p className="text-gray-500 p-6 text-center">Bundle not found.</p>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Editing Bundle: {bundle.name}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
        >
          ← Back
        </button>
      </div>

      {/* Attributes Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        {bundle.attributes?.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Attribute
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                  Common
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Options / Default
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {bundle.attributes.map((attr) => (
                <tr key={attr.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 border-b">{attr.name}</td>
                  <td className="px-6 py-3 border-b">{attr.input_type}</td>
                  <td className="px-6 py-3 border-b text-center">
                    {attr.is_common ? "✔️" : "—"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    {/* Select type */}
                    {attr.input_type === "select" && (
                      <div className="space-y-1">
                        {(attr.options || []).map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between bg-gray-50 border rounded px-2 py-1"
                          >
                            <span>{opt.value}</span>
                            <button
                              onClick={() => handleDeleteOption(opt.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => openAddOptionModal(attr.id)}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    {/* Default value (common) */}
                    {attr.input_type === "text" && attr.is_common === 1 && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          defaultValue={attr.default_value || ""}
                          onChange={(e) => {
                            attr.__pendingDefault = e.target.value;
                          }}
                        />
                        <button
                          onClick={() =>
                            handleDefaultChange(attr.id, attr.__pendingDefault || "")
                          }
                          className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Save
                        </button>
                      </div>
                    )}

                    {attr.input_type === "text" && !attr.is_common && (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>

                  <td className="px-6 py-3 border-b text-right space-x-3">
                    <button
                      onClick={() => openEditAttrModal(attr)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-center text-gray-500">
            This Bundle is empty. Add your first attribute to begin.
          </p>
        )}
      </div>

      {/* Add Attribute Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddAttrModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg"
        >
          + Add Attribute
        </button>
      </div>

      {/* Attribute Modal */}
      {showAttrModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <button
              onClick={() => setShowAttrModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingAttr ? "Edit Attribute" : "Add Attribute"}
            </h2>

            <form onSubmit={handleAttrSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Attribute Name"
                value={attrForm.name}
                onChange={(e) =>
                  setAttrForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                className="w-full border p-2 rounded"
              />

              <select
                value={attrForm.input_type}
                onChange={(e) =>
                  setAttrForm((f) => ({ ...f, input_type: e.target.value }))
                }
                className="w-full border p-2 rounded"
              >
                <option value="select">Select</option>
                <option value="text">Text</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={attrForm.is_common === 1}
                  onChange={(e) =>
                    setAttrForm((f) => ({
                      ...f,
                      is_common: e.target.checked ? 1 : 0,
                    }))
                  }
                />
                <span>Mark as common attribute</span>
              </label>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAttrModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  {editingAttr ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Option Modal */}
      {showOptionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
            <button
              onClick={() => setShowOptionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Option</h2>

            <input
              type="text"
              placeholder="Option value"
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOptionModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveOption}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

