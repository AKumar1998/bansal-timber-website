import { useEffect } from "react";

import MainContainer from '../components/Containers/MainContainer.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactHero from '../components/ContactHero.jsx';
import Marquee from '../components/Marquee.jsx';
import ContactBanner from '../components/ContactBanner.jsx';
import ContactNumber from '../components/ContactNumber.jsx';
import ContactFormular from '../components/ContactFormular.jsx';
import StoreMap from '../components/StoreMap.jsx';
import ContactCarousel from '../components/ContactCarousel.jsx';

export default function ContactUs() {

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollAfterNav");
    if (!targetId) return;

    sessionStorage.removeItem("scrollAfterNav");

    let attempts = 0;
    const maxAttempts = 15;

    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 120);
      }
    };

    // Delay to allow page and components to fully render
    setTimeout(tryScroll, 200);
  }, []);

  return (
    <div>
      <Navbar />
      <ContactHero />
      <Marquee text="Your One-Stop Timber & Plywood Destination" />
      <MainContainer>
        <ContactBanner />
        <ContactCarousel />
        <ContactNumber />
        <ContactFormular />
        <StoreMap />
      </MainContainer>
      <Footer />
    </div>
  );
}

