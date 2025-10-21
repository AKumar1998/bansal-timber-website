import { useEffect, useState } from 'react';
import ArrowButton from './Buttons/ArrowButton.jsx';

export default function ContactHero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch('https://bansaltimber.com/api/get_hero_banner.php?page_name=contact')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHero(data.data);
      });
  }, []);

  if (!hero) return null;

  return (
    <div
      className="relative w-screen h-screen flex flex-col gap-6 items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${hero.image_url})` }}
    >
      <h1 className="z-10 text-white text-3xl sm:text-5xl font-[SagaceMedium] font-bold text-center">
        {hero.title_text}
      </h1>
      {hero.button_text && <ArrowButton text={hero.button_text} />}
    </div>
  );
}

