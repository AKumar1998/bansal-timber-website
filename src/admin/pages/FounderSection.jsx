import { useEffect, useState } from "react";

export default function FounderSection() {
  const [data, setData] = useState({
    founder_image: "",
    heading: "",
    body_text: "",
    founder_name: "",
    quote_text: ""
  });

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const showMsg = (text, type) => {
    setMessage(text);
    setMessageType(type);
    if (type !== "loading") {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2500);
    }
  };

  const msgClass = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300"
  };

  // Fetch initial data safely
  useEffect(() => {
    fetch("https://bansaltimber.com/api/founder-info/get_founder_section.php")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setData(prev => ({
            ...prev,
            ...result.data,
            heading: result.data.heading ?? "",
            body_text: result.data.body_text ?? "",
            founder_name: result.data.founder_name ?? "",
            quote_text: result.data.quote_text ?? ""
          }));
        }
      })
      .catch(() => showMsg("Failed to load data", "error"));
  }, []);

  // Image selection
  const selectImage = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload image
  const uploadImage = async () => {
    if (!selectedFile) return showMsg("Select an image first", "error");
    showMsg("Uploading image...", "loading");

    const formData = new FormData();
    formData.append("founder_image", selectedFile);

    const res = await fetch("https://bansaltimber.com/api/founder-info/upload_founder_image.php", {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    if (result.success) {
      showMsg("Image updated!", "success");
      setPreviewImage("");
      setSelectedFile(null);

      // Refresh data
      const updated = await fetch("https://bansaltimber.com/api/founder-info/get_founder_section.php").then(r => r.json());
      if (updated.success && updated.data) {
        setData(prev => ({
          ...prev,
          ...updated.data,
          heading: updated.data.heading ?? "",
          body_text: updated.data.body_text ?? "",
          founder_name: updated.data.founder_name ?? "",
          quote_text: updated.data.quote_text ?? ""
        }));
      }

    } else showMsg("Upload failed", "error");
  };

  // Save text
  const saveText = async () => {
    setLoading(true);
    showMsg("Saving...", "loading");

    const res = await fetch("https://bansaltimber.com/api/founder-info/update_founder_text.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    setLoading(false);
    showMsg(result.message, result.success ? "success" : "error");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {message && (
        <p className={`border rounded-md text-center font-medium p-2 ${msgClass[messageType]}`}>
          {message}
        </p>
      )}

      <h2 className="text-2xl font-semibold tracking-wide text-gray-800">Founder Section</h2>

      {/* TEXT FIELDS */}
      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-4">
        <label className="font-semibold text-gray-700">Heading</label>
        <input
          value={data.heading ?? ""}
          onChange={(e) => setData({ ...data, heading: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <label className="font-semibold text-gray-700">Body Text</label>
        <textarea
          rows={4}
          value={data.body_text ?? ""}
          onChange={(e) => setData({ ...data, body_text: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <label className="font-semibold text-gray-700">Founder Name</label>
        <input
          value={data.founder_name ?? ""}
          onChange={(e) => setData({ ...data, founder_name: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <label className="font-semibold text-gray-700">Quote Text</label>
        <input
          value={data.quote_text ?? ""}
          onChange={(e) => setData({ ...data, quote_text: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={saveText}
          disabled={loading}
          className="px-6 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-300"
        >
          {loading ? "Saving..." : "Save Text"}
        </button>
      </div>

      {/* IMAGE */}
      <div className="bg-white shadow-sm border rounded-lg p-5 space-y-4">
        <p className="font-semibold text-gray-700">Founder Image</p>

        {data.founder_image ? (
          <img src={data.founder_image} className="w-full h-52 object-cover rounded border" />
        ) : (
          <p className="text-sm text-gray-500 italic">No image uploaded</p>
        )}

        {previewImage && (
          <img src={previewImage} className="w-full h-52 object-cover rounded border" />
        )}

        <input
          id="founderImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => selectImage(e.target.files[0])}
        />

        <button
          onClick={() => document.getElementById("founderImageInput").click()}
          className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Select Image
        </button>

        <button
          onClick={uploadImage}
          className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Update Image
        </button>
      </div>
    </div>
  );
}

