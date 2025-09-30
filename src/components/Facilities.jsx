import React from "react";
import "../Styles/Facilities.css";
import { FacilitiesImages } from "../constants/images";
import constants from "../constants/constant";
const Facilities = () => {
  return (
    <section className="facilities-section">
      <div className="facilities-container">
        <div className="facilities-left"> 
          <div className="facility-divider"></div>
          <h3 className="facilities-title">{constants.facilitySection.heading}</h3>
          <p className="facilities-text">{constants.facilitySection.facilityText}
          </p>

          <ul className="facilities-list">
            <li> <img src={FacilitiesImages.check} alt="" />{constants.facilitySection.check1}</li>
            <li> <img src={FacilitiesImages.check} alt="" />{constants.facilitySection.check2}</li>
            <li> <img src={FacilitiesImages.check} alt="" />{constants.facilitySection.check3}</li>
            <li> <img src={FacilitiesImages.check} alt="" />{constants.facilitySection.check4}</li>
          </ul>
        </div>

        <div className="facilities-right">
          <div className="facility-circle">

          <div className="facilities-box">
              <div className="text-img1"><img src={FacilitiesImages.firstbox} alt="" /></div>
            <div className="text-box1">
            <h5>
              Our Expertise Is Best Earned Through <br />
              Our Experience
            </h5>
            </div>
          </div>
          <div id="facilities-box1" >
            <img src={FacilitiesImages.circle1} alt="" className="circle-images" />
            </div>

          <div id="facilities-box2">
            <img src={FacilitiesImages.circle2} alt="" className="circle-images"/>
            </div>
          <div className="facilities-box">
            <div className="text-img2"><img src={FacilitiesImages.secondbox} alt="" /></div>
            <div className="text-box2">

            <h5>
              Our Best Team For Any Advice <br />
              For Your Education
            </h5>
            </div>
          </div>
          </div>
       
        </div>
      </div>
    </section>
  );
};

export default Facilities;
