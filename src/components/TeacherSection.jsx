import React, { useState, useEffect } from "react";
import axios from "axios"; // 👈 Import axios for API calls
import "../Styles/TeacherSection.css";
// NOTE: Assuming 'teacherImages' and 'constants' are defined and accessible
import { teacherImages } from "../constants/images"; 
import constants from "../constants/constant";

// Assuming your Express server is running on port 4000
const API_BASE_URL = "http://localhost:4000/api/teachers"; 

function TeacherSection() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL);
        // The API returns an array of teacher objects
        setTeachers(response.data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to load teacher profiles. Check server status.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Rendering Logic ---

  if (loading) {
    return (
      <section className="teachers-section">
        <h3 className="section-heading">Loading teachers...</h3>
      </section>
    );
  }

  if (error) {
    return (
      <section className="teachers-section">
        <h3 className="section-heading error-message">Error: {error}</h3>
      </section>
    );
  }
  
  if (teachers.length === 0) {
    return (
      <section className="teachers-section">
        <h3 className="section-heading">No teacher profiles found.</h3>
      </section>
    );
  }

  return (
    <section className="teachers-section">
      {/* Ensure constants.TeacherSection.teacherHeaading exists */}
      <h3>{constants.TeacherSection.teacherHeaading || "Meet Our Educators"}</h3> 
      <div className="teacher-divider"></div>
      
      {/* Assuming teacherImages.sideimg is correctly defined */}
      <div className="sideImage"><img src={teacherImages.sideimg} alt="Decorative element" /></div>
      
      <div className="teachers-grid">
        {teachers.map((teacher) => {
          // 👈 FIX: Prepend the full base URL for correct image loading
          const fullImageUrl = `http://localhost:4000${teacher.imageUrl}`;
          
          return (
            <div key={teacher._id} className="teacher-card">
              {/* Use the full URL for the teacher image */}
              <img src={fullImageUrl} alt={teacher.name} />
              <h5>
                <a href="#">{teacher.name}</a>
              </h5>
              {/* Use the 'role' property from the database, falling back to a default */}
              <p>{teacher.role || 'Faculty Member'}</p> 
              <div className="social-icons">
                {/* Use the specific social links from the database, checking if they exist */}
                {teacher.fb_link && (
                  <a href={teacher.fb_link}>
                    {/* Facebook SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"></path></svg>
                  </a>
                )}
                {teacher.twitter_link && (
                  <a href={teacher.twitter_link}>
                    {/* Twitter SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path></svg>
                  </a>
                )}
                {teacher.whatsapp_app && (
                  <a href={teacher.whatsapp_app}>
                    {/* WhatsApp SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.25361 18.4944L7.97834 18.917C9.18909 19.623 10.5651 20 12.001 20C16.4193 20 20.001 16.4183 20.001 12C20.001 7.58172 16.4193 4 12.001 4C7.5827 4 4.00098 7.58172 4.00098 12C4.00098 13.4363 4.37821 14.8128 5.08466 16.0238L5.50704 16.7478L4.85355 19.1494L7.25361 18.4944ZM2.00516 22L3.35712 17.0315C2.49494 15.5536 2.00098 13.8345 2.00098 12C2.00098 6.47715 6.47813 2 12.001 2C17.5238 2 22.001 6.47715 22.001 12C22.001 17.5228 17.5238 22 12.001 22C10.1671 22 8.44851 21.5064 6.97086 20.6447L2.00516 22ZM8.39232 7.30833C8.5262 7.29892 8.66053 7.29748 8.79459 7.30402C8.84875 7.30758 8.90265 7.31384 8.95659 7.32007C9.11585 7.33846 9.29098 7.43545 9.34986 7.56894C9.64818 8.24536 9.93764 8.92565 10.2182 9.60963C10.2801 9.76062 10.2428 9.95633 10.125 10.1457C10.0652 10.2428 9.97128 10.379 9.86248 10.5183C9.74939 10.663 9.50599 10.9291 9.50599 10.9291C9.50599 10.9291 9.40738 11.0473 9.44455 11.1944C9.45903 11.25 9.50521 11.331 9.54708 11.3991C9.57027 11.4368 9.5918 11.4705 9.60577 11.4938C9.86169 11.9211 10.2057 12.3543 10.6259 12.7616C10.7463 12.8783 10.8631 12.9974 10.9887 13.108C11.457 13.5209 11.9868 13.8583 12.559 14.1082L12.5641 14.1105C12.6486 14.1469 12.692 14.1668 12.8157 14.2193C12.8781 14.2457 12.9419 14.2685 13.0074 14.2858C13.0311 14.292 13.0554 14.2955 13.0798 14.2972C13.2415 14.3069 13.335 14.2032 13.3749 14.1555C14.0984 13.279 14.1646 13.2218 14.1696 13.2222V13.2238C14.2647 13.1236 14.4142 13.0888 14.5476 13.097C14.6085 13.1007 14.6691 13.1124 14.7245 13.1377C15.2563 13.3803 16.1258 13.7587 16.1258 13.7587L16.7073 14.0201C16.8047 14.0671 16.8936 14.1778 16.8979 14.2854C16.9005 14.3523 16.9077 14.4603 16.8838 14.6579C16.8525 14.9166 16.7738 15.2281 16.6956 15.3913C16.6406 15.5058 16.5694 15.6074 16.4866 15.6934C16.3743 15.81 16.2909 15.8808 16.1559 15.9814C16.0737 16.0426 16.0311 16.0714 16.0311 16.0714C15.8922 16.159 15.8139 16.2028 15.6484 16.2909C15.391 16.428 15.1066 16.5068 14.8153 16.5218C14.6296 16.5313 14.4444 16.5447 14.2589 16.5347C14.2507 16.5342 13.6907 16.4482 13.6907 16.4482C12.2688 16.0742 10.9538 15.3736 9.85034 14.402C9.62473 14.2034 9.4155 13.9885 9.20194 13.7759C8.31288 12.8908 7.63982 11.9364 7.23169 11.0336C7.03043 10.5884 6.90299 10.1116 6.90098 9.62098C6.89729 9.01405 7.09599 8.4232 7.46569 7.94186C7.53857 7.84697 7.60774 7.74855 7.72709 7.63586C7.85348 7.51651 7.93392 7.45244 8.02057 7.40811C8.13607 7.34902 8.26293 7.31742 8.39232 7.30833Z"></path></svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TeacherSection;