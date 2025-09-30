import React, { useState, useEffect } from "react";
import "../Styles/Slider.css";
import { sliderImages as defaultSliderImages } from "../constants/images";

function Slider() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(defaultSliderImages);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/site-settings/");
        if (response.ok) {
          const data = await response.json();
          if (data.sliderImages && data.sliderImages.length > 0) {
            setSlides(data.sliderImages);
          }
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      }
    };
    fetchSlides();
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay" />
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            <a href={slide.link} className="btn">
              More Info
            </a>
          </div>
        </div>
      ))}

      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>

      <div className="dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
