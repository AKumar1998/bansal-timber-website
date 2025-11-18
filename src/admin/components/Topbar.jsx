import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const segments = location.pathname.split("/").filter(Boolean);
  let currentPage = segments[segments.length - 1] || "Dashboard";

  if (!isNaN(currentPage)) {
    currentPage = segments[segments.length - 2] || "Dashboard";
  }

  const isBundleEditor = location.pathname.includes("/admin/bundles/");
  const displayTitle = isBundleEditor ? "Bundle Editor" : currentPage;

  const formatTitle = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ");

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <>
      <header className="flex items-center justify-between bg-white px-4 md:px-6 py-3 shadow-md relative">

        {/* Left - Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 hover:text-[#FF5724]"
          onClick={onMenuToggle}
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center - Page Title */}
        <h2 className="absolute left-1/2 -translate-x-1/2 font-[SagaceMedium] text-gray-800 text-lg md:text-xl text-center whitespace-nowrap">
          {formatTitle(displayTitle)}
        </h2>

        {/* Right - Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-1 text-orange-600 hover:text-[#FF5724] transition text-sm md:text-base"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-8V7a2 2 0 10-4 0v1" />
          </svg>
          Logout
        </button>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-11/12 max-w-sm p-6 rounded-2xl shadow-lg animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Confirm Logout
            </h3>
            <p className="text-gray-500 text-center mt-2">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 py-2 rounded-lg bg-[#FF5724] hover:bg-[#e64e20] text-white transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

