import { useState, useEffect } from "react";
import bgMobile from "./../assets/images/about-hero-mobile.jpg";
import bgDesktop from "./../assets/images/about-hero-desktop.jpg";
import logoBlack from "../assets/images/banal_logo_full.svg";

export default function AboutHero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative w-screen flex items-center justify-center"
      style={{
        height: "100vh",
        backgroundImage: `url(${isMobile ? bgMobile : bgDesktop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Container */}
      <div
        className={`flex w-full h-full items-center 
                    ${
                      isMobile
                        ? "flex-col justify-center gap-80"
                        : "flex-row justify-between px-8 md:px-16 lg:px-28 xl:px-44 2xl:px-60 3xl:px-80 4xl:px-120"
                    }`}
      >
        {/* Text */}
        <div className={`${isMobile ? "order-2" : "order-1"} max-w-[460px]`}>
          <h1
            className="text-black text-center md:text-left leading-snug"
            style={{
              // Max size on mobile, shrink only on larger screens
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            <span className="font-[SagaceMedium]">Beyond the Price:</span>
            <br />
            <span className="font-[SagaceRegular]">
              Our Commitment to <br /> Fair Practice.
            </span>
          </h1>
        </div>

        {/* Logo */}
        <div className={`${isMobile ? "order-1" : "order-2"} flex justify-center`}>
          <img
            src={logoBlack}
            alt="Company Logo"
            className="max-w-full"
            style={{
              // Largest at mobile (~7rem), gradually shrinks on desktops
              height: "clamp(5rem, 8vw, 7rem)", 
              maxWidth: "clamp(200px, 20vw, 340px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

