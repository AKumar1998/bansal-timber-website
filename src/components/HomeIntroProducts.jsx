import { useEffect, useState } from "react";

export default function HomeIntroProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://bansaltimber.com/api/home-intro-products/get_home_intro_products.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch((err) => console.error("Error fetching home intro products:", err));
  }, []);

  if (products.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              className="mx-auto"
            />
            <hr className="my-2 border-gray-300" />
            <p className="font-[SagaceMedium]">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

