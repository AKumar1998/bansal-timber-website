import woodLaminates from '../../assets/images/home-wooden-laminates.jpg';
import flushDoors from '../../assets/images/home-flush-doors.jpg';
import action from '../../assets/images/company-logos/action-tesa.svg';
import advance from '../../assets/images/company-logos/advance-laminates.svg';
import century from '../../assets/images/company-logos/century-ply.svg';
import doorset from '../../assets/images/company-logos/doorset.svg';
import fevicol from '../../assets/images/company-logos/fevicol.svg';
import gDecor from '../../assets/images/company-logos/g-decor.svg';
import greenply from '../../assets/images/company-logos/greenply.svg';
import trend from '../../assets/images/company-logos/trend-laminates.svg';
import statSVG from '../../assets/images/home-products-banner-stats.svg';
import productsBanner from '../../assets/images/home-products-banner.jpg';
import ctaImage from '../../assets/images/home-view-products-banner.jpg';
import SectionTitle from '../SectionTitle.jsx';
import HomeProductsBanner from '../HomeProductsBanner.jsx';
import HomeProductsGrid from '../HomeProductsGrid.jsx';
import HomeCollaborators from '../HomeCollaborators.jsx';
import HomeProductsCTA from '../HomeProductsCTA.jsx';
import SimpleButton from '../Buttons/SimpleButton.jsx';


export default function HomeProductsArea() {
  
  const products = [
    
    {id:1, name: "Wooden Laminates", image: woodLaminates},
    {id:2, name: "Flush Doors", image: flushDoors},
    {id:3, name: "Wooden Laminates", image: woodLaminates},
    {id:4, name: "Wooden Laminates", image: woodLaminates},
 
  ];
  
  const logos = [
    { src: action, alt: "Action Logo" },
    { src: advance, alt: "Advance Logo" },
    { src: century, alt: "Century Logo" },
    { src: doorset, alt: "Doorset Logo" },
    { src: fevicol, alt: "Fevicol Logo" },
    { src: gDecor, alt: "GDecor Logo" },
    { src: greenply, alt: "Greenply Logo" },
    { src: trend, alt: "Trend Logo" },
  ];

  return (
  
    <section>
      
      <SectionTitle title="PRODUCTS" />

      <HomeProductsBanner
        text={"The numbers\nspeak volumes."}
        svg={<img src={statSVG} alt="Statistics"/>}
        bannerImage={productsBanner}
      />

      <HomeProductsGrid
        products={products}
      />

      <HomeCollaborators
        logos={logos}
      />

      <HomeProductsCTA
        text="View the full range of products."
        button={<SimpleButton text="See More" textColor="text-black" bgColor="bg-white"/>}
        ctaImage={ctaImage}
      />

    </section>
  
  );

};
