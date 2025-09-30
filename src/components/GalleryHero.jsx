import React from "react";
import "../Styles/GalleryHero.css";
import constants from "../constants/constant";

function GalleryHero() {
  const { title, subtitle, backgroundImage, }=constants.galleryHero;
 
  return (
    <section
      className="gallery-hero"
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

export default GalleryHero;
