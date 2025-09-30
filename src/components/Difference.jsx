import React, { useEffect, useState } from "react";
import "../Styles/Difference.css";
import { differenceSection } from "../constants/images";
import constants from "../constants/constant";
function Difference() {
  const stats = [
    { label: "Practical Knowledge", value: 92 },
    { label: "Passed Percentage", value: 98 },
    { label: "Happy Students", value: 90 },
  ];

  const [progress, setProgress] = useState(stats.map(() => 0));

  useEffect(() => {
    const intervals = stats.map((stat, index) =>
      setInterval(() => {
        setProgress((prev) => {
          const newProgress = [...prev];
          if (newProgress[index] < stat.value) {
            newProgress[index] += 1;
          }
          return newProgress;
        });
      }, 20)
    );

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [stats]);
  

  return (
    <section className="difference-section">
      <div className="difference-left">
        <img src={differenceSection.first} alt="Group of Students" className="main-img" />

        <div className="progress-bars">
          {stats.map((stat, index) => (
            <div key={index} className="progress-item">
              <span>{stat.label}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress[index]}%` }}
                ></div>
              </div>
              <span className="progress-value"
              style={{transform:`translateX(${progress[index]}%)`, display:"block"}}>
                {progress[index]}%</span>
            </div>
          ))}
        </div>

        <div className="features">
          <div className="feature">
            <h4><img src={differenceSection.school} alt={constants.differenceSection.subheading1} className="difference-icons"/> {constants.differenceSection.subheading1}</h4>
            <p>
              {constants.differenceSection.heading1}<br /> <br />{constants.differenceSection.firstBoxText}
            </p>
          </div>
          <div className="feature">
            <h4> <img src={differenceSection.teacher} alt={constants.differenceSection.subheading2}  className="difference-icons" /> {constants.differenceSection.subheading2}</h4>
            <p>{constants.differenceSection.secBoxText}</p>
          <div className="leftend-img"><img src={differenceSection.end} alt="" /></div>

          </div>
        </div>
      </div> 

      <div className="difference-right">
        <div className="difference-divider"></div>
        <h2>
          <span>{constants.differenceSection.upperRightHeading}</span>
        </h2>
        <p>{constants.differenceSection.upperRightText}
        </p>
        <img src={differenceSection.second} alt="End Term Activity" className="side-img" id="right-image" />
        
         </div>
      
    </section>
  );
}

export default Difference;
