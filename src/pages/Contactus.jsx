import React, { useEffect } from 'react'
import ContactHero from '../components/ContactHero'
import MapSection from '../components/MapSection'
import ContactSection from "../components/ContactSection"

function Contactus() {
  useEffect(() => {
    document.title = "Contact Us - The Harvard School";
  }, []);

  return (
    <>
      <ContactHero/>
      <MapSection/>
      <ContactSection/>
    </>
  )
}

export default Contactus
