import { useEffect, useState } from "react";
import RectangleButton from "./Buttons/RectangleButton.jsx";

export default function ProductsIntro() {
  const [introData, setIntroData] = useState(null);

  useEffect(() => {
    fetch("https://bansaltimber.com/api/products-intro/get_products_intro.php")
      .then((res) => res.json())
      .then((data) => {
        console.log("Products Intro response:", data);
        if (data.success) {
          console.log("✅ Setting intro data");
          setIntroData(data.data);
        } else {
          console.warn("❌ data.success is false");
        }
      })
      .catch((err) => console.error("Error fetching products intro:", err));
  }, []);

  if (!introData) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        Loading section...
      </div>
    );
  }

  return (
    <div className="flex flex-col my-12 md:flex-row gap-4">
      {/* Left side big image */}
      <div className="flex-1 overflow-hidden rounded-xl">
        <img
          src={introData.large_image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side grid */}
      <div className="flex-1 grid grid-cols-2 auto-rows-fr gap-4">
        {/* Square image 1 */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={introData.small_image_1}
            alt="Product 1"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Square image 2 */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={introData.small_image_2}
            alt="Product 2"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text + Buttons */}
        <div
          className="col-span-2 flex flex-col justify-center p-8 md:px-24 gap-6 rounded-xl"
          style={{
            backgroundImage: `url(${introData.banner_image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1
            className="text-2xl text-white font-[SagaceMedium] leading-snug"
            dangerouslySetInnerHTML={{ __html: introData.heading_text }}
          ></h1>
          <div className="flex flex-col md:flex-row gap-6">
            <RectangleButton text={introData.phone_1} />
            <RectangleButton text={introData.phone_2} />
          </div>
        </div>
      </div>
    </div>
  );
}

