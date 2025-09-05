import bannerImage from '../assets/images/blog-page-banner-image.jpg';
import WhiteRectButton from './Buttons/WhiteRectButton.jsx';

export default function BlogPageBanner(){
  return(
      <div
        className="relative overflow-hidden w-full py-12 rounded-lg md:aspect-[25/9] aspect-[4/3]"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-2"></div>
        <div className="absolute inset-0 flex flex-col items-center gap-8 justify-center z-5">
          <h1 className="font-[SagaceMedium] text-white text-4xl">Keep Reading</h1>
          <WhiteRectButton text="View All Blogs" href="/blogs"/>
        </div>
      </div>
  );
};
