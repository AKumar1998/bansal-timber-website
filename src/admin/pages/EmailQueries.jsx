import { useEffect, useState } from "react";

export default function EmailQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadQueries = () => {
    setLoading(true);
    fetch("https://bansaltimber.com/api/contact-queries/get_contact_queries.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setQueries(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const markAsRead = (id, readState) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("read", readState ? 1 : 0);

    fetch("https://bansaltimber.com/api/contact-queries/mark_contact_query.php", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) loadQueries();
        else alert(data.message);
      });
  };

  const deleteQuery = (id) => {
    if (!window.confirm("Delete this query permanently?")) return;

    const formData = new FormData();
    formData.append("id", id);

    fetch("https://bansaltimber.com/api/contact-queries/delete_contact_query.php", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) loadQueries();
        else alert(data.message);
      });
  };

  // =====================================
  // FILTERING + SEARCH
  // =====================================
  let displayed = queries.filter(q =>
    q.name.toLowerCase().includes(search.toLowerCase()) ||
    q.email.toLowerCase().includes(search.toLowerCase()) ||
    q.phone.includes(search)
  );

  if (filterStatus !== "all") {
    displayed = displayed.filter(q => (filterStatus === "read" ? q.is_read : !q.is_read));
  }

  if (sortBy === "oldest") {
    displayed.sort((a, b) => new Date(a.submitted_at) - new Date(b.submitted_at));
  } else if (sortBy === "nameAZ") {
    displayed.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "nameZA") {
    displayed.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    displayed.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)); // newest first
  }

  // =====================================
  // PAGINATION LOGIC
  // =====================================
  const totalPages = Math.ceil(displayed.length / pageSize);
  const paginatedData = displayed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    // Scroll smoothly back to results top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Contact Form Queries</h2>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          type="text"
          placeholder="Search name, email or phone..."
          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          className="px-3 py-2 border rounded-md cursor-pointer"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>

        <select
          className="px-3 py-2 border rounded-md cursor-pointer"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="nameAZ">Name: A → Z</option>
          <option value="nameZA">Name: Z → A</option>
        </select>
      </div>

      {/* Display */}
      {loading ? (
        <p className="text-gray-600 animate-pulse">Loading...</p>
      ) : paginatedData.length === 0 ? (
        <p className="text-gray-500 italic text-center py-12">No matching queries found.</p>
      ) : (
        <div className="space-y-4">
          {paginatedData.map((q) => (
            <div
              key={q.id}
              className={`transition border rounded-xl p-5 shadow-sm hover:shadow-lg ${
                q.is_read ? "bg-white" : "bg-orange-50 border-orange-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                  {q.name}
                  {!q.is_read && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs font-medium">
                      NEW
                    </span>
                  )}
                </h3>
                <span className="text-xs text-gray-500">{q.submitted_at}</span>
              </div>

              <p className="text-gray-700"><b>Email:</b> {q.email}</p>
              <p className="text-gray-700"><b>Phone:</b> {q.phone}</p>
              <p className="text-gray-700"><b>Category:</b> {q.service || "Not Provided"}</p>

              <p className="text-gray-700 mt-2">
                <b>Message:</b> {q.message || "Empty"}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  className={`px-4 py-2 rounded-md text-white text-sm ${
                    q.is_read ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={() => markAsRead(q.id, !q.is_read)}
                >
                  {q.is_read ? "Mark Unread" : "Mark Read"}
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  onClick={() => deleteQuery(q.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4 flex-wrap">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === i + 1
                  ? "bg-orange-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

