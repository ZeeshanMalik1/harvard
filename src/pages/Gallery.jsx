import React from 'react'
import GalleryHero from '../components/GalleryHero';
import GallerySection from '../components/GallerySection';

function Gallery() {
  return (
    <>
      <GalleryHero />

      {/* Wrapper div to center iframe */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", alignItems: "center" }}>
  <iframe
    src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/TheHarvardSchoolSargodhaPakistan&tabs=timeline&width=1000&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
    style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: "1000px", height: "800px" }}
    scrolling="no"
    frameBorder="0"
    allowFullScreen={true}
    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  />
</div>


      {/* <GallerySection/> */}
    </>
  )
}

export default Gallery;