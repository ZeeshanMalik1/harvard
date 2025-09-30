import React from 'react'
import "../Styles/Footer.css"
import constants from '../constants/constant'
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <>
    <div className="main-footer">
          <footer class="footer">
  <div class="footer-container">
    <div class="footer-left">
      <img src={constants.icons.logo} alt="The Harvard School Logo" class="footer-logo" />
      <p class="footer-desc">
       {constants.tagLine}
      </p>
      <div class="footer-socials">
      </div>
    </div>

    <div class="footer-middle">
    <h6 class="footer-heading">{constants.footerSection.heading1}</h6>
      <ul class="footer-links">
        <li><Link to="/home" onClick={()=>{window.scrollTo(0,0)}}>{constants.footerSection.h1Subheading1}</Link></li>
        <li><Link to="/aboutus" onClick={()=>{window.scrollTo(0,0)}}>{constants.footerSection.h1Subheading2}</Link></li>
        <li><Link to="/gallery" onClick={()=>{window.scrollTo(0,0)}}>{constants.footerSection.h1Subheading3}</Link></li>
        <li><Link to="/contactus" onClick={()=>{window.scrollTo(0,0)}}>{constants.footerSection.h1Subheading4}</Link></li>
      </ul>
    </div>

    <div class="footer-right">
      <h6 class="footer-heading">{constants.footerSection.heading2}</h6>
      <ul class="footer-hours">
        <li><img src={constants.icons.clockIcon} alt="clock" />{constants.schoolTiming}</li>
        <li ><Link to="/privacy" style={{textDecoration: "none", color:"white"}}>Privacy Policy</Link></li>
      </ul>
    </div>
    <div className="socialIcons">
       <a href={constants.facebookLink} target='_blank' rel="noreferrer">
            <i className="ri-facebook-circle-fill"></i>
          </a>
          <a href={constants.instagramLink} target='_blank' rel="noreferrer">
            <i className="ri-instagram-line"></i>
          </a>
    </div>
  </div>
  <div class="footer-bottom">
    <hr />
    <p>{constants.copyRight} 
      <a href="/" target="_blank">{constants.devName}</a>
    </p>
  </div>
</footer>
</div>

    </>
  )
}

export default Footer