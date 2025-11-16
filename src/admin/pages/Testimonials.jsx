import { useEffect, useState } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    project_name: "",
    testimonial_text: "",
    image_id: "",
    image: "",
  });

  // Message system
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // loading | success | error

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

  const messageClasses = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  // Helper to resolve image URL safely
  const resolveImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `https://bansaltimber.com${path}`;
  };

  // Fetch testimonials
  const fetchTestimonials = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/testimonials/get_admin_testimonials.php")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Sorting logic
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return new Date(a.created_at) - new Date(b.created_at);
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // Upload image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showMessage("Uploading image...", "loading");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "https://bansaltimber.com/api/testimonials/upload_testimonial_image.php",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (data.success) {
      showMessage("Image uploaded successfully!", "success");
      setForm((f) => ({
        ...f,
        image: data.url,
        image_id: data.image_id,
      }));
    } else {
      showMessage("Image upload failed", "error");
    }
  };

  // Submit add / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage("Saving testimonial...", "loading");

    const apiUrl = editingTestimonial
      ? "https://bansaltimber.com/api/testimonials/update_testimonial.php"
      : "https://bansaltimber.com/api/testimonials/add_testimonial.php";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (data.success) {
      showMessage(editingTestimonial ? "Updated successfully!" : "Added successfully!", "success");
      setShowModal(false);
      resetForm();
      fetchTestimonials();
    } else {
      showMessage(data.message || "Failed to save testimonial.", "error");
    }
  };

  const resetForm = () => {
    setEditingTestimonial(null);
    setForm({
      name: "",
      project_name: "",
      testimonial_text: "",
      image_id: "",
      image: "",
    });
  };

  const handleEdit = (t) => {
    setEditingTestimonial(t);
    setForm({
      id: t.id,
      name: t.name,
      project_name: t.project_name,
      testimonial_text: t.testimonial_text,
      image_id: t.image_id || "",
      image: t.image ? t.image.replace("https://bansaltimber.com", "") : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    showMessage("Deleting...", "loading");

    const res = await fetch(
      "https://bansaltimber.com/api/testimonials/delete_testimonial.php",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }
    );

    const data = await res.json();
    if (data.success) {
      showMessage("Deleted successfully!", "success");
      fetchTestimonials();
    } else {
      showMessage("Failed to delete.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Global message */}
      {message && (
        <div className={`border text-center font-medium p-2 rounded ${messageClasses[messageType]}`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Testimonials</h1>

        <div className="flex items-center gap-3">
          <select
            className="border p-2 rounded text-gray-700"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>

          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition"
            onClick={() => setShowModal(true)}
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : sortedTestimonials.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTestimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
              <img
                src={resolveImageUrl(t.image) || "https://bansaltimber.com/uploads/testimonials/default.jpg"}
                alt={t.name}
                className="h-40 w-full object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.project_name}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{t.testimonial_text}</p>

              <div className="flex justify-end gap-3 mt-3">
                <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800 font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-xl shadow-md w-full max-w-xl max-h-[90vh] overflow-auto">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Project Name"
                className="w-full border p-2 rounded"
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
              />

              <textarea
                placeholder="Testimonial Text"
                className="w-full border p-2 rounded min-h-[100px]"
                value={form.testimonial_text}
                onChange={(e) => setForm({ ...form, testimonial_text: e.target.value })}
                required
              />

              {/* Image Upload + Preview */}
              <label className="inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded cursor-pointer">
                Upload Image
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>

              {form.image && (
                <img
                  src={resolveImageUrl(form.image)}
                  className="h-24 rounded mt-2 border object-cover"
                  alt="Preview"
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  {isSubmitting ? "Saving..." : editingTestimonial ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

