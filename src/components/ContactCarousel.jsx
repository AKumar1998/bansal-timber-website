import { useEffect, useState, useRef, useCallback, useMemo } from "react";

export default function ContactCarousel() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(1);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch images
  useEffect(() => {
    fetch("https://bansaltimber.com/api/contact-carousel/get_contact_carousel.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const images = data.data.map((img) =>
            img.startsWith("http") ? img : "https://bansaltimber.com" + img
          );
          setSlides(images);
          setIndex(1);
        }
      })
      .catch((err) => console.error("Contact carousel fetch error:", err));
  }, []);

  const total = slides.length;

  // ✅ Stable extended slides
  const extendedSlides = useMemo(() => {
    return total > 0 ? [slides[total - 1], ...slides, slides[0]] : [];
  }, [slides, total]);

  // Auto slide (single source of truth)
  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 4000);
  }, []);

  useEffect(() => {
    if (total === 0) return;
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [total, startInterval]);

  // ✅ Transform + SAFE loop correction (NO transitionend)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || total === 0) return;

    container.style.transition = "transform 0.6s ease-in-out";
    container.style.transform = `translateX(-${index * 100}%)`;

    const timeout = setTimeout(() => {
      // Forward loop
      if (index === total + 1) {
        container.style.transition = "none";
        setIndex(1);
        container.style.transform = `translateX(-100%)`;
      }

      // Backward loop
      if (index === 0) {
        container.style.transition = "none";
        setIndex(total);
        container.style.transform = `translateX(-${total * 100}%)`;
      }
    }, 600); // match transition duration

    return () => clearTimeout(timeout);
  }, [index, total]);

  // Swipe
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      setIndex((prev) => prev + (diff > 0 ? 1 : -1));
      startInterval();
    }
  };

  if (total === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        Loading carousel...
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-lg my-12 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div ref={containerRef} className="flex">
        {extendedSlides.map((slide, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <img
              src={slide}
              alt={`Slide ${i}`}
              className="w-full h-auto object-cover aspect-[16/9]"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i + 1);
              startInterval();
            }}
            className={`h-2 w-2 md:h-3 md:w-3 mb-2 md:mb-4 rounded-full transition-all duration-300 ${
              index === i + 1 ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
