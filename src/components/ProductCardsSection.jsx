import { useState, useEffect } from "react";
import PaginationControls from "./PaginationControls";

export default function ProductCardsSection({ selectedCategory, attributes, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const perPage = window.innerWidth <= 768 ? 8 : 9;
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("per_page", perPage);
    params.append("device", window.innerWidth <= 768 ? "mobile" : "desktop");

    if (selectedCategory && selectedCategory.id) {
      params.append("category_id", selectedCategory.id);
    }

    if (attributes && typeof attributes === 'object') {
      Object.entries(attributes).forEach(([attrId, values]) => {
        if (!Array.isArray(values)) values = [values];
        values.forEach(v => {
          params.append(`sort_attributes[${attrId}][]`, v);
        });
      });
    }

    try {
      const res = await fetch(`/api/products/index.php?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalItems(data.pagination?.total_products || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, attributes, page]);

  if (!selectedCategory) return null;

  const gridColsClass = "grid grid-cols-2 md:grid-cols-3";

  useEffect(() => {
    const perPage = window.innerWidth <= 768 ? 8 : 9;

    let url = `/api/products/index.php?page=${page}&per_page=${perPage}`;

    if (selectedCategory.id) {
      url += `&category_id=${encodeURIComponent(selectedCategory.id)}`;
    }

    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const sortParams = new URLSearchParams();
    for (const [attrId, values] of Object.entries(attributes)) {
      const vals = Array.isArray(values) ? values : [values];
      vals.forEach(v => sortParams.append(`sort_attributes[${attrId}][]`, v));
    }

    if (sortParams.toString()) {
      url += `&${sortParams.toString()}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTotalItems(data.pagination?.total_products || 0);
      })
      .catch(err => console.error('Error loading products:', err));
  }, [selectedCategory, attributes, searchQuery, page]);

  // ✅ Added a dynamic minimum height (no layout jump)
  const minHeight = window.innerWidth <= 768 ? "min-h-[800px]" : "min-h-[1200px]";

  return (
    <div className={`flex flex-col ${minHeight}`}>
      {loading && <div className="text-center py-10 text-gray-500">Loading products...</div>}

      {!loading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className={`${gridColsClass} gap-6`}>
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
                style={{ minHeight: "400px" }}
              >
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="text-sm text-gray-700 space-y-1">
                      {product.attributes &&
                        Object.entries(product.attributes).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                    </div>
                  </div>

                  <a
                    href={`/contact?category=${encodeURIComponent(selectedCategory.name)}`}
                    className="block w-full text-center bg-gray-200 text-black hover:text-white py-2 rounded hover:bg-blue-500 transition"
                  >
                    On Order Available
                  </a>
                </div>
              </div>
            ))}
          </div>

          <PaginationControls
            currentPage={page}
            totalItems={totalItems}
            perPage={window.innerWidth <= 768 ? 8 : 9}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

