export default function SimpleButton({ text, bgColor = "bg-[#FF5724]", textColor = "text-white" }) {

  return (
    <button
      className={`
        px-7 py-3 rounded-full font-[NeueHaasMedium]
        transiltion-colors duration-300
        ${bgColor} ${textColor}
        hover:bg-black hover:text-white
      `}
    >
      {text}
    </button>
  );

}
