import React, { useEffect } from 'react'
import AboutHero from '../components/AboutHero'
import IntroSection from '../components/IntroSection '
import TeacherSection from '../components/TeacherSection'

function Aboutus() {
  useEffect(() => {
    document.title = "About Us - The Harvard School";
  }, []);

  return (
    <>
      <AboutHero/>
      <IntroSection/>
      <TeacherSection/>
    </>
  )
}

export default Aboutus ;
