import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const currentPage =
    location.pathname.split("/").pop() || "Dashboard";

  const formatTitle = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 shadow-md">
      <h2 className="text-xl font-[SagaceMedium] text-gray-800">
        {formatTitle(currentPage)}
      </h2>

      <button
        className="text-gray-600 hover:text-[#FF5724] transition-colors text-sm font-medium"
        onClick={() => alert('Logout functionality coming soon!')}
      >
        🔒 Logout
      </button>
    </header>
  );
}

