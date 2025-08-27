import heroImage from './../assets/images/home-hero-image.jpg'

export default function HeroMain() {
  return (
    <div
      className="relative w-screen h-screen flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <h1 className="z-10 text-white text-3xl sm:text-5xl font-[SagaceMedium] -translate-y-50 sm:-translate-y-60 font-bold text-center">
        We do not just sell,<br /> We form relations.
      </h1>
    </div>
  )
}


