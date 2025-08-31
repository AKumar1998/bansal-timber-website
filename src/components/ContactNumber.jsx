import numberImage from '../assets/images/number-banner.jpg';
import callIcon from '../assets/images/icons/give-call.svg';
import RectangleButton from './Buttons/RectangleButton.jsx';

export default function ContactNumber() {
  return (
    <div 
      className="flex flex-col md:flex-row gap-8 items-center justify-center rounded-lg p-12 md:p-12 md:gap-12"
      style={{
        backgroundImage: `url(${numberImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {/* Title with icon */}
      <div className="flex gap-3 items-center justify-center">
        <img 
          src={callIcon} 
          alt="Call Icon" 
          className="h-8 w-8 object-contain"
        />
        <h1 className="text-3xl text-white font-[SagaceMedium] leading-none">
          Give us a call
        </h1>
      </div>

      {/* Call buttons */}
      <RectangleButton text="+91 12345 12345" /> 
      <RectangleButton text="+91 12345 12345" /> 
    </div>
  );
}

