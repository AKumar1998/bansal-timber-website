import { useEffect, useState, useRef } from "react";

export default function ContactCarousel() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ✅ Fetch carousel images from backend
  useEffect(() => {
    fetch("https://bansaltimber.com/api/get_contact_carousel.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Ensure full URLs
          const images = data.data.map(
            (img) =>
              img.startsWith("http")
                ? img
                : "https://bansaltimber.com" + img
          );
          setSlides(images);
          setIndex(1);
        }
      })
      .catch((err) => console.error("Contact carousel fetch error:", err));
  }, []);

  const total = slides.length;
  const extendedSlides = total > 0 ? [slides[total - 1], ...slides, slides[0]] : [];

  // ✅ Auto-slide
  useEffect(() => {
    if (total === 0) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [total]);

  // ✅ Smooth infinite loop using ref-based transition snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container || total === 0) return;

    container.style.transition = isTransitioning
      ? "transform 0.7s ease-in-out"
      : "none";
    container.style.transform = `translateX(-${index * 100}%)`;

    const handleTransitionEnd = () => {
      if (index === total + 1) {
        // Snap to first real slide
        setIsTransitioning(false);
        setIndex(1);
      } else if (index === 0) {
        // Snap to last real slide
        setIsTransitioning(false);
        setIndex(total);
      }
    };

    container.addEventListener("transitionend", handleTransitionEnd);
    return () => container.removeEventListener("transitionend", handleTransitionEnd);
  }, [index, total, isTransitioning]);

  // ✅ Re-enable transitions after snapping (1 frame later)
  useEffect(() => {
    if (!isTransitioning) {
      const id = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isTransitioning]);

  // ✅ Swipe gesture
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) setIndex((prev) => prev + 1);
    else if (diff < -50) setIndex((prev) => prev - 1);
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
      {/* ✅ Slides */}
      <div ref={containerRef} className="flex">
        {extendedSlides.map((slide, i) => (
          <div key={i} className="w-full flex-shrink-0">
            <img
              src={slide}
              alt={`Slide ${i}`}
              className="w-full h-auto object-cover aspect-[16/9]"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* ✅ Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i + 1)}
            className={`h-2 w-2 md:h-3 md:w-3 mb-2 md:mb-4 rounded-full transition-all duration-300 ${
              index === i + 1 ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

