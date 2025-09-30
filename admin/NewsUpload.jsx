import React, { useState } from "react";

export default function NewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`News Added:\nTitle: ${title}\nContent: ${content}`);
    setTitle("");
    setContent("");
  };

  return (
    <div className="admin-form">
      <h2>Upload News</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
        <button type="submit">Add News</button>
      </form>
    </div>
  );
}
