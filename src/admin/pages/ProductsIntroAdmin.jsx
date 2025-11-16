import { useEffect, useState } from "react";

export default function ProductsIntroAdmin() {
  const [form, setForm] = useState({
    heading_text: "",
    phone_1: "",
    phone_2: ""
  });

  const [currentImages, setCurrentImages] = useState({
    large_image: "",
    small_image_1: "",
    small_image_2: "",
    banner_image: ""
  });

  const [previewImages, setPreviewImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // loading, success, error

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition";

  // Fetch initial data
  useEffect(() => {
    fetch("https://bansaltimber.com/api/products-intro/get_products_intro.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const d = data.data;
          setForm({
            heading_text: d.heading_text || "",
            phone_1: d.phone_1 || "",
            phone_2: d.phone_2 || ""
          });

          setCurrentImages({
            large_image: d.large_image || "",
            small_image_1: d.small_image_1 || "",
            small_image_2: d.small_image_2 || "",
            banner_image: d.banner_image || ""
          });
        }
      });
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    if (type !== "loading") {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2500);
    }
  };

  const updateField = (key, value) => setForm({ ...form, [key]: value });

  // Save text
  const handleSaveText = async () => {
    showMessage("Updating...", "loading");

    const res = await fetch("https://bansaltimber.com/api/products-intro/update_products_intro.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");
  };

  // Select & preview image
  const handleImageSelect = (field, file) => {
    if (!file) return;
    setSelectedFiles({ ...selectedFiles, [field]: file });

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImages((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Upload image
  const uploadSingleImage = async (field) => {
    if (!selectedFiles[field]) return showMessage("Please choose a file first.", "error");

    showMessage("Uploading image...", "loading");

    const formData = new FormData();
    formData.append(field, selectedFiles[field]);

    const res = await fetch("https://bansaltimber.com/api/products-intro/upload_products_intro.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");

    if (data.success && data.uploaded[field]) {
      setCurrentImages((prev) => ({ ...prev, [field]: data.uploaded[field] }));
      setPreviewImages((prev) => ({ ...prev, [field]: "" }));
      setSelectedFiles((prev) => ({ ...prev, [field]: null }));
    }
  };

  const renderImageControl = (field, label) => (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
      <p className="font-semibold text-gray-700">{label}</p>

      {currentImages[field] ? (
        <img src={currentImages[field]} alt={field} className="w-full h-32 object-cover rounded border" />
      ) : (
        <p className="text-sm text-gray-500 italic">No image uploaded yet</p>
      )}

      {previewImages[field] && (
        <img src={previewImages[field]} alt="Preview" className="w-full h-32 object-cover rounded border" />
      )}

      <input
        id={`file-input-${field}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelect(field, e.target.files[0])}
      />

      <button
        onClick={() => document.getElementById(`file-input-${field}`).click()}
        className="w-full px-4 py-2 bg-gray-200 rounded border hover:bg-gray-300 transition"
      >
        Select Image
      </button>

      <button
        onClick={() => uploadSingleImage(field)}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
      >
        Update Image
      </button>
    </div>
  );

  const messageStyle = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold tracking-wide text-gray-800">Products Intro Section</h2>

      {message && (
        <div className={`mt-2 border rounded-md p-2 text-center font-medium ${messageStyle[messageType]}`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-4">
        <label className="font-semibold text-gray-700">Heading Text (supports HTML)</label>
        <textarea
          rows={3}
          className={inputClass}
          value={form.heading_text}
          onChange={(e) => updateField("heading_text", e.target.value)}
        />

        <label className="font-semibold text-gray-700">Phone 1</label>
        <input className={inputClass} value={form.phone_1} onChange={(e) => updateField("phone_1", e.target.value)} />

        <label className="font-semibold text-gray-700">Phone 2</label>
        <input className={inputClass} value={form.phone_2} onChange={(e) => updateField("phone_2", e.target.value)} />

        <button
          onClick={handleSaveText}
          className="px-6 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
        >
          Save Text
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderImageControl("large_image", "Large Main Image")}
        {renderImageControl("small_image_1", "Small Image 1")}
        {renderImageControl("small_image_2", "Small Image 2")}
        {renderImageControl("banner_image", "Banner Background Image")}
      </div>
    </div>
  );
}

