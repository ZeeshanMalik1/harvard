import React, { useState, useEffect } from "react";
import axios from "axios";

// Assuming your server is running on port 4000
const API_URL = "http://localhost:4000/api/gallery";

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function GalleryPage() {
  const [list, setList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Single file state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all gallery items (Public Route)
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setList(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch gallery items.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for single file input change
  const handleFileChange = (e) => {
    // Get the first file from the FileList
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  // Add new gallery item (Protected Route with File Upload)
  const addItem = async () => {
    if (!selectedFile) {
      alert("Please select an image file to upload.");
      return;
    }
    
    setError(null);

    // 1. Create FormData object
    const formData = new FormData();
    // The key 'image' must match the name specified in Multer setup (.single('image'))
    formData.append('image', selectedFile); 
    
    const authHeaders = getAuthHeaders().headers;

    try {
      // 2. Send the FormData object
      const res = await axios.post(
        API_URL, 
        formData, 
        { 
            headers: { 
                ...authHeaders, 
            }
        } 
      );
      
      setList([res.data, ...list]); 
      setSelectedFile(null); // Clear file state
      // Manually clear the input value for UI consistency
      document.getElementById('file-input').value = null; 
    } catch (err) {
      console.error("Upload error:", err.response?.data?.error || err);
      setError(err.response?.data?.error || "Error uploading image. Login required.");
    }
  };

  // Delete gallery item (Protected Route)
  const removeItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setError(null);

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      setList(list.filter(x => x._id !== id)); 
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting image. Login required.");
    }
  };

  if (loading && list.length === 0) return <div>Loading gallery...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Image Gallery Uploader 📸</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
      
      {/* --- Add New Image Form (Simplified) --- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, border: "1px solid #ccc", padding: 15, borderRadius: 8, background: '#f9f9f9', alignItems: 'center' }}>
        
        <input 
          id="file-input"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4, background: 'white' }}
        />
        
        <button 
          onClick={addItem}
          // Disable button if no file is selected
          disabled={!selectedFile}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: selectedFile ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
        >
          {selectedFile ? `Upload: ${selectedFile.name.substring(0, 15)}...` : "Select Image"}
        </button>
      </div>

      <hr/>

      <h2>Gallery Images ({list.length})</h2>

      {/* --- Gallery List --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {list.length === 0 && !loading ? (
          <p>No images found. Upload one above.</p>
        ) : (
          list.map(item => (
            <div key={item._id} style={{ border: "1px solid #eee", padding: 10, borderRadius: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", background: 'white', width: 200, position: 'relative' }}>
              
              {/* Image Thumbnail */}
              <img 
                src={`http://localhost:4000${item.imageUrl}`} 
                alt="Gallery Item" 
                style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} 
              />
              
              {/* Delete Button */}
              <button 
                onClick={() => removeItem(item._id)}
                style={{ position: 'absolute', top: 15, right: 15, padding: '5px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.8em' }}
              >
                🗑️ Delete
              </button>
              
              {/* Upload Date */}
              <div style={{ color: "#555", fontSize: '0.8em', textAlign: 'center' }}>
                Uploaded: {new Date(item.createdAt).toLocaleDateString("en-US")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}