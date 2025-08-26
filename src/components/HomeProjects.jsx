export default function HomeProjects({ pic, tag, title, text }) {
  return (
    <div className="w-full lg:w-1/2 lg:ml-120">
    <div className="flex flex-col">
      <img 
          className="mb-6 w-auto h-auto mx-auto lg:mx-0 lg:ml-6" 
          src={pic} 
          alt={title} 
        />
      <div className="ml-12 md:ml-24 p-4 max-w-[600px]">
        <p className="text-sm text-gray-700 font-[NeueHaasRoman]">{tag}</p>
        <hr className="my-2 border-gray-700" />
        <h2 className="my-2 text-black text-[16px] md:text-[20px] font-[NeueHaasMedium]">{title}</h2>
        <p className="my-2 mb-12 md:mb-24 text-black text-[12px] md:text-[14px] font-[NeueHaasRoman]">{text}</p>
      </div>
    </div>
    </div>
  );
}

