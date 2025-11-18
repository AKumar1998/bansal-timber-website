import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Reusable icon component (Heroicons)
const Icon = ({ path }) => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {path}
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, queriesRes] = await Promise.all([
          fetch("https://bansaltimber.com/api/admin/get_dashboard_stats.php"),
          fetch("https://bansaltimber.com/api/contact-queries/get_contact_queries.php"),
        ]);

        const statsJson = await statsRes.json();
        const queriesJson = await queriesRes.json();

        if (statsJson.success) {
          setStats(statsJson.data);
        } else {
          setError("Failed to load stats.");
        }

        if (queriesJson.success) {
          setRecentQueries(queriesJson.data.slice(0, 5));
        }
      } catch (err) {
        setError("Something went wrong while loading dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ICON LIBRARY
  const paths = {
    box: (<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />),
    blog: (<><path d="M6 4h12v16H6z" /><path d="M9 8h6m-6 4h6" /></>),
    chat: (<path d="M21 11.5a8.38 8.38 0 01-.9 3.8A8.5 8.5 0 0112 20.5a8.5 8.5 0 01-6.6-3L3 20.5v-3a8.5 8.5 0 1118 0z" />),
    folder: (<><path d="M3 7h18v12H3z" /><path d="M3 7l4-4h14v4" /></>),
    mailUnread: (<><path d="M4 4h16v16H4z" /><path d="M4 4l8 6 8-6" /></>),
    mail: (<><path d="M4 4h16v16H4z" /><path d="M4 4l8 8 8-8" /></>),
    carousel: (<path d="M4 6h16v12H4z" />),
    image: (<><path d="M4 6h16v12H4z" /><path d="M8 11l3 3 4-4" /></>),
    check: (<path d="M5 13l4 4L19 7" />),
    x: (<path d="M6 18L18 6M6 6l12 12" />),
  };

  const cards = [
    { label: "Total Products", value: stats?.total_products ?? "—", accent: "bg-orange-50 text-orange-700 border-orange-200", icon: paths.box, onClick: () => navigate("products") },
    { label: "Total Blogs", value: stats?.total_blogs ?? "—", accent: "bg-sky-50 text-sky-700 border-sky-200", icon: paths.blog, onClick: () => navigate("blogs") },
    { label: "Testimonials", value: stats?.total_testimonials ?? "—", accent: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: paths.chat, onClick: () => navigate("testimonials") },
    { label: "Categories", value: stats?.total_categories ?? "—", accent: "bg-violet-50 text-violet-700 border-violet-200", icon: paths.folder, onClick: () => navigate("products") },
    { label: "New Queries", value: stats?.unread_contact_queries ?? "—", accent: "bg-red-50 text-red-700 border-red-200", icon: paths.mailUnread, onClick: () => navigate("emailQueries") },
    { label: "Total Queries", value: stats?.total_contact_queries ?? "—", accent: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: paths.mail, onClick: () => navigate("emailQueries") },
    { label: "Product Carousel", value: stats?.product_carousel_items ?? "—", accent: "bg-teal-50 text-teal-700 border-teal-200", icon: paths.carousel, onClick: () => navigate("productCarouselAdmin") },
    { label: "Contact Carousel", value: stats?.contact_carousel_items ?? "—", accent: "bg-rose-50 text-rose-700 border-rose-200", icon: paths.image, onClick: () => navigate("contactCarouselAdmin") },
  ];

  const configStatus = [
    { label: "Hero Banners", ok: (stats?.hero_banners_configured ?? 0) >= 3, onClick: () => navigate("heroBanners") },
    { label: "Footer Info", ok: (stats?.footer_rows ?? 0) > 0, onClick: () => navigate("footerInfo") },
    { label: "Products Intro Section", ok: (stats?.products_intro_rows ?? 0) > 0, onClick: () => navigate("productsIntroAdmin") },
    { label: "Home Intro Products", ok: (stats?.home_intro_rows ?? 0) > 0, onClick: () => navigate("homeIntroProductsAdmin") },
    { label: "Founder Section", ok: (stats?.founder_section_rows ?? 0) > 0, onClick: () => navigate("founderSection") },
  ];

  return (
    <div className="space-y-6">

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Quick overview of website activity & configuration.</p>
        </div>
      </header>

      {error && <div className="border border-red-300 bg-red-50 text-red-700 rounded-md px-3 py-2 text-sm">{error}</div>}
      {loading && !error && <div className="border border-blue-200 bg-blue-50 text-blue-700 rounded-md px-3 py-2 text-sm animate-pulse">Loading dashboard data...</div>}

      <section>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className={`text-left border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform ${card.accent}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon path={card.icon} />
                <span className="text-[11px] uppercase tracking-wide opacity-80">View</span>
              </div>
              <div>
                <p className="text-xs text-gray-500/90 mb-1">{card.label}</p>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-600">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

          <button onClick={() => navigate("products")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.box} /> Manage Products
          </button>

          <button onClick={() => navigate("blogs")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.blog} /> Manage Blogs
          </button>

          <button onClick={() => navigate("emailQueries")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.mailUnread} /> View Queries
          </button>

          <button onClick={() => navigate("footerInfo")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.chat} /> Edit Footer
          </button>

          <button onClick={() => navigate("productCarouselAdmin")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.carousel} /> Product Carousel
          </button>

          <button onClick={() => navigate("contactCarouselAdmin")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.image} /> Contact Carousel
          </button>

          <button onClick={() => navigate("heroBanners")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.image} /> Hero Banners
          </button>

          <button onClick={() => navigate("founderSection")} className="flex items-center justify-center gap-2 rounded-xl border bg-white hover:bg-gray-50 px-3 py-3 text-sm font-medium shadow-sm">
            <Icon path={paths.chat} /> Founder Section
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-600">Content Configuration Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {configStatus.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex items-center justify-between border rounded-xl px-4 py-3 bg-white shadow-sm hover:shadow-md text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-500">{item.ok ? "Configured" : "Needs attention"}</p>
              </div>
              <span className={`w-3 h-3 rounded-full ${item.ok ? "bg-emerald-500" : "bg-red-500"}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-600 flex items-center justify-between">
          Recent Contact Queries
          <button
            onClick={() => navigate("emailQueries")}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            View all →
          </button>
        </h2>

        {recentQueries.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No recent queries found.</p>
        ) : (
          <div className="space-y-2">
            {recentQueries.map((q) => (
              <div key={q.id} className="border rounded-lg px-3 py-2 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {q.name}{" "}
                    {q.service && (
                      <span className="text-[11px] ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {q.service}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {q.email} · {q.phone}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400">{q.submitted_at}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

