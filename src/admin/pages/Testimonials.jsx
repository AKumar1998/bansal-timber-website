import { useEffect, useState } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  const [form, setForm] = useState({
    name: "",
    project_name: "",
    testimonial_text: "",
    image_id: "",
    image: "",
  });

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
      default: // newest
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // Image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://bansaltimber.com/api/testimonials/upload_testimonial_image.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setForm((f) => ({
        ...f,
        image: data.url,
        image_id: data.image_id,
      }));
    } else {
      alert("Image upload failed.");
    }
  };

  // Add / Update testimonial
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = editingTestimonial
      ? "https://bansaltimber.com/api/testimonials/update_testimonial.php"
      : "https://bansaltimber.com/api/testimonials/add_testimonial.php";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      setEditingTestimonial(null);
      setForm({
        name: "",
        project_name: "",
        testimonial_text: "",
        image_id: "",
        image: "",
      });
      fetchTestimonials();
    } else {
      alert(data.message || "Error saving testimonial.");
    }
  };

  // Edit testimonial
  const handleEdit = (t) => {
    setEditingTestimonial(t);
    setForm({
      id: t.id,
      name: t.name,
      project_name: t.project_name,
      testimonial_text: t.testimonial_text,
      image_id: t.image_id || "",
      image: t.image || "",
    });
    setShowModal(true);
  };

  // Delete testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    const res = await fetch("https://bansaltimber.com/api/testimonials/delete_testimonial.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.success) fetchTestimonials();
    else alert("Failed to delete testimonial.");
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setForm({
      name: "",
      project_name: "",
      testimonial_text: "",
      image_id: "",
      image: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Testimonials</h1>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
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
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => setShowModal(true)}
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : sortedTestimonials.length === 0 ? (
        <p>No testimonials found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={t.image || "https://bansaltimber.com/uploads/testimonials/default.jpg"}
                alt={t.name}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{t.project_name}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{t.testimonial_text}</p>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div
            className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-xl overflow-y-auto max-h-[90vh]"
            style={{ pointerEvents: "auto" }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl leading-none z-10"
              type="button"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h2>

            <form className="space-y-4 relative z-20" onSubmit={handleSubmit}>
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

              {/* Upload Image */}
              <label className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow">
                Upload Image
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
              {form.image && (
                <img
                  src={"https://bansaltimber.com" + form.image}
                  alt=""
                  className="h-24 mt-2 rounded"
                />
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                >
                  {editingTestimonial ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

