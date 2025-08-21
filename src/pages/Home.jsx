import MainContainer from '../components/Containers/MainContainer.jsx';
import Header from '.././components/Header.jsx';
import HeroMain from '.././components/HeroMain.jsx';
import HomeSlider from '.././components/HomeSlider.jsx';
import HomeIntroSection from '../components/HomeIntroSection.jsx';
import HomeIntroProducts from '../components/HomeIntroProducts';
import WhyChooseUs from '../components/WhyChooseUs.jsx';


function Home(){
  return(
    <div>
      <Header/>
      <HeroMain/>
      <MainContainer>
        <HomeSlider/> 
        <HomeIntroSection/>
        <HomeIntroProducts/>
        <WhyChooseUs/>
      </MainContainer>
    </div>
  )

}

export default Home
