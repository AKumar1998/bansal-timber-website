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
      className="relative w-screen h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${hero.image_url})` }}
    >
      <h1 className="z-10 text-white text-3xl sm:text-5xl font-[SagaceMedium] -translate-y-50 sm:-translate-y-60 font-bold text-center">
        {hero.title_text}
      </h1>
    </div>
  );
}

