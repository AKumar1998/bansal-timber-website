import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BundleEditor() {
  const { bundleId } = useParams();
  const navigate = useNavigate();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAttrModal, setShowAttrModal] = useState(false);
  const [editingAttr, setEditingAttr] = useState(null);
  const [attrForm, setAttrForm] = useState({
    name: "",
    input_type: "select",
    is_common: 0,
    required: 1,
  });

  // ------------------------------------------
  // Fetch bundle and attributes
  // ------------------------------------------
  const fetchBundle = () => {
    setLoading(true);
    fetch(`https://bansaltimber.com/api/products/get_bundle.php?category_id=${bundleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBundle(data.bundle);
        else alert("Failed to fetch bundle details.");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBundle();
  }, [bundleId]);

  // ------------------------------------------
  // Attribute Modals
  // ------------------------------------------
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
    } else alert(data.message || "Error saving attribute.");
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

  // ------------------------------------------
  // Options Logic
  // ------------------------------------------
  const handleAddOption = async (attribute_id) => {
    const value = prompt("Enter new option value:");
    if (!value) return;

    const res = await fetch(
      "https://bansaltimber.com/api/products/add_bundle_option.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attribute_id, value }),
      }
    );
    const data = await res.json();
    if (data.success) fetchBundle();
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

  // ------------------------------------------
  // Default (Common) Values
  // ------------------------------------------
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

  // ------------------------------------------
  // Render
  // ------------------------------------------
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
                  <td className="px-6 py-3 border-b text-sm text-gray-800 font-medium">
                    {attr.name}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-600">
                    {attr.input_type}
                  </td>
                  <td className="px-6 py-3 border-b text-center">
                    {attr.is_common ? "✅" : "❌"}
                  </td>
                  <td className="px-6 py-3 border-b text-sm text-gray-700">
                    {attr.input_type === "select" ? (
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
                          onClick={() => handleAddOption(attr.id)}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          + Add Option
                        </button>
                      </div>
                    ) : attr.is_common ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder="Set default value"
                        defaultValue={attr.default_value || ""}
                        onBlur={(e) =>
                          handleDefaultChange(attr.id, e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 border-b text-right space-x-3">
                    <button
                      onClick={() => openEditAttrModal(attr)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-gray-500 text-center">
            No attributes found for this bundle.
          </p>
        )}
      </div>

      {/* Add Attribute Button */}
      <div className="flex justify-end">
        <button
          onClick={openAddAttrModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all"
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
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  {editingAttr ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

