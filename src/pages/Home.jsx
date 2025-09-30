import React from "react";
import Difference from "../components/Difference";
import Facilities from "../components/Facilities";
import MissionSection from "../components/MissionSection";
import PrincipalMessage from "../components/PrincipalSection";
import Slider from "../components/Slider";
import VisionSection from "../components/VisionSection ";
import LatestNews from "../components/LatestNews";
import FixedSection from "../components/FixedSection";

function Home() {
  return (
    <>
      <Slider />
      <VisionSection />
      <MissionSection />
      <Difference />
      <Facilities />
      <FixedSection/>
      <PrincipalMessage />
      <LatestNews />
    </>
  );
}

export default Home;
