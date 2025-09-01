import heroImage from '../assets/images/product-hero.jpg';

export default function ProductsHero(){
  return(
    <div className="flex flex-col mt-28 gap-8 md:gap-12 rounded-lg overflow-hidden items-center justify-center p-4 md:p-12">
      <h1 className="font-[SagaceMedium] text-center text-3xl md:text-6xl">Our Products</h1>
      <img 
        src={heroImage} 
        alt="Products Banner"
        className="w-full md:h-auto min-h-[431px] object-cover object-center rounded-lg"
      />
    </div>
  );
};
