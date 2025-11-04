import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from './PaginationControls.jsx';

export default function BlogCard() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest'); // 🟢 sort state

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://bansaltimber.com/api/blogs/get_blogs.php?per_page=${perPage}&page=${page}&sort=${sort}`
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
  }, [page, perPage, sort]); // added sort dependency

  const getImageUrl = (image) => {
    if (!image || image.trim() === '') {
      return 'https://bansaltimber.com/uploads/blog-images/default.jpg';
    }
    if (!image.startsWith('http')) {
      return `https://bansaltimber.com${image}`;
    }
    return image;
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
          Latest Blogs
        </h1>

        {/* Sort Dropdown */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">A – Z</option>
          <option value="za">Z – A</option>
        </select>
      </div>

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
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-56 md:h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-2xl font-semibold mb-3 line-clamp-2">{blog.title}</h2>
                  <p className="text-gray-600 flex-1 mb-4 line-clamp-3">{blog.excerpt}</p>
                  <span className="mt-auto text-blue-600 font-semibold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={page}
            totalItems={total}
            perPage={perPage}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

