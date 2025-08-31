export default function Marquee({ text, gap = 8, speed = 40, separator = " * " }) {
  // Prepare the repeated text with separator and gap
  const repeatedText = Array(20).fill(text).join(separator);

  return (
    <div className="w-full overflow-hidden py-4 bg-[#FF5724] text-white">
      <div
        className="inline-block whitespace-nowrap py-2 text-xl font-[SagaceMedium]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          paddingLeft: `${gap}rem`,
        }}
      >
        {repeatedText}
      </div>
    </div>
  );
}

