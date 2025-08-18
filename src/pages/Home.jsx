
import Header from '.././components/Header.jsx'
import HeroMain from '.././components/HeroMain.jsx'
import HomeSlider from '.././components/HomeSlider.jsx'
import HomeIntroSection from '../components/HomeIntroSection.jsx'

function Home(){
  return(
    <div>
      <Header/>
      <HeroMain/>
      <HomeSlider/> 
      <HomeIntroSection/>
    </div>
  )

}

export default Home
