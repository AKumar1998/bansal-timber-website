import { useState, useEffect } from "react";
import SortingAttributesSection from './SortingAttributesSection.jsx';

export default function MobileFilterMenu({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  onAttributesChange
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [view, setView] = useState("categories"); // 'categories' or 'attributes'
  const [menuTitle, setMenuTitle] = useState("Select a category");
  const [tempSelectedCategory, setTempSelectedCategory] = useState(selectedCategory);
  const [mobileAttributes, setMobileAttributes] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  const hasSortingOptions = (category) => {
    return !(category.id === '' || category.name === 'Miscellaneous');
  };

  // Fetch categories on mount
  useEffect(() => {
    setLoadingCategories(true);
    fetch("/api/products/get_categories.php")
      .then((res) => res.json())
      .then((data) => {
        const allCategories = [
          { id: '', name: 'All Products' },
          ...(data.categories || []),
        ];
        setCategories(allCategories);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error(err);
        setCategories([{ id: '', name: 'All Products' }]);
        setLoadingCategories(false);
      });
  }, []);

  // Preload attributes immediately when clicking Sort
  const handleCategorySelect = (category) => {
    setTempSelectedCategory(category);
    setMenuTitle("Select attributes to sort");
    setView("attributes");
    if (!category.id) return;

    setLoadingAttributes(true);
    fetch(`/api/products/get_attributes.php?category_id=${encodeURIComponent(category.id)}`)
      .then(res => res.json())
      .then(data => {
        const attrs = Array.isArray(data.attributes) ? data.attributes : [];
        setMobileAttributes(attrs);
        setLoadingAttributes(false);
      })
      .catch(err => {
        console.error(err);
        setMobileAttributes([]);
        setLoadingAttributes(false);
      });
  };

  const handleApply = () => {
    setSelectedCategory(tempSelectedCategory);
    onAttributesChange(Array.isArray(mobileAttributes) ? mobileAttributes : []);
    onClose();
    setView("categories");
    setMenuTitle("Select a category");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-end transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        backgroundColor: isOpen ? "rgba(0,0,0,0.25)" : "transparent", // semi-transparent black
        backdropFilter: "blur(8px)", // blur behind menu
        WebkitBackdropFilter: "blur(8px)" // Safari support
      }}
    >
      <div
        className="bg-white w-full max-h-[80%] rounded-t-xl shadow-lg p-4 overflow-hidden flex flex-col"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-in-out"
        }}
      >
        {/* Draggable handle */}
        <div
          className="w-20 h-3 rounded-full bg-gray-300 mx-auto my-4 cursor-pointer"
          onClick={onClose}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {view === "attributes" && (
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => {
                setView("categories");
                setMenuTitle("Select a category");
              }}
            >
              ←
            </button>
          )}
          <h2 className="text-2xl font-[SagaceMedium] text-center flex-grow">
            {menuTitle}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto relative">
          {view === "categories" && (
            <>
              {loadingCategories && (
                <div className="text-center py-4 text-gray-500">Loading categories...</div>
              )}
              {!loadingCategories && categories.length === 0 && (
                <div className="text-center py-4 text-gray-500">No categories found.</div>
              )}
              {!loadingCategories && categories.length > 0 && (
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-lg cursor-pointer shadow hover:shadow-md transition flex justify-between items-center ${
                        tempSelectedCategory.id === cat.id
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <span
                        onClick={() => setTempSelectedCategory(cat)}
                        className="flex-grow font-[SagaceMedium]"
                      >
                        {cat.name}
                      </span>
                      {hasSortingOptions(cat) && (
                        <button
                          className="bg-gray-200 text-black px-3 py-1 rounded font-[SagaceMedium] hover:bg-orange-600 transition"
                          onClick={() => handleCategorySelect(cat)}
                        >
                          Sort
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {view === "attributes" && (
            <div className="bg-white p-2 animate-slide-in">
              <SortingAttributesSection
                key={tempSelectedCategory.id}
                attributes={Array.isArray(mobileAttributes) ? mobileAttributes : []}
                loading={loadingAttributes}
                selectedCategory={tempSelectedCategory}
                onAttributesChange={setMobileAttributes}
              />
            </div>
          )}
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          className="w-full mt-4 bg-[#FF5724] text-white font-[SagaceMedium] p-3 rounded-lg shadow hover:bg-orange-600 transition"
        >
          Apply
        </button>
      </div>

      {/* Slide-in animation */}
      <style>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

