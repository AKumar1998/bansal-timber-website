import footCTAImage from '../assets/images/home-foot-cta.jpg';
import FancyButton from './Buttons/FancyButton.jsx';

export default function HomeFootCTA (){

  return(
    
    <div 
      className="flex flex-col md:flex-row justify-between md:px-40 p-14 gap-8 mb-12"
      style={{
        backgroundImage:`url(${footCTAImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p className="font-[SagaceMedium] max-w-[400px] text-2xl text-white">
        Visit our store for expert guidance, bulk deals & free material suggestions!
      </p>
      <FancyButton 
        mainText="Give us a visit!"
        buttonText="Store Location"
        mapsUrl="https://maps.app.goo.gl/CSkH8irjE1KcNhzM9?g_st=ipc"
      />
    </div>

  );

};
