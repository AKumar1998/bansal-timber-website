import ctaImage from '../assets/images/products-first-cta-image.jpg';
import ContactFancyButton from './Buttons/ContactFancyButton.jsx';

export default function ProductsFirstCTA() {
  return (
    <div className="relative w-full flex flex-col items-center my-12 py-24 p-8 md:p-12 rounded-lg justify-center gap-8 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          backgroundImage: `url(${ctaImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Content */}
      <h1 className="relative text-3xl md:text-4xl font-[SagaceMedium] text-white text-center z-10">
        Seen Something You Like?
      </h1>
      <div className="relative z-10">
        <ContactFancyButton
          mainText="Drop By or Give Us a Call"
          buttonText="+91 12345 12345"
        />
      </div>
    </div>
  );
}

