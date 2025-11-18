import { useEffect, useState } from "react";

export default function ProductCarouselAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const msgStyles = {
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
    loading: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const showMsg = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    if (type !== "loading") setTimeout(() => setMessage(""), 2200);
  };

  const load = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/product-carousel/get_product_carousel_admin.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setItems(
            data.data.map((r) => ({
              id: r.id,
              url: r.full_url,
              file: null,
              status: "existing",
            }))
          );
        } else setItems([]);
        setDirty(false);
        setLoading(false);
      })
      .catch(() => {
        showMsg("Failed to load images", "error");
        setLoading(false);
      });
  };

  useEffect(() => load(), []);

  const makeTempId = () =>
    "tmp-" + Date.now() + Math.random().toString(36).slice(2, 6);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setItems((prev) => [
      ...prev,
      { id: makeTempId(), url: URL.createObjectURL(file), file, status: "new" },
    ]);
    setDirty(true);
    showMsg("Added (not saved)", "loading");
    e.target.value = "";
  };

  const handleReplace = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, url: URL.createObjectURL(file), file } : i
      )
    );
    setDirty(true);
    showMsg("Replace staged", "loading");
    e.target.value = "";
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove image?")) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "deleted" } : i))
    );
    setDirty(true);
    showMsg("Delete staged", "loading");
  };

  const applyPosition = (id, newPos) => {
    const active = items.filter((i) => i.status !== "deleted");
    const from = active.findIndex((i) => i.id === id);
    const to = newPos - 1;
    if (from < 0) return;

    const arr = [...active];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);

    const deleted = items.filter((i) => i.status === "deleted");
    setItems([...arr, ...deleted]);
    setDirty(true);
    showMsg("Reorder staged", "loading");
  };

  const saveAll = async () => {
    if (!dirty) return showMsg("No changes!", "success");

    setSaving(true);
    showMsg("Saving...", "loading");

    try {
      const formData = new FormData();
      const visible = items.filter((i) => i.status !== "deleted");
      const meta = visible.map((i, idx) => {
        const entry = { id: i.id, position: idx + 1 };
        if (i.file) {
          const key = `file_${idx}`;
          entry.fileField = key;
          formData.append(key, i.file);
        }
        return entry;
      });

      formData.append("meta", JSON.stringify(meta));

      const res = await fetch(
        "https://bansaltimber.com/api/product-carousel/save_product_carousel.php",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.success) {
        showMsg("Updated!", "success");
        load();
      } else {
        showMsg(data.message || "Failed", "error");
      }
    } catch {
      showMsg("Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const visible = items.filter((i) => i.status !== "deleted");

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`border p-2 rounded text-center font-medium ${
            msgStyles[messageType]
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">Products Carousel</h2>

        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border rounded shadow-sm text-sm"
            onClick={() => document.getElementById("upload-PC").click()}
          >
            Add Image
          </button>
          <input
            type="file"
            id="upload-PC"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />

          <button
            onClick={saveAll}
            disabled={saving || !dirty}
            className={`px-4 py-2 rounded text-sm font-semibold shadow ${
              saving || !dirty
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {loading ? (
          <p>Loading...</p>
        ) : visible.length === 0 ? (
          <p>No images found</p>
        ) : (
          visible.map((i, idx) => (
            <div key={i.id} className="p-3 border rounded-lg shadow space-y-3">
              <img src={i.url} className="rounded w-full aspect-[16/9]" />

              <div>
                <label className="text-sm font-medium">Position</label>
                <select
                  value={idx + 1}
                  onChange={(e) => applyPosition(i.id, Number(e.target.value))}
                  className="border rounded p-2 w-full text-sm"
                >
                  {visible.map((_, pos) => (
                    <option key={pos + 1} value={pos + 1}>
                      Position {pos + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="w-full bg-gray-200 hover:bg-blue-200 rounded p-2 text-sm"
                onClick={() =>
                  document.getElementById("replace-PC-" + i.id).click()
                }
              >
                Replace Image
              </button>
              <input
                id={"replace-PC-" + i.id}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleReplace(e, i.id)}
              />

              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
                onClick={() => handleDelete(i.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

