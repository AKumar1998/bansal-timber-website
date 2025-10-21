import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center bg-white border mb-6 border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:shadow-md transition duration-300"
    >
      {/* Search Icon (Left) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
        />
      </svg>

      {/* Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="flex-grow min-w-0 outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base"
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="ml-2 text-gray-400 hover:text-gray-600 transition"
        >
          &#10005;
        </button>
      )}

      {/* Search Button (Pill-Shaped & Responsive) */}
      <button
        type="submit"
        className="ml-2 bg-[#FF5724] text-white font-[SagaceMedium] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-[#e24d1f] transition-colors duration-300 flex items-center justify-center flex-shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </button>
    </form>
  );
}

