import bannerImage from '../assets/images/blogs-foot-banner.jpg';

export default function BlogsFootBanner() {
  return (
    <div
      className="
        overflow-hidden rounded-lg w-full
        md:aspect-[21/9]
        aspect-[4/3]
      "
    >
      <img
        src={bannerImage}
        alt="Let's learn together"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}

