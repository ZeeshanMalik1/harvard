import React, { useState, useEffect } from "react";
import "../Styles/PrincipalSection.css";
import { principalMessage } from "../constants/images";
import constants from "../constants/constant";
const PrincipalMessage = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const numbersSection = document.querySelector(".principal-numbers");
    const numberValues = document.querySelectorAll(".principal-number-value");
    let hasAnimated = false;

    function animateNumbers() {
      if (hasAnimated) return;
      const sectionTop = numbersSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight && sectionTop > -numbersSection.offsetHeight) {
        numberValues.forEach((valueElement) => {
          const target = parseInt(valueElement.dataset.target);
          let current = 0;
          const increment = Math.ceil(target / 100);
          const hasPlus = valueElement.querySelector(".plus-sign");
          const hasK=  valueElement.querySelector(".k-letter")

          const timer = setInterval(() => {
            current += increment;
            if (current < target) {
              valueElement.textContent = current;
            } else {
              valueElement.textContent = target;
              if(hasK) valueElement.textContent +="K"
              if (hasPlus) valueElement.textContent += "+";
              valueElement.classList.add("animate");
              clearInterval(timer);
            }
          }, 20);
        });
        hasAnimated = true;
        window.removeEventListener("scroll", animateNumbers);
      }
    }

    animateNumbers();
    window.addEventListener("scroll", animateNumbers);
    return () => window.removeEventListener("scroll", animateNumbers);
  }, []);

  const openVideo = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
  };

  return (
    <div className="principal-main">
    <section className="principal-section">
      <div className="gray"></div>
      <div className="principal-container">
        <div className="principal-video">
          <button
            className="video-button"
            onClick={openVideo}
            aria-label="video-popup"
          >
            <i className="icon-play">&#9658;</i>
          </button>
        </div>

        <div className="principal-message">
          <div className="principal-divider"></div>
          <h3 className="principal-title">
            {constants.principalMessageSection.principalMasTitle1}<br /> {constants.principalMessageSection.principalMasTitle2}
          </h3>
          <p className="principal-text">{constants.principalMessageSection.principalMas}
          </p>
          <div className="pm-image"><img src={principalMessage.prinMasBg} alt="circle" id="pm-img"/></div>
        </div>
      </div>

      <div className="principal-numbers">
        <div className="number-main-containner">
  <div className="principal-number-box">
    <div className="principal-number-value" data-target={constants.introSection.fn1TargetValue}>
      <span className="k-letter"></span><span className="plus-sign">+</span>
    </div>
    <div className="principal-number-label">{constants.introSection.fnTitle1}</div>
  </div>
  <div className="principal-number-box">
    <div className="principal-number-value"  data-target={constants.introSection.fn2TargetValue}>0<span className="plus-sign">+</span></div>
    <div className="principal-number-label">{constants.introSection.fnTitle2}</div>
  </div>
  <div className="principal-number-box">
    <div className="principal-number-value" data-target={constants.introSection.fn3TargetValue}>0<span className="plus-sign">+</span></div>
    <div className="principal-number-label">{constants.introSection.fnTitle3}</div>
  </div>
  <div className="principal-number-box">
    <div className="principal-number-value" data-target={constants.introSection.fn4TargetValue}>0</div>
    <div className="principal-number-label">{constants.introSection.fnTitle4}</div>
  </div>
  </div>
</div>

      {isOpen && (
        <div className="video-overlay">
          <button className="close-btn" onClick={closeVideo}>
            <span>X</span>
          </button>
          <div className="video-popup">
            <iframe
              src="https://www.youtube.com/embed/Z3To2nj_ilE?autoplay=1&mute=0"
              title="Principal's Video"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
    </div>
  );
};

export default PrincipalMessage;
