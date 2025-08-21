import plyWood from '../assets/images/home-plywood.jpg';
import blockBoard from '../assets/images/home-blackboard.jpg';
import hdhmr from '../assets/images/home-hdhmr.jpg';
import SimpleButton from './Buttons/SimpleButton.jsx';

const products = [
  
  {
    id:1,
    name:"Plywood",
    image:plyWood  
  },
  {
    id:2,
    name:"Block Board",
    image:blockBoard  
  },{
    id:3,
    name:"HDHMR",
    image:hdhmr  
  }
];

export default function HomeIntroProducts() {

  return(
    <div className=""> 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) =>(
          <div key={product.id}>
            <img src={product.image} alt={product.name} className="mx-auto" />
            <hr className="my-2 border-gray-300" />
            <p className="font-[SagaceMedium]">{product.name}</p>
          </div>
        ))}
      </div>

      <div className="my-3 flex justify-center align-items-center">
        <SimpleButton text="View Products" bgColor="bg-[#FF5724]" textColor="text-white"/>
      </div>
    </div>
  );

}
