import rIconsMobile from '../assets/images/home-resistance-icons-mobile.svg';
import rIconsDesktop from '../assets/images/home-resistance-icons.svg';
import SimpleButton from './Buttons/SimpleButton.jsx';

export default function HomeIntroIcons() {
  return (
    <div className="flex p-8 my-3 md:py-16 bg-[#6B1900] gap-8 md:gap-20 rounded-xl items-center">
      <div className="flex flex-col gap-4">
        <p className="text-white font-[NeueHaasMedium] text-[12px] md:text-[16px]">
          Wood built to last,<br/> resist, and endure.
        </p>
      </div>
      
      {/* Mobile SVG */}
      <img 
        src={rIconsMobile} 
        alt="Wood Resistance Icons Mobile" 
        className="md:hidden max-w-[150px] w-auto" 
      />
      
      {/* Desktop SVG */}
      <img 
        src={rIconsDesktop} 
        alt="Wood Resistance Icons Desktop" 
        className="hidden md:block max-w-[300px] w-auto" 
      />
    </div>
  );
}

