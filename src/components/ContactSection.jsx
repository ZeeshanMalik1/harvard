import React from "react";
import "../Styles/ContactSection.css";
import { ContactSectionData } from "../constants/images";

function ContactSection() {
  return (
    <section className="contact-section">
      <div className="contactDivider"></div>
      <h2 className="contact-heading">{ContactSectionData.heading}</h2>

      <div className="contact-container">
  
        <div className="contact-info">
          {ContactSectionData.info.map((item) => (
            <div key={item.id} className="info-item">
              <span className="icon">
                {item.icon === "location" ? (

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995L16.9497 15.9497ZM12 13C10.8954 13 10 12.1046 10 11C10 9.89543 10.8954 9 12 9C13.1046 9 14 9.89543 14 11C14 12.1046 13.1046 13 12 13Z"></path>
                  </svg>
                ) : item.icon === "email" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path>
                  </svg>
                ) : (
                  <img src={item.icon} alt="" />
                )}
              </span>
              <div>
                <h6>{item.label}</h6>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form">
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name.." required />
              <input type="email" placeholder="Your Email.." required />
            </div>

            <div className="form-group">
              <input type="text" placeholder="Phone Number.." />
              <input type="text" placeholder="Your Subject.." />
            </div>

            <textarea
              rows="6"
              placeholder="Enter Your Message.."
              required
            ></textarea>

            <button type="submit" className="submit-btn">
              SUBMIT MESSAGE
            </button>

            <div className="sideInnerImage">
              <img src={ContactSectionData.sideImage1} alt="" />
            </div>
          </form>
        </div>

        <div className="middelImage">
          <img src={ContactSectionData.sideImage2} alt="" />
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
