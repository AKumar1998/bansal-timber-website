import whoImage from '../assets/images/who-we-are-image.jpg';
import drivesImage from '../assets/images/drives-image.jpg';

export default function AboutIntro() {
  const cards = [
    {
      id: 1,
      title: "Who We Are",
      text: "From textile to timber, our decades long family business is built on foundation of sincerity, fair trade, and unparalleled business relations.",
      image: whoImage
    },
    {
      id: 2,
      title: "What Drives Us",
      text: "Ensuring every piece and every price is a promise of excellence and honesty.",
      image: drivesImage
    }
  ];

  return (
    <div className="flex flex-col mb-12 md:flex-row gap-12">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="w-full md:w-1/2 flex flex-col"
        >
          <h1 className="text-2xl my-2 font-[NeueHaasBold] text-left">{card.title}</h1>
          <p className="text-md md:text-xl my-4 mb-8 font-[NeueHaasRoman] flex-1 text-left">{card.text}</p>
          <img 
            src={card.image} 
            alt={card.title}
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}

