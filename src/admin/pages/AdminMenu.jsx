import Sidebar from "../components/Sidebar.jsx";

export default function AdminMenu({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 w-72 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar isMobile onLinkClick={onClose} />
      </div>
    </>
  );
}

