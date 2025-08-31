import introImage from '../assets/images/contact-banner.jpg';
import bannerLogo from '../assets/images/bansal-banner-logo.svg';

export default function ContactBanner() {
  return (
    <div className="relative my-8 md:my-12 w-full rounded-xl overflow-hidden h-[442px] md:h-auto">
      {/* Image:
          - Mobile: absolute cover inside fixed-height container
          - Desktop: normal flow, controls container height */}
      <img
        src={introImage}
        alt="Inspired by your trust"
        className="md:hidden absolute inset-0 w-full h-full object-cover"
      />
      <img
        src={introImage}
        alt="Inspired by your trust"
        className="hidden md:block w-full h-auto object-cover"
      />

      {/* Gradient Overlay (matches container/image size) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center gap-6 justify-center text-center">
        <h1 className="font-[SagaceBold] text-white text-3xl md:text-4xl leading-snug">
          Inspired by your trust.
        </h1>
        <img src={bannerLogo} alt="Bansal Logo" className="w-32 md:w-48" />
      </div>
    </div>
  );
}

