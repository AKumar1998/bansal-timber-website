import imageOne from '../assets/images/product-image1.jpg';
import imageTwo from '../assets/images/product-image2.jpg';
import imageThree from '../assets/images/product-image3.jpg';
import RectangleButton from './Buttons/RectangleButton.jsx';
import bannerImage from '../assets/images/number-banner.jpg';

export default function ProductsIntro() {
  return (
    <div className="flex flex-col my-12 md:flex-row gap-4">
      {/* Left side big image */}
      <div className="flex-1 overflow-hidden rounded-xl">
        <img
          src={imageOne}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side grid */}
      <div className="flex-1 grid grid-cols-2 auto-rows-fr gap-4">
        {/* Square image */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={imageTwo}
            alt="Flush Doors"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Square image */}
        <div className="overflow-hidden rounded-xl">
          <img
            src={imageThree}
            alt="Wooden Flooring"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text + Buttons */}
        <div 
          className="col-span-2 flex flex-col justify-center p-8 md:px-24 gap-6 rounded-xl"
          style={{
            backgroundImage: `url(${bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-2xl text-white font-[SagaceMedium] leading-snug">
            Any queries? <br /> Feel free to contact us.
          </h1>
          <div className="flex flex-col md:flex-row gap-6">
            <RectangleButton text="+91 12345 12345" />
            <RectangleButton text="+91 12345 12345" />
          </div>
        </div>
      </div>
    </div>
  );
}

