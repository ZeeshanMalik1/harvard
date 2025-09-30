import React from "react";
import "../Styles/VisionSection.css";
import { visionImages } from "../constants/images";
import constants from "../constants/constant";

const VisionSection = () => {
  return (
    <section className="vision-section">
      <div className="vision-container">
        <div className="vision-column">
          <div className="vision-divider" ></div>
          <h3 className="vision-heading">{constants.visionMission.visionHeading}</h3>
          <img
            src={visionImages.first}
            alt="Vision"
            id="heading-image"
            className="vision-img"
          />
        </div>

        <div className="vision-column">
          <p className="vision-text">{constants.visionMission.visionText}
          </p>
        </div>

        <div className="vision-column">
          <img
            src={visionImages.second}
            alt="Vision 2"
            className="vision-img"
          />
          <img
            src={visionImages.third}
            alt="Vision 3"
            className="vision-img"
          />
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
