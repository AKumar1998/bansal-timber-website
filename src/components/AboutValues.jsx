import SectionTitle from './SectionTitle.jsx';
import valueOne from '../assets/images/value1-image.jpg';
import valueTwo from '../assets/images/value2-image.jpg';
import valueThree from '../assets/images/value3-image.jpg';

export default function AboutValues(){

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

  return(
    <div>
      {values.map((value) => (
        <div key={value.id} className="">

        </div>
      ))}
    </div>
  );
};
