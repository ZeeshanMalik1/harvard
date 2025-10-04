import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/LatestNews.css";
import { latestNews, latestNewsSliderImages } from "../constants/images";
// Static events data import is correctly REMOVED
import { Link } from "react-router-dom";
import constants from "../constants/constant";

// API URL for the public events route
const API_URL = "http://localhost:4000/api/events";

const LatestNews = () => {
  useEffect(() => {
    document.title = "Latest News - The Harvard School";
  }, []);
    // State to hold the fetched events
    const [fetchedEvents, setFetchedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // The API fetches all events sorted by date
                const response = await axios.get(API_URL);
                setFetchedEvents(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching news events:", err);
                setError("Failed to load latest news from the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        // Use the event.date field as the source for the date format
        return new Date(dateString).toLocaleDateString("en-US", { 
            year: 'numeric', month: 'short', day: 'numeric' 
        });
    };

    return (
        <section className="latest-news-section">
            
            <div className="news-header">
                <div className="zigzag-divider"></div>
                <h3 className="news-title">{constants.latestNewsSection.latesNewsTitle}</h3>
                <p className="news-description">{constants.latestNewsSection.latestNewsDiscription}
                </p>
                <img
                    src={latestNews.sideImage}
                    alt="News Illustration"
                    className="news-side-img"
                />
            </div>

            <div className="news-cards">
                {loading && <p>Loading latest Events...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {/* Check if events are loaded and map the first 4 */}
                {!loading && fetchedEvents.length === 0 && !error && (
                    <p>No current events available.</p>
                )}

                {fetchedEvents.slice(0, 4).map((event) => (
                    <Link
                        key={event._id}
                        // Correctly uses the event._id for routing
                        to={`/events/${event._id}`} 
                        className="news-card"
                    >
                        <h5>{event.title}</h5>
                        <p style={{fontSize: '0.8em', color: '#666', marginTop: '5px'}}>
                            {formatDate(event.date)}
                        </p>
                    </Link>
                ))}
            </div>
{/* News Slider */}
<div className="news-slider">
  <div className="slider-track">
    {latestNewsSliderImages.concat(latestNewsSliderImages).map((img, index) => (
      <img
        key={img} // better than index
        src={img}
        alt={`Slide ${index + 1}`}
        className="slider-img"
      />
    ))}
  </div>
</div>
 </section>
    );
};

export default LatestNews;