import { useState, useEffect, useRef } from "react";
import styles from "./HomeSlider.module.css";
import doorSkinImg from "../assets/images/doorskin-carousel.jpg";

class SliderImage {
  constructor(url, caption) {
    this.url = url;
    this.caption = caption;
  }
}


export default function HomeSlider() {

  const images = [
    new SliderImage(doorSkinImg, "Doorskin Image"),
    new SliderImage(doorSkinImg, "Image"),
    new SliderImage(doorSkinImg, "Doorskin Image"),
    new SliderImage(doorSkinImg, "Doorskin Image"),
    new SliderImage(doorSkinImg, "Doorskin Image"),
    new SliderImage(doorSkinImg, "Doorskin Image"),
  ];

  const ANIM_MS = 1000;
  const HOLD_MS = 3000;
  const PERIOD_MS = ANIM_MS + HOLD_MS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) => {
      prevIndexRef.current = prev;
      return (prev + 1) % images.length;
    });
  }, PERIOD_MS);

    return () => clearInterval(id);
  }, [images.length]);

  const prevIndex = prevIndexRef.current;

return ( <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg bg-black">
    <div className={`${styles.frame} h-64 sm:h-80`}>
      <img
      key={`prev-${prevIndex}`}
      src={images[prevIndex].url} 
      alt={images[prevIndex].caption}
      className={`${styles.layer}`}
      />
      <img
      key={`curr-${currentIndex}`}
      src={images[currentIndex].url} 
      alt={images[currentIndex].caption}
      className={`${styles} ${styles.animateSnapSlide}`}
      />
    </div>


    <div className="flex items-center justify-center gap-2 py-3">
    {images.map((_, i) => (
      <button 
      key={i}
      aria-label={`Go to slide ${i+1}`}
      onClick={() => {
      prevIndexRef.current = currentIndex;
      setCurrentIndex(i);
      }}
      className = {`h-2 w-2 rounded-full transition
        ${i === currentIndex? "bg-gray-800 scale-110" : "bg-gray-300 hover:bg-gray-400"}`}
      />
      ))}
    </div>
  </div>          
  );
}
