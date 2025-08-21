import rIcons from '../assets/images/home-resistance-icons.svg'
import WhiteRoundedButton from './Buttons/WhiteRoundedButton.jsx'

export default function HomeIntroIcons(){

  return (
    <div className="bg-[#6B1900]">
      <div>
        <p className="text-white">Discover our full product line</p>
        <WhiteRoundedButton/>
      </div>
      <img src={rIcons} alt="Wood Resistance Icons" />
    </div>

  );

}
