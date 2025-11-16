import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Categories & Products", path: "/admin/products", icon: "📦" },
    { name: "Blogs", path: "/admin/blogs", icon: "📝" },
    { name: "Bundles", path: "/admin/bundles", icon: "🗂️" },
    { name: "Testimonials", path: "/admin/testimonials", icon: "💬" },
    { name: "Footer", path: "/admin/footerInfo", icon: "💬" },
    { name: "Products Page Intro", path: "/admin/productsIntroAdmin", icon: "💬" },
    { name: "Home Intro Products", path: "/admin/homeIntroProductsAdmin", icon: "💬" },
    { name: "Founder Section", path: "/admin/founderSection", icon: "💬" },
  ];

  return (
    <aside className="bg-[#1F1F1F] text-white w-64 min-h-screen flex flex-col shadow-lg">
      <div className="flex items-center justify-center py-6 border-b border-gray-700">
        <h1 className="text-2xl font-[SagaceMedium] text-[#FF5724] tracking-wide">
          BANSAL ADMIN
        </h1>
      </div>

      <nav className="flex-1 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 my-1 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "bg-[#FF5724] text-white"
                  : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
        © 2025 Bansal Timber
      </div>
    </aside>
  );
}

