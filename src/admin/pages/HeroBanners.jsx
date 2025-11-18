import { useEffect, useState } from "react";

export default function HeroBanners() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const pages = ["home", "products", "contact"];

  // -------- Load hero banners --------
  useEffect(() => {
    const fetchHeroes = async () => {
      setLoading(true);
      const results = [];

      for (const page of pages) {
        try {
          const res = await fetch(
            `https://bansaltimber.com/api/hero-banners/get_hero_banner.php?page_name=${page}`
          );
          const data = await res.json();

          results.push({
            page,
            title_text: data?.data?.title_text || "",
            button_text: data?.data?.button_text || "",
            image_url: data?.data?.image_url || "",
            file: null,
          });
        } catch {
          results.push({ page, title_text: "", button_text: "", image_url: "", file: null });
        }
      }

      setItems(results);
      setLoading(false);
    };

    fetchHeroes();
  }, []);

  const updateField = (page, field, value) => {
    setItems(prev => prev.map(i => (i.page === page ? { ...i, [field]: value } : i)));
  };

  const updateFile = (page, file) => {
    const previewUrl = URL.createObjectURL(file);
    setItems(prev =>
      prev.map(i => (i.page === page ? { ...i, file, image_url: previewUrl } : i))
    );
  };

  // -------- Save changes --------
  const saveAll = async () => {
    setSaving(true);
    showMsg("Saving changes...", "loading");

    try {
      for (const item of items) {
        // Upload image if replaced
        if (item.file) {
          const formData = new FormData();
          formData.append("page_name", item.page);
          formData.append("hero_image", item.file);

          await fetch("https://bansaltimber.com/api/hero-banners/upload_hero_image.php", {
            method: "POST",
            body: formData,
          });
        }

        // Update text — only send button_text for contact
        const bodyPayload = {
          page_name: item.page,
          title_text: item.title_text,
        };

        if (item.page === "contact") {
          bodyPayload.button_text = item.button_text || "";
        }

        await fetch("https://bansaltimber.com/api/hero-banners/update_hero_text.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayload),
        });
      }

      showMsg("Changes saved!", "success");

      // Reload to refresh preview URLs
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showMsg("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      {message && (
        <div className={`border p-2 rounded text-center font-medium ${msgStyles[messageType]}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Hero Banners</h2>
        <button
          onClick={saveAll}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm ${
            saving ? "bg-gray-400 text-gray-700" : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(hero => (
          <div key={hero.page} className="bg-white border rounded-lg shadow p-4 space-y-4">
            <h3 className="text-lg font-semibold capitalize">{hero.page} Page</h3>

            <img
              src={hero.image_url}
              alt={hero.page}
              className="rounded-md w-full object-cover aspect-[16/9]"
            />

            <button
              type="button"
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-md py-2 text-sm"
              onClick={() => document.getElementById(`heroFile-${hero.page}`).click()}
            >
              Replace Image
            </button>
            <input
              id={`heroFile-${hero.page}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => updateFile(hero.page, e.target.files[0])}
            />

            <div>
              <label className="block text-sm font-medium">Title Text</label>
              <input
                className="border rounded-md p-2 w-full text-sm"
                value={hero.title_text}
                onChange={e => updateField(hero.page, "title_text", e.target.value)}
              />
            </div>

            {/* Only show button input for Contact page */}
            {hero.page === "contact" && (
              <div>
                <label className="block text-sm font-medium">Button Text (optional)</label>
                <input
                  className="border rounded-md p-2 w-full text-sm"
                  placeholder="Leave blank to hide button"
                  value={hero.button_text || ""}
                  onChange={e => updateField(hero.page, "button_text", e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

