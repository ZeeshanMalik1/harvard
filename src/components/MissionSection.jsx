import React from "react";
import "../Styles/MissionSection.css";
import constants from "../constants/constant";

function Mission() {
  return (
    <section className="mission-section">
        <div className="mission-line"></div>
      <div className="mission-content">
        <p className="mission-label">{constants.visionMission.missionHeading}</p>
        <h2 className="mission-title">
          {constants.visionMission.motoTiltle} <br />
          <span>{constants.visionMission.motoText}</span>
        </h2>
        <p className="mission-subtext">
          {constants.visionMission.subText}
        </p>
        <p className="mission-description">
          {constants.visionMission.subDiscription}
        </p>
      </div>
    </section>
  );
}

export default Mission;
