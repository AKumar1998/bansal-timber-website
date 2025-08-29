import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import AboutHero from '../components/AboutHero.jsx';
import AboutIntro from '../components/AboutIntro.jsx';
import AboutIntroLine from '../components/AboutIntroLine.jsx';
import AboutValues from '../components/AboutValues.jsx';
import AboutFounderWords from '../components/AboutFounderWords.jsx';

export default function About(){
  return (
    <div>
      <Navbar/>
      <AboutHero/>
      <MainContainer>
        <AboutIntroLine/>
        <AboutIntro/>
        <AboutValues/>
        <AboutFounderWords/>
      </MainContainer>
      <Footer/>
    </div>
  );
};
