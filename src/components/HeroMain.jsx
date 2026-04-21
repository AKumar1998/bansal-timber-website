import { useEffect, useState } from 'react';

export default function HeroMain() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch('https://bansaltimber.com/api/hero-banners/get_hero_banner.php?page_name=home')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHero(data.data);
      });
  }, []);

  if (!hero) return null;

  return (
    <div
      className="relative w-screen h-screen bg-center bg-cover flex items-start justify-center"
      style={{ backgroundImage: `url(${hero.image_url})` }}
    >

      {/* Text Container */}
      <div className="relative z-10 mt-45 sm:mt-40 px-4">
        <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-[SagaceMedium] font-bold text-center max-w-[20ch] leading-tight mx-auto">
          {hero.title_text}
        </h1>
      </div>
    </div>
  );
}
