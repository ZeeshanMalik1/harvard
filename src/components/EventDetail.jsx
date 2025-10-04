import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/EventDetail.css";
import constants from "../constants/constant";

const API_URL_BASE = "http://localhost:4000/api/events";

// ✅ Custom hook to detect screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
};

// ✅ Reusable Recent Events list
const RecentEventsList = ({ events, closeDrawer }) => (
  <>
    <h3>Recent Events</h3>
    {events.length > 0 ? (
      events.map((ev) => (
        <Link
          key={ev._id}
          to={`/events/${ev._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={() => closeDrawer && closeDrawer()}
        >
          <div className="recent-event-item">
            {ev.images && ev.images.length > 0 && (
              <img
                src={`http://localhost:4000${ev.images[0]}`}
                alt={ev.title}
              />
            )}
            <div>
              <h4>{ev.title}</h4>
              <p>
                {ev.date
                  ? new Date(ev.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No Date"}
              </p>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p>No recent events.</p>
    )}
  </>
);

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const refs = useRef([]);
  const isMobile = useIsMobile(); // 👈 detect screen size

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL_BASE}/${eventId}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        const message =
          err.response && err.response.status === 404
            ? `Event with ID: ${eventId} not found.`
            : "Failed to load event details.";
        setError(message);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Fetch recent events
  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const response = await axios.get(API_URL_BASE);
        const allEvents = response.data;
        const recent = allEvents.filter((ev) => ev._id !== eventId).slice(0, 4);
        setRecentEvents(recent);
      } catch (err) {
        console.error("Error fetching recent events:", err);
      }
    };
    fetchRecentEvents();
  }, [eventId]);

  // Dynamic page title
  useEffect(() => {
    if (event) {
      document.title = `${event.title} - The Harvard School`;
    }
  }, [event]);

  // Intersection Observer
  useEffect(() => {
    if (!event || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => {
      refs.current.forEach((el) => el && observer.unobserve(el));
    };
  }, [event, loading]);

  if (loading) return <h2>Loading event details...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!event) return <h2>{constants.eventSection.Error || "Event not found."}</h2>;

  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date N/A";

  return (
    <section className="event-detail">
      {/* HERO */}
      <div className="event-hero">
        <h1>{event.title}</h1>
        <div className="hero-separator"></div>
        <div className="dateDaySection">
          <span className="event-date">{eventDate}</span>
        </div>

        {/* Only show hamburger in mobile */}
        {isMobile && (
          <button className="hamburger-btn" style={{position:"absolute",
            top:"250px",
            right:"140px",
          }} onClick={() => {setDrawerOpen(true)}}>
            <img src="../images/appointment.png" alt="Open Recent Events" style={
                {
                    width: "30px", height: "30px", marginTop: "10px",
                    filter: "invert(1)"
                }
            } /> <br /> <span style={{ color: "white", fontSize: "12px" }}>
                Recent Events
            </span>
          </button>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="event-content">
        <div className="event-main">
          <div className="event-gallery">
            {Array.isArray(event.images) && event.images.length > 0 ? (
              event.images.map((src, i) => (
                <div
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  className="gallery-item"
                >
                  <img src={`http://localhost:4000${src}`} alt={event.title} />
                </div>
              ))
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>

        {/* Desktop Aside */}
        {!isMobile && (
          <aside className="recent-events-aside">
            <RecentEventsList events={recentEvents} />
          </aside>
        )}
      </div>

      {/* Drawer (Mobile Only) */}
      {isMobile && (
        <div className={`recent-events-drawer ${drawerOpen ? "open" : ""}`}>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
          <RecentEventsList
            events={recentEvents}
            closeDrawer={() => setDrawerOpen(false)}
          />
        </div>
      )}

      {/* Description */}
      <div className="event-description">
        <h2>{event.title}</h2>
        {event.description && <p>{event.description}</p>}
      </div>
    </section>
  );
};

export default EventDetail;
