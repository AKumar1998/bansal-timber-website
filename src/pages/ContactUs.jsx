import MainContainer from '../components/Containers/MainContainer.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactHero from '../components/ContactHero.jsx';
import Marquee from '../components/Marquee.jsx';
import ContactBanner from '../components/ContactBanner.jsx';
import ContactNumber from '../components/ContactNumber.jsx';
import ContactFormular from '../components/ContactFormular.jsx';
import StoreMap from '../components/StoreMap.jsx';

export default function Contact(){
  return (
    <div>
      <Navbar/>
      <ContactHero/>
      <Marquee
        text="Your One-Stop Timber & Plywood Destination"
      />
      <MainContainer>
        <ContactBanner/>
        <ContactNumber/>
        <ContactFormular/>
        <StoreMap/>
      </MainContainer>
      <Footer/>
    </div>
  );
};
