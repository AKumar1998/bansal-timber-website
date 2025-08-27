import { Link } from "react-router-dom";

export default function SimpleButton({
  text,
  bgColor = "bg-[#FF5724]",
  textColor = "text-white",
  to, // optional: if provided, renders a Link
  onClick, // optional: for normal button click
}) {
  const buttonClasses = `
    px-8 py-3 rounded-full font-[NeueHaasMedium]
    transition-colors duration-300
    ${bgColor} ${textColor}
    hover:bg-black hover:text-white
    text-center
  `;

  if (to) {
    // Render as a Link if "to" prop is provided
    return (
      <Link to={to} className={buttonClasses}>
        {text}
      </Link>
    );
  }

  // Otherwise render a normal button
  return (
    <button onClick={onClick} className={buttonClasses}>
      {text}
    </button>
  );
}

