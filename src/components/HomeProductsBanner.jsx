export default function HomeProductsBanner({text, svg, bannerImage}){

    return(
      <div 
      className="relative bg-gray-200 mt-15 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}      
      >
        <div className="flex flex-col md:flex-row items-center justify-between p-12 bg-black/40 text-white">
          <p className="font-[SagaceBold] whitespace-pre-line text-[28px] md:text-[36px] mb-8 md:mb-0">{text}</p>
        <div className="mt-6 mb-6 md:mb-0 md:mt-0">{svg}</div>
        </div>
      </div>
    );
};
