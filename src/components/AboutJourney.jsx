import SectionTitle from './SectionTitle.jsx';
import journeyImage from '../assets/images/journey-logo.svg';
import journeyPic from '../assets/images/journey-image1.jpg';
import HomeProductsCTA from './HomeProductsCTA.jsx';
import SimpleButton from './Buttons/SimpleButton.jsx';
import ctaImage from '../assets/images/home-view-products-banner.jpg';

export default function AboutJourney(){
  return(
    <div className="mb-16">
      <SectionTitle title="OUR JOURNEY" />
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="font-[SagaceRegular] text-3xl md:text-6xl py-6">From our modest origins<br/> to your valued endorsements</h1>
        <hr className="border-1 border-gray-500 w-full my-4"/>
        <img src={journeyImage} alt="Journey throughout the years" className="py-8 md:py-16" />
        <hr className="border-1 border-gray-500 w-full my-4"/>
        <h1 className="font-[SagaceRegular] text-3xl md:text-6xl py-6">Present and Beyond:<br/> A Shared Future</h1>
        <img src={journeyPic} alt="A shared future" className="py-6 md:py-8" />
        <p className="font-[SagaceRegular] text-xl md:text-2xl p-6">We’ll keep bringing your visions to life<br/> with sincerity and unwavering integrity</p>
        <hr className="border-1 border-gray-500 w-full my-4"/>
      </div>
       <HomeProductsCTA
        text="View the full range of products."
        button={<SimpleButton text="See More" textColor="text-black" to="/products"bgColor="bg-white"/>}
        ctaImage={ctaImage}
      />

    </div>
  );
};
