import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios"; // 👈 New Import
// REMOVED STATIC DATA: import { events } from "../constants/events"; 
import "../Styles/EventDetail.css";
import constants from "../constants/constant";

// API URL for fetching a single event
const API_URL_BASE = "http://localhost:4000/api/events";

const EventDetail = () => {
    const { eventId } = useParams();
    // State to hold the fetched event details
    const [event, setEvent] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refs = useRef([]);

    // 👈 API Data Fetching Hook
    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                setLoading(true);
                // Fetch event details using the ID from the URL: /api/events/:id
                const response = await axios.get(`${API_URL_BASE}/${eventId}`);
                setEvent(response.data);
                setError(null);
            } catch (err) {
                console.error(`Error fetching event ${eventId}:`, err);
                // Set an error message if the API call fails
                const message = err.response && err.response.status === 404
                                ? `Event with ID: ${eventId} not found.`
                                : "Failed to load event details from the server.";
                setError(message);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]); // Re-run if eventId changes

    // Fetch recent events
    useEffect(() => {
        const fetchRecentEvents = async () => {
            try {
                const response = await axios.get(API_URL_BASE);
                // Take first 4 events, exclude current if present
                const allEvents = response.data;
                const recent = allEvents.filter(ev => ev._id !== eventId).slice(0, 4);
                setRecentEvents(recent);
            } catch (err) {
                console.error("Error fetching recent events:", err);
            }
        };

        fetchRecentEvents();
    }, [eventId]);

    // Intersection Observer useEffect (Remains the same, but now depends on fetched 'event')
    useEffect(() => {
        if (!event || loading) return; // Wait for the event to load

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
    }, [event]); // Rerun when the event data changes/loads

    // 👈 Handle Loading and Error States
    if (loading) {
        return <h2 className="event-detail-loading">Loading event details...</h2>;
    }

    if (error) {
        return <h2 className="event-detail-error" style={{ color: 'red' }}>{error}</h2>;
    }
    
    // Check if event is null after loading (e.g., if fetch succeeded but returned no data)
    if (!event) { 
        return <h2>{constants.eventSection.Error || "Event not found."}</h2>;
    }
    
    // Helper to extract the date (assuming 'date' is a field on the event object)
    const eventDate = event.date 
        ? new Date(event.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
        : "Date N/A";

    return (
        <section className="event-detail">
            <div className="event-hero">
                <h1>{event.title}</h1>
                <div className="hero-separator"></div>
                <div className="dateDaySection">
                    <span className="event-date">{eventDate}</span>
                </div>
            </div>

            <div className="event-content" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div className="event-main" style={{ flex: 1 }}>
                    <div className="event-gallery">
                        {/* Assuming event.images is an array of URLs from the API */}
                        {Array.isArray(event.images) && event.images.length > 0 ? (
                            event.images.map((src, i) => (

                                <div
                                    key={i}
                                    ref={(el) => (refs.current[i] = el)}
                                    className="gallery-item"
                                >
                                <img src={`http://localhost:4000${src}`} alt={`Event ${event.title} ${i + 1}`} />
                                </div>
                            ))
                        ) : (
                            <p>No images available for this event.</p>
                        )}
                    </div>
                </div>

                <aside className="recent-events" style={{ width: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
                    <h3>Recent Events</h3>
                    {recentEvents.length > 0 ? (
                        recentEvents.map(ev => (
                            <Link key={ev._id} to={`/events/${ev._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="recent-event-item" style={{ display: 'flex', marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', background: 'white' }}>
                                    {ev.images && ev.images.length > 0 && (
                                        <img
                                            src={`http://localhost:4000${ev.images[0]}`}
                                            alt={ev.title}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
                                        />
                                    )}
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1em' }}>{ev.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>
                                            {ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No recent events.</p>
                    )}
                </aside>
            </div>

            {/* Description Section (Use fetched event data) */}
            <div className="event-description">
                <h2>{event.title}</h2>
                {event.description && <p>{event.description}</p>}
            </div>

            {/* Social Media Section */}
            <div className="social-media" style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Follow Us on Social Media</h3>
                <div style={{ display: 'flex',  justifyContent: 'center', gap: '15px', flexWrap: 'wrap' ,textAlign:"center"}}>
                    <a href="#" style={{ textDecoration: 'none', color: '#25D366', fontSize: '1.5em' }}><img src="/images/SocialIcons/whatsapp (2).png" alt="WhatsApp" style={{ width: '1.5em', height: '1.5em' }} /> <br />WhatsApp</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#000000ff', fontSize: '1.5em' }}><img src="/images/SocialIcons/twitter.png" alt="Twitter" style={{ width: '1.5em', height: '1.5em' }} /> <br />Twitter</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#E4405F', fontSize: '1.5em' }}><img src="/images/SocialIcons/instagram.png" alt="Instagram" style={{ width: '1.5em', height: '1.5em' }} /> <br />Instagram</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#BD081C', fontSize: '1.5em' }}><img src="/images/SocialIcons/pinterest.png" alt="Pinterest" style={{ width: '1.5em', height: '1.5em' }} /> <br />Pinterest</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#1877F2', fontSize: '1.5em' }}><img src="/images/SocialIcons/facebook.png" alt="Facebook" style={{ width: '1.5em', height: '1.5em' }} /> <br />Facebook</a>
                    <a href="#" style={{ textDecoration: 'none', color: '#0077B5', fontSize: '1.5em' }}><img src="/images/SocialIcons/linkedin.png" alt="LinkedIn" style={{ width: '1.5em', height: '1.5em' }} /> <br />LinkedIn</a>
                </div>
            </div>

        </section>
    );
};

export default EventDetail;