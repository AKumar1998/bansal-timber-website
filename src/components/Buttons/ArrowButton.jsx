import { useNavigate, useLocation } from "react-router-dom";

export default function ArrowButton({ text }) {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTargetId = "contact-form-section";

  // ---------------- Custom Slow Smooth Scroll ----------------
  const smoothScrollSlow = (targetEl, duration = 1300) => {
    const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const startPos = window.pageYOffset;
    const distance = targetPos - startPos;
    let startTime = null;

    const easeInOutCubic = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPos + distance * ease);

      if (progress < 1) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const smoothScroll = () => {
    const el = document.getElementById(scrollTargetId);
    if (el) smoothScrollSlow(el); // slow scroll
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("🚀 CTA clicked");

    sessionStorage.setItem("scrollAfterNav", scrollTargetId);

    if (location.pathname === "/contactus") {
      console.log("📍 Already on Contact page — scrolling now");
      smoothScroll();
    } else {
      console.log("🔁 Navigating to Contact page first…");
      navigate("/contactus");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group inline-flex items-center rounded-full bg-white overflow-hidden w-auto shadow-md h-[40px] md:h-[48px] cursor-pointer"
    >
      <span className="flex items-center px-6 md:px-7 text-black font-[NeueHaasRoman] text-[12px] md:text-[14px] whitespace-nowrap">
        {text}
      </span>
      <div className="bg-[#FF5724] flex justify-center items-center rounded-full h-full aspect-square">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          className="w-1/3 h-1/3 transform transition-transform duration-300 ease-in-out group-hover:translate-x-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

