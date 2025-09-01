export default function Marquee({
  items = [],
  gap = 8,
  speed = 40,
  separator = " * ",
}) {
  // Join the items into a single string with separator
  const marqueeText = items.join(separator);

  // Repeat it multiple times to create a seamless scrolling effect
  const repeatedText = Array(20).fill(marqueeText).join(separator);

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

      {/* Add marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}

