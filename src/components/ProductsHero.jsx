import { useEffect, useState } from 'react';

export default function ProductsHero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch('https://bansaltimber.com/api/get_hero_banner.php?page_name=products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHero(data.data);
      });
  }, []);

  if (!hero) return null;

  return (
    <div className="flex flex-col mt-28 gap-8 md:gap-12 rounded-lg overflow-hidden items-center justify-center p-4 md:p-12">
      <h1 className="font-[SagaceMedium] text-center text-3xl md:text-6xl">{hero.title_text}</h1>
      <img
        src={hero.image_url}
        alt="Products Banner"
        className="w-full md:h-auto min-h-[431px] object-cover object-center rounded-lg"
      />
    </div>
  );
}
;
