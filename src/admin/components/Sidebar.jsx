import { NavLink } from "react-router-dom";

const iconClass = "h-5 w-5";

const icons = {
  dashboard: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9.75 3v18m4.5-18v18M3 9.75h18m-18 4.5h18" />
    </svg>
  ),
  email: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8 8-8" />
    </svg>
  ),
  products: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
    </svg>
  ),
  blogs: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 4h12v16H6z" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-6 4h6" />
    </svg>
  ),
  bundles: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  ),
  comments: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 0112 20.5a8.5 8.5 0 01-6.6-3L3 20.5v-3a8.5 8.5 0 1118 0z" />
    </svg>
  ),
};

export default function Sidebar({isMobile, onLinkClick}) {
  const logoUrl = "https://bansaltimber.com/uploads/company-logos/bansal-white.png";

  const links = [
    { name: "Dashboard", path: "/admin", icon: icons.dashboard },
    { name: "Email Queries", path: "/admin/emailQueries", icon: icons.email },
    { name: "Categories & Products", path: "/admin/products", icon: icons.products },
    { name: "Blogs", path: "/admin/blogs", icon: icons.blogs },
    { name: "Bundles", path: "/admin/bundles", icon: icons.bundles },
    { name: "Testimonials", path: "/admin/testimonials", icon: icons.comments },
    { name: "Footer", path: "/admin/footerInfo", icon: icons.comments },
    { name: "Products Page Intro", path: "/admin/productsIntroAdmin", icon: icons.products },
    { name: "Home Intro Products", path: "/admin/homeIntroProductsAdmin", icon: icons.products },
    { name: "Founder Section", path: "/admin/founderSection", icon: icons.comments },
    { name: "Contact Page Carousel", path: "/admin/contactCarouselAdmin", icon: icons.products },
    { name: "Product Page Carousel", path: "/admin/productCarouselAdmin", icon: icons.products },
    { name: "Hero Banners", path: "/admin/heroBanners", icon: icons.products },
  ];

  return (
    <aside className="bg-[#1F1F1F] text-white w-64 min-h-screen flex flex-col shadow-lg">
      
      {/* Logo Area */}
      <div className="flex items-center justify-center py-6 border-b border-gray-700 bg-[#1F1F1F]">
        <div className="p-6 rounded-md bg-[#1F1F1F]">
          <img
            src={logoUrl}
            alt="Admin Logo"
            className="max-h-12 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => isMobile && onLinkClick?.()}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 my-1 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "bg-[#FF5724] text-white"
                  : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
              }`
            }
          >
            {link.icon}
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

