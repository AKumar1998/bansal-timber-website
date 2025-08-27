import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // ✅ import Link

import logoBlack from './../assets/images/banal_logo_full.png';
import logoWhite from './../assets/images/bansal_logo_full_white.png';
import hamburgerBlack from '../assets/images/icons/hamburger-black.svg';
import crossWhite from '../assets/images/icons/cross-white.svg';
import homeBlack from '../assets/images/icons/home-black.svg';
import homeWhite from '../assets/images/icons/home-white.svg';
import productsBlack from '../assets/images/icons/products-black.svg';
import productsWhite from '../assets/images/icons/products-white.svg';
import aboutBlack from '../assets/images/icons/about-black.svg';
import aboutWhite from '../assets/images/icons/about-white.svg';
import blogsBlack from '../assets/images/icons/blogs-black.svg';
import blogsWhite from '../assets/images/icons/blogs-white.svg';
import contactBlack from '../assets/images/icons/contact-black.svg';
import contactWhite from '../assets/images/icons/contact-white.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const [navHovered, setNavHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(null);

  const navItems = [
    { name: "Home", href: "/", iconBlack: homeBlack, iconWhite: homeWhite },
    { name: "Products", href: "/products", iconBlack: productsBlack, iconWhite: productsWhite },
    { name: "About Us", href: "/aboutus", iconBlack: aboutBlack, iconWhite: aboutWhite },
    { name: "Blogs", href: "/blogs", iconBlack: blogsBlack, iconWhite: blogsWhite },
    { name: "Contact Us", href: "/contactus", iconBlack: contactBlack, iconWhite: contactWhite },
  ];

  const navIsLight = (isOpen || navHovered) && window.innerWidth >= 768;

  // Scroll hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll <= 100) {
        setShowNavbar(true);
      } else if (currentScroll > lastScroll) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 pt-4 md:pt-6 left-0 w-full z-50 transition-transform duration-500 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Navbar */}
        <nav
          onMouseEnter={() => window.innerWidth >= 768 && setNavHovered(true)}
          onMouseLeave={() => {
            setNavHovered(false);
            setLinkHovered(null);
          }}
          className={`relative flex items-center justify-between px-6 py-4 rounded-xl mx-4 md:mx-auto max-w-7xl transition-colors duration-300
            ${isOpen ? "bg-white text-black" : navIsLight ? "bg-white text-black" : "bg-black text-white"}
          `}
        >
          {/* Logo */}
          <Link to="/" className="z-50">
            <img
              src={isOpen ? logoBlack : navIsLight ? logoBlack : logoWhite}
              alt="Logo"
              className="h-8 md:h-10 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => {
              const isThisLinkHovered = linkHovered === item.name;
              const iconSrc = isThisLinkHovered
                ? item.iconWhite
                : navIsLight
                ? item.iconBlack
                : item.iconWhite;
              const textClass = isThisLinkHovered
                ? "text-white"
                : navIsLight
                ? "text-black"
                : "text-white";
              const linkBg = isThisLinkHovered ? "bg-black" : "bg-transparent";

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onMouseEnter={() => setLinkHovered(item.name)}
                  onMouseLeave={() => setLinkHovered(null)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${linkBg}`}
                >
                  <img src={iconSrc} alt={`${item.name} icon`} className="h-5 w-5" />
                  <span className={`${textClass} select-none`}>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger / Cross */}
          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition ${
              isOpen ? "bg-black" : "bg-white"
            }`}
            onClick={() => setIsOpen((s) => !s)}
            aria-expanded={isOpen}
          >
            <img
              src={isOpen ? crossWhite : hamburgerBlack}
              alt="menu"
              className="w-6 h-6"
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu (full overlay) */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black z-40 flex flex-col px-8 pt-28 pb-12 gap-6 transition-transform duration-300 overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Links (left-aligned) */}
        <div className="flex flex-col w-full items-start gap-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="w-full rounded-lg overflow-hidden"
              onTouchStart={(e) => e.currentTarget.classList.add("bg-[#191919]")}
              onTouchEnd={(e) => e.currentTarget.classList.remove("bg-[#191919]")}
              onTouchCancel={(e) => e.currentTarget.classList.remove("bg-[#191919]")}
              onMouseDown={(e) => e.currentTarget.classList.add("bg-[#191919]")}
              onMouseUp={(e) => e.currentTarget.classList.remove("bg-[#191919]")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("bg-[#191919]")}
            >
              <Link
                to={item.href}
                className="block text-white text-[24px] font-[SagaceMedium] py-4 w-full transition-colors duration-150"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
              {/* Straight line under link */}
              <hr className="w-full border-white" />
            </div>
          ))}
        </div>

        {/* Footer info centered */}
        <div className="mt-8 w-full flex flex-col text-center items-center text-white text-sm gap-4">
          <img src={logoWhite} alt="Logo white" className="h-10 mb-8" />
          <hr className="w-full border-white" />
          <p className="font-[SagaceMedium]">Reach us at:</p>
          <hr className="w-full font-[SagaceMedium] border-white" />
          <p className="font-[SagaceMedium]">+91 98765 43210 &nbsp;&nbsp;&nbsp; +91 12345 12345</p>
          <hr className="w-full border-white" />
          <p className="font-[SagaceMedium]">897 B Ward, no.8, Main Bazar Rd,<br/>
             Ward no- 2, Aam Bagh, Mehrauli Village,<br/>
             Mehrauli, New Delhi, Delhi 110030
          </p>
        </div>
      </div>
    </>
  );
}

