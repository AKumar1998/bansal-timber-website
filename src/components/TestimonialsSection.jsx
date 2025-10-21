import { useEffect, useState, useRef } from "react";
import SectionTitle from "../components/SectionTitle.jsx";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const intervalRef = useRef(null);

  // Fetch testimonials
  useEffect(() => {
    fetch("/api/get_testimonials.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.testimonials)) {
          // Duplicate testimonials for continuous flow
          const looped = [...data.testimonials, ...data.testimonials];
          setTestimonials(looped);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  }, []);

  // Handle screen resize (mobile = 1, desktop = 2)
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= 1024 ? 2 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!testimonials.length) return;
    intervalRef.current = setInterval(() => {
      if (!paused) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 5000); // slower and smoother
    return () => clearInterval(intervalRef.current);
  }, [paused, testimonials]);

  // Reset index for seamless infinite loop
  useEffect(() => {
    if (currentIndex >= testimonials.length / 2) {
      setCurrentIndex(0);
    }
  }, [currentIndex, testimonials]);

  // Manual navigation
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length / 2 - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (!testimonials.length) return null;

  // Translate per card width
  const translateValue = currentIndex * (100 / visibleCount);

  return (
    <section
      className="relative w-full mx-auto px-4 py-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <SectionTitle title="TESTIMONIALS" />

      {/* Carousel container */}
      <div className="relative mt-16 flex justify-center items-center overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Track */}
        <div
          className="flex transition-transform duration-[2000ms] ease-[cubic-bezier(0.45,0,0.25,1)]"
          style={{
            width: `${(testimonials.length / visibleCount) * 100}%`,
            transform: `translateX(-${translateValue}%)`,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`w-full ${visibleCount === 2 ? "lg:w-1/2" : "w-full"} flex-shrink-0 px-3`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-[350px]">
                <img
                  src={t.image_url}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-6">
                  <p className="text-lg italic mb-4">{t.testimonial_text}</p>
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-300">{t.project_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

