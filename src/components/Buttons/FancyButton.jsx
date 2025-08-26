export default function FancyButton({ mainText, buttonText, mapsUrl }) {
  return (
    <div className="flex items-stretch rounded-full bg-white overflow-hidden w-fit shadow-md min-h-[40px] md:min-h-[48px]">
      {/* Left side - main text */}
      <span className="flex items-center px-6 md:px-7 text-black font-[NeueHaasRoman] text-[12px] md:text-[14px]">
        {mainText}
      </span>

      {/* Right side - orange button */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center bg-[#FF5724] text-white font-[SagaceMedium] text-[12px] md:text-[14px] px-4 rounded-full transition-all duration-300 hover:bg-black"
      >
        {buttonText}
      </a>
    </div>
  );
}

