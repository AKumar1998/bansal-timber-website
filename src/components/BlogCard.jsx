import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://bansaltimber.com/api/get_blogs.php?per_page=${perPage}&page=${page}`
        );
        const data = await response.json();
        setBlogs(data.blogs);
        setTotal(data.total);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
      setLoading(false);
    }

    fetchBlogs();
  }, [page, perPage]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center md:text-left">Latest Blogs</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : (
        <>
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer group"
              >
                {/* Blog Image */}
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 md:h-48 object-cover"
                  />
                )}

                {/* Blog Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-2xl font-semibold mb-3 line-clamp-2">{blog.title}</h2>
                  <p className="text-gray-600 flex-1 mb-4 line-clamp-3">{blog.excerpt}</p>

                  {/* CTA */}
                  <span className="mt-auto text-blue-600 font-semibold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-md font-medium ${
                    page === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

