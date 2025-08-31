import founder from '../assets/images/founder-image.jpg';

export default function AboutFounderWords() {
  return (
    <div className="bg-black p-6 md:p-12 rounded-lg md:rounded-xl">
      {/* Main founder words section */}
      <div className="flex flex-col md:flex-row items-stretch bg-black">
        {/* Founder image */}
        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-8 flex items-center">
          <img
            src={founder}
            alt="Founder"
            className="h-full object-cover rounded-lg md:rounded-xl"
          />
        </div>

        {/* Founder text */}
        <div className="p-6 bg-white md:w-[50%] md:py-20 rounded-lg md:rounded-xl flex flex-col justify-between">
          <h1 className="font-[SagaceMedium] text-2xl mb-6">A word from the founder:</h1>
          <p className="font-[NeueHaasRoman] text-md">
            For generations, our family's retail journey has been shaped by a singular commitment to ethical practice, honed through decades of success in textiles. We are now honored to bring that same unwavering legacy of care, empathy, understanding, and honesty to the timber and plywood industry.
            <br /><br />
            We firmly believe that true success is built on mutual respect and lasting relationships. Ensuring fair dealing and the best experience for every client, supplier, vendor, and our dedicated staff is not just a practice, but our core philosophy. Our continued prosperity stands as a testament to the blessings of our elders, our time-honored traditions, and the unwavering support of our cherished customers.
            <br /><br />
            At Bansal Timber and Plywood, every purchase is a pledge of unparalleled service.
          </p>
          <h2 className="font-[SagaceMedium] text-lg mt-6">~ Ram Avatar Sunil Kumar Bansal</h2>
        </div>
      </div>

      {/* Hindi tagline */}
      <div className="bg-[#6B1900] p-12 md:p-18 rounded-lg md:rounded-xl ">
        <h1 className="font-[TiroDev] text-2xl md:text-[32px] text-center text-white">
          व्यापार का सार, उत्तम व्यवहार।
        </h1>
      </div>
    </div>
  );
};

