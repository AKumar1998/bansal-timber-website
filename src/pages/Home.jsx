import MainContainer from '../components/Containers/MainContainer.jsx';
import Navbar from '../components/Navbar.jsx';
import HeroMain from '../components/HeroMain.jsx';
import HomeSlider from '../components/HomeSlider.jsx';
import HomeIntroSection from '../components/HomeIntroSection.jsx';
import HomeIntroProducts from '../components/HomeIntroProducts.jsx';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import HomeProductsArea from '../components/Containers/HomeProductsArea.jsx';
import HomeProjectShow from '../components/HomeProjectShow.jsx';
import HomeFootCTA from '../components/HomeFootCTA.jsx';
import Footer from '../components/Footer.jsx';

function Home() {
  return (
    <div className="relative">
      {/* Navbar overlays HeroMain */}
      <Navbar />

      {/* Hero section */}
      <HeroMain />

      {/* Main content container */}
      <MainContainer>
        <HomeSlider />
        <HomeIntroSection />
        <HomeIntroProducts />
        <WhyChooseUs />
        <HomeProductsArea />
        <HomeProjectShow />
      </MainContainer>

      {/* Footer CTA and Footer */}
      <HomeFootCTA />
      <Footer />
    </div>
  );
}

export default Home;

