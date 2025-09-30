import React from "react";
import "../Styles/ContactHero.css";
import constants from "../constants/constant";

function ContactHero() {
  const { title, subtitle, backgroundImage} =  constants.contactHero;

  return (
    <section
      className="contact-hero"
      style={{
        background:`url(${backgroundImage}) center/cover no-repeat`
      }}
    >  <div className="overlay"></div>
      <div className="content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export default ContactHero;
