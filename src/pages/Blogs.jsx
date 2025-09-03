import BlogsHero from '../components/BlogsHero.jsx';
import Navbar from '../components/Navbar.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import Footer from '../components/Footer.jsx';
import BlogsFootBanner from '../components/BlogsFootBanner.jsx';

export default function Blogs(){
  return (
    <div>
      <Navbar/>
      <BlogsHero/>
      <MainContainer>
        <BlogsFootBanner/>
      </MainContainer>
      <Footer/>
    </div>
  );
};

