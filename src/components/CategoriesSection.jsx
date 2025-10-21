import { useState, useEffect } from 'react';

export default function CategoriesSection({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/get_categories.php');
        const data = await res.json();
        setCategories(data.categories); // Only actual categories from DB
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Product Categories</h2>

      {/* Frontend-only "All Products" */}
      <div
        onClick={() => setSelectedCategory({ id: '', name: 'All Products' })}
        className={`cursor-pointer px-3 py-2 rounded ${
          selectedCategory.id === '' ? 'bg-gray-700 text-white' : 'hover:bg-gray-200'
        }`}
      >
        All Products
      </div>

      {/* Real categories from backend */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => setSelectedCategory({ id: cat.id, name: cat.name })}
          className={`cursor-pointer px-3 py-2 rounded ${
            selectedCategory.id === cat.id ? 'bg-gray-700 text-white' : 'hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
}

