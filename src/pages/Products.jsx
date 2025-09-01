import ProductsHero from '../components/ProductsHero.jsx';
import Navbar from '../components/Navbar.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import Footer from '../components/Footer.jsx';
import ProductsMarquee from '../components/ProductsMarquee.jsx';
import ProductsFirstCTA from '../components/ProductsFirstCTA.jsx';
import HomeFootCTA from '../components/HomeFootCTA.jsx';
import ProductsGallery from '../components/ProductsGallery.jsx';

export default function Products(){
  return (
    <div>
      <Navbar/>
      <ProductsHero/>
        <ProductsMarquee
          items={[
            "BlockBoards",
            "HDHMR Boards",
            "Plywood",
            "Flush Doors",
            "Batons",
            "Adhesives",
            "Mica",
            "Door Skin & Veneer",
            "Edge Bands",
            "Miscellaneous",
          ]}
          speed={120}
          gap={8}
        />
      <MainContainer>
        <ProductsFirstCTA/>
        <ProductsGallery/>
        <HomeFootCTA/>
      </MainContainer>
      <Footer/>
    </div>
  );
}
