import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import axios from "axios";
import "../Styles/GallerySecction.css";

const API_BASE_URL = "http://localhost:4000/api/gallery";

const GallerySection = ({ images = [] }) => {
  const [allImages, setAllImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loader = useRef(null);

  // --- 1. Fetch ALL images from backend only once ---
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_BASE_URL);
        const imageUrls = response.data.map((item) => item.imageUrl);
        setAllImages(imageUrls); // 👈 ek hi bar saare images store
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError("Failed to load gallery images. Check server connection.");
        setLoading(false);
      }
    };

    if (images.length > 0) {
      setAllImages(images);
      setLoading(false);
    } else {
      fetchImages();
    }
  }, []);

  // --- 2. Load images chunk by chunk from already fetched data ---
  useEffect(() => {
    const perPage = 12;
    const newImages = allImages.slice(0, page * perPage);
    setVisibleImages(newImages);
  }, [page, allImages]);

  // --- 3. Infinite Scroll (frontend only, no API call) ---
  useEffect(() => {
    const hasMore = visibleImages.length < allImages.length;
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1); // 👈 sirf page badhata hai
        }
      },
      { threshold: 1 }
    );

    if (loader.current) observer.observe(loader.current);

    return () => {
      if (loader.current) observer.unobserve(loader.current);
      observer.disconnect();
    };
  }, [visibleImages, allImages, loading]);

  // --- 4. Animation observer ---
  useEffect(() => {
    const items = document.querySelectorAll(".gallery-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));
    return () => {
      items.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [visibleImages]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const hasMore = visibleImages.length < allImages.length;

  // --- Rendering Logic ---
  if (loading && allImages.length === 0) {
    return <div className="gallery-container">Loading gallery...</div>;
  }

  if (error) {
    return <div className="gallery-container error">{error}</div>;
  }

  if (allImages.length === 0 && !loading) {
    return <div className="gallery-container">No images found in the gallery.</div>;
  }

  return (
    <div className="gallery-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="gallery-masonry"
        columnClassName="gallery-column"
      >
        {visibleImages.map((src, idx) => {
          const fullImageUrl = `http://localhost:4000${src}`;
          return (
            <div key={idx} className="gallery-item">
              <img src={fullImageUrl} alt={`Gallery item ${idx}`} loading="lazy" />
            </div>
          );
        })}
      </Masonry>

      {hasMore ? (
        <div ref={loader} className="loading-trigger">
          Loading more...
        </div>
      ) : (
        <div className="end-of-gallery">All images loaded.</div>
      )}
    </div>
  );
};

export default GallerySection;
