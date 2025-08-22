export default function HomeProductSCTA({text, button, ctaImage}) {
  
  return(
    <div 
      className="text-white mt-15 rounded-lg overflow-hidden"
      style={{
        backgroundImage:`url(${ctaImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <p className="text-xl mb-4 md:mb-0 font-[NeueHaasMedium]">{text}</p>
        {button}
      </div>
    </div>
  );
  
};
