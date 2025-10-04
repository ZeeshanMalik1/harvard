import React, { useEffect } from 'react'
import GalleryHero from '../components/GalleryHero';
import '../Styles/Gallery.css';
// import GallerySection from '../components/GallerySection';

function Gallery() {
  useEffect(() => {
    document.title = "Gallery - The Harvard School";
  }, []);

  return (
    <>
      <GalleryHero />

      {/* Responsive Full-Width Facebook Iframe */}
      <div className="gallery-iframe-container">
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/TheHarvardSchoolSargodhaPakistan&tabs=timeline&width=1400&height=2200&small_adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          className="gallery-iframe"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="The Harvard School Facebook Page"
        />
      </div>

      {/* <GallerySection/> */}
    </>
  )
}

export default Gallery;
