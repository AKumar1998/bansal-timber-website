import { useState, useEffect, useRef } from 'react';
import CategoriesSection from '../CategoriesSection.jsx';
import SortingAttributesSection from '../SortingAttributesSection.jsx';
import ProductCardsSection from '../ProductCardsSection.jsx';
import SectionTitle from '../SectionTitle.jsx';
import MobileFilterMenu from '../MobileFilterMenu.jsx';
import SearchBar from '../SearchBar.jsx';

export default function ProductsAll() {
  const [selectedCategory, setSelectedCategory] = useState({ id: '', name: 'All Products' });
  const [attributes, setAttributes] = useState([]); // array of attributes
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  const containerRef = useRef(null);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!selectedCategory.id) {
      setAttributes([]);
      return;
    }

    setLoadingAttributes(true);
    fetch(`/api/products/get_attributes.php?category_id=${encodeURIComponent(selectedCategory.id)}`)
      .then(res => res.json())
      .then(data => {
        setAttributes(data.attributes || []);
        setLoadingAttributes(false);
      })
      .catch(err => {
        console.error(err);
        setAttributes([]);
        setLoadingAttributes(false);
      });
  }, [selectedCategory]);

  const handleAttributesChange = (selectedFilters) => {
    // selectedFilters: { "<attributeId>": [val1,val2,...], ... }
    // convert to a shape the ProductCardsSection expects or pass raw and let it serialize
    setAttributes(prev => {
      // keep prev attributes but store a `selectedValues` mapping externally
      // we'll store selected filters in a separate state managed below if needed.
      // For simplicity, we'll keep attributes unchanged and manage selected filters in separate ref/state.
      return prev;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingBtn(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // new
  const [query, setQuery] = useState('');

  // Handle search query submission
  const handleSearch = (query) => {
      setSearchQuery(query);
    // Reset filters & category when searching globally
      SetTimeout(() => {
        setSelectedCategory({ id: '', name: 'All Products' });
        setSelectedFilters({});
      }, 0);
  };

  // Sync internal state with prop
  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

return (
  <div ref={containerRef} className="p-4 relative">
    <SectionTitle title="PRODUCTS" />

    <div className="flex flex-col md:flex-row md:space-x-4">
      {/* LEFT COLUMN - Search + Categories + Sorting */}
      <div className="w-full md:w-[25%] md:flex-shrink-0 mb-4 md:mb-0">
        {/* Search bar stays always visible */}
        <div className="mb-4">
          <SearchBar
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
        </div>

        {/* Categories & Sorting - hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <CategoriesSection
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedFilters({});
              setSearchQuery('');
            }}
          />

          {selectedCategory.name !== 'All Products' &&
            selectedCategory.name !== 'Miscellaneous' && (
              <SortingAttributesSection
                attributes={attributes}
                loading={loadingAttributes}
                selectedCategory={selectedCategory}
                onAttributesChange={(filters) => {
                  setSelectedFilters(filters);
                  setSearchQuery('');
                }}
              />
            )}
        </div>
      </div>

      {/* RIGHT COLUMN - Category Box + Product Cards */}
      <div className="w-full md:w-[75%] flex flex-col space-y-4">
        {/* Category title box */}
        <div className="bg-orange-100 rounded-lg py-3 px-4 text-center text-lg font-semibold text-orange-800 shadow-sm">
          {searchQuery ? 'All Products' : selectedCategory?.name || 'All Products'}
        </div>

        {/* Product cards */}
        <ProductCardsSection
          selectedCategory={selectedCategory}
          attributes={selectedFilters}
          searchQuery={searchQuery}
        />
      </div>
    </div>

    {/* Floating Button - only on mobile */}
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        transition-transform duration-300
        ${showFloatingBtn ? 'translate-y-0' : 'translate-y-24'}
        md:hidden
      `}
    >
      <button
        onClick={() => setMenuOpen(true)}
        className="bg-[#FF5724] text-white font-[SagaceMedium] px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
      >
        Categories & Filters
      </button>
    </div>

    {/* Mobile Filter Menu */}
    <MobileFilterMenu
      isOpen={menuOpen}
      onClose={() => setMenuOpen(false)}
      selectedCategory={selectedCategory}
      setSelectedCategory={(cat) => {
        setSelectedCategory(cat);
        setSelectedFilters({});
        setSearchQuery('');
      }}
      attributes={attributes}
      onAttributesChange={(filters) => {
        setSelectedFilters(filters);
        setSearchQuery('');
      }}
    />
  </div>
);


}

