import React, { useState } from 'react';
import '../Styles/Header.css';
import constants from '../constants/constant';
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Top bar */}
      <div className="upper-header">
        <div className="upper-header-left">
          <span>
            <i className="ri-phone-fill"></i> {constants.phone}
          </span>
          <span>
            <i className="ri-mail-fill"></i> {constants.email}
          </span>
          <span>
            <i className="ri-map-pin-fill"></i> {constants.location}
          </span>
        </div>

        <div className="upper-header-right">
          <a href={constants.facebookLink} target="_blank" rel="noreferrer">
            <i className="ri-facebook-circle-fill"></i>
          </a>
          <a href={constants.instagramLink} target="_blank" rel="noreferrer">
            <i className="ri-instagram-line"></i>
          </a>
        </div>
      </div>

      {/* Navbar */}
      <div className="main-navbar">
        <div className="logo-container">
          <img src={constants.icons.logo} alt="Logo" />
          <h3>{constants.name}</h3>
        </div>

        {/* Hamburger button */}
        <div 
          className={`hamburger ${menuOpen ? "active" : ""}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Nav Links */}
        <div className={`navbar-container ${menuOpen ? "show" : ""}`}>
          <ul>
            <li>
              <Link to="/home" onClick={() => setMenuOpen(false)}>
                {constants.footerSection.h1Subheading1}
              </Link>
            </li>
            <li>
              <Link to="/aboutus" onClick={() => setMenuOpen(false)}>
                {constants.footerSection.h1Subheading2}
              </Link>
            </li>
            <li>
              <Link to="/gallery" onClick={() => setMenuOpen(false)}>
                {constants.footerSection.h1Subheading3}
              </Link>
            </li>
            <li>
              <Link to="/contactus" onClick={() => setMenuOpen(false)}>
                {constants.footerSection.h1Subheading4}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
