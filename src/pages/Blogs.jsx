import BlogsHero from '../components/BlogsHero.jsx';
import Navbar from '../components/Navbar.jsx';
import MainContainer from '../components/Containers/MainContainer.jsx';
import Footer from '../components/Footer.jsx';
import BlogsFootBanner from '../components/BlogsFootBanner.jsx';
import BlogCard from '../components/BlogCard.jsx';

export default function Blogs(){
  return (
    <div>
      <Navbar/>
      <BlogsHero/>
      <MainContainer>
        <BlogCard/>
        <BlogsFootBanner/>
      </MainContainer>
      <Footer/>
    </div>
  );
};

