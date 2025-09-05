export default function BlogHero({ title }) {
  return (
    <div className="bg-white py-12 md:py-20 px-4 md:px-0 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
          {title}
        </h1>
        <div className="mt-2 w-20 h-1 bg-[#FF5724] rounded-full"></div> {/* subtle underline */}
      </div>
    </div>
  );
}

