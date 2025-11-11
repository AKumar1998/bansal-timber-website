import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  let currentPage = segments[segments.length - 1] || "Dashboard";

  if (!isNaN(currentPage)) {
    currentPage = segments[segments.length - 2] || "Dashboard";
  }

  const isBundleEditor = location.pathname.includes("/admin/bundles/");
  const displayTitle = isBundleEditor ? "Bundle Editor" : currentPage;

  const formatTitle = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ");

  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 shadow-md">
      <h2 className="text-xl font-[SagaceMedium] text-gray-800">
        {formatTitle(displayTitle)}
      </h2>

      <button
        className="text-gray-600 hover:text-[#FF5724] transition-colors text-sm font-medium"
        onClick={() => alert("Logout functionality coming soon!")}
      >
        🔒 Logout
      </button>
    </header>
  );
}

