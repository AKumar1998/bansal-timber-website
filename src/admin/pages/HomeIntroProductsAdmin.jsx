import { useEffect, useState } from "react";

export default function HomeIntroProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [previewImages, setPreviewImages] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "loading", "success", "error"

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none transition";

  // Fetch products on load
  useEffect(() => {
    fetch("https://bansaltimber.com/api/home-intro-products/get_home_intro_products.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      });
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    // auto clear
    if (type !== "loading") {
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 2500);
    }
  };

  // Update product name
  const handleNameUpdate = async (position, name) => {
    if (!name.trim()) return showMessage("Product name cannot be empty.", "error");

    showMessage("Updating name...", "loading");

    const res = await fetch(
      "https://bansaltimber.com/api/home-intro-products/update_home_intro_products.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, product_name: name })
      }
    );

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");
  };

  // Select & Preview Image
  const handleImageSelect = (position, file) => {
    if (!file) return;
    setSelectedFiles((prev) => ({ ...prev, [position]: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImages((prev) => ({ ...prev, [position]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Upload Image
  const uploadImage = async (position) => {
    if (!selectedFiles[position]) return showMessage("Please choose a file first.", "error");

    const product = products.find((p) => p.position === position);
    if (!product) return;

    showMessage("Uploading image...", "loading");

    const formData = new FormData();
    formData.append("image", selectedFiles[position]);
    formData.append("position", position);
    formData.append("product_name", product.name);

    const res = await fetch(
      "https://bansaltimber.com/api/home-intro-products/upload_home_intro_products.php",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    showMessage(data.message, data.success ? "success" : "error");

    if (data.success) {
      const refresh = await fetch(
        "https://bansaltimber.com/api/home-intro-products/get_home_intro_products.php"
      );
      const updated = await refresh.json();
      if (updated.success) setProducts(updated.products);

      setPreviewImages((prev) => ({ ...prev, [position]: "" }));
      setSelectedFiles((prev) => ({ ...prev, [position]: null }));
    }
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="border rounded-lg p-4 space-y-3 bg-white shadow-sm">
      <p className="font-semibold text-gray-700">Product #{product.position}</p>

      <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded border" />

      {previewImages[product.position] && (
        <img
          src={previewImages[product.position]}
          alt="Preview"
          className="w-full h-32 object-cover rounded border"
        />
      )}

      <input
        className={inputClass}
        value={product.name}
        onChange={(e) => {
          const newName = e.target.value;
          setProducts((prev) =>
            prev.map((p) => (p.id === product.id ? { ...p, name: newName } : p))
          );
        }}
      />

      <button
        onClick={() => handleNameUpdate(product.position, product.name.trim())}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-black transition"
      >
        Update Name
      </button>

      <input
        id={`file-input-${product.position}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelect(product.position, e.target.files[0])}
      />

      <button
        onClick={() => document.getElementById(`file-input-${product.position}`).click()}
        className="w-full px-4 py-2 bg-gray-200 rounded border hover:bg-gray-300 transition"
      >
        Select Image
      </button>

      <button
        onClick={() => uploadImage(product.position)}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
      >
        Update Image
      </button>
    </div>
  );

  // Message Style
  const messageStyle = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold tracking-wide text-gray-800">Home Intro Products</h2>

      {message && (
        <div className={`mt-2 border rounded-md p-2 text-center font-medium ${messageStyle[messageType]}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => renderProductCard(product))}
      </div>
    </div>
  );
}

