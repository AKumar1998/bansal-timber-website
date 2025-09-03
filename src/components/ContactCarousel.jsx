import { useEffect, useState, useRef } from "react";
import img1 from "../assets/images/store-image1.jpg";
import img2 from "../assets/images/store-image2.jpg";
import img3 from "../assets/images/store-image3.jpg";

export default function ImageCarousel() {
  const slides = [img1, img2, img3];
  const totalSlides = slides.length;

  // Add clones for smooth looping
  const extendedSlides = [slides[totalSlides - 1], ...slides, slides[0]];

  const [current, setCurrent] = useState(1); // start at the first *real* slide
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef(null);

  // Touch/swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToNext = () => {
    setCurrent((prev) => prev + 1);
    setIsTransitioning(true);
  };

  const goToPrev = () => {
    setCurrent((prev) => prev - 1);
    setIsTransitioning(true);
  };

  // Auto-slide every 5s
  useEffect(() => {
    intervalRef.current = setInterval(goToNext, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Handle the "infinite" reset after transition ends
  const handleTransitionEnd = () => {
    if (current === extendedSlides.length - 1) {
      // If we’re at the cloned last -> reset to first real
      setIsTransitioning(false);
      setCurrent(1);
    } else if (current === 0) {
      // If we’re at the cloned first -> reset to last real
      setIsTransitioning(false);
      setCurrent(totalSlides);
    } else {
      setIsTransitioning(true);
    }
  };

  // Handle swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
  };

  return (
    <div
      className="w-full overflow-hidden rounded-lg my-12 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider wrapper */}
      <div
        className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={slide}
              alt={`Slide ${index}`}
              className="w-full h-auto object-cover aspect-[16/9]"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index + 1)} // +1 because of cloned start
            className={`h-3 w-3 mb-4 rounded-full transition-all duration-300 ${
              current === index + 1 ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

