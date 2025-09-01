import BlogsHero from '../components/BlogsHero.jsx';
import Navbar from '../components/Navbar.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import Footer from '../components/Footer.jsx';

export default function Blogs(){
  return (
    <div>
      <Navbar/>
      <BlogsHero/>
      <MainContainer>
      </MainContainer>
      <Footer/>
    </div>
  );
};

