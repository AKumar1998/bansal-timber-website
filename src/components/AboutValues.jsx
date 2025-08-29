import SectionTitle from './SectionTitle.jsx';
import valueOne from '../assets/images/value1-image.jpg';
import valueTwo from '../assets/images/value2-image.jpg';
import valueThree from '../assets/images/value3-image.jpg';

export default function AboutValues() {
  const values = [
    {
      id: 1,
      image: valueOne,
      title: "Understanding Needs, Educating Choices",
      text: "We guide your choices to perfectly match your vision, ensuring ideal products."
    },
    {
      id: 2,
      image: valueTwo,
      title: "Quality without Compromise",
      text: "All products in our inventory are meticulously selected to meet the highest standards of durability and performance."
    },
    {
      id: 3,
      image: valueThree,
      title: "Bonds beyond Transactions",
      text: "We do not just sell, we for relations."
    },
  ];

  return (
    <div>
      <SectionTitle title="OUR VALUES" />

      <div className="my-8 md:my-24 grid grid-cols-1 md:grid-cols-[40%_50%_10%]">
        <div className="md:col-start-2 md:col-end-3 w-full justify-self-stretch px-4 md:px-0 flex flex-col gap-12">
          {values.map((value) => (
            <div key={value.id} className="flex flex-col gap-4">
              <h1 className="font-[NeueHaasBold] text-2xl">{value.title}</h1>
              <p className="font-[NeueHaasRoman] text-md md:text-xl">{value.text}</p>
              <img
                src={value.image}
                alt={value.title}
                className="w-full h-auto mt-4"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

