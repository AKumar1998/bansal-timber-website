import imageOne from '../assets/images/products-image1.jpg';
import imageTwo from '../assets/images/products-image2.jpg';
import imageThree from '../assets/images/products-image3.jpg';

export default function ProductsIntro(){
  return(
    <div>
      <img src={imageOne} alt="" />
      <img src={imageTwo} alt="" />
      <img src={imageThree} alt="" />
    </div>
  );
};
