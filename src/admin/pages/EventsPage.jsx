import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../admin/pages/pages.css"

const API_URL = "http://localhost:4000/api/events";

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  // NOTE: When uploading files with FormData, the 'Content-Type' header 
  // must be omitted or set to 'multipart/form-data', which Axios handles automatically.
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function EventsPage() {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  // New state to hold the File objects selected by the user
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events (Public Route)
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setList(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for file input change
  const handleFileChange = (e) => {
    // Convert the FileList object to a standard JavaScript Array
    setSelectedFiles(Array.from(e.target.files));
    setError(null);
  };

  // Add or update event (Protected Route with File Upload)
  const addOrUpdate = async () => {
    if (!title || !date) {
      alert("Title and Date are required.");
      return;
    }
    
    setError(null);

    // 1. Create FormData object for multi-part submission (required for files)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('description', description);
    
    // 2. Append each selected file to the FormData object if any
    // The key 'images' must match the name specified in the Multer setup (upload.array('images', 10))
    selectedFiles.forEach((file) => {
      formData.append(`images`, file); 
    });
    
    // Get the standard auth headers
    const authHeaders = getAuthHeaders().headers;

    try {
      let res;
      if (editingId) {
        // Update existing event
        res = await axios.put(
          `${API_URL}/${editingId}`, 
          formData, // Send FormData object (files + text)
          { 
              headers: { 
                  ...authHeaders, 
                  // No need to set Content-Type, Axios handles it for FormData
              }
          } 
        );
        // Update the list
        setList(list.map(ev => ev._id === editingId ? res.data : ev));
        setEditingId(null);
      } else {
        // Add new event
        // Check if files are selected for new event
        if (selectedFiles.length === 0) {
            alert("Please select at least one image to upload.");
            return;
        }
        res = await axios.post(
          API_URL, 
          formData, // Send FormData object (files + text)
          { 
              headers: { 
                  ...authHeaders, 
                  // No need to set Content-Type, Axios handles it for FormData
              }
          } 
        );
        setList([res.data, ...list]); 
      }
      
      // Clear form
      setTitle("");
      setDate("");
      setDescription("");
      setSelectedFiles([]);
    } catch (err) {
      console.error("Add/Update error:", err.response?.data?.error || err);
      // Display the specific error returned by Multer or the DB logic
      setError(err.response?.data?.error || "Error adding/updating event. Check server console.");
    }
  };

  // Edit event
  const edit = (ev) => {
    setTitle(ev.title);
    setDate(ev.date ? new Date(ev.date).toISOString().split('T')[0] : '');
    setDescription(ev.description || '');
    setSelectedFiles([]); // Clear files for new upload if needed
    setEditingId(ev._id);
  };

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setSelectedFiles([]);
    setEditingId(null);
  };
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setError(null);

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      setList(list.filter(x => x._id !== id)); 
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting event. Login required.");
    }
  };

  if (loading && list.length === 0) return <div>Loading events...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }} className="adminEvent">
      <h1>Events Management with Images 🖼️</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
      
      {/* --- Add New Event Form (Includes File Input) --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, border: "1px solid #ccc", padding: 15, borderRadius: 8, background: '#f9f9f9' }}>
        
        {/* Title and Date Inputs */}
        <div style={{ display: "flex", gap: 10 }}>
            <input 
              placeholder="Event Title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              style={{ flexGrow: 2, padding: 10, border: "1px solid #ddd", borderRadius: 4, fontSize: '1em' }}
            />
          
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4, fontSize: '1em' }}
            />
        </div>

        {/* Description Textarea */}
        <textarea 
          placeholder="Event Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows={3}
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 4, fontSize: '1em', resize: 'vertical' }}
        />

        <input 
          type="file" 
          multiple // Key attribute to allow multiple selection
          accept="image/*" // Restrict to image types
          onChange={handleFileChange} 
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 4, background: 'white' }}
        />
        
        {/* File Count Display */}
        {selectedFiles.length > 0 && (
            <p style={{ color: '#007bff', margin: '0', fontSize: '0.9em', paddingLeft: 5 }}>
                ✅ **{selectedFiles.length}** file(s) selected: {selectedFiles.map(f => f.name).join(', ')}
            </p>
        )}
        
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={addOrUpdate}
            style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold', flexGrow: 1 }}
          >
            {editingId ? 'Update Event' : 'Add Event with Images'} (Admin)
          </button>
          {(title || date || description || selectedFiles.length > 0) && (
            <button 
              onClick={clearForm}
              style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <hr/>

      <h2>Recent Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {list.slice(0, 4).map(ev => (
          <div key={ev._id} style={{ width: '300px', padding: '10px', border: '1px solid #eee', borderRadius: '4px', background: 'white' }}>
            {ev.images && ev.images.length > 0 && (
              <img
                src={`http://localhost:4000${ev.images[0]}`}
                alt={ev.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            )}
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>{ev.title}</h4>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>
              🗓️ {ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
            </p>
          </div>
        ))}
      </div>


      {/* --- Events List --- */}
      <div>
        {list.length === 0 && !loading ? (
          <p>No events found. Add one above.</p>
        ) : (
          list.map(ev => (
            <div key={ev._id} style={{ display: 'flex', marginBottom: '10px', padding: '15px', border: '1px solid #eee', borderRadius: '4px', boxShadow: '0 1px 5px rgba(0,0,0,0.1)', background: 'white' }}>
              {ev.images && ev.images.length > 0 && (
                <img
                  src={`http://localhost:4000${ev.images[0]}`}
                  alt={ev.title}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '1.2em', color: '#333' }}>{ev.title}</strong>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button
                      onClick={() => edit(ev)}
                      style={{ padding: '8px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => remove(ev._id)}
                      style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      🗑️ Delete (Admin)
                    </button>
                  </div>
                </div>
                <div style={{ color: '#555', fontSize: '0.95em', marginBottom: '5px' }}>
                  🗓️ Date: {ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "No Date Specified"}
                </div>
                {ev.description && (
                  <div style={{ color: '#555', fontSize: '0.95em', marginBottom: '10px' }}>
                    📝 {ev.description}
                  </div>
                )}
                <div style={{ color: '#007bff', fontSize: '0.9em' }}>
                  🖼️ {ev.images?.length || 0} Images
                  {ev.images && ev.images.length > 1 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
                      {ev.images.slice(1).map((url, index) => (
                        <img
                          key={index}
                          src={`http://localhost:4000${url}`}
                          alt={`Event Image ${index + 2}`}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}