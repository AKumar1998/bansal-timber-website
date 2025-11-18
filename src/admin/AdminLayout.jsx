import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import AdminMenu from "./pages/AdminMenu.jsx";

export default function AdminLayout() {
  const token = localStorage.getItem("adminToken");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Slide Panel */}
      <AdminMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <Topbar onMenuToggle={() => setMenuOpen(true)} />
        <main className="p-4 md:p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

