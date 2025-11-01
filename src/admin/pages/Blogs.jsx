import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    image: "",
    status: "draft",
  });

  // Fetch blogs
  const fetchBlogs = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/get_admin_blogs.php")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Auto-generate slug
  const handleTitleChange = (title) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((f) => ({ ...f, title, slug }));
  };

  // Image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://bansaltimber.com/api/upload_blog_image.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      // Set the relative path to send to add_blog.php
      setForm((f) => ({ ...f, image: data.url }));
    } else {
      alert("Image upload failed.");
    }
  };

  // Save blog (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = editingBlog
      ? "https://bansaltimber.com/api/update_blog.php"
      : "https://bansaltimber.com/api/add_blog.php";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      setEditingBlog(null);
      setForm({ title: "", slug: "", excerpt: "", body: "", image: "", status: "draft" });
      fetchBlogs();
    } else {
      alert(data.error || "Error saving blog.");
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setForm(blog);
    setShowModal(true);
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    const res = await fetch("https://bansaltimber.com/api/delete_blog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (data.success) fetchBlogs();
  };

  // Reset modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setForm({ title: "", slug: "", excerpt: "", body: "", image: "", status: "draft" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Blogs</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          + Add Blog
        </button>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={b.image || "https://bansaltimber.com/uploads/blog-images/default.jpg"}
                alt={b.title}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{b.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{b.excerpt}</p>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    b.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {b.status}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
              <input
                type="text"
                placeholder="Slug"
                className="w-full border p-2 rounded"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <input
                type="text"
                placeholder="Excerpt"
                className="w-full border p-2 rounded"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
              <ReactQuill
                theme="snow"
                value={form.body}
                onChange={(value) => setForm({ ...form, body: value })}
              />

              {/* Improved Upload Button */}
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

              <select
                className="w-full border p-2 rounded"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  {editingBlog ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

