export default function PaginationControls({ currentPage, totalItems, perPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / perPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            currentPage === p
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  );
}

