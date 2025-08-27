export default function HomeProductSCTA({ text, button, ctaImage }) {
  return (
    <div
      className="text-white p-6 md:p-8 mt-10 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${ctaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between p-4 md:p-6">
        <p className="text-lg md:text-xl mb-4 md:mb-0 font-[NeueHaasMedium] text-center md:text-left">
          {text}
        </p>
        <div>{button}</div>
      </div>
    </div>
  );
}

