import { useEffect, useState } from "react";

export default function ContactCarouselAdmin() {
  const [items, setItems] = useState([]); // staged items (existing + new)
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error | loading

  const msgStyles = {
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
    loading: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const showMsg = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    if (type !== "loading") {
      setTimeout(() => setMessage(""), 2200);
    }
  };

  // --- Fetch from admin endpoint ---
  const loadImages = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/contact-carousel/get_contact_carousel_admin.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((row) => ({
            id: row.id,            // numeric ID from DB
            url: row.full_url,     // absolute URL for display
            file: null,            // File if replaced / new
            status: "existing",    // 'existing' | 'new' | 'deleted'
          }));
          setItems(mapped);
        } else {
          setItems([]);
          showMsg(data.message || "No images found", "error");
        }
        setLoading(false);
        setDirty(false);
      })
      .catch(() => {
        showMsg("Failed to load images", "error");
        setLoading(false);
      });
  };

  useEffect(() => loadImages(), []);

  // Helper: generate a temp ID for new images
  const makeTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // --- Upload: stage a NEW image (no immediate API call) ---
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const tempId = makeTempId();

    setItems((prev) => [
      ...prev,
      {
        id: tempId,
        url: previewUrl,
        file,
        status: "new",
      },
    ]);
    setDirty(true);
    showMsg("Image added (not saved yet)", "loading");

    // reset input so selecting same file again still fires change
    e.target.value = "";
  };

  // --- Replace: stage replacing an existing image ---
  const handleReplace = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              url: previewUrl,
              file,          // mark this item to be replaced
              // status stays 'existing'
            }
          : item
      )
    );
    setDirty(true);
    showMsg("Replacement staged (not saved yet)", "loading");

    e.target.value = "";
  };

  // --- Delete: mark item as deleted (keep it only for Save) ---
  const handleDelete = (id) => {
    if (!window.confirm("Delete this image from carousel?")) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "deleted" }
          : item
      )
    );
    setDirty(true);
    showMsg("Marked for deletion (not saved yet)", "loading");
  };

  // --- Reorder: move item to new position (within visible items) ---
  const moveItem = (fromIndex, toIndex) => {
    setItems((prev) => {
      const visible = prev.filter((i) => i.status !== "deleted");
      const deleted = prev.filter((i) => i.status === "deleted");

      if (toIndex < 0) toIndex = 0;
      if (toIndex >= visible.length) toIndex = visible.length - 1;

      const updated = [...visible];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      setDirty(true);
      return [...updated, ...deleted];
    });
  };

  const handlePositionChange = (itemId, newPos) => {
    const visible = items.filter((i) => i.status !== "deleted");
    const fromIndex = visible.findIndex((i) => i.id === itemId);
    const toIndex = newPos - 1;
    if (fromIndex === -1) return;
    moveItem(fromIndex, toIndex);
    showMsg("Reorder staged (not saved yet)", "loading");
  };

  // --- Save ALL staged changes (add, replace, delete, reorder) ---
  const handleSaveAll = async () => {
    if (!dirty) {
      showMsg("No changes to save", "success");
      return;
    }

    setSaving(true);
    showMsg("Saving changes...", "loading");

    try {
      const formData = new FormData();

      // Build meta describing final state in order
      const visible = items.filter((i) => i.status !== "deleted");

      const meta = visible.map((item, idx) => {
        const entry = {
          id: item.id,        // numeric id or temp-id
          position: idx + 1,  // 1-based position
        };

        if (item.file) {
          const fieldName = `file_${idx}`;
          entry.fileField = fieldName;
          formData.append(fieldName, item.file);
        }

        return entry;
      });

      formData.append("meta", JSON.stringify(meta));

      const res = await fetch(
        "https://bansaltimber.com/api/contact-carousel/save_contact_carousel.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        showMsg("Carousel updated!", "success");
        loadImages();
      } else {
        showMsg(data.message || "Failed to save changes", "error");
      }
    } catch (err) {
      showMsg("Error saving changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const visibleItems = items.filter((i) => i.status !== "deleted");

  return (
    <div className="space-y-6">
      {/* Global message */}
      {message && (
        <div
          className={`border p-2 rounded text-center font-medium ${
            msgStyles[messageType] || ""
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800">
          Contact Page Carousel
        </h2>

        <div className="flex flex-wrap gap-3">
          {/* Add image */}
          <div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("carouselUploadInput").click()
              }
              className="px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100 shadow-sm text-sm font-medium"
            >
              Add Image
            </button>
            <input
              type="file"
              id="carouselUploadInput"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {/* Save changes */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || !dirty}
            className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm ${
              saving || !dirty
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 italic">
        Changes (add, replace, delete, reorder) are only applied when you click{" "}
        <span className="font-semibold">Save Changes</span>.
      </p>

      {/* Existing + staged images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : visibleItems.length === 0 ? (
          <p>No images in carousel.</p>
        ) : (
          visibleItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white border rounded-lg shadow-md p-3 space-y-3"
            >
              <img
                src={item.url}
                alt=""
                className="rounded-md w-full object-cover aspect-[16/9]"
              />

              {/* Position selector */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <select
                  className="border rounded-md p-2 w-full text-sm"
                  value={idx + 1}
                  onChange={(e) =>
                    handlePositionChange(item.id, Number(e.target.value))
                  }
                >
                  {visibleItems.map((_, pos) => (
                    <option key={pos + 1} value={pos + 1}>
                      Position {pos + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Replace image */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">
                  Replace Image
                </p>
                <button
                  type="button"
                  className="px-3 py-2 w-full rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                  onClick={() =>
                    document
                      .getElementById(`replaceInput-${item.id}`)
                      .click()
                  }
                >
                  Replace…
                </button>
                <input
                  type="file"
                  accept="image/*"
                  id={`replaceInput-${item.id}`}
                  className="hidden"
                  onChange={(e) => handleReplace(e, item.id)}
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(item.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium text-sm"
              >
                Delete
              </button>

              {item.status === "new" && (
                <p className="text-xs text-orange-600 mt-1">
                  This is a new image (not saved yet).
                </p>
              )}
              {item.file && item.status === "existing" && (
                <p className="text-xs text-blue-600 mt-1">
                  Replacement staged (not saved yet).
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

