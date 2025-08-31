export default function RectangleButton({ text, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#FF5724] text-white font-[NeueHaasBold] text-lg px-6 py-3 rounded-md shadow-md hover:bg-[#e64a19] transition-colors duration-300"
    >
      {text}
    </button>
  );
}

