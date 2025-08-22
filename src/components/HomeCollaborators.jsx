export default function HomeCollaborators({logos}) {

  return (
    <div className="text-center mb-25 mt-25">
      <h2 className="font-[SagaceRegular] text-xl mb-10 text-black">
        Our collaborations with the best
      </h2>
      <div className="border-2 w-full border-[#FF5724] rounded-2xl p-12 inline-block">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="w-32 h-16 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

