import contactHero from './../assets/images/contact-hero.jpg'
import ArrowButton from './Buttons/ArrowButton.jsx';

export default function HeroMain() {
  return (
    <div
      className="relative w-screen h-screen flex flex-col gap-6 items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${contactHero})` }}
    >
      <h1 className="z-10 text-white text-3xl sm:text-5xl font-[SagaceMedium] font-bold text-center">
        How can we help you today?
      </h1>
      <ArrowButton text="Contact Us Now"/>
    </div>
  )
}


