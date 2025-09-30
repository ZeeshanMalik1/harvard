import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/teachers";

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Simple Icon component for social links
const SocialIcon = ({ type, link }) => {
    const icons = {
        fb: '📘',
        whatsapp: '🟢',
        twitter: '🐦'
    };
    if (!link) return null;
    return (
        <a 
            href={link.startsWith('http') ? link : `https://${link}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ textDecoration: 'none', fontSize: '1.2em', marginRight: 8 }}
        >
            {icons[type]}
        </a>
    );
}


export default function TeacherPage() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [waLink, setWaLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setList(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch teacher profiles.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const addTeacher = async () => {
    if (!name || !selectedFile) {
      alert("Teacher Name and Image are required.");
      return;
    }
    
    setError(null);
    const formData = new FormData();

    // Append text fields
    formData.append('name', name);
    formData.append('role', role);
    formData.append('fb_link', fbLink);
    formData.append('whatsapp_app', waLink);
    formData.append('twitter_link', twitterLink);
    
    // Append the file (key 'image' must match Multer setup in the router)
    formData.append('image', selectedFile); 
    
    const authHeaders = getAuthHeaders().headers;

    try {
      const res = await axios.post(
        API_URL, 
        formData, 
        { 
            headers: { 
                ...authHeaders, 
            }
        } 
      );
      
      // Update state and clear form
      setList([res.data, ...list]); 
      setName("");
      setRole("");
      setFbLink("");
      setWaLink("");
      setTwitterLink("");
      setSelectedFile(null);
      document.getElementById('teacher-file-input').value = null; 
    } catch (err) {
      console.error("Add error:", err.response?.data?.error || err);
      setError(err.response?.data?.error || "Error adding profile. Check server console.");
    }
  };

  const removeTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher profile?")) return;
    setError(null);

    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
      setList(list.filter(x => x._id !== id)); 
    } catch (err) {
      setError(err.response?.data?.error || "Error deleting profile. Login required.");
    }
  };

  if (loading && list.length === 0) return <div>Loading teacher profiles...</div>;

  const defaultImageUrl = 'https://placehold.co/150x150/EEEEEE/AAAAAA?text=No+Image';

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Teacher Profiles Management 🎓</h1>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}
      
      {/* --- Add New Teacher Form --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, border: "1px solid #007bff", padding: 15, borderRadius: 8, background: '#f0f8ff' }}>
        <h2 style={{ margin: 0, color: '#007bff' }}>Add New Teacher (Admin)</h2>
        
        {/* Row 1: Name and Role */}
        <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="*Name (Required)" value={name} onChange={e => setName(e.target.value)} style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4 }} />
            <input placeholder="Role (e.g., Math Head)" value={role} onChange={e => setRole(e.target.value)} style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4 }} />
        </div>

        {/* Row 2: Social Links */}
        <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="Facebook Link" value={fbLink} onChange={e => setFbLink(e.target.value)} style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4 }} />
            <input placeholder="WhatsApp Link" value={waLink} onChange={e => setWaLink(e.target.value)} style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4 }} />
            <input placeholder="Twitter Link" value={twitterLink} onChange={e => setTwitterLink(e.target.value)} style={{ flexGrow: 1, padding: 10, border: "1px solid #ddd", borderRadius: 4 }} />
        </div>

        {/* Row 3: Image Upload */}
        <input 
          id="teacher-file-input"
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 4, background: 'white' }}
        />
        
        <button 
          onClick={addTeacher}
          disabled={!name || !selectedFile}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: (name && selectedFile) ? 'pointer' : 'not-allowed', fontWeight: 'bold', transition: 'background-color 0.3s' }}
        >
          Add Teacher Profile
        </button>
      </div>

      <hr/>

      <h2>Current Faculty ({list.length})</h2>

      {/* --- Teacher List --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
        {list.length === 0 && !loading ? (
          <p>No teacher profiles found.</p>
        ) : (
          list.map(teacher => (
            <div key={teacher._id} style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8, boxShadow: "0 4px 8px rgba(0,0,0,0.1)", background: 'white', width: 250, textAlign: 'center' }}>
              
              {/* Image */}
              <img 
                src={teacher.imageUrl ? `http://localhost:4000${teacher.imageUrl}` : defaultImageUrl} 
                alt={`${teacher.name} Profile`} 
                onError={(e) => { e.target.onerror = null; e.target.src=defaultImageUrl; }}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%', border: '3px solid #007bff', marginBottom: 10 }} 
              />
              
              <strong style={{ fontSize: '1.2em', display: 'block', color: '#333' }}>{teacher.name}</strong>
              <em style={{ color: "#555", fontSize: '0.9em', display: 'block', marginBottom: 10 }}>{teacher.role || 'Faculty Member'}</em>

              {/* Social Links */}
              <div style={{ marginBottom: 15 }}>
                  <SocialIcon type="fb" link={teacher.fb_link} />
                  <SocialIcon type="whatsapp" link={teacher.whatsapp_app} />
                  <SocialIcon type="twitter" link={teacher.twitter_link} />
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => removeTeacher(teacher._id)}
                style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: '0.9em' }}
              >
                🗑️ Remove Profile
              </button>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
