import React, { useState, useEffect } from 'react'
import "../Styles/FixedSection.css"
import { Link } from 'react-router-dom';
import constants from '../constants/constant';
import { fixedSection } from '../constants/images';
function FixedSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {  
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixedSection">
    <Link to={constants.whatsappLink}><img src={fixedSection.whatsappLogo} alt="" /></Link>
          {visible && (
        <button 
          className="top" 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="ri-arrow-up-s-line"></i>
        </button>
      )}
    </div>
  )
}

export default FixedSection
