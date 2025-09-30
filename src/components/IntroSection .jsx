import React, { useState, useEffect } from "react";
import "../Styles/IntroSection .css";
import { introImages } from "../constants/images";
import {latestNewsSliderImages } from "../constants/images";
import constants from "../constants/constant";

const IntroSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const numbersSection = document.querySelector(".intro-numbers");
    const numberValues = document.querySelectorAll(".intro-number-value");
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
          const hasK = valueElement.querySelector(".k-letter");

          const timer = setInterval(() => {
            current += increment;
            if (current < target) {
              valueElement.textContent = current;
            } else {
              valueElement.textContent = target;
              if (hasK) valueElement.textContent += "K";
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
    <section className="intro-section">
      <div className="intro-divider"> </div>
      <h3 className="intro-heading">{constants.introSection.title}</h3>

      <div className="intro-features">
        <div className="intro-feature-card card1">
        
          <h6> <img src={introImages.school} alt={constants.differenceSection.subheading1} className="icon-img"/>{constants.differenceSection.subheading1}</h6>
          <p>{constants.differenceSection.heading1} <br /><br />{constants.differenceSection.firstBoxText}</p>
        </div>
        <div className="intro-feature-card card2">
          <h6><img src={introImages.teacher} alt={constants.differenceSection.subheading2} className="icon-img" />{constants.differenceSection.subheading2}</h6>
          <p>{constants.differenceSection.secBoxText}</p>
        </div>
      </div>

      <div className="intro-numbers">
        <div className="intro-number-box">
          <div className="intro-number-value" data-target={constants.introSection.fn1TargetValue}>
            <span className="k-letter"></span><span className="plus-sign">+</span>
          </div>
          <div className="intro-number-label">{constants.introSection.fnTitle1}</div>
        </div>
        <div className="intro-number-box">
          <div className="intro-number-value" data-target={constants.introSection.fn2TargetValue}>0<span className="plus-sign">+</span></div>
          <div className="intro-number-label">{constants.introSection.fnTitle2}</div>
        </div>
        <div className="intro-number-box">
          <div className="intro-number-value" data-target={constants.introSection.fn3TargetValue}>0<span className="plus-sign">+</span></div>
          <div className="intro-number-label">{constants.introSection.fnTitle3}</div>
        </div>
        <div className="intro-number-box">
          <div className="intro-number-value" data-target={constants.introSection.fn4TargetValue}>0</div>
          <div className="intro-number-label">{constants.introSection.fnTitle4}</div>
        </div>
      </div>

      <div className="intro-background" style={{ backgroundImage: `url(${introImages.bg})` }}>
        <div className="intro-overlay"></div>
        <div className="intro-bg-cards">
          <div className="intro-card">
             <div className="svg-circle"><img src={constants.icons.trophy} alt="" /></div> 
            <h4>{constants.introSection.fn4TargetValue} {constants.introSection.expirianceTitle}</h4>
          </div>
          <div className="video-card">
            <button className="video-button" onClick={openVideo} aria-label="video-popup">
              <i className="icon-play">&#9658;</i>
            </button>
            <h5>{constants.introSection.introVideoTitle}</h5>
            <p>{constants.introSection.introVideoText}</p>
          </div>
        </div>
      </div>


      <div className="news-slider">
        <div className="slider-track">
          {latestNewsSliderImages
            .concat(latestNewsSliderImages)
            .map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Slide ${index}`}
                className="slider-img"
              />
            ))}
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
              title="Intro School Video"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default IntroSection;
