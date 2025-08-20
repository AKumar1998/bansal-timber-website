import heroImage from './../assets/images/home-hero-image.jpg'

function HeroMain() {
  return (
    <div
      className="relative w-screen h-[60vh] flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <h1 className="z-10 text-white text-2xl sm:text-5xl font-[SagaceMedium] -translate-y-30 sm:-translate-y-40 font-bold text-center">
        We do not just sell,<br /> We form relations.
      </h1>
    </div>
  )
}


export default HeroMain
