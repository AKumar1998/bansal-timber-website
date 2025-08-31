import { Link } from "react-router-dom";

export default function ArrowButton({ text }) {
  return (
    <Link
      to="/contactus"
      className="group inline-flex items-center rounded-full bg-white overflow-hidden w-auto shadow-md h-[40px] md:h-[48px] cursor-pointer"
    >
      {/* Left side - text */}
      <span className="flex items-center px-6 md:px-7 text-black font-[NeueHaasRoman] text-[12px] md:text-[14px] whitespace-nowrap">
        {text}
      </span>

      {/* Right side - circular orange button (auto scales with height) */}
      <div className="bg-[#FF5724] flex justify-center items-center rounded-full h-full aspect-square">
        {/* Inline SVG for crisp arrow, scales with parent */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-1/3 h-1/3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

