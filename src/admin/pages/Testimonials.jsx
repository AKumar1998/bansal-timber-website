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

  // Message System
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (txt, type) => {
    setMessage(txt);
    setMessageType(type);
    if (type !== "loading") {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const msgStyles = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  // Resolve image path properly
  const resolveImg = (path) =>
    !path ? "" : path.startsWith("http") ? path : `https://bansaltimber.com${path}`;

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

  // Sorting list
  const sorted = [...testimonials].sort((a, b) => {
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
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showMessage("Uploading image...", "loading");

    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("https://bansaltimber.com/api/testimonials/upload_testimonial_image.php", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();

    if (data.success) {
      showMessage("Image uploaded!", "success");
      setForm((f) => ({ ...f, image: data.url, image_id: data.image_id }));
    } else {
      showMessage("Upload failed.", "error");
    }
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    showMessage("Saving...", "loading");

    const endpoint = editingTestimonial
      ? "https://bansaltimber.com/api/testimonials/update_testimonial.php"
      : "https://bansaltimber.com/api/testimonials/add_testimonial.php";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setIsSubmitting(false);

    if (data.success) {
      showMessage(editingTestimonial ? "Updated!" : "Added!", "success");
      setShowModal(false);
      resetForm();
      fetchTestimonials();
    } else {
      showMessage("Failed to save.", "error");
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
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    showMessage("Deleting...", "loading");

    const res = await fetch("https://bansaltimber.com/api/testimonials/delete_testimonial.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) {
      showMessage("Deleted.", "success");
      fetchTestimonials();
    } else showMessage("Delete failed.", "error");
  };

  return (
    <div className="space-y-6">
      
      {/* Global message */}
      {message && (
        <div className={`border text-center font-medium p-2 rounded ${msgStyles[messageType]}`}>
          {message}
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Testimonials</h1>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <select
            className="border rounded p-2 text-gray-700 flex-1 md:flex-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Name A–Z</option>
            <option value="za">Name Z–A</option>
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl shadow"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No testimonials found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Project</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img src={resolveImg(t.image)} alt="" className="h-16 w-24 rounded object-cover" />
                  </td>
                  <td className="p-3">{t.name}</td>
                  <td className="p-3 text-gray-600">{t.project_name}</td>
                  <td className="p-3 text-gray-500 text-sm">
                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3 text-right space-x-4">
                    <button className="text-blue-600" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="text-red-600" onClick={() => handleDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : sorted.length === 0 ? (
          <p className="text-center text-gray-500">No testimonials found.</p>
        ) : (
          sorted.map((t) => (
            <div key={t.id} className="bg-white shadow rounded-xl overflow-hidden">
              <img
                src={resolveImg(t.image)}
                className="w-full h-48 object-cover"
                alt="project"
              />

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <p className="text-gray-500 text-sm">{t.project_name}</p>
                <p className="text-gray-600 text-sm whitespace-pre-line">{t.testimonial_text}</p>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="py-2 rounded-lg bg-red-50 border border-red-200 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-end md:items-center justify-center z-[9999]">
          <div className="bg-white w-full md:max-w-lg max-h-[90vh] overflow-auto rounded-t-2xl md:rounded-xl p-6 relative">
            <button
              onClick={() => { setShowModal(false); resetForm(); }}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full border rounded-xl p-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="text"
                placeholder="Project Name"
                className="w-full border rounded-xl p-3"
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
              />

              <textarea
                placeholder="Testimonial Text"
                required
                className="w-full border rounded-xl p-3 min-h-[100px]"
                value={form.testimonial_text}
                onChange={(e) => setForm({ ...form, testimonial_text: e.target.value })}
              />

              <label className="inline-block bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl cursor-pointer text-sm">
                Upload / Change Image
                <input type="file" className="hidden" onChange={handleFile} />
              </label>

              {form.image && (
                <img
                  src={resolveImg(form.image)}
                  className="h-28 w-full rounded-lg object-cover border mt-2"
                  alt="preview"
                />
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-2 rounded-xl border bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-orange-600 text-white disabled:bg-gray-400"
                >
                  {isSubmitting ? "Saving…" : editingTestimonial ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

