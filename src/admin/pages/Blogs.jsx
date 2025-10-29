import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", body: "", image: "", status: "draft" });

  const fetchBlogs = () => {
    fetch("https://bansaltimber.com/api/get_blogs.php")
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://bansaltimber.com/backend/upload_blog_image.php", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setForm((f) => ({ ...f, image: data.path }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://bansaltimber.com/backend/create_blog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      fetchBlogs();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    await fetch("https://bansaltimber.com/backend/delete_blog.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Blogs</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          + Add Blog
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">Title</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Status</th>
                <th className="p-3">Published</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.title}</td>
                  <td className="p-3">{b.slug}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">{b.published_at}</td>
                  <td className="p-3 text-right space-x-3">
                    <button className="text-blue-500 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Add Blog</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2 rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              <ReactQuill theme="snow" value={form.body} onChange={(value) => setForm({ ...form, body: value })} />
              <input type="file" onChange={handleFileChange} />
              {form.image && <img src={"https://bansaltimber.com" + form.image} alt="" className="h-24 mt-2 rounded" />}
              <select
                className="w-full border p-2 rounded"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

