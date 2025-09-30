import React from "react";
import "../Styles/AboutHero.css";
import constants from "../constants/constant";

function AboutHero() {
  const { title, subtitle, backgroundImage, }=constants.aboutHero;
 
  return (
    <section
      className="about-hero"
      style={{
        background: `url(${backgroundImage}) center/cover no-repeat`
      }}
    > <div className="overlay"></div>

      <div className="content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

export default AboutHero;
