import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import AboutHero from '../components/AboutHero.jsx';
import AboutIntro from '../components/AboutIntro.jsx';
import AboutIntroLine from '../components/AboutIntroLine.jsx';

export default function About(){
  return (
    <div>
      <Navbar/>
      <AboutHero/>
      <MainContainer>
        <AboutIntroLine/>
        <AboutIntro/>
      </MainContainer>
      <Footer/>
    </div>
  );
};
