import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [editorKey, setEditorKey] = useState(Date.now());
  const [isFetchingSingle, setIsFetchingSingle] = useState(false);

  const emptyForm = {
    id: null,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    image: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    tags: "",
    featured: 0,
  };

  const [form, setForm] = useState(emptyForm);

  // -------------------- Messages --------------------
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalMessageType, setModalMessageType] = useState("");

  const msgClasses = {
    loading: "bg-blue-100 text-blue-700 border-blue-300",
    success: "bg-green-100 text-green-700 border-green-300",
    error: "bg-red-100 text-red-700 border-red-300",
  };

  const showMessage = (txt, type) => {
    setMessage(txt);
    setMessageType(type);
    if (type !== "loading") setTimeout(() => setMessage(""), 2500);
  };

  const showModalMessage = (txt, type) => {
    setModalMessage(txt);
    setModalMessageType(type);
    if (type !== "loading") setTimeout(() => setModalMessage(""), 2500);
  };

  // -------------------- Fetch All Blogs --------------------
  const fetchBlogs = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/blogs/get_admin_blogs.php")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => fetchBlogs(), []);

  // -------------------- Sorting --------------------
  const sortedBlogs = [...blogs].sort((a, b) => {
    switch (sortOption) {
      case "oldest": return new Date(a.created_at) - new Date(b.created_at);
      case "title-az": return a.title.localeCompare(b.title);
      case "title-za": return b.title.localeCompare(a.title);
      case "published-first": return a.status === "published" ? -1 : 1;
      case "drafts-first": return a.status === "draft" ? -1 : 1;
      default: return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  // -------------------- Title → Slug --------------------
  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    setForm((f) => ({
      ...f,
      title,
      slug,
      meta_title: f.meta_title || title,
    }));
  };

  // -------------------- Image Upload --------------------
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showModalMessage("Uploading image...", "loading");

    const formData = new FormData();
    formData.append("image", file);
    if (form.image) formData.append("oldImage", form.image);

    const res = await fetch("https://bansaltimber.com/api/blogs/upload_blog_image.php", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setForm((f) => ({ ...f, image: data.url.replace("https://bansaltimber.com", "") }));
      showModalMessage("Image uploaded!", "success");
    } else showModalMessage("Upload failed", "error");
  };

  // -------------------- Edit Blog (Fetch by ID) --------------------
  const handleEdit = async (blog) => {
    setShowModal(true);
    setIsFetchingSingle(true);
    showModalMessage("Loading full blog...", "loading");

    try {
      const res = await fetch(`https://bansaltimber.com/api/blogs/get_blog.php?id=${blog.id}`);
      const data = await res.json();

      if (!data || !data.body) throw new Error("Missing full body");

      setEditingBlog(data);

      setForm({
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        body: data.body,
        image: data.image ? data.image.replace("https://bansaltimber.com", "") : "",
        status: data.status,
        meta_title: data.meta_title || data.title,
        meta_description: data.meta_description || "",
        meta_keywords: data.meta_keywords || "",
        tags: data.tags || "",
        featured: data.featured || 0,
      });

      setEditorKey(Date.now());
      showModalMessage("Loaded!", "success");
    } catch {
      showModalMessage("Failed to load full blog!", "error");
    }

    setIsFetchingSingle(false);
  };

  // -------------------- Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    showModalMessage("Saving...", "loading");

    const apiUrl = editingBlog
      ? "https://bansaltimber.com/api/blogs/update_blog.php"
      : "https://bansaltimber.com/api/blogs/add_blog.php";

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      showModalMessage(editingBlog ? "Updated!" : "Created!", "success");
      setTimeout(() => {
        closeModal();
        fetchBlogs();
      }, 700);
    } else showModalMessage(data.error || "Failed!", "error");
  };

  // -------------------- Delete --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    showMessage("Deleting...", "loading");

    const res = await fetch("https://bansaltimber.com/api/blogs/delete_blog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    data.success ? showMessage("Deleted!", "success") : showMessage("Failed!", "error");
    fetchBlogs();
  };

  // -------------------- Close Modal --------------------
  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setModalMessage("");
    setForm(emptyForm);
    setEditorKey(Date.now());
  };

  // -------------------- JSX --------------------
  return (
    <div className="space-y-6">

      {message && (
        <div className={`border text-center font-medium p-2 rounded ${msgClasses[messageType]}`}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Blogs</h1>

        <div className="flex items-center gap-3">
          <select className="border p-2 rounded text-gray-700" value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-az">Title A–Z</option>
            <option value="title-za">Title Z–A</option>
            <option value="published-first">Published First</option>
            <option value="drafts-first">Drafts First</option>
          </select>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
            onClick={() => {
              setForm(emptyForm);
              setEditingBlog(null);
              setEditorKey(Date.now());
              setShowModal(true);
            }}>
            + Add Blog
          </button>
        </div>
      </div>

      {/* Blog List */}
      {loading ? <p>Loading...</p> : sortedBlogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition">
              <img
                src={blog.image || "https://bansaltimber.com/uploads/blog-images/default.jpg"}
                alt={blog.title}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{blog.excerpt}</p>

              <div className="flex items-center justify-between mt-4">
                {blog.featured === 1 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">
                    ⭐ Featured
                  </span>
                )}

                <span className={`text-xs px-2 py-1 rounded-full ${
                  blog.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {blog.status}
                </span>

                <div className="space-x-3">
                  <button onClick={() => handleEdit(blog)} className="text-blue-500 hover:text-blue-700 font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-800">&times;</button>

            {modalMessage && (
              <div className={`border w-full text-center font-medium p-2 mb-3 rounded ${msgClasses[modalMessageType]}`}>
                {modalMessage}{isFetchingSingle && " ..."}
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">{editingBlog ? "Edit Blog" : "Add Blog"}</h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              <label>Title</label>
              <input className="w-full border p-2 rounded" value={form.title} required
                onChange={(e) => handleTitleChange(e.target.value)} />

              <label>Slug</label>
              <input className="w-full border p-2 rounded bg-gray-100" value={form.slug} disabled />

              <label>Excerpt</label>
              <input className="w-full border p-2 rounded" value={form.excerpt} required
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />

              <label>Meta Title</label>
              <input className="w-full border p-2 rounded" value={form.meta_title}
                onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />

              <label>Meta Description</label>
              <textarea className="w-full border p-2 rounded"
                value={form.meta_description}
                onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />

              <label>Meta Keywords</label>
              <input className="w-full border p-2 rounded" value={form.meta_keywords}
                onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} />

              <label>Tags</label>
              <input className="w-full border p-2 rounded" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })} />

              <label>Blog Content</label>
              <ReactQuill key={editorKey} theme="snow" value={form.body}
                onChange={(v) => setForm({ ...form, body: v })} />

              
              {/* ---------------------- Improved Image Upload Section ---------------------- */}
              <div className="space-y-2 pt-2 border-t mt-2">
                <p className="font-medium text-gray-700">Upload Featured Image</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("adminBlogImageInput").click()}
                    className="px-4 py-2 rounded-md border bg-gray-50 hover:bg-gray-100 shadow-sm text-sm font-medium"
                  >
                    📁 Select Image
                  </button>

                  <input
                    id="adminBlogImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {form.image && (
                    <img
                      src={"https://bansaltimber.com" + form.image}
                      alt=""
                      className="h-20 w-auto object-cover rounded border"
                    />
                  )}
                </div>

                <p className="text-xs text-gray-500 italic">
                  Recommended: 1200×600px • JPG/WebP • Under 400KB
                </p>
              </div>
              {/* --------------------------------------------------------------------------- */}


              <label>Status</label>
              <select className="w-full border p-2 rounded" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox"
                  checked={form.featured === 1}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} />
                <span>Featured</span>
              </label>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                  {editingBlog ? "Update" : "Create"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

