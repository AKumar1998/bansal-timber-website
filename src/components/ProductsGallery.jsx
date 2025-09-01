import SectionTitle from '../components/SectionTitle.jsx';
import plywood from '../assets/images/g-image1.jpg';
import veneer from '../assets/images/g-image2.jpg';
import flushDoor from '../assets/images/g-image3.jpg';
import woodFloor from '../assets/images/g-image4.jpg';
import blockBoard from '../assets/images/g-image5.jpg';
import baton from '../assets/images/g-image6.jpg';
import WhiteRectButton from './Buttons/WhiteRectButton.jsx';
import bgImage from '../assets/images/number-banner.jpg';

export default function ProductsGallery() {
  return (
    <div className="flex flex-col gap-4 mb-12">
      {/* Section title */}
      <SectionTitle title="GALLERY" />

      {/* Subtitle */}
      <h1 className="font-[NeueHaasRoman] my-12 text-4xl">
        Where Our Materials,<br /> Meet Your Vision.
      </h1>

      {/* First row (two images) */}
      <div className="flex flex-col md:flex-row gap-4">
        <img src={plywood} alt="Plywood" className="w-full h-auto object-cover" />
        <img src={veneer} alt="Veneers" className="w-full h-auto object-cover" />
      </div>

      {/* Second row (left grid + right text box) */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT: square wrapper -> 2x2 grid inside */}
        <div className="flex-1">
          <div className="relative w-full aspect-square">
            <div className="absolute inset-0 grid grid-cols-2 [grid-template-rows:repeat(2,minmax(0,1fr))] gap-4">
              <img
                src={flushDoor}
                alt="Flush Doors"
                className="w-full h-full object-cover rounded-xl"
              />
              <img
                src={woodFloor}
                alt="Wooden Flooring"
                className="w-full h-full object-cover rounded-xl"
              />
              <img
                src={blockBoard}
                alt="Block Boards"
                className="w-full h-full object-cover rounded-xl col-span-2"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: square wrapper -> background image + content */}
        <div className="flex-1">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden text-white">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />
            <div className="relative p-12 h-full flex flex-col gap-4">
              <h1 className="font-[NeueHaasBold] pt-8 text-3xl">
                Need Help Choosing<br /> the Right Product?
              </h1>
              <p className="font-[NeueHaasRoman] py-6 text-xl">
                Reach out to our team—<br /> we're here to assist you.
              </p>
              <WhiteRectButton text="Contact Us" href="/contactus"/>
            </div>
          </div>
        </div>
      </div>

      {/* Last single image */}
      <img src={baton} alt="Wood Batons" className="w-full h-auto object-cover" />
    </div>
  );
}

