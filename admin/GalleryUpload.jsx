import React, { useState } from "react";

export default function GalleryPage() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setImages([...images, { title, imageUrl }]);
    setTitle("");
    setImageUrl("");
  };

  return (
    <div className="admin-form">
      <h2>Upload Gallery Image</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" required />
        <button type="submit">Add Image</button>
      </form>

      <div className="gallery-preview">
        {images.map((img, idx) => (
          <div key={idx} className="gallery-card">
            <img src={img.imageUrl} alt={img.title} />
            <p>{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
