import React from "react";
import "../Styles/MapSection.css";
import constants from "../constants/constant";

function MapSection() {
  return (
    <section className="map-section">
      <h2 className="map-heading">{constants.map.mapHeading}</h2>
      <div className="map-container">
        <iframe
          loading="lazy"
          src="https://maps.google.com/maps?q=The%20harvard%20school%2C%20Sargodha%2C%20Punjab&amp;t=m&amp;z=14&amp;output=embed&amp;iwloc=near"
          title="The Harvard School, Sargodha, Punjab"
          aria-label="The Harvard School, Sargodha, Punjab"
        ></iframe>
      </div>
    </section>
  );
}

export default MapSection;
