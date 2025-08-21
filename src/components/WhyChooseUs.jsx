import woodInOut from '../assets/images/wood-in-out.jpg';
import qualityLeaves from '../assets/images/quality-leaves.jpg';
import fastFairPrice from '../assets/images/fast-fair-price.jpg';

const Section = ({title, text, image, reverse}) => {

  return(
  
    <div className="flex flex-col md:flex-row items-center gap-8 my-12">
      <div className={`flex-1 ${reverse ? "md:order-2" : "md:order-1"}`}>
        <img src={image} alt={text} className="w-full"/>
      </div>
      <div className={`flex-1 ${reverse? "md:order-1" : "md:order-2"}`}>
        <h2 className="text-4xl text-black font-[NeueHaasBold]">{title}</h2>
        <p className="text-base mt-4 text-black font-[NeueHaasRoman]">{text}</p>
      </div>
    </div>
  
  );
};

const sections = [
  
  {
    Id: 1, 
    title: "We Know Wood, Inside Out",
    text: "Years of experience help us guide you to the right product every time. Speak with experts, not salespeople.",
    image: woodInOut,
    reverse: false
  },
  {
    Id: 2, 
    title: "Only Quality Leaves Our Store",
    text: "No substandard stock, no fakes. Just genuine, high-performance materials. Products we’d use in our own homes.",
    image: qualityLeaves,
    reverse: true
  },
  {
    Id: 3, 
    title: "Fast Service, Fair Prices",
    text: "Expect on-time delivery, honest rates, and smooth support. Transparent pricing, no last-minute surprises.",
    image: fastFairPrice,
    reverse: false
  }
  
];


export default function WhyChooseUs(){

  return(
    <div>
      <div className="text-center mt-6">
        <h1 className="font-[NeueHaasRoman] text-xl md:text-[28px]">WHY CHOOSE US</h1>
        <hr className="border-1 border-gray-500 mx-auto my-4"/>
      </div>
      <div className="mx-auto">
        {sections.map((section) => (
          <Section key={sections.id} {...section}/>
        ))}
      </div>
    </div>
  );

};
